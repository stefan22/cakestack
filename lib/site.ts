/**
 * Public site origin for sitemap, robots, and canonicals.
 * Must match the host that returns 200 (not a redirect).
 * Live Vercel: apex serves; www 308s to apex.
 */
const PUBLIC_ORIGIN = 'https://cakestack.uk';

const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');

// NEXT_PUBLIC_SITE_URL doubles as the Better Auth baseURL (lib/auth-client.ts),
// so locally it has to be http://localhost:3000 for sign-in to work. That value
// must never reach a sitemap entry, robots directive, canonical or OG tag, so
// loopback origins fall back to the real public origin here.
const isLoopback =
  !!configured &&
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(configured);

export const SITE_URL = !configured || isLoopback ? PUBLIC_ORIGIN : configured;
