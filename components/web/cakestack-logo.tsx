'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CakeStack } from '@/components/web/cake-stack';

export interface CakeStackLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const CakeStackLogo: React.FC<CakeStackLogoProps> = ({
  size = 32,
  showWordmark = true,
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
          className="w-auto text-foreground"
          style={{ height: `${size * 0.62}px` }}
        />
      )}
    </div>
  );
};

CakeStackLogo.displayName = 'CakeStackLogo';
