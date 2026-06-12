/** Lowercase, hyphenated slug from a title. Collapses non-alphanumerics. */
export function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return base || 'post';
}

/**
 * Appends -2, -3, ... until `taken` (an existing-slugs lookup) says the
 * candidate is free. Callers pass a function backed by the `by_slug` index
 * rather than a precomputed set, since this runs inside a mutation against
 * live data.
 */
export async function uniqueSlug(
  title: string,
  taken: (candidate: string) => Promise<boolean>
): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;

  while (await taken(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}
