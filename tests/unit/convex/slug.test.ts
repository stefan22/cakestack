import { describe, expect, it } from 'vitest';
import { slugify, uniqueSlug } from '@/convex/slug';

describe('slugify', () => {
  it('lowercases and hyphenates a normal title', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('collapses runs of non-alphanumeric characters into one hyphen', () => {
    expect(slugify('Hello!!!  World??')).toBe('hello-world');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  --Hello World--  ')).toBe('hello-world');
  });

  it('strips accents', () => {
    expect(slugify('Café Résumé')).toBe('cafe-resume');
  });

  it('falls back to "post" when nothing alphanumeric remains', () => {
    expect(slugify('!!!???')).toBe('post');
    expect(slugify('')).toBe('post');
  });
});

describe('uniqueSlug', () => {
  it('returns the base slug when it is free', async () => {
    const taken = async () => false;
    await expect(uniqueSlug('My New Post', taken)).resolves.toBe(
      'my-new-post',
    );
  });

  it('appends -2 when the base slug is taken once', async () => {
    const taken = async (candidate: string) => candidate === 'my-new-post';
    await expect(uniqueSlug('My New Post', taken)).resolves.toBe(
      'my-new-post-2',
    );
  });

  it('keeps incrementing the suffix until a free slug is found', async () => {
    const usedSlugs = new Set(['dup', 'dup-2', 'dup-3']);
    const taken = async (candidate: string) => usedSlugs.has(candidate);
    await expect(uniqueSlug('Dup', taken)).resolves.toBe('dup-4');
  });
});
