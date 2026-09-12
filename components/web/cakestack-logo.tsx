'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CakeStack } from '@/components/web/cake-stack';

export interface CakeStackLogoProps {
  size?: number;
  showWordmark?: boolean;
  /** Delay the wordmark draw until it scrolls into view. */
  playOnView?: boolean;
  /** Seconds to hold before the wordmark draws. */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CakeStackLogo: React.FC<CakeStackLogoProps> = ({
  size = 32,
  showWordmark = true,
  playOnView = false,
  delay = 0,
  className,
  style,
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1 select-none',
        '*:transition-all *:duration-1000 *:ease-linear',
        className
      )}
      role="img"
      aria-label="CakeStack"
      style={style}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <Image
          src="/images/cakestack-bgrm.webp"
          alt=""
          fill
          sizes={`${size}px`}
          priority
          className="object-contain dynamic-image"
        />
      </div>

      {showWordmark && (
        <CakeStack
          playOnView={playOnView}
          delay={delay}
          className="w-auto text-foreground"
          style={{ height: `${size * 0.62}px` }}
        />
      )}
    </div>
  );
};

CakeStackLogo.displayName = 'CakeStackLogo';
