import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bombom.au";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BomBom Treats | Wagga Wagga",
    template: "%s | BomBom Treats",
  },
  description:
    "BomBom Treats — coming to Shop 1, 117 Baylis St, Wagga. Sign up to be first to know when we open this autumn.",
  keywords: ["BomBom", "treats", "Wagga Wagga", "desserts", "ice cream", "bakery"],
  authors: [{ name: "BomBom Treats", url: siteUrl }],
  creator: "BomBom Treats",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName: "BomBom Treats",
    title: "BomBom Treats | Coming to Wagga Wagga",
    description:
      "Sign up to be first to know when BomBom Treats opens at Shop 1, 117 Baylis St, Wagga.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BomBom Treats | Coming to Wagga Wagga",
    description:
      "Sign up to be first to know when BomBom Treats opens at Shop 1, 117 Baylis St, Wagga.",
  },
  robots: {
    index: true,
    follow: true,
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
    <html lang="en">
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
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
