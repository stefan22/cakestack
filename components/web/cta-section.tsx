import { ArrowRight } from 'lucide-react';

import { BlurFade } from '@/components/motion/blur-fade';
import { RobotIllustration } from '@/components/web/robot-illustration';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <BlurFade inView yOffset={50} blur="10px" duration={0.7}>
      <div className="group relative isolate overflow-hidden rounded-2xl">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(circle at 15% 20%, oklch(0.4 0.09 264), transparent 55%), radial-gradient(circle at 85% 80%, oklch(0.32 0.08 300), transparent 55%), oklch(0.16 0.02 264)',
          }}>
          <svg
            className="absolute inset-0 h-full w-full opacity-20"
            aria-hidden="true">
            <pattern
              id="cta-grid"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>

        <div className="grid grid-cols-1 items-center gap-6 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-2 lg:gap-10 lg:px-14">
          <div className="flex flex-col gap-5 text-white">
            <h2 className="text-2xl font-medium sm:text-3xl lg:text-4xl">
              Meet the CakeBot assistant behind every page
            </h2>
            <p className="max-w-md text-base text-white/80 md:text-lg">
              No tokens just cake. A super friendly creature ready for whatever
              guides your product.
            </p>
            <div>
              <Button
                variant="default"
                size="lg"
                className="h-10 px-6 text-base">
                Call to Action
                <ArrowRight className="size-4 -rotate-45" />
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center pt-4 lg:justify-end">
            <RobotIllustration className="w-full max-w-[220px] transition-transform duration-300 group-hover:scale-105 sm:max-w-[260px]" />
          </div>
        </div>
      </div>
    </BlurFade>
  );
}
