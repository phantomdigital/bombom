import {
  EMAIL_BLEED_URL,
  EMAIL_INSTAGRAM_ICON_URL,
  EMAIL_SITE_URL,
  EMAIL_THEME,
  EMAIL_TIKTOK_ICON_URL,
  EMAIL_LOGO_URL,
  TICKER_GIF_URL,
} from './theme';

/**
 * BomBom waitlist welcome — HTML shaped for Klaviyo CODE templates.
 *
 * Structure, `<head>` CSS classes, and table markup follow the exact pattern Klaviyo
 * accepts. Do not use `@react-email` `<Html>` / `<Head>` / `<Body>` / `<Tailwind>`: they add
 * lang/dir, meta, preload links, and wrapper tables. Use lowercase `<html>`, `<head>`, `<body>`.
 *
 * Merge tags: Klaviyo Django-style `{{ }}` and `{% %}` must appear verbatim in JSX strings.
 */

const FONT_REGULAR = `${EMAIL_SITE_URL}/fonts/SaansRegular.otf`;
const FONT_MEDIUM = `${EMAIL_SITE_URL}/fonts/SaansMedium.otf`;
const TICKER_STATIC_URL = `${EMAIL_SITE_URL}/email/ticker-static.png`;

const headCss = `
@font-face {
  font-family: saans;
  font-style: normal;
  font-weight: 400;
  src: url(${FONT_REGULAR}) format(opentype);
}
@font-face {
  font-family: saans;
  font-style: normal;
  font-weight: 500;
  src: url(${FONT_MEDIUM}) format(opentype);
}
body {
  background-color: ${EMAIL_THEME.emailOuterBg};
  font-family: saans, Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
}
.badge {
  display: inline-block;
  margin: 0 0 18px;
  padding: 3px 16px 4px;
  font-size: 13px;
  line-height: 1.1;
  font-weight: 400;
  color: #ffffff;
  background-color: ${EMAIL_THEME.bomMusk};
  border-radius: 999px;
}
.heading {
  margin: 0 0 16px;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: #000000;
}
.body-text {
  margin: 0 0 20px;
  font-size: 16px;
  line-height: 26px;
  color: #000000;
}
.body-text.last {
  margin: 0;
}
`.trim();

