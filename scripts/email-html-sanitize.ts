/**
 * Post-process HTML from @react-email/render before Klaviyo or local inspection.
 */

export function stripEmailImagePreloadHints(html: string): string {
  return html.replace(/<link\b[\s\S]*?rel=["']preload["'][\s\S]*?\/>/gi, '');
}

/** React 19 streaming render leaves boundary comments in HTML; Klaviyo rejects them. */
export function stripReactBoundaryComments(html: string): string {
  return html
    .replace(/<!--\$-->/g, '')
    .replace(/<!--\/\$-->/g, '')
    .replace(/<!--\d+-->/g, '');
}

export function sanitizeKlaviyoEmailHtml(html: string): string {
  return stripReactBoundaryComments(stripEmailImagePreloadHints(html));
}
