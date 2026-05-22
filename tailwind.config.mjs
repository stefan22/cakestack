/**
 * Tailwind v4 uses CSS-first config in `app/globals.css`. This file supplies
 * `content` paths and third-party plugins; it is pulled in via
 * `@config "../tailwind.config.mjs"` there.
 *
 * @type {import('tailwindcss').Config}
 */
import typography from '@tailwindcss/typography';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [typography],
};
