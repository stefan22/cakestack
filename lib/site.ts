/**
 * Public site origin for sitemap, robots, and canonicals.
 * Must match the host that returns 200 (not a redirect).
 * Live Vercel: apex serves; www 308s to apex.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cakestack.uk'
).replace(/\/$/, '');
