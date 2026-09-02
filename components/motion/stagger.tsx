'use client';

import { Children, cloneElement, isValidElement } from 'react';

import { BlurFade } from '@/components/motion/blur-fade';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  inView?: boolean;
}

/**
 * Lays out StaggerItem children and gives each one an increasing delay so
 * they reveal in sequence. Delay is computed here and passed down directly
 * (rather than relying on motion's variant propagation) so the sequence is
 * predictable regardless of nesting.
 */
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
  initialDelay = 0,
  inView = false,
}: StaggerContainerProps) {
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, index) => {
        if (!isValidElement<StaggerItemProps>(child)) return child;
        return cloneElement(child, {
          delay: initialDelay + index * staggerDelay,
          inView,
        });
      })}
    </div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
  blur?: string;
  duration?: number;
  delay?: number;
  inView?: boolean;
}

export function StaggerItem({
  children,
  className,
  yOffset = 24,
  blur = '8px',
  duration = 0.5,
  delay = 0,
  inView = false,
}: StaggerItemProps) {
  return (
    <BlurFade
      className={className}
      yOffset={yOffset}
      blur={blur}
      duration={duration}
      delay={delay}
      inView={inView}>
      {children}
    </BlurFade>
  );
}
