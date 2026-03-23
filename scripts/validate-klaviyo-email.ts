import { render } from '@react-email/render';
import { createElement } from 'react';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { emailTemplates, type EmailTemplateKey } from '../emails/registry';

type CheckResult = {
  name: string;
  ok: boolean;
  details?: string;
};

function stripEmailImagePreloadHints(html: string): string {
  return html.replace(/<link\b[\s\S]*?rel=["']preload["'][\s\S]*?\/>/gi, '');
}

function stripReactRenderMarkers(html: string): string {
  return html.replace(/<!--(?:\$|\/\$|\d+|\s*)-->/g, '');
}

function normalizeHtmlEntities(html: string): string {
  return html.replace(/&#x27;|&#39;/g, "'");
}

function normalizeTableAttributes(html: string): string {
  return html
    .replace(/\bcellPadding=/g, 'cellpadding=')
    .replace(/\bcellSpacing=/g, 'cellspacing=');
}

function sanitizeForKlaviyo(html: string): string {
  return normalizeTableAttributes(
    normalizeHtmlEntities(
      stripReactRenderMarkers(stripEmailImagePreloadHints(html))
    )
  );
}

function normalizePlainTextTemplateTags(text: string): string {
  return text
    .replace(
      /\{\{\s*FIRST_NAME\|DEFAULT:"THERE"\s*\}\}/g,
      '{{ first_name|default:"there" }}'
    )
    .replace(
      /\{\{\s*FIRST_NAME\|DEFAULT:'THERE'\s*\}\}/g,
      '{{ first_name|default:"there" }}'
    )
    .replace(/\{%\s*UNSUBSCRIBE_LINK\s*%\}/g, '{% unsubscribe_link %}');
}

function runChecks(html: string): CheckResult[] {
  const percentTags = [...html.matchAll(/\{%\s*([^%]+?)\s*%\}/g)].map((m) =>
    m[1].trim()
  );
  const doubleBraceTags = [...html.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g)].map((m) =>
    m[1].trim()
  );

  const badPercentTags = percentTags.filter((t) => t !== 'unsubscribe_link');
  const badDoubleBraceTags = doubleBraceTags.filter(
    (t) => t !== 'first_name|default:"there"'
  );

  return [
    {
      name: 'No single quotes in font-family declarations',
      ok: !/font-family:[^;]*'/.test(html),
    },
    {
      name: 'No {% unsubscribe %} tag',
      ok: !/\{%\s*unsubscribe\s*%\}/.test(html),
    },
    {
      name: 'No named entities (&copy; &hearts; &bull;)',
      ok: !/&(?:copy|hearts|bull);/i.test(html),
    },
    {
      name: 'No React render comment markers',
      ok: !/<!--(?:\$|\/\$|\d+|\s*)-->/.test(html),
    },
    {
      name: 'Only {% unsubscribe_link %} is used',
      ok: badPercentTags.length === 0,
      details: badPercentTags.length
        ? `Unexpected tags: ${badPercentTags.join(', ')}`
        : undefined,
    },
    {
      name: 'Only {{ first_name|default:"there" }} is used',
      ok: badDoubleBraceTags.length === 0,
      details: badDoubleBraceTags.length
        ? `Unexpected variables: ${badDoubleBraceTags.join(', ')}`
        : undefined,
    },
    {
      name: "No style='...' attributes with nested double quotes",
      ok: !/style='[^']*"[^"]*'/.test(html),
    },
  ];
}

function parseArgs() {
  const onlyKey = process.argv[2] as EmailTemplateKey | undefined;
  if (onlyKey && !(onlyKey in emailTemplates)) {
    console.error(
      `Unknown template key "${onlyKey}". Valid keys: ${Object.keys(emailTemplates).join(', ')}`
    );
    process.exit(1);
  }
  const keys = (onlyKey
    ? [onlyKey]
    : (Object.keys(emailTemplates) as EmailTemplateKey[])) as EmailTemplateKey[];
  return { keys };
}

async function main() {
  const { keys } = parseArgs();
  let hasFailures = false;

  for (const key of keys) {
    const entry = emailTemplates[key];
    const rawHtml = await render(createElement(entry.component), { pretty: false });
    const html = sanitizeForKlaviyo(rawHtml);
    const rawText = await render(createElement(entry.component), { plainText: true });
    const text = normalizePlainTextTemplateTags(rawText);
    const checks = runChecks(html);
    const outPath = resolve(`emails/.tmp-klaviyo-${key}.html`);
    const textOutPath = resolve(`emails/.tmp-klaviyo-${key}.txt`);
    writeFileSync(outPath, html, 'utf8');
    writeFileSync(textOutPath, text, 'utf8');

    console.info(`\n[${key}] ${entry.klaviyoName}`);
    console.info(`Sanitized HTML written to: ${outPath}`);
    console.info(`Sanitized text written to: ${textOutPath}`);
    for (const check of checks) {
      if (check.ok) {
        console.info(`  PASS ${check.name}`);
        continue;
      }
      hasFailures = true;
      console.info(`  FAIL ${check.name}`);
      if (check.details) {
        console.info(`       ${check.details}`);
      }
    }

    if (/\{\{\s*FIRST_NAME\|DEFAULT:/.test(text)) {
      hasFailures = true;
      console.info('  FAIL Plain text contains uppercased Klaviyo variable syntax');
    } else {
      console.info('  PASS Plain text Klaviyo variable syntax is normalized');
    }
  }

  if (hasFailures) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
