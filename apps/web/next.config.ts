import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Enable React strict mode for surfacing potential issues early.
   * See: https://react.dev/reference/react/StrictMode
   */
  reactStrictMode: true,

  /**
   * Image optimization configuration.
   * Add remote hostnames here as new image sources are introduced.
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  /**
   * Experimental features.
   * Typed routes: enables compile-time checking of all Next.js route paths.
   */
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
