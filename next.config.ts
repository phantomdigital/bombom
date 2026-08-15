import type { NextConfig } from "next";
import { GIFT_CARDS_URL } from "./lib/gift-cards";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "bombomtreats.com",
          },
        ],
        destination: "https://bombomtreats.com.au/:path*",
        permanent: true,
      },
      {
        source: "/gift-cards",
        destination: GIFT_CARDS_URL,
        permanent: false,
      },
      {
        source: "/giftcards",
        destination: GIFT_CARDS_URL,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
