import { ReactNode } from 'react';
import Navbar from '@/components/web/navbar';
import { Footer } from '@/components/web/footer';

/**
 * Navbar reads usePathname(), which cacheComponents treats as unprerenderable
 * URL data. The alternative fix — a Suspense boundary around the nav — gives
 * it its own hydration boundary, so its GSAP timelines start from a later t0
 * than the panel wipe's and the wordmark and search drift out of step with the
 * overlay. Blocking the route keeps the whole page on one clock.
 */
export const instant = false;

export default function SharedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 md:px-6 lg:px-8">
        <Navbar />
        <div className="flex-1">{children}</div>
      </div>
      <Footer />
    </>
  );
}
