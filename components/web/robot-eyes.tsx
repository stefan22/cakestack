'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useEffect, useRef, type RefObject } from 'react';

gsap.registerPlugin(useGSAP);

/** Pupil travel limits, in the illustration's own viewBox units. */
const VIEWBOX = 320;
const EYE_MOVE = { x: 5, y: 6 };
/** Cursor distance (px) at which the gaze reaches full travel. */
const GAZE_RAMP = 120;

type Eye = {
  cx: number;
  cy: number;
  moveX: gsap.QuickToFunc;
  moveY: gsap.QuickToFunc;
};

/**
 * Pupils that look at the pointer while it is anywhere inside `boundsRef`
 * (the CTA banner), and re-center when it leaves. Each eye aims from its own
 * center, so they converge slightly when the cursor is close.
 */
export function RobotEyes({
  boundsRef,
}: {
  boundsRef: RefObject<HTMLElement | null>;
}) {
  const container = useRef<SVGGElement>(null);
  const eyes = useRef<Eye[]>([]);

  useGSAP(
    () => {
      // quickTo builds one reusable tween per axis per eye, so a mousemove
      // costs a function call rather than a new tween.
      const pupils = Array.from(
        container.current?.querySelectorAll('rect') ?? []
      );
      eyes.current = pupils.map((pupil) => ({
        cx: pupil.x.baseVal.value + pupil.width.baseVal.value / 2,
        cy: pupil.y.baseVal.value + pupil.height.baseVal.value / 2,
        moveX: gsap.quickTo(pupil, 'x', { duration: 0.4, ease: 'power3.out' }),
        moveY: gsap.quickTo(pupil, 'y', { duration: 0.4, ease: 'power3.out' }),
      }));
    },
    { scope: container }
  );

  // Deliberately useEffect, not useGSAP: React attaches refs bottom-up during
  // the layout phase, so an ancestor's ref (the banner) is still null when a
  // child's layout effect runs.
  useEffect(() => {
    const bounds = boundsRef.current;
    const svg = container.current?.ownerSVGElement;
    if (!bounds || !svg) return;

    const track = (event: MouseEvent) => {
      const box = svg.getBoundingClientRect();
      const scaleX = box.width / VIEWBOX;
      const scaleY = box.height / VIEWBOX;

      for (const eye of eyes.current) {
        const dx = event.clientX - (box.left + eye.cx * scaleX);
        const dy = event.clientY - (box.top + eye.cy * scaleY);
        const angle = Math.atan2(dy, dx);
        // Ramp in by distance so the pupil doesn't swing wildly when the
        // cursor sits almost exactly on the eye.
        const reach = Math.min(1, Math.hypot(dx, dy) / GAZE_RAMP);
        eye.moveX(Math.cos(angle) * EYE_MOVE.x * reach);
        eye.moveY(Math.sin(angle) * EYE_MOVE.y * reach);
      }
    };

    const recenter = () => {
      for (const eye of eyes.current) {
        eye.moveX(0);
        eye.moveY(0);
      }
    };

    bounds.addEventListener('mousemove', track);
    bounds.addEventListener('mouseleave', recenter);

    return () => {
      bounds.removeEventListener('mousemove', track);
      bounds.removeEventListener('mouseleave', recenter);
    };
  }, [boundsRef]);

  return (
    <g ref={container}>
      <rect
        x="130"
        y="108"
        width="10"
        height="10"
        rx="5"
        fill="var(--color-glow)"
      />
      <rect
        x="172"
        y="108"
        width="10"
        height="10"
        rx="5"
        fill="var(--color-glow)"
      />
    </g>
  );
}
