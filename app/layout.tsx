import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import { getPublicSiteUrl } from "@/lib/site-url";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getPublicSiteUrl();

const description =
  "BomBom Treats is now open at Shop 1, 117 Baylis St, Wagga Wagga. Come in and say hey!";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "BomBom Treats | Now Open | Wagga",
    template: "%s | BomBom Treats",
  },
  description,
  keywords: [
    "BomBom Treats",
    "Wagga Wagga",
    "117 Baylis St",
    "desserts",
    "ice cream",
    "bakery",
    "cakes",
    "coffee",
  ],
  authors: [{ name: "BomBom Treats", url: siteUrl }],
  creator: "BomBom Treats",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName: "BomBom Treats",
    title: "BomBom Treats | Wagga Wagga",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "BomBom Treats | Wagga Wagga",
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="stylesheet" href="https://use.typekit.net/nxt3jds.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(d) {
                var config = {
                  kitId: 'nxt3jds',
                  scriptTimeout: 2000,
                  async: true
                },
                h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s);
                
                // Fallback: ensure content shows after max 2 seconds
                setTimeout(function() {
                  if (h.className.indexOf('wf-active') === -1 && h.className.indexOf('wf-inactive') === -1) {
                    h.className = h.className.replace(/\\bwf-loading\\b/g, '') + ' wf-inactive';
                  }
                }, 2000);
              })(document);
            `,
          }}
        />
      </head>
      <body
        className={`${geistMono.variable} antialiased bg-sky-100`}
      >
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-bom-black focus-visible:text-bom-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bom-black focus-visible:ring-offset-2"
        >
          Skip to main content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
