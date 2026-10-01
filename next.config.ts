import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows this Mac's phone-on-Wi-Fi preview during local development.
  allowedDevOrigins: ["192.168.200.227"],
};

export default nextConfig;
