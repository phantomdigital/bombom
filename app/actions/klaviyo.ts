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

export async function subscribeToKlaviyo(
  _prevState: unknown,
  formData: FormData
): Promise<SubscribeResult> {
  const email = formData.get('email')?.toString() ?? '';
  const listId = formData.get('listId')?.toString() ?? undefined;

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
            },
          },
        },
      }),
    });

    if (!profileResponse.ok) {
      const errorData = await profileResponse.json();
      console.error('Klaviyo profile creation error:', errorData);
      return { success: false, error: 'Failed to create profile' };
    }

    const profileData = await profileResponse.json();
    const profileId = profileData.data.id;

    if (result.data.listId) {
      const subscribeResponse = await fetch(
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

      if (!subscribeResponse.ok) {
        const errorData = await subscribeResponse.json();
        console.error('Klaviyo list subscription error:', errorData);
        return { success: false, error: 'Failed to subscribe to list' };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Klaviyo subscription error:', error);
    return { success: false, error: 'Failed to subscribe. Please try again.' };
  }
}
