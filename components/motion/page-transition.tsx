'use client';

import { motion } from 'motion/react';

/**
 * Mount animation for route content. Because app/template.tsx remounts on
 * every navigation, wrapping children here gives each page a fresh,
 * consistent entrance without needing exit-animation plumbing.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}>
      {children}
    </motion.div>
  );
}
