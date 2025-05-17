import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.0.130:3000",
    "http://192.168.0.130",
  ],
};

export default nextConfig;
