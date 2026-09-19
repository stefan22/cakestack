import { render, screen, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const STORAGE_KEY = 'cakestack:wipe-last-played';

/**
 * Fresh modules per test: the playback gate keeps its once-per-load flag and
 * frozen snapshot in module scope.
 */
async function renderFresh() {
  vi.resetModules();
  const { WipeCountdown } = await import('@/components/web/wipe-countdown');
  render(<WipeCountdown />);
  // The initial tick is deferred through setTimeout(0), so nothing is on
  // screen until timers run.
  await act(async () => {
    vi.advanceTimersByTime(1);
  });
}

beforeEach(() => {
  window.localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('WipeCountdown', () => {
  it('parks at the full duration before the wipe has ever run', async () => {
    await renderFresh();

    expect(
      screen.getByText(/Main Page Animation Ready Again In:/)
    ).toBeInTheDocument();
    expect(screen.getByText('2:00')).toBeInTheDocument();
  });

  it('counts down while the cooldown is running', async () => {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now() - 30_000));

    await renderFresh();

    expect(screen.getByText('1:30')).toBeInTheDocument();
  });

  it('keeps ticking as time passes', async () => {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now() - 30_000));
    await renderFresh();

    await act(async () => {
      vi.advanceTimersByTime(5_000);
    });

    expect(screen.getByText('1:25')).toBeInTheDocument();
  });

  it('announces ready once the cooldown has lapsed', async () => {
    // Regression: the readout used to ask whether the wipe had played. On a
    // load where the wipe was suppressed that answer went false the instant
    // the cooldown lapsed, dropping readyAt and snapping the clock from 0:01
    // back to the full duration instead of saying it was ready.
    window.localStorage.setItem(
      STORAGE_KEY,
      String(Date.now() - 2 * 60 * 1000 - 30_000)
    );

    await renderFresh();

    expect(screen.getByText('Main Page Animation Now Ready')).toBeVisible();
    expect(screen.queryByText('2:00')).not.toBeInTheDocument();
    expect(screen.queryByText(/Ready Again In:/)).not.toBeInTheDocument();
  });

  it('crosses from counting to ready without resetting', async () => {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now() - 119_000));
    await renderFresh();

    expect(screen.getByText('0:01')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(2_000);
    });

    expect(screen.getByText('Main Page Animation Now Ready')).toBeVisible();
  });
});
