import type { Metadata } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";

const siteUrl = getPublicSiteUrl();
const pagePath = "/coming-soon";
const pageUrl = `${siteUrl}${pagePath}`;

const description =
  "BomBom Treats — opening this autumn at Shop 1, 117 Baylis St, Wagga Wagga. Join the list to be first to know when we open.";

export const metadata: Metadata = {
  alternates: {
    canonical: pagePath,
  },
  title: "Coming Autumn",
  description,
  keywords: [
    "BomBom Treats",
    "Wagga Wagga",
    "117 Baylis St",
    "desserts",
    "ice cream",
    "bakery",
    "coming soon",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: pageUrl,
    siteName: "BomBom Treats",
    title: "BomBom Treats | Coming Autumn — Wagga Wagga",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "BomBom Treats | Coming Autumn — Wagga Wagga",
    description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "BomBom Treats",
      url: siteUrl,
      sameAs: [
        "https://instagram.com/bombom.au",
        "https://www.tiktok.com/@bombom_au",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "BomBom Treats",
      description,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "IceCreamShop",
      "@id": `${pageUrl}#local`,
      name: "BomBom Treats",
      url: pageUrl,
      description,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Shop 1, 117 Baylis St",
        addressLocality: "Wagga Wagga",
        addressRegion: "NSW",
        addressCountry: "AU",
      },
      parentOrganization: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function ComingSoonLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-bom-ice flex flex-col">{children}</div>
    </>
  );
}
