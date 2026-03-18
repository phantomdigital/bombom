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

    if (!profileResponse.ok) {
      const errorData = await profileResponse.json();
      console.error('Klaviyo profile creation error:', errorData);
      const rawMessage = extractKlaviyoErrorText(errorData);
      return {
        success: false,
        error: mapKlaviyoErrorToUserMessage(rawMessage, 'We could not save your email right now. Please try again.'),
      };
    }

    // When we have explicit checkbox consent, use the subscriptions endpoint so
    // Klaviyo sets email marketing consent to SUBSCRIBED (not NEVER_SUBSCRIBED).
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

      if (!subscribeResponse.ok) {
        const errorData = await subscribeResponse.json();
        console.error('Klaviyo consent subscription error:', errorData);
        const rawMessage = extractKlaviyoErrorText(errorData);
        return {
          success: false,
          error: mapKlaviyoErrorToUserMessage(rawMessage, 'We could not subscribe you right now. Please try again.'),
        };
      }
    } else if (result.data.listId) {
      // Fallback for non-consented submissions: add profile to list only.
      const profileData = await profileResponse.json();
      const profileId = profileData.data.id;

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

      if (!listResponse.ok) {
        const errorData = await listResponse.json();
        console.error('Klaviyo list add error:', errorData);
        const rawMessage = extractKlaviyoErrorText(errorData);
        return {
          success: false,
          error: mapKlaviyoErrorToUserMessage(rawMessage, 'We could not save your email right now. Please try again.'),
        };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Klaviyo subscription error:', error);
    return { success: false, error: 'Failed to subscribe. Please try again.' };
  }
}
