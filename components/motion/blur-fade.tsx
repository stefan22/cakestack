'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  blur?: string;
  inView?: boolean;
  inViewMargin?: string;
}

/**
 * Reusable entrance animation: blurs, fades and slides content into place.
 * Set `inView` to trigger on scroll instead of on mount.
 */
export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.6,
  yOffset = 24,
  blur = '8px',
  inView = false,
  inViewMargin = '-80px',
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inViewResult = useInView(ref, {
    once: true,
    margin: inViewMargin as unknown as never,
  });
  const isVisible = !inView || inViewResult;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, filter: `blur(${blur})` }}
      animate={
        isVisible ?
          { opacity: 1, y: 0, filter: 'blur(0px)' }
        : { opacity: 0, y: yOffset, filter: `blur(${blur})` }
      }
      transition={{ delay, duration, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}
