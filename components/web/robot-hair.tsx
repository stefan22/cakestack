'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

const HAIR_PATHS = [
  'M120,74 C100,62 132,46 98,42 C84,40 100,16 76,10',
  'M200,74 C220,62 188,46 222,42 C236,40 220,16 244,10',
];

/**
 * Two hair strands that draw themselves on with DrawSVGPlugin while `active`
 * (the robot's hover state) is true.
 */
export function RobotHair({ active }: { active: boolean }) {
  const container = useRef<SVGGElement>(null);

  const draw = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      gsap.set('path', { drawSVG: '0%' });
      draw.current = gsap.to('path', {
        drawSVG: '100%',
        duration: 1.1,
        stagger: 0.1,
        ease: 'power2.out',
        paused: true,
      });
    },
    { scope: container }
  );

  // Built once and played/reversed, rather than tweened per hover: keying a
  // useGSAP on `active` would add a new tween to the context on every toggle
  // and only release them on unmount. Reversing also resumes from wherever an
  // interrupted draw got to, and the faster timeScale keeps the retract snappy.
  useEffect(() => {
    const tween = draw.current;
    if (!tween) return;
    tween.timeScale(active ? 1 : 2.75);
    active ? tween.play() : tween.reverse();
  }, [active]);

  return (
    <g ref={container}>
      {HAIR_PATHS.map((d) => (
        <path
          key={d}
          d={d}
          stroke="white"
          strokeOpacity="0.85"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          // Hides the strands in the server-rendered markup, before useGSAP
          // runs and DrawSVGPlugin replaces this with a real measurement.
          strokeDasharray="200"
          strokeDashoffset="200"
        />
      ))}
    </g>
  );
}
