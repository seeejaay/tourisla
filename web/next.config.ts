import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  typescript: { ignoreBuildErrors: true },
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.0.130:3000",
    "http://192.168.0.130",
  ],

  images: {
    domains: ["media-cdn.tripadvisor.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tourislabuckets.s3.ap-southeast-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
