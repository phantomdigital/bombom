import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildNomniContactSyncPayload,
  buildNomniFieldValues,
  extractNomniContactId,
  mapNomniErrorToUserMessage,
  runNomniSignup,
} from '@/lib/nomni-signup';

test('buildNomniFieldValues includes required and optional mapped fields', () => {
  const values = buildNomniFieldValues({
    email: 'hello@example.com',
    listId: '4',
    marketingConsent: true,
    marketingConsentText: 'I agree',
    signupSource: 'website',
    signupPageType: 'coming-soon',
    attribution: {
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'winter',
      gclid: 'g-123',
      fbclid: 'f-456',
      ttclid: 't-789',
      landingPath: '/home?utm_source=google',
      referrerUrl: 'https://google.com',
    },
  });

  const map = new Map(values.map((v) => [v.field, v.value]));

  assert.equal(map.get('3'), 'Yes');
  assert.ok(typeof map.get('4') === 'string');
  assert.equal(map.get('5'), 'I agree');
  assert.equal(map.get('6'), 'website');
  assert.equal(map.get('7'), 'coming-soon');
  assert.equal(map.get('8'), '/home?utm_source=google');
  assert.equal(map.get('9'), 'https://google.com');
  assert.equal(map.get('10'), 'google');
  assert.equal(map.get('11'), 'cpc');
  assert.equal(map.get('12'), 'winter');
  assert.equal(map.get('13'), 'g-123');
  assert.equal(map.get('14'), 'f-456');
  assert.equal(map.get('15'), 't-789');
});

test('buildNomniContactSyncPayload keeps email in contact.email', () => {
  const payload = buildNomniContactSyncPayload({
    email: 'user@example.com',
    listId: '4',
    marketingConsent: false,
    marketingConsentText: '',
    signupSource: 'website',
    signupPageType: 'coming-soon',
    attribution: {},
  });

  assert.equal(payload.contact.email, 'user@example.com');
  assert.ok(Array.isArray(payload.contact.fieldValues));
  assert.equal(payload.contact.fieldValues.length, 2);
});

test('runNomniSignup sends sync then list subscription payload', async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fetchMock: typeof fetch = async (input, init) => {
    const url = String(input);
    calls.push({ url, init });

    if (url.endsWith('/api/3/contact/sync')) {
      return new Response(JSON.stringify({ contact: { id: 123 } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    if (url.endsWith('/api/3/contactLists')) {
      return new Response(JSON.stringify({ contactList: { id: 1 } }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response('{}', { status: 404 });
  };

  const result = await runNomniSignup(
    {
      email: 'user@example.com',
      listId: '4',
      marketingConsent: true,
      marketingConsentText: 'I agree to receive marketing emails from Nomni.',
      signupSource: 'website',
      signupPageType: 'coming-soon',
      attribution: {
        utmSource: 'google',
      },
    },
    {
      apiKey: 'secret',
      baseUrl: 'https://api.nomni.test',
    },
    fetchMock
  );

  assert.deepEqual(result, { success: true });
  assert.equal(calls.length, 2);

  const firstBody = JSON.parse(String(calls[0].init?.body));
  assert.equal(firstBody.contact.email, 'user@example.com');
  assert.ok(Array.isArray(firstBody.contact.fieldValues));

  const secondBody = JSON.parse(String(calls[1].init?.body));
  assert.equal(secondBody.contactList.list, 4);
  assert.equal(secondBody.contactList.contact, 123);
  assert.equal(secondBody.contactList.status, 1);
});

test('runNomniSignup maps API errors to user-facing message', async () => {
  const fetchMock: typeof fetch = async () =>
    new Response(JSON.stringify({ errors: [{ detail: 'Email already exists' }] }), {
      status: 422,
      headers: { 'content-type': 'application/json' },
    });

  const result = await runNomniSignup(
    {
      email: 'exists@example.com',
      listId: '4',
      marketingConsent: false,
      marketingConsentText: '',
      signupSource: 'website',
      signupPageType: 'coming-soon',
      attribution: {},
    },
    {
      apiKey: 'secret',
      baseUrl: 'https://api.nomni.test',
    },
    fetchMock
  );

  assert.deepEqual(result, {
    success: false,
    error: "You're already on our list with this email.",
  });
});

test('extractNomniContactId handles string, number and missing id', () => {
  assert.equal(extractNomniContactId({ contact: { id: 42 } }), '42');
  assert.equal(extractNomniContactId({ contact: { id: '44' } }), '44');
  assert.equal(extractNomniContactId({}), null);
});

test('mapNomniErrorToUserMessage keeps fallback for unknown errors', () => {
  assert.equal(
    mapNomniErrorToUserMessage('some unknown backend failure', 'Generic fallback'),
    'Generic fallback'
  );
});
