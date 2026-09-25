import { expect, test } from '@playwright/test'
import { jsonLd, SHOT, trackErrors } from './helpers'

/** Public website checks: every page renders, SEO tags survive the conversion, nav works. */

const PAGES = [
  { path: '/', h1: /Sell Feet Pics Safely & Earn with\s*Fun With Feet/, title: 'Fun With Feet: Sell Feet Pics Safely & Make Money Online', shot: 'home' },
  { path: '/how-to-sell-feet-pics', h1: 'How to Sell Feet Pics', title: 'How to Sell Feet Pics: 2026 Master Guide | Fun With Feet', shot: 'how-to' },
  { path: '/sell-feet-pics', h1: /Get Paid to Sell Feet Pics/, title: 'Sell Feet Pics Online — Safe, Anonymous & Legal | Fun With Feet', shot: 'sell' },
  { path: '/blog', h1: /Guides & Tips for/, title: /Feet Pics Blog/, shot: 'blog' },
  { path: '/about', h1: /An Independent Guide/, title: /About FunWithFeet\.net/, shot: 'about' },
  { path: '/contact', h1: 'Get in Touch', title: 'Contact FunWithFeet.net', shot: 'contact' },
  { path: '/privacy-policy', h1: 'Privacy Policy', title: 'Privacy Policy | FunWithFeet.net', shot: 'privacy' },
  { path: '/terms', h1: 'Terms of Use', title: 'Terms of Use | FunWithFeet.net', shot: 'terms' },
  { path: '/disclaimer', h1: 'Affiliate Disclosure & Disclaimer', title: /Affiliate Disclosure/, shot: 'disclaimer' },
]

for (const p of PAGES) {
  test(`page ${p.path} renders with correct SEO tags`, async ({ page }) => {
    const errors = trackErrors(page)
    const res = await page.goto(p.path)
    expect(res?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(p.h1)
    await expect(page).toHaveTitle(p.title)
    // Next.js writes the root canonical without the trailing slash — the same URL.
    const canonical = p.path === '/' ? /^https:\/\/funwithfeet\.net\/?$/ : `https://funwithfeet.net${p.path}`
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical)
    await expect(page.locator('meta[name="google-site-verification"]')).toHaveAttribute('content', 'c_TdSMOCLqsh91Hb9TPpDR0NpTA0VurAHY61AOD1In4')
    await expect(page.locator('header.site')).toBeVisible()
    await expect(page.locator('footer.site')).toContainText('Content is intended for adults aged 18+ only.')
    for (const ld of await jsonLd(page)) expect(ld['@context']).toBe('https://schema.org')
    await page.screenshot({ path: SHOT(`page-${p.shot}`), fullPage: true })
    expect(errors, errors.join('\n')).toEqual([])
  })
}

test('/sell-feet-pics keeps its noindex, other guides are indexable', async ({ page }) => {
  await page.goto('/sell-feet-pics')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
  await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute('content', 'noindex, follow')
  await page.goto('/how-to-sell-feet-pics')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow')
})

test('home page structured data is intact', async ({ page }) => {
  await page.goto('/')
  const ld = await jsonLd(page)
  const faq = ld.find((d) => d['@type'] === 'FAQPage') as { mainEntity: unknown[] }
  expect(faq.mainEntity).toHaveLength(8)
  const site = ld.find((d) => d['@type'] === 'WebSite') as { potentialAction: { target: string } }
  expect(site.potentialAction.target).toBe('https://funwithfeet.net/blog?q={search_term_string}')
  expect(ld.some((d) => d['@type'] === 'Organization')).toBe(true)
  await expect(page.locator('details.faq')).toHaveCount(8)
})

test('affiliate buttons open in a new tab and are marked sponsored', async ({ page }) => {
  await page.goto('/')
  const ctas = page.locator('a[href*="feetfinder.com/affiliate"]')
  expect(await ctas.count()).toBeGreaterThanOrEqual(5)
  for (const a of await ctas.all()) {
    await expect(a).toHaveAttribute('target', '_blank')
    await expect(a).toHaveAttribute('rel', 'noopener sponsored')
  }
})

