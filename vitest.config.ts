// vitest.config.ts

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: [
      './tests/unit/**/*.test.{ts,tsx}',
      './tests/integration/**/*.test.{ts,tsx}',
    ],
    reporters: 'verbose',
  },
  resolve: {
    tsconfigPaths: true,
  },
});
