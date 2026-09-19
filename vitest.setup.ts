// vitest.setup.ts

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';

/**
 * jsdom has no IntersectionObserver, and motion's useInView reaches for it on
 * mount — so any tree containing BlurFade, StaggerContainer or the CakeStack
 * wordmark throws before a single assertion runs.
 *
 * It deliberately never reports an intersection. Entrance animations then stay
 * in their pre-animation state, which leaves the markup mounted and queryable
 * without firing React state updates outside act().
 */
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;
