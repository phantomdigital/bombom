/**
 * Writes the waitlist welcome template to disk for browser / editor inspection.
 *
 *   npm run email:render-welcome-html
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from '@react-email/render';
import { createElement } from 'react';
import ExampleWelcomeEmail from '../emails/example-welcome';
import { sanitizeKlaviyoEmailHtml } from './email-html-sanitize';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = resolve(ROOT, 'emails/rendered');
const OUT_FILE = resolve(OUT_DIR, 'example-welcome.html');

void (async () => {
  const raw = await render(createElement(ExampleWelcomeEmail), { pretty: false });
  const html = sanitizeKlaviyoEmailHtml(raw);
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, html, 'utf8');
  console.log(`Wrote ${OUT_FILE}`);
})();
