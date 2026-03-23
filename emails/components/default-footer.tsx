import { Img, Link, Section, Text } from '@react-email/components';
import {
  EMAIL_INSTAGRAM_ICON_SRC,
  EMAIL_THEME,
  EMAIL_TIKTOK_ICON_SRC,
  SHOP_ADDRESS,
} from '../theme';

const INSTAGRAM_URL = 'https://instagram.com/bombom.au';
const TIKTOK_URL = 'https://tiktok.com/@bombom_au';

/**
 * Default footer — social icons, address, unsubscribe, copyright.
 * Reuse across all email templates.
 */
export default function DefaultFooter() {
  return (
    <Section
      className="email-footer"
      style={{
        padding: '24px',
        marginTop: 0,
        backgroundColor: EMAIL_THEME.emailOuterBg,
        textAlign: 'center',
      }}
    >
      <Link
        href={INSTAGRAM_URL}
        style={{
          display: 'inline-block',
          margin: '0 6px',
          textDecoration: 'none',
        }}
        aria-label="Instagram"
      >
        <Img
          src={EMAIL_INSTAGRAM_ICON_SRC}
          alt="Instagram"
          width={32}
          height={32}
          style={{ display: 'inline-block' }}
        />
      </Link>
      <Link
        href={TIKTOK_URL}
        style={{
          display: 'inline-block',
          margin: '0 6px',
          textDecoration: 'none',
        }}
        aria-label="TikTok"
      >
        <Img
          src={EMAIL_TIKTOK_ICON_SRC}
          alt="TikTok"
          width={32}
          height={32}
          style={{ display: 'inline-block' }}
        />
      </Link>
      <Text
        style={{
          margin: '16px 0 8px',
          fontSize: '11px',
          lineHeight: '1.45',
          fontWeight: 400,
          color: EMAIL_THEME.footerMuted,
        }}
      >
        {"If you'd no longer like to receive emails, "}
        <span
          dangerouslySetInnerHTML={{
            __html:
              '<a href="{% unsubscribe_link %}" style="color:#5c6168;text-decoration:underline">click here</a>',
          }}
        />
        .
      </Text>
      <Text
        style={{
          margin: '0 0 4px',
          fontSize: '11px',
          lineHeight: '1.4',
          fontWeight: 400,
          color: EMAIL_THEME.footerMuted,
        }}
      >
        {SHOP_ADDRESS}
      </Text>
      <Text
        style={{
          margin: '0',
          fontSize: '10px',
          lineHeight: '1.35',
          fontWeight: 400,
          color: EMAIL_THEME.footerSubtle,
        }}
      >
        © {new Date().getFullYear()} BomBom. All rights reserved.
      </Text>
    </Section>
  );
}
