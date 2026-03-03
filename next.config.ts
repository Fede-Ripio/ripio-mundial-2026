import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nisegxadupnavsdammwf.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Google avatars (OAuth sign-in)
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
}

export default nextConfig;
