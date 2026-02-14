import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "i.scdn.co" },
      { hostname: "cdn.discordapp.com" },
      { hostname: "wsrv.nl" },
    ],
  },
};

export default nextConfig;
