'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
      className={cn('flex items-center gap-1 select-none', className)}
      role="img"
      aria-label="CakeStack"
      style={style}
    >
      <div
        className="relative flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <Image
          src="/images/cakedes.webp"
          alt=""
          fill
          sizes={`${size}px`}
          priority
          className="object-contain"
        />
      </div>

      {showWordmark && (
        <span
          className="font-semibold tracking-tight text-foreground leading-none"
          style={{ fontSize: `${size * 0.78}px` }}
        >
          <span className="font-semibold">Cake</span>
          <span className="font-semibold">Stack</span>
        </span>
      )}
    </div>
  );
};

CakeStackLogo.displayName = 'CakeStackLogo';
