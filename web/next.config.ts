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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media-cdn.tripadvisor.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tourislabuckets.s3.ap-southeast-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.weatherapi.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
