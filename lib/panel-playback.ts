'use client';

import { useSyncExternalStore } from 'react';

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

/**
 * useSyncExternalStore requires a snapshot that is stable between renders, so
 * the answer is computed once and only recomputed when it actually changes.
 * Deriving it from Date.now() on every call would hand React a value that can
 * differ within a single render.
 */
let snapshot: boolean | null = null;

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

function getSnapshot(): boolean {
  if (snapshot === null) {
    const last = readLastPlayed();
    snapshot =
      playedThisLoad || (last !== null && Date.now() - last < WIPE_COOLDOWN_MS);
  }
  return snapshot;
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

/** Whether the wipe has already run, and so should be skipped. */
export function useWipeHasPlayed(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Non-reactive read, for effects that only need the value once. */
export function wipeHasPlayed(): boolean {
  if (typeof window === 'undefined') return false;
  return getSnapshot();
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
  snapshot = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Cooldown degrades to once-per-page-load, which is still the fix for the
    // replay-on-navigation case. Nothing to recover from.
  }
  listeners.forEach((l) => l());
}
