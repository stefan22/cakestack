import { beforeEach, describe, expect, it, vi } from 'vitest';

const STORAGE_KEY = 'cakestack:wipe-last-played';

/**
 * A fresh module instance stands in for a fresh page load: both the
 * once-per-load flag and the frozen snapshot live in module scope, so
 * resetting modules is what actually resets them.
 */
async function freshLoad() {
  vi.resetModules();
  return import('@/lib/panel-playback');
}

beforeEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('panel playback gate', () => {
  it('lets the wipe run on a first visit', async () => {
    const m = await freshLoad();

    expect(m.wipeHasPlayed()).toBe(false);
  });

  it('reflects the played state immediately, so the next mount does not replay', async () => {
    const m = await freshLoad();

    // The read happens first because that is the real order: the gate is read
    // when the components mount, and the wipe finishes ~2.5s later.
    expect(m.wipeHasPlayed()).toBe(false);

    m.markWipePlayed();

    // This must flip to true in the same load: app/template.tsx remounts
    // PanelAnimation on every client-side navigation, and it calls
    // wipeHasPlayed() fresh on each mount to decide whether to replay. A
    // frozen "not played yet" answer here was the regression — the wipe
    // replayed on every page instead of once per cooldown.
    //
    // This is deliberately a different question from whether the *reactive*
    // useWipeHasPlayed() snapshot moves mid-animation: that one stays frozen
    // per mount on purpose (see markWipePlayed), because hero-stagger and
    // navbar key/gate their entrance off it and flipping it mid-flight is
    // what tore the sequence apart. wipeHasPlayed() has no such constraint —
    // it is read once, synchronously, before any animation starts.
    expect(m.wipeHasPlayed()).toBe(true);
  });

  it('suppresses the wipe on the next load while the cooldown is active', async () => {
    const first = await freshLoad();
    first.wipeHasPlayed();
    first.markWipePlayed();

    const second = await freshLoad();

    expect(second.wipeHasPlayed()).toBe(true);
  });

  it('lets the wipe run again once the cooldown has lapsed', async () => {
    const m = await freshLoad();
    window.localStorage.setItem(
      STORAGE_KEY,
      String(Date.now() - m.WIPE_COOLDOWN_MS - 1)
    );

    const next = await freshLoad();

    expect(next.wipeHasPlayed()).toBe(false);
  });

  it('treats blocked storage as no record rather than throwing', async () => {
    const m = await freshLoad();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('site data blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('site data blocked');
    });

    expect(() => m.wipeHasPlayed()).not.toThrow();
    expect(m.wipeHasPlayed()).toBe(false);
    expect(() => m.markWipePlayed()).not.toThrow();
  });
});

describe('cooldown readout', () => {
  it('has nothing to count before the wipe has ever run', async () => {
    const m = await freshLoad();

    expect(m.wipeReadyAt()).toBeNull();
  });

  it('reports the play time plus the cooldown', async () => {
    const m = await freshLoad();
    const played = Date.now();
    window.localStorage.setItem(STORAGE_KEY, String(played));

    expect(m.wipeReadyAt()).toBe(played + m.WIPE_COOLDOWN_MS);
  });

  it('counts down while the cooldown is running', async () => {
    const m = await freshLoad();
    const played = Date.now() - 30_000;
    window.localStorage.setItem(STORAGE_KEY, String(played));

    const remaining = m.wipeReadyAt()! - Date.now();

    expect(remaining).toBeGreaterThan(0);
    expect(remaining).toBeLessThanOrEqual(m.WIPE_COOLDOWN_MS - 30_000);
  });

  it('stays at zero once expired instead of resetting to the full duration', async () => {
    const m = await freshLoad();
    const played = Date.now() - m.WIPE_COOLDOWN_MS - 30_000;
    window.localStorage.setItem(STORAGE_KEY, String(played));

    // What the component renders from. Regression: the readout used to ask
    // whether the wipe had played, which went false the moment the cooldown
    // lapsed — dropping readyAt and snapping the clock from 0:01 back to the
    // full duration rather than announcing it was ready.
    const readyAt = m.wipeReadyAt();

    expect(readyAt).not.toBeNull();
    expect(Math.max(0, readyAt! - Date.now())).toBe(0);
  });

  it('ignores a corrupt timestamp', async () => {
    const m = await freshLoad();
    window.localStorage.setItem(STORAGE_KEY, 'not-a-number');

    expect(m.wipeReadyAt()).toBeNull();
    expect(m.wipeHasPlayed()).toBe(false);
  });
});
