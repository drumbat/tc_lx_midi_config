import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Use threads pool instead of forks to avoid EPERM termination errors
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/test/**'
      ],
      // Set initial coverage thresholds (can be adjusted as project grows)
      thresholds: {
        lines: 0,        // Start with 0%, increase as coverage improves
        functions: 0,   // Start with 0%, increase as coverage improves
        branches: 0,    // Start with 0%, increase as coverage improves
        statements: 0,  // Start with 0%, increase as coverage improves
      },
    },
  },
})
