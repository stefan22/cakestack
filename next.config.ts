import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    // When a lockfile exists above this repo (e.g. ~/package-lock.json), Next can infer the wrong Turbopack root
    root: configDir,
  },
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: '**.convex.cloud',
        protocol: 'https',
        port: '',
      },
      {
        hostname: '**.convex.site',
        protocol: 'https',
        port: '',
      },
      {
        hostname: 'res.cloudinary.com',
        protocol: 'https',
        port: '',
      },
    ],
  },
};

export default nextConfig;
