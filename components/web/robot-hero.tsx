'use client';

import { motion, useInView } from 'motion/react';
import { useRef, type RefObject } from 'react';

import { RobotEyes } from '@/components/web/robot-eyes';
import { RobotHair } from '@/components/web/robot-hair';

export function RobotHero({
  className,
  hovered = false,
  boundsRef,
}: {
  className?: string;
  hovered?: boolean;
  boundsRef: RefObject<HTMLElement | null>;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  // These loops repeat forever, so off-screen they would keep Motion's frame
  // loop alive and repainting for nothing. The margin resumes them just
  // before the robot scrolls back into view.
  const alive = useInView(svgRef, { margin: '200px' });
  /** Off-screen, settle once and stop — a repeating transition would keep the
   *  animation alive even when its target is a single static value. */
  const settle = { duration: 0.4 };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 320 320"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a friendly home robot">
      <ellipse
        cx="160"
        cy="278"
        rx="86"
        ry="14"
        fill="white"
        fillOpacity="0.12"
      />

      <motion.g
        animate={alive ? { y: [0, -8, 0] } : { y: 0 }}
        transition={
          alive ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : settle
        }>
        {/* antenna */}
        <motion.g
          style={{ transformOrigin: '160px 70px' }}
          animate={alive ? { rotate: [-4, 4, -4] } : { rotate: 0 }}
          transition={
            alive ?
              { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            : settle
          }>
          <line
            x1="160"
            y1="70"
            x2="160"
            y2="46"
            stroke="white"
            strokeOpacity="0.7"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="160" cy="38" r="8" fill="var(--color-glow)" />
        </motion.g>

        {/* head */}
        <rect
          x="104"
          y="70"
          width="112"
          height="92"
          rx="28"
          fill="white"
          fillOpacity="0.95"
        />

        <RobotHair active={hovered} />

        <rect
          x="124"
          y="98"
          width="30"
          height="36"
          rx="15"
          fill="oklch(0.25 0.02 260)"
        />
        <rect
          x="166"
          y="98"
          width="30"
          height="36"
          rx="15"
          fill="oklch(0.25 0.02 260)"
        />
        <RobotEyes boundsRef={boundsRef} />

        {/* body */}
        <rect
          x="90"
          y="170"
          width="140"
          height="98"
          rx="24"
          fill="white"
          fillOpacity="0.85"
        />
        <rect
          x="120"
          y="196"
          width="80"
          height="46"
          rx="12"
          fill="oklch(0.25 0.02 260)"
        />
        <circle
          data-robot-dot="1"
          cx="140"
          cy="219"
          r="6"
          fill="var(--color-glow)"
        />
        <circle
          data-robot-dot="2"
          cx="160"
          cy="219"
          r="6"
          fill="white"
          fillOpacity="0.5"
        />
        <circle
          data-robot-dot="3"
          cx="180"
          cy="219"
          r="6"
          fill="white"
          fillOpacity="0.5"
        />

        {/* arms */}
        <rect
          x="62"
          y="182"
          width="26"
          height="16"
          rx="8"
          fill="white"
          fillOpacity="0.85"
        />
        <motion.g
          style={{ transformOrigin: '246px 190px' }}
          animate={alive ? { rotate: [0, -18, 0] } : { rotate: 0 }}
          transition={
            alive ?
              {
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }
            : settle
          }>
          <rect
            x="232"
            y="182"
            width="26"
            height="16"
            rx="8"
            fill="white"
            fillOpacity="0.85"
          />
        </motion.g>

        {/* legs */}
        <rect
          x="112"
          y="266"
          width="22"
          height="20"
          rx="8"
          fill="white"
          fillOpacity="0.7"
        />
        <rect
          x="186"
          y="266"
          width="22"
          height="20"
          rx="8"
          fill="white"
          fillOpacity="0.7"
        />
      </motion.g>

      {/* ambient sparkles */}
      <motion.circle
        cx="66"
        cy="120"
        r="4"
        fill="var(--color-glow)"
        animate={alive ? { opacity: [0.2, 1, 0.2] } : { opacity: 0.2 }}
        transition={
          alive ?
            { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
          : settle
        }
      />
      <motion.circle
        cx="256"
        cy="150"
        r="3"
        fill="white"
        animate={alive ? { opacity: [0.15, 0.8, 0.15] } : { opacity: 0.15 }}
        transition={
          alive ?
            {
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.6,
            }
          : settle
        }
      />
      <motion.circle
        cx="242"
        cy="90"
        r="2.5"
        fill="var(--color-glow)"
        animate={alive ? { opacity: [0.2, 1, 0.2] } : { opacity: 0.2 }}
        transition={
          alive ?
            {
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.1,
            }
          : settle
        }
      />
    </svg>
  );
}
