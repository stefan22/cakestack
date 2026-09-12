'use client';

import { StaggerContainer } from '@/components/motion/stagger';
import { useWipeHasPlayed } from '@/lib/panel-playback';
import { CONTENT_ENTRANCE_DELAY, HERO_STAGGER } from '@/lib/panel-timing';

/**
 * The hero's stagger, held back only when the panel wipe is actually going to
 * cover it.
 *
 * This exists because page.tsx is a server component and the decision is
 * client-side: on a repeat visit the wipe is skipped, and an unconditional
 * delay would leave the hero blank for over two seconds with nothing on top
 * of it.
 */
export function HeroStagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const hasPlayed = useWipeHasPlayed();
  const initialDelay = hasPlayed ? 0 : CONTENT_ENTRANCE_DELAY;

  return (
    // Keyed on the resolved answer, which remounts the subtree if it flips.
    //
    // getServerSnapshot has to report "not yet played" — the server cannot see
    // localStorage — so the hydration render always schedules the held delay.
    // motion reads `transition` when it starts an animation and does not
    // restart one already queued, so correcting the prop on the next render is
    // too late: the heading would sit out the full hold with no wipe covering
    // it. Remounting is what actually re-runs the entrance at the right time,
    // and it is free here because the content is at opacity 0 either way.
    <StaggerContainer
      key={hasPlayed ? 'instant' : 'held'}
      staggerDelay={HERO_STAGGER}
      initialDelay={initialDelay}
      className={className}>
      {children}
    </StaggerContainer>
  );
}
