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
    ...(process.env.NODE_ENV !== 'production'
      ? { dangerouslyAllowLocalIP: true }
      : {}),
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
      ...(process.env.NODE_ENV !== 'production'
        ? [
            {
              hostname: '127.0.0.1',
              protocol: 'http' as const,
              port: '3210',
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
