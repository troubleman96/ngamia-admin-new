import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/ngamia/:path*",
        destination: "https://api.ngamia.cc/:path*",
      },
    ];
  },
};

export default nextConfig;
