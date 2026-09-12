'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';

import {
  PANEL_DROP,
  PANEL_DROP_STAGGER,
  PANEL_OPEN,
  PANEL_RISE,
  PANEL_RISE_OVERLAP,
} from '@/lib/panel-timing';
import { markWipePlayed, wipeHasPlayed } from '@/lib/panel-playback';

gsap.registerPlugin(useGSAP);

/**
 * Full-screen panel wipe that plays once on mount and uncovers the page.
 */
const PanelAnimation = () => {
  const containerRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      // Already ran this page load, so leave the overlay in its hidden
      // default and let the page render plainly.
      if (wipeHasPlayed()) return;

      // Marked on complete rather than up front: React's dev double-invoke
      // mounts, cleans up and mounts again, and claiming the single run on the
      // first pass would leave nothing for the second.
      const tl = gsap.timeline({ onComplete: markWipePlayed });

      // Only on screen while the wipe is actually running.
      tl.set(containerRef.current, { visibility: 'visible' });

      // Durations come from lib/panel-timing so page content can be scheduled
      // against this timeline. Every duration is explicit — leaving one to
      // GSAP's 0.5s default would put the real timing out of that module's
      // reach.
      tl.to('.panel:first-child, .panel:last-child', {
        scaleY: 1,
        duration: PANEL_RISE,
      })
        .to(
          '.panel:not(:first-child):not(:last-child)',
          { scaleY: 1, duration: PANEL_RISE_OVERLAP },
          `-=${PANEL_RISE_OVERLAP}`
        )
        .to('.panel', {
          scaleY: 0,
          duration: PANEL_DROP,
          stagger: PANEL_DROP_STAGGER,
        })
        .to(containerRef.current, {
          clipPath: 'circle(0%)',
          skewX: 0,
          duration: PANEL_OPEN,
        });

      // Back to the default state. That is the whole teardown: nothing outside
      // this component was ever touched, so the page is left exactly as it
      // renders with no animation attached.
      tl.set(containerRef.current, { visibility: 'hidden' });
    },
    { scope: containerRef }
  );

  return (
    <ul ref={containerRef} className="panels">
      <li className="panel" />
      <li className="panel" />
      <li className="panel" />
      <li className="panel" />
      <li className="panel" />
      <li className="panel" />
    </ul>
  );
};

export default PanelAnimation;
