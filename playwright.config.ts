import { defineConfig, devices } from '@playwright/test'
import { E2E_ADMIN, E2E_PORT, EXTERNAL_BASE_URL } from './e2e/config'

/**
 * End-to-end tests run against a PRODUCTION build (`next build` + `next start`)
 * with an isolated database in e2e/.data that is wiped before every run, so
 * your real content in ./data is never touched. The build goes to .next-e2e,
 * so a `next dev` you have running on port 3000 is not disturbed.
 *
 *   npm run test:e2e          build, then run all tests
 *   npm run test:e2e:headed   same, with a visible browser
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: EXTERNAL_BASE_URL || `http://localhost:${E2E_PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 } } }],
  // With E2E_BASE_URL set, use that server instead of starting one.
  webServer: EXTERNAL_BASE_URL ? undefined : {
    command: `node e2e/reset-data.mjs && npx next build && npx next start -p ${E2E_PORT}`,
    url: `http://localhost:${E2E_PORT}/robots.txt`,
    reuseExistingServer: false,
    timeout: 600_000,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      NEXT_DIST_DIR: '.next-e2e',
      DATA_DIR: 'e2e/.data',
      // Overrides any TURSO_DATABASE_URL in .env.local, so tests never touch the live database.
      TURSO_DATABASE_URL: 'file:e2e/.data/cms.db',
      ADMIN_EMAIL: E2E_ADMIN.email,
      ADMIN_PASSWORD: E2E_ADMIN.password,
      SEED_DEMO_CONTENT: 'true',
    },
  },
})
