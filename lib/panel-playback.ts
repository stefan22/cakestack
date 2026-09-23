'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';

/**
 * Decides whether the panel wipe should run.
 *
 * app/template.tsx remounts the whole tree on every navigation, which is what
 * makes per-page entrances replay on route changes. For the wipe that is
 * wrong: it runs ~2.5s and covers the page, so replaying it every time the
 * reader lands back on home — straight after signing in, say — crosses from
 * flourish into obstacle.
 *
 * Two gates, deliberately:
 *   - a module variable, so it never repeats within one page load, including
 *     across client-side navigation;
 *   - a timestamp, so a reader returning soon after is not shown it again.
 */

/** How long after a play the wipe stays suppressed. */
export const WIPE_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes

const STORAGE_KEY = 'cakestack:wipe-last-played';

/** Survives client-side navigation; resets on a real document load. */
let playedThisLoad = false;

const listeners = new Set<() => void>();

function readLastPlayed(): number | null {
  // Storage throws in a private window or with site data blocked. Either way
  // the honest answer is "no record".
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function computeHasPlayed(): boolean {
  const last = readLastPlayed();
  return playedThisLoad || (last !== null && Date.now() - last < WIPE_COOLDOWN_MS);
}

/**
 * The server has no storage and no flag, so it always renders the "about to
 * play" state. React hydrates against this and then re-renders with the real
 * client value — which is why nothing here may drive server-rendered markup
 * that must match.
 */
function getServerSnapshot(): boolean {
  return false;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/**
 * Whether the wipe has already run, and so should be skipped.
 *
 * Frozen once per mount, not once per page load: app/template.tsx remounts
 * hero-stagger and navbar on every client-side navigation, and each of those
 * fresh mounts needs the *current* answer — otherwise a mount from before the
 * wipe first completed keeps every later visit to home holding the search
 * and hero behind the full entrance delay, even once the wipe itself has
 * correctly stopped replaying (see wipeHasPlayed).
 *
 * Still stable within one mount's lifetime, same as before: a ref computed
 * lazily on first render and never reassigned is what useSyncExternalStore
 * needs to avoid re-deriving a value that could differ mid-render, and it is
 * what keeps this mount's answer from moving under it — markWipePlayed
 * deliberately does not notify, so nothing here changes mid-animation.
 */
export function useWipeHasPlayed(): boolean {
  const frozen = useRef<boolean | null>(null);
  if (frozen.current === null) {
    frozen.current = computeHasPlayed();
  }
  const getSnapshot = useCallback(() => frozen.current as boolean, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Non-reactive read, for effects that only need the value once.
 *
 * panel-animation.tsx calls this synchronously at the top of its mount
 * effect, before any tween starts, so — unlike useWipeHasPlayed — it has no
 * reason to freeze: it always computes fresh, which is what makes a replayed
 * mount (client-side navigation back to a page that runs the wipe) see the
 * play that happened on an earlier mount instead of the pre-play answer.
 */
export function wipeHasPlayed(): boolean {
  if (typeof window === 'undefined') return false;
  return computeHasPlayed();
}

/**
 * When the cooldown lapses, or null if there is no record and the wipe is
 * ready now. Server-safe: no window means no record.
 */
export function wipeReadyAt(): number | null {
  if (typeof window === 'undefined') return null;
  const last = readLastPlayed();
  return last === null ? null : last + WIPE_COOLDOWN_MS;
}

export function markWipePlayed(): void {
  playedThisLoad = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Cooldown degrades to once-per-page-load, which is still the fix for the
    // replay-on-navigation case. Nothing to recover from.
  }
  // Deliberately does not notify: this runs on the timeline's onComplete —
  // exactly when the wordmark, search and hero are mid-entrance — and waking
  // a subscriber here, which would move the *current* mount's already-frozen
  // useWipeHasPlayed() answer mid-render, is what tore the sequence apart.
  // The next mount (the next navigation) picks up the change on its own,
  // since its ref has not been computed yet. The countdown reads
  // wipeReadyAt() instead of this hook, so it is unaffected either way.
}
