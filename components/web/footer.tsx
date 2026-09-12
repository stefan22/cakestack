import Link from 'next/link';
import { cacheLife } from 'next/cache';

import { CakeStackLogo } from '@/components/web/cakestack-logo';

const footerSections = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'All Posts', href: '/blog' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign In', href: '/auth/sign-in' },
      { label: 'Sign Up', href: '/auth/sign-up' },
    ],
  },
  {
    title: 'Site',
    links: [{ label: 'Sitemap', href: '/sitemap.xml' }],
  },
];

export async function Footer() {
  'use cache';
  cacheLife('days');

  const year = new Date().getFullYear();

  return (
    <footer className="mt-40 w-full border-t border-border bg-secondary/30">
      <div className="mx-auto w-full max-w-7xl px-4 pt-14 pb-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-baseline"
              data-testid="footer-link-home">
              <CakeStackLogo size={30} showWordmark playOnView />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <nav
              key={section.title}
              aria-label={section.title}
              className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-foreground">
                {section.title}
              </h2>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          <p>&copy; {year} CakeStack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
