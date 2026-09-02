'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useConvexAuth } from 'convex/react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';
import { Button, buttonVariants } from '@/components/ui/button';
import { CakeStackLogo } from '@/components/web/cakestack-logo';
import { ThemeToggle } from '@/components/web/ThemeToggle';
import { SearchInput } from '@/components/web/SearchInput';

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
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
            data-testid="nav-link-home"
          >
            <CakeStackLogo size={30} showWordmark />
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
        <div className="hidden md:block mr-3">
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
