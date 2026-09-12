'use client';

import Link from 'next/link';
import { useRef, useTransition } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { usePathname, useRouter } from 'next/navigation';
import { useConvexAuth } from 'convex/react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';
import { Button, buttonVariants } from '@/components/ui/button';
import { CakeStackLogo } from '@/components/web/cakestack-logo';
import { ThemeToggle } from '@/components/web/theme-toggle';
import { SearchInput } from '@/components/web/search-input';
import { LOGO_DRAW_DELAY, NAV_REVEAL_DURATION } from '@/lib/panel-timing';
import { cn } from '@/lib/utils';
import { useWipeHasPlayed } from '@/lib/panel-playback';

gsap.registerPlugin(useGSAP);

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const pathname = usePathname();
  // Only the home route runs the panel wipe, and app/template.tsx remounts
  // this nav on every navigation. Holding the draw anywhere else would leave
  // the wordmark blank for three seconds for no reason.
  const isHome = pathname === '/';
  // When the wipe is not going to run there is nothing to wait for, so the nav
  // arrives at once rather than holding a blank wordmark and search field for
  // two seconds. Called unconditionally — short-circuiting the `&&` below
  // would make hook order depend on the route.
  const hasPlayed = useWipeHasPlayed();
  const wipeWillPlay = isHome && !hasPlayed;
  const wordmarkDelay = wipeWillPlay ? LOGO_DRAW_DELAY : 0;

  const searchRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!isHome) return;

      // Skipped run: no wipe to wait for, so drop it straight in. The
      // `invisible` class is still on the element, and autoAlpha clears it.
      if (!wipeWillPlay) {
        gsap.set(searchRef.current, { autoAlpha: 1 });
        return;
      }

      // fromTo, not to: the field is hidden by a class, so its opacity is
      // still 1 and a plain `to` would find nothing to animate and simply pop
      // it on. autoAlpha carries visibility along with opacity — per GSAP it
      // flips to hidden at 0 to "prevent clicks/interactivity" — so the field
      // is genuinely inert behind the overlay, not just transparent.
      gsap.fromTo(
        searchRef.current,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: NAV_REVEAL_DURATION,
          delay: LOGO_DRAW_DELAY,
          ease: 'power2.out',
        }
      );
    },
    { dependencies: [isHome, wipeWillPlay] }
  );
  const [isPending, startTransition] = useTransition();

  const navLinks = [
    { label: 'All Posts', href: '/blog', id: 'blog' },
    ...(isAuthenticated ?
      [{ label: 'Create', href: '/create', id: 'create' }]
    : []),
  ];

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Signed out successfully.');
            router.push('/');
          },
          onError: ({ error }) => {
            toast.error(error.message);
          },
        },
      });
    });
  };

  return (
    <nav className="w-full py-5 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="flex items-baseline"
          data-testid="nav-link-home">
          <CakeStackLogo size={30} showWordmark delay={wordmarkDelay} />
        </Link>

        <div className="hidden sm:flex items-baseline gap-2 mt-1">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              data-testid={`nav-link-${link.id}`}
              className={buttonVariants({ variant: 'secondary' })}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* `invisible` only on home: it hides the field in the server-rendered
            markup so it can't flash before GSAP takes over at hydration. */}
        <div
          ref={searchRef}
          className={cn('hidden md:block mr-3', isHome && 'invisible')}>
          <SearchInput />
        </div>

        {!isLoading && (
          <div className="flex items-center gap-2">
            {isAuthenticated ?
              <Button
                variant="destructive"
                data-testid="nav-link-signout"
                disabled={isPending}
                onClick={handleSignOut}>
                {isPending ?
                  <span>See ya!</span>
                : <span>Sign Out</span>}
              </Button>
            : <>
                <Link
                  data-testid="nav-link-signup"
                  className={buttonVariants()}
                  href="/auth/sign-up">
                  Sign Up
                </Link>

                <Link
                  data-testid="nav-link-signin"
                  className={buttonVariants({ variant: 'outline' })}
                  href="/auth/sign-in">
                  Sign In
                </Link>
              </>
            }
          </div>
        )}

        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
