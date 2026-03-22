import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import DefaultFooter from './components/default-footer';
import {
  EMAIL_BLEED_SRC,
  EMAIL_LOGO_SRC,
  EMAIL_SITE_URL,
  EMAIL_THEME,
  FONT_BASE_URL,
  TICKER_GIF_SRC,
} from './theme';
import { Tailwind } from '@react-email/tailwind';

/**
 * BomBom welcome email — sent after waitlist signup.
 *
 * Layout follows transactional email best practices:
 * - Traditional header (logo as highest element, anchor of trust)
 * - Single-column 600px content area
 * - Outer frame color for depth and focus
 *
 * Colors from app/globals.css via emails/theme.ts.
 *
 * TODO before launch:
 * 1. Ensure logo is deployed at /images/logo/logo.png (see EMAIL_LOGO_URL in theme.ts)
 *
 * Klaviyo merge tags: https://help.klaviyo.com/hc/en-us/articles/115005076267
 */

const emailResponsiveCss = `
@media only screen and (max-width: 600px) {
  .email-container { padding: 24px 12px !important; }
  .email-hero-logo { padding: 30px 24px 16px !important; }
  .email-main { padding: 36px 24px 28px !important; }
  .email-footer { padding: 20px 16px !important; }
  .email-fluid-img { max-width: 100% !important; width: 100% !important; height: auto !important; }
}
`;

export default function ExampleWelcomeEmail() {
  return (
    <Tailwind>
      <Html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="color-scheme" content="light" />
          <meta name="supported-color-schemes" content="light" />
          <style>{emailResponsiveCss}</style>
          <Font
            fontFamily="saans"
            fallbackFontFamily={['Arial', 'Helvetica', 'sans-serif']}
            webFont={{
              url: `${FONT_BASE_URL}/fonts/SaansRegular.otf`,
              format: 'opentype',
            }}
            fontWeight={400}
          />
          <Font
            fontFamily="saans"
            fallbackFontFamily={['Arial', 'Helvetica', 'sans-serif']}
            webFont={{
              url: `${FONT_BASE_URL}/fonts/SaansMedium.otf`,
              format: 'opentype',
            }}
            fontWeight={500}
          />
        </Head>
        <Preview>You're on the list — welcome to BomBom</Preview>

        {/* Outer frame: light grey */}
        <Body
          style={{
            margin: 0,
            padding: 0,
            backgroundColor: EMAIL_THEME.emailOuterBg,
            fontFamily:
              '"saans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          <Container
            className="email-container"
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              padding: '32px 16px',
            }}
          >
            {/* White card — top corners only; bottom edge is completed by bleed SVG below */}
            <Section
              style={{
                backgroundColor: EMAIL_THEME.bomWhite,
                borderRadius: '8px 8px 0 0',
                overflow: 'hidden',
              }}
            >
              {/* Logo + ticker share one ice block — avoids <hr> gap showing white card behind */}
              <Section
                style={{
                  backgroundColor: EMAIL_THEME.bomIce,
                  textAlign: 'center',
                }}
              >
                <Section
                  className="email-hero-logo"
                  style={{
                    margin: 0,
                    padding: '40px 40px 20px',
                    textAlign: 'center',
                  }}
                >
                  <Link href={EMAIL_SITE_URL} style={{ textDecoration: 'none' }}>
                    <Img
                      className="email-fluid-img"
                      src={EMAIL_LOGO_SRC}
                      alt="BomBom"
                      width={520}
                      height={100}
                      style={{
                        display: 'block',
                        margin: '0 auto',
                        maxWidth: '100%',
                        height: 'auto',
                        /* White wordmark on bomIce; Outlook often ignores filter — use a white PNG if that matters */
                        filter: 'brightness(0) invert(1)',
                      }}
                    />
                  </Link>
                </Section>
                <Section
                  style={{
                    margin: 0,
                    padding: '12px 0 8px',
                    textAlign: 'center',
                  }}
                >
                  <Img
                    className="email-fluid-img"
                    src={TICKER_GIF_SRC}
                    alt="Frozen Yoghurt • Soft Serve • Ice cream"
                    width={600}
                    height={32}
                    style={{
                      display: 'block',
                      margin: 0,
                      lineHeight: 0,
                      maxWidth: '100%',
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </Section>
              </Section>

              <Hr
                style={{
                  margin: 0,
                  borderTop: `1px solid ${EMAIL_THEME.emailDivider}`,
                  borderBottom: 'none',
                }}
              />

              {/* Main content */}
              <Section
                className="email-main"
                style={{ padding: '48px 40px 36px' }}
              >
                <Heading
                  as="h1"
                  style={{
                    margin: '0 0 16px',
                    fontSize: '24px',
                    fontWeight: 600,
                    lineHeight: '32px',
                    color: EMAIL_THEME.bomBlack,
                  }}
                >
                  {`Hey {{ person.first_name|default:'there' }},`}
                </Heading>

                <Text
                  style={{
                    margin: '0 0 20px',
                    fontSize: '16px',
                    lineHeight: '26px',
                    color: EMAIL_THEME.bomBlack,
                  }}
                >
                  You're officially on the BomBom waitlist. We're putting the
                  finishing touches on our Wagga Wagga store and you'll be the first
                  to know when we open.
                </Text>

                <Text
                  style={{
                    margin: '0',
                    fontSize: '16px',
                    lineHeight: '26px',
                    color: EMAIL_THEME.bomBlack,
                  }}
                >
                  We'll let you know when we're ready to open the doors.
                </Text>
              </Section>
            </Section>

            {/* Custom bottom silhouette — sits on outer grey so the shape reads as card + drip */}
            <Section
              style={{
                margin: 0,
                padding: 0,
                lineHeight: 0,
                backgroundColor: EMAIL_THEME.emailOuterBg,
              }}
            >
              <Img
                className="email-fluid-img"
                src={EMAIL_BLEED_SRC}
                alt=""
                width={600}
                height={112}
                style={{
                  display: 'block',
                  margin: 0,
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  verticalAlign: 'bottom',
                }}
              />
            </Section>

            <DefaultFooter />
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
