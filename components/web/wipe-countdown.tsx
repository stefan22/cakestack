'use client';

import { useEffect, useState } from 'react';

import { WIPE_COOLDOWN_MS, wipeReadyAt } from '@/lib/panel-playback';

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

  // Driven by the stored timestamp alone. It deliberately does not ask
  // whether the wipe has played: on a load where the wipe was suppressed that
  // answer flips to false the moment the cooldown lapses, which reset the
  // clock to the full duration instead of announcing it was ready.
  //
  // No timestamp means it has never run — and on the server, which cannot see
  // storage — so it parks at the full duration with nothing to count.
  const readyAt = now === null ? null : wipeReadyAt();
  const remaining =
    readyAt === null || now === null ?
      WIPE_COOLDOWN_MS
    : Math.max(0, readyAt - now);

  return (
    // flex, not inline-flex: block-level so it already spans the banner,
    // which is why no w-full is needed. gap-1 because flex discards the
    // whitespace-only node between the label and the clock.
    <p className="flex justify-center gap-1 p-0 text-xs text-white/50">
      {remaining > 0 ?
        <>
          Main Page Animation Ready Again In:{' '}
          <span className="tabular-nums">{formatRemaining(remaining)}</span>
        </>
      : 'Main Page Animation Now Ready'}
    </p>
  );
}
