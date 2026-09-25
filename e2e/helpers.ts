import { expect, type Browser, type Page } from '@playwright/test'
import path from 'node:path'
import { E2E_ADMIN } from './config'

export const ASSET = (rel: string) => path.join(process.cwd(), 'public', 'assets', rel)
export const SHOT = (name: string) => path.join(process.cwd(), 'e2e', 'screenshots', `${name}.png`)

export async function login(page: Page) {
  await page.goto('/admin/login')
  await page.getByLabel('Email').fill(E2E_ADMIN.email)
  await page.getByLabel('Password').fill(E2E_ADMIN.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('heading', { name: /Welcome back/ })).toBeVisible()
}

/** A fresh, signed-out browser context — what a normal visitor sees. */
export async function visitorPage(browser: Browser) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } })
  const page = await ctx.newPage()
  return { ctx, page }
}

/** Collect uncaught page errors and console errors while a page is used. */
export function trackErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`)
  })
  return errors
}

export async function jsonLd(page: Page): Promise<Array<Record<string, unknown>>> {
  const raw = await page.locator('script[type="application/ld+json"]').allTextContents()
  return raw.map((r) => JSON.parse(r))
}
