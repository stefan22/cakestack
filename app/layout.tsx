import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ConvexClientProvider } from '@/components/web/ConvexClientProvider';
import { Toaster } from '@/components/ui';
import { SITE_URL } from '@/lib/site';

const interSans = Inter({
  variable: '--font-inter-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const DEFAULT_TITLE = 'CakeStack';
const DEFAULT_DESCRIPTION =
  'Essays and field notes on front-end craft, product decisions, and the small details that make software feel considered.';
const DEFAULT_OG_IMAGE = '/covers/screenshot.png';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: 'CakeStack',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1439, height: 958 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${interSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <main className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </main>
          <Toaster
            closeButton
            position="bottom-right"
            richColors={true}
            containerAriaLabel="Notifications"
          />
        </ThemeProvider>
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-5721MB1ZSH" />
    </html>
  );
}
