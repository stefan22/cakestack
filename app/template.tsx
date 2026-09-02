import { PageTransition } from '@/components/motion/page-transition';

/**
 * template.tsx remounts on every navigation (unlike layout.tsx), which is
 * what makes this per-page entrance animation replay on route changes.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
