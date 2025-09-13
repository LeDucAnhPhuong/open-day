import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**", // cho phép tất cả hostname
      },
      {
        protocol: "https",
        hostname: "**", // cho phép tất cả hostname HTTPS
      },
    ],
  },
};

export default nextConfig;
