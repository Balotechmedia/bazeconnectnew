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
  ],
};

export default nextConfig;