test('desktop navigation reaches every main page', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Primary' })
  await nav.getByRole('link', { name: 'How to Sell Feet Pics' }).click()
  await expect(page).toHaveURL(/\/how-to-sell-feet-pics$/)
  await expect(nav.getByRole('link', { name: 'How to Sell Feet Pics' })).toHaveAttribute('aria-current', 'page')
  await nav.getByRole('link', { name: 'Blog' }).click()
  await expect(page).toHaveURL(/\/blog$/)
  await nav.getByRole('link', { name: 'About' }).click()
  await expect(page).toHaveURL(/\/about$/)
  await page.getByRole('contentinfo').getByRole('link', { name: 'Privacy Policy' }).click()
  await expect(page).toHaveURL(/\/privacy-policy$/)
})

test('mobile menu opens, navigates and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav).toBeHidden()
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(nav).toBeVisible()
  await page.screenshot({ path: SHOT('mobile-menu-open') })
  await nav.getByRole('link', { name: 'Blog' }).click()
  await expect(page).toHaveURL(/\/blog$/)
  await expect(nav).toBeHidden()
})

test('blog: seeded articles, category filter and search', async ({ page }) => {
  await page.goto('/blog')
  await expect(page.locator('.post-feature')).toContainText('How Much Should You Charge for Feet Pics?')
  await page.getByRole('link', { name: /Safety & Privacy/ }).click()
  await expect(page).toHaveURL(/\/blog\/category\/safety-privacy$/)
  await expect(page.getByRole('link', { name: /7 Feet Pic Scams/ })).toBeVisible()

  await page.goto('/blog')
  await page.getByLabel('Search articles').fill('overpayment')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page).toHaveURL(/\/blog\?q=overpayment/)
  await expect(page.getByRole('link', { name: /7 Feet Pic Scams/ })).toBeVisible()

  await page.goto('/blog?q=zzzz-no-such-thing')
  await expect(page.getByRole('heading', { name: 'Nothing matched your search' })).toBeVisible()
})

test('unknown URLs return a 404 page in the site design', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Wrong Step')
  await expect(page.locator('header.site')).toHaveCount(1)
  await expect(page.locator('footer.site')).toHaveCount(1)
  // A multi-segment URL matches no route at all (root not-found).
  expect((await page.goto('/no/such/deep/page'))?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Wrong Step')
  await expect(page.locator('header.site')).toHaveCount(1)
  expect((await page.goto('/blog/no-such-article'))?.status()).toBe(404)
  await expect(page.locator('header.site')).toHaveCount(1)
  expect((await page.goto('/blog/category/no-such-category'))?.status()).toBe(404)
})

test('robots.txt, sitemap.xml, feed.xml and llms.txt', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Disallow: /admin')
  expect(robots).toContain('Sitemap: https://funwithfeet.net/sitemap.xml')

  const sitemap = await (await request.get('/sitemap.xml')).text()
  for (const u of ['/', '/how-to-sell-feet-pics', '/blog', '/about', '/blog/how-much-to-charge-for-feet-pics', '/privacy-policy']) {
    expect(sitemap).toContain(`<loc>https://funwithfeet.net${u}</loc>`)
  }
  expect(sitemap).not.toContain('/sell-feet-pics<') // noindex page stays out

  const feed = await request.get('/feed.xml')
  expect(feed.headers()['content-type']).toContain('application/rss+xml')
  expect(await feed.text()).toContain('<title>7 Feet Pic Scams Every New Seller Should Know (and How to Avoid Them)</title>')

  expect(await (await request.get('/llms.txt')).text()).toContain('# FunWithFeet.net')
})

test('old static URLs redirect to the new routes', async ({ request }) => {
  const res = await request.get('/index.html', { maxRedirects: 0 })
  expect(res.status()).toBe(308)
  expect(res.headers()['location']).toBe('/')
  const res2 = await request.get('/how-to-sell-feet-pics/index.html', { maxRedirects: 0 })
  expect(res2.headers()['location']).toBe('/how-to-sell-feet-pics')
})

test('admin area and admin APIs are protected', async ({ page, request }) => {
  await page.goto('/admin/posts')
  await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin%2Fposts/)
  expect((await request.get('/api/admin/media')).status()).toBe(401)
  expect((await request.post('/api/admin/upload', { multipart: { file: { name: 'x.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('x') } } })).status()).toBe(401)
  const res = await request.get('/admin/login')
  expect(res.headers()['x-robots-tag']).toBe('noindex, nofollow')
})
