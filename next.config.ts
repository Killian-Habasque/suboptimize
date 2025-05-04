import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    authInterrupts: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }, {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'v9aolganobwwpe19.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'cms.doowup.fr',
      },
      {
        protocol: 'https',
        hostname: 'cms.doowup.fr',
      },
    ],
  },
};

export default nextConfig;
