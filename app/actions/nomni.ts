'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { runNomniSignup, type NomniSignupResult } from '@/lib/nomni-signup';

const NOMNI_API_KEY = process.env.NOMNI_PRIVATE_API_KEY || process.env.NONMNI_PRIVATE_API_KEY;
const NOMNI_API_URL =
  process.env.NOMNI_API_URL ||
  process.env.NOMNI_BASE_URL ||
  process.env.NEXT_PUBLIC_NOMNI_API_URL ||
  process.env.NEXT_PUBLIC_NOMNI_BASE_URL;
const DEFAULT_NOMNI_LIST_ID =
  process.env.NEXT_PUBLIC_NOMNI_LIST_ID || process.env.NEXT_PUBLIC_NONMNI_LIST_ID || '4';

const subscribeSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  listId: z.string().optional(),
});

export type NomniSubscribeResult = NomniSignupResult;

function isLocalHostHeader(hostHeader: string | null): boolean {
  if (!hostHeader) return false;
  const host = hostHeader.split(':')[0]?.toLowerCase() ?? '';
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

export async function subscribeToNomni(
  _prevState: unknown,
  formData: FormData
): Promise<NomniSubscribeResult> {
  const email = formData.get('email')?.toString() ?? '';
  const listId = formData.get('listId')?.toString() ?? DEFAULT_NOMNI_LIST_ID;
  const marketingConsentValue = formData.get('marketingConsent')?.toString();
  const marketingConsent =
    marketingConsentValue === 'yes' ||
    marketingConsentValue === 'on' ||
    marketingConsentValue === 'true';

  const utmSource = formData.get('utm_source')?.toString() ?? '';
  const utmMedium = formData.get('utm_medium')?.toString() ?? '';
  const utmCampaign = formData.get('utm_campaign')?.toString() ?? '';
  const gclid = formData.get('gclid')?.toString() ?? '';
  const fbclid = formData.get('fbclid')?.toString() ?? '';
  const ttclid = formData.get('ttclid')?.toString() ?? '';
  const landingPath = formData.get('landing_path')?.toString() ?? '';
  const referrerUrl = formData.get('referrer_url')?.toString() ?? '';

  const result = subscribeSchema.safeParse({ email, listId });
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Invalid request' };
  }

  if (!NOMNI_API_KEY || !NOMNI_API_URL) {
    return { success: false, error: 'Server configuration error' };
  }

  const requestHeaders = await headers();
  const hostHeader = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');
  const enableLocalDebug = process.env.NODE_ENV !== 'production' && isLocalHostHeader(hostHeader);

  return runNomniSignup(
    {
      email: result.data.email,
      listId: result.data.listId,
      marketingConsent,
      marketingConsentText: 'I agree to receive marketing emails from Nomni.',
      signupSource: 'website',
      signupPageType: 'landing-page',
      attribution: {
        utmSource,
        utmMedium,
        utmCampaign,
        gclid,
        fbclid,
        ttclid,
        landingPath,
        referrerUrl,
      },
    },
    {
      apiKey: NOMNI_API_KEY,
      baseUrl: NOMNI_API_URL,
      debug: enableLocalDebug,
    }
  );
}

export const subscribeToNomniForTesting = subscribeToNomni;
