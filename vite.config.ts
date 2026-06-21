import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    process.env.SENTRY_AUTH_TOKEN
      ? sentryVitePlugin({
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          authToken: process.env.SENTRY_AUTH_TOKEN,
        })
      : null,
  ].filter(Boolean),
  build: {
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, '**/.code-index/**'],
  },
})
