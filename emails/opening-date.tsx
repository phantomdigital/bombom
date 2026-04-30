import {
  EMAIL_BLEED_URL,
  EMAIL_INSTAGRAM_ICON_URL,
  EMAIL_LOGO_URL,
  EMAIL_SITE_URL,
  EMAIL_THEME,
  EMAIL_TIKTOK_ICON_URL,
} from './theme';

const FONT_REGULAR = `${EMAIL_SITE_URL}/fonts/SaansRegular.otf`;
const FONT_MEDIUM = `${EMAIL_SITE_URL}/fonts/SaansMedium.otf`;

// Leave empty to show the mock leaked group chat block.
// Set this to a real image URL to show the screenshot instead.
const GROUP_CHAT_SCREENSHOT_URL = '';

// Marketing can point this CTA to any landing page.
const OPENING_DATE_CTA_URL = `${EMAIL_SITE_URL}`;

// Replace if you want a different full-width closing image.
const FULL_WIDTH_IMAGE_URL = `${EMAIL_SITE_URL}/9154.jpg`;
const EMAIL_OUTER_BG = EMAIL_THEME.bomWhite;
const EMAIL_CARD_BG = EMAIL_THEME.bomIce;

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
  background-color: ${EMAIL_OUTER_BG};
  font-family: saans, Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
}
.heading {
  margin: 0 0 16px;
  font-size: 42px;
  font-weight: 600;
  line-height: 1.02;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  text-align: center;
  color: #000000;
}
.body-text {
  margin: 0 0 18px;
  font-size: 16px;
  line-height: 26px;
  text-align: center;
  color: #000000;
}
.button {
  display: inline-block;
  padding: 12px 20px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  color: #ffffff;
  background-color: #000000;
}
`.trim();

export default function OpeningDateEmail() {
  const year = new Date().getFullYear();

  return (
    <html>
      <head>
        <title>{''}</title>
        <style type="text/css">{headCss}</style>
      </head>
      <body
        style={{
          backgroundColor: EMAIL_OUTER_BG,
          margin: 0,
          padding: 0,
        }}
      >
        <table
          border={0}
          cellPadding={0}
          cellSpacing={0}
          width="100%"
          style={{ backgroundColor: EMAIL_OUTER_BG }}
        >
          <tr>
            <td align="center" style={{ padding: '40px 0' }}>
              <table
                border={0}
                cellPadding={0}
                cellSpacing={0}
                width={600}
                style={{
                  maxWidth: '600px',
                  width: '95%',
                  backgroundColor: EMAIL_CARD_BG,
                  borderRadius: '8px 8px 0 0',
                }}
              >
                <tr>
                  <td
                    style={{
                      backgroundColor: EMAIL_THEME.bomIce,
                      textAlign: 'center',
                      padding: '48px 28px 34px',
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
                {GROUP_CHAT_SCREENSHOT_URL ? (
                  <tr>
                    <td style={{ padding: 0, lineHeight: 0 }}>
                      <img
                        alt="Leaked group chat opening date message"
                        height={300}
                        src={GROUP_CHAT_SCREENSHOT_URL}
                        width={600}
                        style={{
                          display: 'block',
                          width: '100%',
                          height: 'auto',
                          border: 'none',
                          outline: 'none',
                        }}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td style={{ padding: '34px 20px 18px' }}>
                      <table
                        border={0}
                        cellPadding={0}
                        cellSpacing={0}
                        width="100%"
                        style={{
                          width: '78%',
                          maxWidth: '390px',
                          margin: '0 auto',
                          backgroundColor: '#f2f2f7',
                          border: '1px solid #d9d9df',
                          borderRadius: '28px',
                        }}
                      >
                        <tr>
                          <td style={{ padding: '10px 14px 6px' }}>
                            <table border={0} cellPadding={0} cellSpacing={0} width="100%">
                              <tr>
                                <td
                                  style={{
                                    fontSize: '12px',
                                    lineHeight: '14px',
                                    color: '#8e8e93',
                                    fontWeight: 500,
                                  }}
                                >
                                  9:41
                                </td>
                                <td
                                  align="center"
                                  style={{
                                    fontSize: '12px',
                                    lineHeight: '14px',
                                    color: '#8e8e93',
                                    fontWeight: 500,
                                  }}
                                >
                                  Messages
                                </td>
                                <td
                                  align="right"
                                  style={{
                                    fontSize: '12px',
                                    lineHeight: '14px',
                                    color: '#8e8e93',
                                    fontWeight: 500,
                                  }}
                                >
                                  &#8226;&#8226;&#8226;
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              borderTop: '1px solid #d9d9df',
                              borderBottom: '1px solid #d9d9df',
                              padding: '10px 14px',
                            }}
                          >
                            <table border={0} cellPadding={0} cellSpacing={0} width="100%">
                              <tr>
                                <td
                                  width={26}
                                  style={{
                                    width: '26px',
                                    fontSize: '20px',
                                    lineHeight: '20px',
                                    color: '#007aff',
                                  }}
                                >
                                  &#8249;
                                </td>
                                <td align="center">
                                  <table border={0} cellPadding={0} cellSpacing={0}>
                                    <tr>
                                      <td align="center">
                                        <table
                                          border={0}
                                          cellPadding={0}
                                          cellSpacing={0}
                                          style={{ margin: '0 auto 1px' }}
                                        >
                                          <tr>
                                            <td style={{ paddingTop: '5px' }}>
                                              <span
                                                style={{
                                                  display: 'inline-block',
                                                  width: '14px',
                                                  height: '14px',
                                                  lineHeight: '14px',
                                                  borderRadius: '999px',
                                                  backgroundColor: '#ffd7e6',
                                                  color: '#8f2c55',
                                                  fontSize: '7px',
                                                  textAlign: 'center',
                                                }}
                                              >
                                                L
                                              </span>
                                            </td>
                                            <td style={{ paddingLeft: '2px' }}>
                                              <span
                                                style={{
                                                  display: 'inline-block',
                                                  width: '24px',
                                                  height: '24px',
                                                  lineHeight: '24px',
                                                  borderRadius: '999px',
                                                  backgroundColor: '#7de2f3',
                                                  color: '#1f5061',
                                                  fontSize: '14px',
                                                  textAlign: 'center',
                                                }}
                                              >
                                                🍧
                                              </span>
                                            </td>
                                            <td style={{ paddingLeft: '2px', paddingTop: '5px' }}>
                                              <span
                                                style={{
                                                  display: 'inline-block',
                                                  width: '14px',
                                                  height: '14px',
                                                  lineHeight: '14px',
                                                  borderRadius: '999px',
                                                  backgroundColor: '#d9ecff',
                                                  color: '#0b5fb3',
                                                  fontSize: '7px',
                                                  textAlign: 'center',
                                                }}
                                              >
                                                B
                                              </span>
                                            </td>
                                            <td style={{ paddingLeft: '2px', paddingTop: '7px' }}>
                                              <span
                                                style={{
                                                  display: 'inline-block',
                                                  width: '11px',
                                                  height: '11px',
                                                  lineHeight: '11px',
                                                  borderRadius: '999px',
                                                  backgroundColor: '#f4e8c9',
                                                  color: '#836a2a',
                                                  fontSize: '6px',
                                                  textAlign: 'center',
                                                }}
                                              >
                                                T
                                              </span>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        style={{
                                          paddingTop: '1px',
                                          fontSize: '13px',
                                          lineHeight: '16px',
                                          color: '#000000',
                                          fontWeight: 600,
                                        }}
                                      >
                                        BomBom <span style={{ color: '#8e8e93' }}>&#8250;</span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        style={{
                                          fontSize: '11px',
                                          lineHeight: '13px',
                                          color: '#8e8e93',
                                          fontWeight: 400,
                                        }}
                                      >
                                        14 People
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                                <td
                                  width={26}
                                  align="right"
                                  style={{
                                    width: '26px',
                                    fontSize: '15px',
                                    lineHeight: '15px',
                                    color: '#007aff',
                                  }}
                                >
                                  &#128249;
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '16px 14px 12px' }}>
                            <p
                              style={{
                                margin: '0 0 1px',
                                fontSize: '11px',
                                lineHeight: '13px',
                                color: '#8e8e93',
                                textAlign: 'center',
                              }}
                            >
                              iMessage
                            </p>
                            <p
                              style={{
                                margin: '0 0 8px',
                                fontSize: '11px',
                                lineHeight: '13px',
                                color: '#8e8e93',
                                textAlign: 'center',
                              }}
                            >
                              Today 9:41 AM
                            </p>
                            <table border={0} cellPadding={0} cellSpacing={0} width="100%">
                              <tr>
                                <td style={{ verticalAlign: 'top' }}>
                                  <p
                                    style={{
                                      margin: '0 0 5px 38px',
                                      fontSize: '12px',
                                      lineHeight: '14px',
                                      color: '#8e8e93',
                                    }}
                                  >
                                    Ludmilla
                                  </p>
                                  <table border={0} cellPadding={0} cellSpacing={0}>
                                    <tr>
                                      <td
                                        width={28}
                                        style={{ width: '28px', verticalAlign: 'bottom', paddingBottom: '2px' }}
                                      >
                                        <span
                                          style={{
                                            display: 'inline-block',
                                            width: '28px',
                                            height: '28px',
                                            lineHeight: '28px',
                                            borderRadius: '999px',
                                            backgroundColor: '#ffd7e6',
                                            color: '#8f2c55',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            textAlign: 'center',
                                          }}
                                        >
                                          L
                                        </span>
                                      </td>
                                      <td style={{ verticalAlign: 'top', paddingLeft: '6px' }}>
                                        <table
                                          border={0}
                                          cellPadding={0}
                                          cellSpacing={0}
                                          style={{
                                            maxWidth: '84%',
                                            backgroundColor: '#e5e5ea',
                                            borderRadius: '18px',
                                          }}
                                        >
                                          <tr>
                                            <td style={{ padding: '10px 13px' }}>
                                              <p
                                                style={{
                                                  margin: 0,
                                                  fontSize: '14px',
                                                  lineHeight: '19px',
                                                  color: '#000000',
                                                }}
                                              >
                                                Opening date is locked in. We open on Friday 1st May at
                                                11:00am. Keep this off socials for now.
                                              </p>
                                            </td>
                                          </tr>
                                        </table>
                                        <table
                                          border={0}
                                          cellPadding={0}
                                          cellSpacing={0}
                                          style={{ marginTop: '-8px', marginLeft: '73%' }}
                                        >
                                          <tr>
                                            <td
                                              style={{
                                                minWidth: '34px',
                                                height: '20px',
                                                lineHeight: '20px',
                                                borderRadius: '11px',
                                                border: '1px solid #d7d7dc',
                                                backgroundColor: '#ffffff',
                                                textAlign: 'center',
                                                fontSize: '11px',
                                                padding: '0 6px',
                                              }}
                                            >
                                              ❤️ 4
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            <table
                              border={0}
                              cellPadding={0}
                              cellSpacing={0}
                              width="100%"
                              style={{ marginTop: '14px' }}
                            >
                              <tr>
                                <td
                                  width={28}
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '999px',
                                    border: '1px solid #cfd0d5',
                                    textAlign: 'center',
                                    fontSize: '20px',
                                    lineHeight: '25px',
                                    color: '#8e8e93',
                                  }}
                                >
                                  +
                                </td>
                                <td style={{ paddingLeft: '8px' }}>
                                  <table
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                    width="100%"
                                    style={{
                                      backgroundColor: '#f2f2f7',
                                      border: '1px solid #d7d7dc',
                                      borderRadius: '18px',
                                    }}
                                  >
                                    <tr>
                                      <td
                                        style={{
                                          padding: '7px 12px',
                                          fontSize: '14px',
                                          lineHeight: '18px',
                                          color: '#b2b2b7',
                                        }}
                                      >
                                        iMessage
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                )}
                <tr>
                  <td style={{ padding: '48px 28px 44px', textAlign: 'center' }}>
                    <p className="heading">
                      {'You heard it first!'}
                    </p>
                    <p className="body-text">
                      {'(Don&apos;t tell them we leaked it.)'}
                    </p>
                    <p className="body-text">
                      Keep it low-key for now and lock it in your calendar. Be ready to
                      pull up early.
                    </p>
                    <a
                      href={OPENING_DATE_CTA_URL}
                      target="_blank"
                      className="button"
                      style={{
                        display: 'inline-block',
                        padding: '12px 20px',
                        borderRadius: '999px',
                        fontSize: '14px',
                        fontWeight: 600,
                        lineHeight: '14px',
                        textDecoration: 'none',
                        color: '#ffffff',
                        backgroundColor: '#000000',
                      }}
                    >
                      Add opening date to calendar
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: 0, lineHeight: 0 }}>
                    <img
                      alt="BomBom opening teaser"
                      height={340}
                      src={FULL_WIDTH_IMAGE_URL}
                      width={600}
                      style={{
                        display: 'block',
                        width: '100%',
                        height: 'auto',
                        border: 'none',
                        outline: 'none',
                      }}
                    />
                  </td>
                </tr>
              </table>
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
