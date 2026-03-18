import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
