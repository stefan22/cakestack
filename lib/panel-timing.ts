/**
 * Beats of the panel wipe in components/web/panel-animation.tsx.
 *
 * Kept in a plain module — no 'use client' — for two reasons: the GSAP
 * timeline and anything scheduled against it can't drift apart, and server
 * components can read the actual numbers. Importing a constant from a
 * 'use client' file into a server component yields a client reference rather
 * than the value.
 *
 * All values are seconds.
 */

export const PANEL_COUNT = 6;

/** Outer pair sweeps down to fill the screen. */
export const PANEL_RISE = 1;
/** Inner panels start before the outer pair lands, so the fill reads as one move. */
export const PANEL_RISE_OVERLAP = 0.5;
/** Each panel retracts... */
export const PANEL_DROP = 0.3;
/** ...one after another. */
export const PANEL_DROP_STAGGER = 0.05;
/** Overlay collapses to a point, uncovering the page. */
export const PANEL_OPEN = 1;

/** Moment the overlay starts collapsing. */
export const PANEL_OPEN_START =
  PANEL_RISE + (PANEL_COUNT - 1) * PANEL_DROP_STAGGER + PANEL_DROP;

/** Moment the overlay is fully gone. */
export const PANEL_OPEN_END = PANEL_OPEN_START + PANEL_OPEN;

/**
 * How far into the opening the page's own entrance begins, as a fraction of
 * PANEL_OPEN. Deliberately below 1: the content is already moving by the time
 * the overlay clears. Two beats that overlap read as a single gesture, where
 * strictly sequential ones read as a stutter.
 */
const CONTENT_CUE = 0.65;

/**
 * Delay for content that animates on mount and sits behind the overlay —
 * StaggerContainer's `initialDelay`, BlurFade's `delay`.
 *
 * Not for scroll-triggered (`inView`) content: that fires whenever the reader
 * arrives, and holding it for the wipe would stall it long after the wipe is
 * over.
 */
export const CONTENT_ENTRANCE_DELAY =
  PANEL_OPEN_START + PANEL_OPEN * CONTENT_CUE;

/* ------------------------------------------------------------------ *
 * Hero entrance — the StaggerContainer in app/(share-layout)/page.tsx *
 * ------------------------------------------------------------------ */

/** Gap between hero items. Passed to StaggerContainer so it can't drift. */
export const HERO_STAGGER = 0.12;

/** StaggerItem's own default duration (components/motion/stagger.tsx). */
export const HERO_ITEM_DURATION = 0.5;

/**
 * Number of StaggerItems in the hero. Not derivable at module scope — keep it
 * in step with the JSX if items are added or removed.
 */
export const HERO_ITEM_COUNT = 4;

/** Moment the last hero item finishes arriving. */
export const HERO_ENTRANCE_END =
  CONTENT_ENTRANCE_DELAY +
  (HERO_ITEM_COUNT - 1) * HERO_STAGGER +
  HERO_ITEM_DURATION;

/**
 * How far the wordmark is pulled back from the end of the hero — GSAP's
 * `-=1` applied to a value rather than a timeline position. Landing the logo
 * strictly after the hero read as a relay; overlapping it makes the two one
 * continuous motion.
 */
const LOGO_OVERLAP = 1;

/**
 * When the nav wordmark starts drawing.
 *
 * Only meaningful on the route that runs the panel wipe. Elsewhere the logo
 * should draw on mount, so pass 0.
 */
export const LOGO_DRAW_DELAY = HERO_ENTRANCE_END - LOGO_OVERLAP;

/** How long the nav search field takes to fade in. */
export const NAV_REVEAL_DURATION = 0.5;
