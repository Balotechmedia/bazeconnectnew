import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  turbopack: {},
  // Allow cross-origin requests from preview panel
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    ".space.z.ai",
    "space.z.ai",
    ".z.ai",
  ],
  // Allow cross-origin for static chunks in dev
  headers: async () => [
    {
      source: "/_next/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
      ],
    },
  ],
};

export default nextConfig;
