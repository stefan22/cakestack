import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

/**
 * Next.js 16 Proxy (formerly middleware). Protects routes that require auth.
 *
 * Cookie naming note: `getSessionCookie()` uses Better Auth's default session
 * cookie name. If you ever customize `cookieName` in the Better Auth config
 * inside convex/auth.ts, update this file to match (or read it via the same
 * shared config) — otherwise every protected route will silently redirect to
 * /auth/sign-in with no error log.
 */
export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Routes that require a signed-in session. [slug] matches the dynamic segment
  // in app/(share-layout)/blog/[slug]/edit/page.tsx.
  matcher: ['/create', '/blog/:slug/edit'],
};
