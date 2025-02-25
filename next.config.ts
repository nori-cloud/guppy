import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  redirects: async () => [
    {
      // because we don't have a /dashboard/profile page
      source: "/dashboard/profile",
      destination: "/dashboard",
      permanent: true,
    },
  ],
}

export default nextConfig
