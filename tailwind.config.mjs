/**
 * Tailwind v4 uses CSS-first config (`app/globals.css`).
 * This file exists so `@plugin` directives (e.g. `@tailwindcss/typography`) can
 * resolve their companion JS config via `@config` — see Tailwind Typography docs.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};
