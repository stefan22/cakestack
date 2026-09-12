import { ReactNode, Suspense } from 'react';
import Navbar from '@/components/web/navbar';
import { Footer } from '@/components/web/footer';

export default function SharedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 md:px-6 lg:px-8">
        {/* Navbar reads usePathname() to hold its animations on the route
            that runs the panel wipe. Under cacheComponents that is URL data,
            which can't be prerendered, so the nav streams in behind a
            placeholder of its own height (76px measured) — the shell around
            it stays static and nothing shifts when it lands. */}
        <Suspense fallback={<div className="h-[76px] w-full" aria-hidden />}>
          <Navbar />
        </Suspense>
        <div className="flex-1">{children}</div>
      </div>
      <Footer />
    </>
  );
}
