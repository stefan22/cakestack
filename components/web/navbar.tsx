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

      // One fade for both paths; only the cue differs. A suppressed run used
      // to take a gsap.set here, which flips visibility and opacity in a
      // single frame — the field snapped in. Dev hydrates slowly enough to
      // hide that; production does not.
      //
      // fromTo, not to: the field is hidden by a class, so its opacity is
      // still 1 and a plain `to` would find nothing to animate and simply pop
      // it on. autoAlpha carries visibility along with opacity — per GSAP it
      // flips to hidden at 0 to "prevent clicks/interactivity" — so the field
      // is genuinely inert behind the overlay, not just transparent.
      const tl = gsap.timeline();

      // An empty spacer holding the wipe's cue. It gives the reveal below a
      // preceding end point, which is what a relative position parameter
      // offsets from — without one, "-=1" has nothing to subtract from and is
      // clamped to the start.
      tl.to({}, { duration: wipeWillPlay ? LOGO_DRAW_DELAY : 0 });

      tl.fromTo(
        searchRef.current,
        // scaleX rather than x: translating only slides the field in, where
        // scaling opens it out from its own width, which is what reads as a
        // reveal. Paired with opacity so it arrives rather than stretches.
        { autoAlpha: 0, scaleX: 0.9 },
        {
          autoAlpha: 1,
          scaleX: 1,
          // Transform, so it costs no layout and cannot push its neighbours.
          transformOrigin: 'right center',
          duration: NAV_REVEAL_DURATION,
          ease: 'power2.out',
        },
        '-=1.65'
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
            markup so it can't flash before GSAP takes over at hydration.

            `relative z-20`: the GSAP reveal sets a `transform` on this div,
            which — regardless of `position` — creates its own stacking
            context per the CSS spec. Without an explicit z-index that
            context has none, so it is painted in plain DOM order among its
            siblings' stacking contexts, and page content declared later in
            the DOM (the hero section, its Particles canvas, post cards)
            painted on top of it and ate every click on the search dropdown.
            `z-20` outranks SearchInput's own internal `z-10`, which only
            matters for ordering *within* this context. */}
        <div
          ref={searchRef}
          className={cn(
            'relative z-20 hidden md:block mr-3',
            isHome && 'invisible'
          )}>
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
