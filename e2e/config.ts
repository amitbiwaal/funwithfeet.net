export const E2E_PORT = 3100

/**
 * Normally the tests start their own server with an isolated database.
 * Set E2E_BASE_URL (plus E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD) to run a single
 * spec against a server you already have running instead, e.g. to publish the
 * long formatting article into your real site:
 *
 *   E2E_BASE_URL=http://localhost:3000 E2E_ADMIN_EMAIL=… E2E_ADMIN_PASSWORD=… npx playwright test long-article
 */
export const EXTERNAL_BASE_URL = process.env.E2E_BASE_URL || ''

export const E2E_ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL || 'e2e-admin@funwithfeet.net',
  password: process.env.E2E_ADMIN_PASSWORD || 'E2E-only-password-2026',
}
