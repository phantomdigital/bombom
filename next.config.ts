import type { NextConfig } from "next";

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
    ];
  },
};

export default nextConfig;
