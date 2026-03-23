/**
 * Renders React Email templates to HTML and creates or updates Klaviyo CODE templates.
 *
 * Requires KLAVIYO_PRIVATE_API_KEY with scope `templates:write` (same key as subscribe flow).
 *
 * Usage:
 *   npm run email:push-klaviyo
 *   npm run email:push-klaviyo:dry
 *   npx tsx scripts/push-email-templates-to-klaviyo.ts example-welcome
 *   npx tsx scripts/push-email-templates-to-klaviyo.ts --dry-run
 */

import { render } from '@react-email/render';
import { config as loadEnv } from 'dotenv';
import { createElement } from 'react';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  emailTemplates,
  type EmailTemplateKey,
} from '../emails/registry';
import { sanitizeKlaviyoEmailHtml } from './email-html-sanitize';

const KLAVIYO_API_VERSION =
  process.env.KLAVIYO_API_REVISION?.trim() || '2024-10-15';

type Manifest = Record<string, { klaviyoTemplateId?: string }>;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = resolve(ROOT, 'emails/klaviyo-manifest.json');

function loadManifest(): Manifest {
  try {
    const raw = readFileSync(MANIFEST_PATH, 'utf8');
    return JSON.parse(raw) as Manifest;
  } catch {
    return {};
  }
}

function saveManifest(manifest: Manifest) {
  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

function parseArgs() {
  const argv = process.argv.slice(2);
  const dryRun =
    argv.includes('--dry-run') ||
    process.env.EMAIL_PUSH_DRY_RUN === '1' ||
    process.env.EMAIL_PUSH_DRY_RUN === 'true';
  const positional = argv.filter((a) => !a.startsWith('--'));
  const onlyKey = positional[0] as EmailTemplateKey | undefined;
  return { dryRun, onlyKey };
}

async function klaviyoFetch(
  apiKey: string,
  path: string,
  init: RequestInit
): Promise<Response> {
  return fetch(`https://a.klaviyo.com/api${path}`, {
    ...init,
    headers: {
      Authorization: `Klaviyo-API-Key ${apiKey}`,
      revision: KLAVIYO_API_VERSION,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
}

async function main() {
  loadEnv({ path: resolve(ROOT, '.env') });
  loadEnv({ path: resolve(ROOT, '.env.local') });

  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY?.trim();
  const { dryRun, onlyKey } = parseArgs();

  if (onlyKey && !(onlyKey in emailTemplates)) {
    console.error(
      `Unknown template key "${onlyKey}". Valid keys: ${Object.keys(emailTemplates).join(', ')}`
    );
    process.exit(1);
  }

  const keys = (onlyKey
    ? [onlyKey]
    : (Object.keys(emailTemplates) as EmailTemplateKey[])) as EmailTemplateKey[];

  if (!apiKey && !dryRun) {
    console.error('Missing KLAVIYO_PRIVATE_API_KEY (set in .env.local).');
    process.exit(1);
  }

  const manifest = loadManifest();
  let manifestDirty = false;

  for (const key of keys) {
    const entry = emailTemplates[key];
    const rawHtml = await render(createElement(entry.component), { pretty: true });
    const html = sanitizeKlaviyoEmailHtml(rawHtml);
    const text = await render(createElement(entry.component), {
      plainText: true,
    });

    console.info(`\n[${key}] ${entry.klaviyoName}`);
    console.info(`  HTML length: ${html.length} chars, text length: ${text.length} chars`);

    if (dryRun) {
      continue;
    }

    const existingId = manifest[key]?.klaviyoTemplateId;

    if (existingId) {
      const res = await klaviyoFetch(apiKey!, `/templates/${existingId}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          data: {
            type: 'template',
            id: existingId,
            attributes: {
              name: entry.klaviyoName,
              html,
              text,
            },
          },
        }),
      });

      const body = await res.text();
      if (!res.ok) {
        console.error(`  PATCH failed ${res.status}: ${body}`);
        process.exitCode = 1;
        continue;
      }
      console.info(`  Updated Klaviyo template ${existingId}`);
    } else {
      const res = await klaviyoFetch(apiKey!, '/templates/', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'template',
            attributes: {
              name: entry.klaviyoName,
              editor_type: 'CODE',
              html,
              text,
            },
          },
        }),
      });

      const body = await res.text();
      if (!res.ok) {
        console.error(`  POST failed ${res.status}: ${body}`);
        process.exitCode = 1;
        continue;
      }

      let id: string | undefined;
      try {
        const json = JSON.parse(body) as { data?: { id?: string } };
        id = json.data?.id;
      } catch {
        /* ignore */
      }

      if (!id) {
        console.error(`  Created template but could not read id from response: ${body}`);
        process.exitCode = 1;
        continue;
      }

      manifest[key] = { ...manifest[key], klaviyoTemplateId: id };
      manifestDirty = true;
      console.info(`  Created Klaviyo template ${id} (saved to emails/klaviyo-manifest.json)`);
    }
  }

  if (manifestDirty) {
    saveManifest(manifest);
  }

  if (dryRun) {
    console.info('\nDry run only — no Klaviyo requests sent.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
