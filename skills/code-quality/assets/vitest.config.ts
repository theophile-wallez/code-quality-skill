import { defineConfig } from 'vitest/config';

// Browser code runs in happy-dom, scripts in Node. Mocks and stubbed globals are
// restored after each test, so no test leaks into the next.
export default defineConfig({
  test: {
    restoreMocks: true,
    unstubGlobals: true,
    projects: [
      {
        extends: true,
        test: { name: 'app', include: ['src/**/*.test.{ts,tsx}'], environment: 'happy-dom' },
      },
      {
        extends: true,
        test: { name: 'scripts', include: ['scripts/**/*.test.ts'], environment: 'node' },
      },
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}', 'scripts/**/*.ts'],
      exclude: ['**/*.test.{ts,tsx}', '**/fixtures/**'],
      reporter: ['text-summary', 'html', 'lcov'],
    },
  },
});
