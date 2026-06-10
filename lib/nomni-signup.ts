import { z } from 'zod';

export type NomniFieldValue = {
  field: string;
  value: string;
};

export type NomniSignupAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  landingPath?: string;
  referrerUrl?: string;
};

export type NomniSignupInput = {
  email: string;
  listId?: string;
  marketingConsent: boolean;
  marketingConsentText: string;
  signupSource: string;
  signupPageType: string;
  attribution: NomniSignupAttribution;
};

export type NomniSignupResult =
  | { success: true }
  | { success: false; error: string };

type NomniContactSyncResponse = {
  contact?: {
    id?: string | number;
  };
};

type NomniErrorItem = {
  title?: string;
  detail?: string;
};

const EMAIL_SCHEMA = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

const NOMNI_MARKETING_FIELD_IDS = {
  marketingConsent: '3',
  consentTimestamp: '4',
  consentText: '5',
  signupSource: '6',
  signupPageType: '7',
  landingPath: '8',
  referrerUrl: '9',
  utmSource: '10',
  utmMedium: '11',
  utmCampaign: '12',
  gclid: '13',
  fbclid: '14',
  ttclid: '15',
} as const;

export function normalizeNomniBaseUrl(rawBaseUrl: string): string {
  return rawBaseUrl.trim().replace(/\/+$/, '');
}

export function buildNomniFieldValues(input: NomniSignupInput): NomniFieldValue[] {
  const values: NomniFieldValue[] = [
    { field: NOMNI_MARKETING_FIELD_IDS.signupSource, value: input.signupSource },
    { field: NOMNI_MARKETING_FIELD_IDS.signupPageType, value: input.signupPageType },
  ];

  if (input.marketingConsent) {
    values.push(
      { field: NOMNI_MARKETING_FIELD_IDS.marketingConsent, value: 'Yes' },
      { field: NOMNI_MARKETING_FIELD_IDS.consentTimestamp, value: new Date().toISOString() },
      { field: NOMNI_MARKETING_FIELD_IDS.consentText, value: input.marketingConsentText }
    );
  }

  const addOptional = (field: string, value?: string) => {
    if (!value) return;
    values.push({ field, value });
  };

  addOptional(NOMNI_MARKETING_FIELD_IDS.landingPath, input.attribution.landingPath);
  addOptional(NOMNI_MARKETING_FIELD_IDS.referrerUrl, input.attribution.referrerUrl);
  addOptional(NOMNI_MARKETING_FIELD_IDS.utmSource, input.attribution.utmSource);
  addOptional(NOMNI_MARKETING_FIELD_IDS.utmMedium, input.attribution.utmMedium);
  addOptional(NOMNI_MARKETING_FIELD_IDS.utmCampaign, input.attribution.utmCampaign);
  addOptional(NOMNI_MARKETING_FIELD_IDS.gclid, input.attribution.gclid);
  addOptional(NOMNI_MARKETING_FIELD_IDS.fbclid, input.attribution.fbclid);
  addOptional(NOMNI_MARKETING_FIELD_IDS.ttclid, input.attribution.ttclid);

  return values;
}

export function buildNomniContactSyncPayload(input: NomniSignupInput) {
  return {
    contact: {
      email: input.email,
      fieldValues: buildNomniFieldValues(input),
    },
  };
}

export function extractNomniErrorText(errorData: unknown): string {
  if (!errorData || typeof errorData !== 'object') return '';

  const maybeErrors = (errorData as { errors?: NomniErrorItem[] }).errors;
  if (Array.isArray(maybeErrors) && maybeErrors.length > 0) {
    const first = maybeErrors[0];
    return first?.detail || first?.title || '';
  }

  const message = (errorData as { message?: string }).message;
  return typeof message === 'string' ? message : '';
}

export function mapNomniErrorToUserMessage(rawMessage: string, fallback: string): string {
  const msg = rawMessage.toLowerCase();

  if (msg.includes('already') && (msg.includes('exist') || msg.includes('subscribed'))) {
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

export function extractNomniContactId(syncBody: unknown): string | null {
  if (!syncBody || typeof syncBody !== 'object') return null;
  const contact = (syncBody as NomniContactSyncResponse).contact;
  const id = contact?.id;
  if (typeof id === 'number') return String(id);
  if (typeof id === 'string' && id.trim()) return id;
  return null;
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function runNomniSignup(
  input: NomniSignupInput,
  config: {
    apiKey: string;
    baseUrl: string;
    debug?: boolean;
  },
  fetchImpl: typeof fetch = fetch
): Promise<NomniSignupResult> {
  const validEmail = EMAIL_SCHEMA.safeParse(input.email);
  if (!validEmail.success) {
    return { success: false, error: validEmail.error.issues[0]?.message ?? 'Invalid request' };
  }

  if (!config.apiKey.trim() || !config.baseUrl.trim()) {
    return { success: false, error: 'Server configuration error' };
  }

  const normalizedBaseUrl = normalizeNomniBaseUrl(config.baseUrl);
  const debugLog = (step: string, data: Record<string, unknown>) => {
    if (!config.debug) return;
    console.info('[nomni][debug]', { step, ...data });
  };

  const syncUrl = `${normalizedBaseUrl}/api/3/contact/sync`;
  const syncPayload = buildNomniContactSyncPayload(input);
  debugLog('contact-sync:request', {
    url: syncUrl,
    method: 'POST',
    headers: {
      'Api-Token': '[redacted]',
      'Content-Type': 'application/json',
    },
    payload: syncPayload,
  });

  const syncResponse = await fetchImpl(syncUrl, {
    method: 'POST',
    headers: {
      'Api-Token': config.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(syncPayload),
  });

  const syncBody = await parseJsonSafe(syncResponse);
  debugLog('contact-sync:response', {
    status: syncResponse.status,
    ok: syncResponse.ok,
    body: syncBody,
  });
  if (!syncResponse.ok) {
    const rawMessage = extractNomniErrorText(syncBody);
    return {
      success: false,
      error: mapNomniErrorToUserMessage(rawMessage, 'We could not save your email right now. Please try again.'),
    };
  }

  const listId = input.listId?.trim();
  if (!listId) return { success: true };

  const contactId = extractNomniContactId(syncBody);
  if (!contactId) {
    debugLog('contact-sync:missing-contact-id', { body: syncBody });
    return { success: false, error: 'We could not save your email right now. Please try again.' };
  }

  const listUrl = `${normalizedBaseUrl}/api/3/contactLists`;
  const listPayload = {
    contactList: {
      list: Number(listId),
      contact: Number(contactId),
      status: 1,
    },
  };
  debugLog('contact-lists:request', {
    url: listUrl,
    method: 'POST',
    headers: {
      'Api-Token': '[redacted]',
      'Content-Type': 'application/json',
    },
    payload: listPayload,
  });

  const listResponse = await fetchImpl(listUrl, {
    method: 'POST',
    headers: {
      'Api-Token': config.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(listPayload),
  });
  const listBody = await parseJsonSafe(listResponse);
  debugLog('contact-lists:response', {
    status: listResponse.status,
    ok: listResponse.ok,
    body: listBody,
  });

  if (!listResponse.ok) {
    const rawMessage = extractNomniErrorText(listBody);
    return {
      success: false,
      error: mapNomniErrorToUserMessage(rawMessage, 'We could not subscribe you right now. Please try again.'),
    };
  }

  return { success: true };
}
