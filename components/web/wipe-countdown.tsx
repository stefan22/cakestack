'use client';

import { useEffect, useState } from 'react';

import {
  WIPE_COOLDOWN_MS,
  wipeHasPlayedLive,
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
  const [now, setNow] = useState<number | null>(null);
  // Live read, not a subscription: a subscriber woken at the wipe's
  // onComplete is what disturbed the animations.
  const hasPlayed = now !== null && wipeHasPlayedLive();

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
    <p className="text-xs text-white/50">
      {remaining > 0 ?
        <>
          next main animation ready in:{' '}
          <span className="tabular-nums">{formatRemaining(remaining)}</span>
        </>
      : 'next main animation ready'}
    </p>
  );
}
