import { Img, Link, Section, Text } from '@react-email/components';
import { EMAIL_THEME, SHOP_ADDRESS } from '../theme';

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
        marginTop: '16px',
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
          src="https://cdn.simpleicons.org/instagram/262626"
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
          src="https://cdn.simpleicons.org/tiktok/262626"
          alt="TikTok"
          width={32}
          height={32}
          style={{ display: 'inline-block' }}
        />
      </Link>
      <Text
        style={{
          margin: '16px 0 8px',
          fontSize: '12px',
          lineHeight: '1.45',
          fontWeight: 400,
          color: EMAIL_THEME.bomBlack,
        }}
      >
        We sent you this because you joined the BomBom waitlist.{' '}
        <span dangerouslySetInnerHTML={{ __html: '{% unsubscribe %}' }} />
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
