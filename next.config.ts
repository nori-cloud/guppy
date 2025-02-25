import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  redirects: async () => [
    {
      // because we don't have a /profile page
      source: "/profile",
      destination: "/dashboard",
      permanent: true,
    },
  ],
}

export default nextConfig
