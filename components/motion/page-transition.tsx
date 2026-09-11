'use client';

import { motion } from 'motion/react';
import { useEffect } from 'react';

/**
 * Mount animation for route content. Because app/template.tsx remounts on
 * every navigation, wrapping children here gives each page a fresh,
 * consistent entrance without needing exit-animation plumbing.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // The browser otherwise restores the previous offset on reload, landing
    // part-way down the page.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      // Without this the entrance offset below shifts the top of the document,
      // and scroll anchoring compensates by scrolling down by that same amount.
      style={{ overflowAnchor: 'none' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}>
      {children}
    </motion.div>
  );
}
