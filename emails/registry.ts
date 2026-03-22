import type { ComponentType } from 'react';
import ExampleWelcomeEmail from './example-welcome';

export type EmailTemplateEntry = {
  /** Display name in Klaviyo (Templates → your template). */
  klaviyoName: string;
  component: ComponentType;
};

/**
 * Keys are stable IDs (used in `emails/klaviyo-manifest.json`).
 * Add a new entry for each `.tsx` template you want to sync.
 */
export const emailTemplates = {
  'example-welcome': {
    klaviyoName: 'BomBom Treats — Waitlist welcome',
    component: ExampleWelcomeEmail,
  },
} satisfies Record<string, EmailTemplateEntry>;

export type EmailTemplateKey = keyof typeof emailTemplates;