export default function ExampleWelcomeEmail() {
  const year = new Date().getFullYear();

  return (
    <html>
      <head>
        <title>{''}</title>
        <style type="text/css">{headCss}</style>
      </head>
      <body
        style={{
          backgroundColor: EMAIL_THEME.emailOuterBg,
          margin: 0,
          padding: 0,
        }}
      >
        <table
          border={0}
          cellPadding={0}
          cellSpacing={0}
          width="100%"
          style={{ backgroundColor: EMAIL_THEME.emailOuterBg }}
        >
          <tr>
            <td align="center" style={{ padding: '28px 0' }}>
              {/* White card */}
              <table
                border={0}
                cellPadding={0}
                cellSpacing={0}
                width={600}
                style={{
                  maxWidth: '600px',
                  width: '95%',
                  backgroundColor: EMAIL_THEME.bomWhite,
                  borderRadius: '8px 8px 0 0',
                }}
              >
                {/* Hero logo */}
                <tr>
                  <td
                    style={{
                      backgroundColor: EMAIL_THEME.bomIce,
                      textAlign: 'center',
                      padding: '40px 28px 20px',
                    }}
                  >
                    <a
                      href={EMAIL_SITE_URL}
                      target="_blank"
                      style={{ textDecoration: 'none' }}
                    >
                      <img
                        alt="BomBom"
                        height={100}
                        src={EMAIL_LOGO_URL}
                        width={520}
                        style={{
                          display: 'block',
                          margin: '0 auto',
                          maxWidth: '100%',
                          width: '520px',
                          height: '100px',
                          border: 'none',
                          outline: 'none',
                        }}
                      />
                    </a>
                  </td>
                </tr>
                {/* Ticker full width */}
                <tr>
                  <td
                    style={{
                      backgroundColor: EMAIL_THEME.bomIce,
                      padding: 0,
                      lineHeight: 0,
                      fontSize: 0,
                      textAlign: 'center',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: `<!--[if mso]>
<img alt="Frozen Yoghurt - Soft Serve - Ice cream" height="32" src="${TICKER_STATIC_URL}" width="600" style="display:block;width:600px;height:32px;border:none;outline:none;-ms-interpolation-mode:bicubic;" />
<![endif]--><!--[if !mso]><!-->
<img alt="Frozen Yoghurt - Soft Serve - Ice cream" height="32" src="${TICKER_GIF_URL}" width="600" style="display:block;width:600px;max-width:100%;height:32px;border:none;outline:none;" />
<!--<![endif]-->`,
                    }}
                  >
                  </td>
                </tr>
                {/* Divider */}
                <tr>
                  <td>
                    <hr
                      style={{
                        border: 'none',
                        borderTop: `1px solid ${EMAIL_THEME.emailDivider}`,
                        margin: 0,
                      }}
                    />
                  </td>
                </tr>
                {/* Content */}
                <tr>
                  <td style={{ padding: '48px 28px 32px' }}>
                    <table
                      border={0}
                      cellPadding={0}
                      cellSpacing={0}
                      style={{ margin: '0 0 18px' }}
                    >
                      <tr>
                        <td
                          align="left"
                          dangerouslySetInnerHTML={{
                            __html: `<span style="display:inline-block;padding:3px 16px 3px;font-size:13px;line-height:13px;mso-line-height-rule:exactly;font-weight:400;color:${EMAIL_THEME.bomWhite};background-color:${EMAIL_THEME.bomMusk};border-radius:999px;">Welcome</span>`,
                          }}
                        />
                      </tr>
                    </table>
                    <p className="heading">
                      {'Hey {{ first_name|default:"there" }},'}
                    </p>
                    <p className="body-text">
                      You&apos;re officially on the BomBom waitlist. We&apos;re putting the
                      finishing touches on our Wagga store and you&apos;ll be the first to
                      know when we open.
                    </p>
                    <p className="body-text last">
                      Thanks for getting in this early!
                    </p>
                  </td>
                </tr>
              </table>
              {/* Bleed drip */}
              <table
                border={0}
                cellPadding={0}
                cellSpacing={0}
                width={600}
                style={{ maxWidth: '600px', width: '95%' }}
              >
                <tr>
                  <td style={{ padding: 0, lineHeight: 0 }}>
                    <img
                      alt=""
                      height={112}
                      src={EMAIL_BLEED_URL}
                      width={600}
                      style={{
                        display: 'block',
                        width: '100%',
                        maxWidth: '100%',
                        height: 'auto',
                        border: 'none',
                        outline: 'none',
                      }}
                    />
                  </td>
                </tr>
              </table>
              {/* Footer */}
              <table
                border={0}
                cellPadding={0}
                cellSpacing={0}
                width={600}
                style={{ maxWidth: '600px', width: '95%' }}
              >
                <tr>
                  <td
                    align="center"
                    style={{ padding: '16px 0 28px', textAlign: 'center' }}
                  >
                    <a
                      href="https://instagram.com/bombom.au"
                      target="_blank"
                      style={{
                        display: 'inline-block',
                        margin: '0 6px',
                        textDecoration: 'none',
                      }}
                    >
                      <img
                        alt="Instagram"
                        height={32}
                        src={EMAIL_INSTAGRAM_ICON_URL}
                        width={32}
                        style={{
                          display: 'inline-block',
                          border: 'none',
                          outline: 'none',
                        }}
                      />
                    </a>
                    <a
                      href="https://tiktok.com/@bombom_au"
                      target="_blank"
                      style={{
                        display: 'inline-block',
                        margin: '0 6px',
                        textDecoration: 'none',
                      }}
                    >
                      <img
                        alt="TikTok"
                        height={32}
                        src={EMAIL_TIKTOK_ICON_URL}
                        width={32}
                        style={{
                          display: 'inline-block',
                          border: 'none',
                          outline: 'none',
                        }}
                      />
                    </a>
                    <p
                      style={{
                        fontSize: '11px',
                        lineHeight: 1.45,
                        margin: '16px 0 8px',
                        color: EMAIL_THEME.footerMuted,
                      }}
                    >
                      If you no longer wish to receive emails,{' '}
                      <a
                        href="{% unsubscribe_link %}"
                        style={{
                          color: EMAIL_THEME.footerMuted,
                          textDecoration: 'underline',
                        }}
                      >
                        click here
                      </a>
                      .
                    </p>
                    <p
                      style={{
                        fontSize: '11px',
                        lineHeight: 1.4,
                        margin: '0 0 4px',
                        color: EMAIL_THEME.footerMuted,
                      }}
                    >
                      Shop 1, 117 Baylis St, Wagga Wagga
                    </p>
                    <p
                      style={{
                        fontSize: '10px',
                        lineHeight: 1.35,
                        margin: 0,
                        color: EMAIL_THEME.footerSubtle,
                      }}
                    >
                      © {year} BomBom. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
