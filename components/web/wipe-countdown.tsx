'use client';

import { useEffect, useState } from 'react';

import {
  WIPE_COOLDOWN_MS,
  useWipeHasPlayed,
  wipeReadyAt,
} from '@/lib/panel-playback';

function formatRemaining(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Cooldown readout for the panel wipe.
 *
 * Sits at the full duration until the wipe has actually run — there is nothing
 * counting down before then — and only ticks once a play has been recorded.
 */
export function WipeCountdown() {
  const hasPlayed = useWipeHasPlayed();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    // Deferred rather than called here: setting state straight from an effect
    // body forces a second render in the same commit.
    const initial = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, []);

  // Before a play — and on the server, which can see neither the flag nor
  // storage — this is the full duration, so hydration has nothing to disagree
  // about.
  const readyAt = hasPlayed && now !== null ? wipeReadyAt() : null;
  const remaining =
    readyAt === null || now === null ?
      WIPE_COOLDOWN_MS
    : Math.max(0, readyAt - now);

  return (
    <p className="text-xs text-white p-0 text-center w-full inline-flex justify-center">
      {remaining > 0 ?
        <>
          Main Page Animation Be Ready Again In: {' '} &nbsp;
          <span className="tabular-nums">{formatRemaining(remaining)}</span>
        </>
      : 'Main Page Animation Now Ready!'}
    </p>
  );
}
