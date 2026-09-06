import { ReactNode } from 'react';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurFade } from '@/components/motion/blur-fade';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen mb-0 w-full flex items-center justify-center">
      <div className="absolute top-5 left-5">
        <Link href="/" className={cn(buttonVariants({ variant: 'secondary' }))}>
          <ArrowLeft className="size-4" />
          Go Back
        </Link>
      </div>
      <BlurFade delay={0.14} yOffset={0} blur="1px" className="flex">
        <div className="w-full md:mx-auto">{children}</div>
      </BlurFade>
    </div>
  );
}
