'use server';

import { z } from 'zod';

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
const KLAVIYO_API_VERSION = '2024-10-15';

const subscribeSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  listId: z.string().optional(),
});

export type SubscribeResult =
  | { success: true }
  | { success: false; error: string };

function extractKlaviyoErrorText(errorData: unknown): string {
  if (!errorData || typeof errorData !== 'object') return '';

  const maybeErrors = (errorData as { errors?: Array<{ detail?: string; title?: string; code?: string }> }).errors;
  if (Array.isArray(maybeErrors) && maybeErrors.length > 0) {
    const first = maybeErrors[0];
    return first?.detail || first?.title || first?.code || '';
  }

  const maybeMessage = (errorData as { message?: string }).message;
  return typeof maybeMessage === 'string' ? maybeMessage : '';
}

function mapKlaviyoErrorToUserMessage(rawMessage: string, fallback: string): string {
  const msg = rawMessage.toLowerCase();

  if (
    msg.includes('already exists') ||
    msg.includes('already in this list') ||
    msg.includes('already subscribed') ||
    msg.includes('duplicate')
  ) {
    return "You're already on our list with this email.";
  }

  if (msg.includes('invalid') && msg.includes('email')) {
    return 'Please enter a valid email address.';
  }

  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Too many attempts right now. Please wait a moment and try again.';
  }

  return fallback;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0] ?? '*'}*@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function subscribeToKlaviyo(
  _prevState: unknown,
  formData: FormData
): Promise<SubscribeResult> {
  const email = formData.get('email')?.toString() ?? '';
  const listId = formData.get('listId')?.toString() ?? undefined;
  const marketingConsentValue = formData.get('marketingConsent')?.toString();
  const marketingConsent =
    marketingConsentValue === 'yes' ||
    marketingConsentValue === 'on' ||
    marketingConsentValue === 'true';

  const result = subscribeSchema.safeParse({ email, listId });

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? 'Invalid request';
    return { success: false, error: message };
  }

  // Test bypass: skip Klaviyo, just return success for flow testing
  if (result.data.email.toLowerCase() === 'test@test.com') {
    return { success: true };
  }

  if (!KLAVIYO_API_KEY) {
    console.error('KLAVIYO_PRIVATE_API_KEY is not set');
    return { success: false, error: 'Server configuration error' };
  }

  try {
    const requestId = crypto.randomUUID();
    console.info('[klaviyo][subscribe][start]', {
      requestId,
      email: maskEmail(result.data.email),
      hasListId: Boolean(result.data.listId),
      listId: result.data.listId ?? null,
      marketingConsent,
      marketingConsentValue: marketingConsentValue ?? null,
    });

    const profileResponse = await fetch('https://a.klaviyo.com/api/profiles/', {
      method: 'POST',
      headers: {
        Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        revision: KLAVIYO_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email: result.data.email,
            properties: {
              source: 'bombom-website',
              signup_date: new Date().toISOString(),
              signup_page: 'coming-soon',
              signup_type: 'waitlist',
              marketing_consent: marketingConsent,
              marketing_consent_captured_at: marketingConsent ? new Date().toISOString() : null,
              marketing_consent_text:
                'I agree to receive marketing emails from BomBom.',
            },
          },
        },
      }),
    });

    const profileResponseBody = await parseJsonSafe(profileResponse);
    console.info('[klaviyo][profile][response]', {
      requestId,
      status: profileResponse.status,
      ok: profileResponse.ok,
      body: profileResponseBody,
    });

    if (!profileResponse.ok) {
      const errorData = profileResponseBody;
      console.error('Klaviyo profile creation error:', errorData);
      const rawMessage = extractKlaviyoErrorText(errorData);
      return {
        success: false,
        error: mapKlaviyoErrorToUserMessage(rawMessage, 'We could not save your email right now. Please try again.'),
      };
    }

    const profileData = profileResponseBody as { data?: { id?: string } } | null;
    const profileId = profileData?.data?.id;
    if (!profileId) {
      console.error('[klaviyo] missing profile id in profile response', {
        requestId,
        profileResponseBody,
      });
      return { success: false, error: 'We could not save your email right now. Please try again.' };
    }

    // Always attach to list directly when listId exists. This restores deterministic
    // list membership even when consent jobs are asynchronous.
    if (result.data.listId) {
      const listResponse = await fetch(
        `https://a.klaviyo.com/api/lists/${result.data.listId}/relationships/profiles/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
            revision: KLAVIYO_API_VERSION,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: [{ type: 'profile', id: profileId }],
          }),
        }
      );

      const listResponseBody = await parseJsonSafe(listResponse);
      console.info('[klaviyo][list-add][response]', {
        requestId,
        status: listResponse.status,
        ok: listResponse.ok,
        listId: result.data.listId,
        profileId,
        body: listResponseBody,
      });

      if (!listResponse.ok) {
        const errorData = listResponseBody;
        console.error('Klaviyo list add error:', errorData);
        const rawMessage = extractKlaviyoErrorText(errorData);
        return {
          success: false,
          error: mapKlaviyoErrorToUserMessage(rawMessage, 'We could not save your email right now. Please try again.'),
        };
      }
    }

    // When we have explicit checkbox consent, set marketing consent status too.
    if (marketingConsent) {
      const subscribeJobPayload: Record<string, unknown> = {
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            profiles: {
              data: [
                {
                  type: 'profile',
                  attributes: {
                    email: result.data.email,
                    subscriptions: {
                      email: {
                        marketing: {
                          consent: 'SUBSCRIBED',
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      };

      if (result.data.listId) {
        (subscribeJobPayload.data as Record<string, unknown>).relationships = {
          list: {
            data: {
              type: 'list',
              id: result.data.listId,
            },
          },
        };
      }

      const subscribeResponse = await fetch(
        'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
        {
          method: 'POST',
          headers: {
            Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
            revision: KLAVIYO_API_VERSION,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscribeJobPayload),
        }
      );

      const subscribeResponseBody = await parseJsonSafe(subscribeResponse);
      console.info('[klaviyo][subscribe-job][response]', {
        requestId,
        status: subscribeResponse.status,
        ok: subscribeResponse.ok,
        listId: result.data.listId ?? null,
        payload: subscribeJobPayload,
        body: subscribeResponseBody,
      });

      if (!subscribeResponse.ok) {
        const errorData = subscribeResponseBody;
        console.error('Klaviyo consent subscription error:', errorData);
        const rawMessage = extractKlaviyoErrorText(errorData);
        return {
          success: false,
          error: mapKlaviyoErrorToUserMessage(rawMessage, 'We could not subscribe you right now. Please try again.'),
        };
      }
    }

    console.info('[klaviyo][subscribe][success]', {
      requestId,
      email: maskEmail(result.data.email),
      listId: result.data.listId ?? null,
      marketingConsent,
    });

    return { success: true };
  } catch (error) {
    console.error('Klaviyo subscription error:', error);
    return { success: false, error: 'Failed to subscribe. Please try again.' };
  }
}
