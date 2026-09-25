import { expect, test, type Page } from '@playwright/test'
import { ASSET, jsonLd, login, SHOT, trackErrors, visitorPage } from './helpers'

/**
 * End-to-end test of the CMS: an admin writes a complete blog article in the
 * rich-text editor, publishes it, and we verify every place it should appear on
 * the public website. Then edit / unpublish / schedule / delete flows, pages,
 * categories, media, the contact inbox and sign-out.
 */

const TITLE = 'How to Take Feet Pics That Sell: Lighting, Angles & Editing Tips'
const TITLE_UPDATED = 'How to Take Feet Pics That Sell: Lighting, Angles & Editing (2026 Update)'
const SLUG = 'how-to-take-feet-pics-that-sell'
const META_TITLE = 'How to Take Feet Pics That Sell (Lighting & Angles Guide)'
const META_DESC =
  'Simple lighting, angle and editing tips for feet pics that sell — shot on a phone, with no studio and no face required.'
const EXCERPT =
  'You do not need a studio. Soft daylight, a few proven angles and light editing are what make feet pics sell — here is exactly how to do it.'
const H2S = [
  'Use soft, natural light',
  'Find your best angles',
  'Match the light to the result',
  'Edit lightly and protect your photos',
]

test.describe.configure({ mode: 'serial' })

let admin: Page
let postId = 0

test.beforeAll(async ({ browser }) => {
  admin = await browser.newPage({ viewport: { width: 1366, height: 900 } })
})
test.afterAll(async () => {
  await admin.close()
})

const toolbar = () => admin.getByRole('toolbar', { name: 'Formatting' })
const tool = (name: string) => toolbar().getByRole('button', { name, exact: true })
const type = (text: string) => admin.keyboard.type(text)
const enter = () => admin.keyboard.press('Enter')
async function selectBack(chars: number) {
  for (let i = 0; i < chars; i++) await admin.keyboard.press('Shift+ArrowLeft')
}
async function heading(text: string) {
  await admin.getByLabel('Text style').selectOption('h2')
  await type(text)
  await enter()
}

test('login rejects a wrong password and accepts the right one', async () => {
  await admin.goto('/admin')
  await expect(admin).toHaveURL(/\/admin\/login/)
  await admin.getByLabel('Email').fill('e2e-admin@funwithfeet.net')
  await admin.getByLabel('Password').fill('wrong-password')
  await admin.getByRole('button', { name: 'Sign in' }).click()
  await expect(admin.locator('.adm-alert.error')).toContainText('Incorrect email or password')

  await login(admin)
  await expect(admin.getByRole('link', { name: 'Posts', exact: true })).toBeVisible()
  await admin.screenshot({ path: SHOT('admin-dashboard') })
})

test('write a full blog article in the editor and save it as a draft', async () => {
  const errors = trackErrors(admin)
  await admin.goto('/admin/posts/new')

  // Title → slug is generated automatically, then shortened by hand.
  await admin.getByPlaceholder('Post title').fill(TITLE)
  const slug = admin.getByLabel('URL slug')
  await expect(slug).toHaveValue('how-to-take-feet-pics-that-sell-lighting-angles-and-editing-tips')
  await slug.fill(SLUG)

  // ---- Body, written with the toolbar exactly like an editor would ----
  await admin.getByTestId('rte').click()
  await type('Great feet pics are not about expensive gear. ')
  await tool('Bold').click()
  await type('Light, angles and a clean background')
  await tool('Bold').click()
  await type(' do almost all of the work, and every one of them is free.')
  await enter()

  await heading(H2S[0])
  await type('Shoot near a window during the day. ')
  await tool('Italic').click()
  await type('Avoid the flash')
  await tool('Italic').click()
  await type(', it flattens skin tone and creates harsh shadows.')
  await enter()
  await tool('Bullet list').click()
  await type('Face a window, never stand with your back to it')
  await enter()
  await type('Shoot mid-morning or late afternoon for soft light')
  await enter()
  await type('Use a white sheet as a cheap reflector')
  await enter()
  await enter() // leave the list

  await heading(H2S[1])
  await type('Buyers search for specific views, so give them variety in every set.')
  await enter()
  await tool('Numbered list').click()
  await type('Overhead soles and arches')
  await enter()
  await type('Side profile with pointed toes')
  await enter()
  await type('Close-up of a fresh pedicure')
  await enter()
  await enter()

  await heading(H2S[2])
  await type('Different setups give very different looks:')
  await enter()
  await tool('Insert table').click()
  await expect(admin.getByRole('toolbar', { name: 'Table' })).toBeVisible()
  const cells = [
    'Light source', 'Best for', 'Result',
    'Window daylight', 'Soles and arches', 'Soft, even skin tone',
    'Golden hour', 'Beach and outdoor sets', 'Warm, premium look',
  ]
  for (let i = 0; i < cells.length; i++) {
    await type(cells[i])
    if (i < cells.length - 1) await admin.keyboard.press('Tab')
  }
  await admin.keyboard.press('Control+End') // jump below the table

  // Image upload from inside the editor
  await tool('Insert image').click()
  const imgDialog = admin.getByRole('dialog', { name: 'Insert image' })
  await imgDialog.getByLabel('Upload an image').setInputFiles(ASSET('how-to-sell-feet-pics/feet-pic-lighting-setup.jpg'))
  await expect(imgDialog.locator('.adm-pick[aria-pressed="true"]')).toBeVisible()
  await imgDialog.getByLabel(/Alt text/).fill('Feet photographed in soft window light')
  await imgDialog.getByRole('button', { name: 'Insert image' }).click()
  await expect(imgDialog).toBeHidden()
  await expect(admin.getByTestId('rte').locator('img[alt="Feet photographed in soft window light"]')).toBeVisible()
  await admin.keyboard.press('Control+End')

  await heading(H2S[3])
  await type('Crop, straighten and brighten slightly, nothing more.')
  await enter()
  await tool('Quote').click()
  await type('Always watermark previews and strip location data before you upload.')
  await enter()
  await enter() // leave the quote

  // Internal link
  await type('Want the full walkthrough? ')
  await type('Read our complete guide')
  await selectBack('Read our complete guide'.length)
  await tool('Link').click()
  const linkDialog = admin.getByRole('dialog', { name: 'Insert link' })
  await linkDialog.getByLabel('URL').fill('/how-to-sell-feet-pics')
  await linkDialog.getByRole('button', { name: 'Apply link' }).click()
  await type('.')
  await enter()

  // Affiliate link using the one-click helper
  await type('Ready to go? ')
  await type('Create your free seller profile')
  await selectBack('Create your free seller profile'.length)
  await tool('Link').click()
  await linkDialog.getByRole('button', { name: 'Use the affiliate link' }).click()
  await expect(linkDialog.getByLabel('Open in a new tab')).toBeChecked()
  await expect(linkDialog.getByLabel(/sponsored/)).toBeChecked()
  await linkDialog.getByRole('button', { name: 'Apply link' }).click()
  await type(' and upload your first set today.')

  // ---- Sidebar fields ----
  await admin.getByLabel('Excerpt').fill(EXCERPT)

  await admin.getByRole('button', { name: 'Set cover image' }).click()
  const coverDialog = admin.getByRole('dialog', { name: 'Cover image' })
  await coverDialog.getByLabel('Upload an image').setInputFiles(ASSET('sell-feet-pics/feet-pics-pedicure.jpg'))
  await expect(coverDialog.locator('.adm-pick[aria-pressed="true"]')).toBeVisible()
  await coverDialog.getByLabel(/Alt text/).fill('Fresh pedicure photographed in daylight')
  await coverDialog.getByRole('button', { name: 'Use as cover' }).click()
  await expect(admin.getByTestId('cover-preview')).toBeVisible()

  await admin.getByLabel('Category').selectOption({ label: 'Photography Tips' })
  await admin.getByLabel('Tags').fill('photography, lighting, beginners')
  await admin.getByLabel(/Meta title/).fill(META_TITLE)
  await admin.getByLabel(/Meta description/).fill(META_DESC)
  await expect(admin.locator('.serp .t')).toHaveText(META_TITLE)
  await expect(admin.locator('.adm-savebar')).toHaveText('Unsaved changes')

  await admin.screenshot({ path: SHOT('admin-editor'), fullPage: true })

  await admin.getByRole('button', { name: 'Save draft' }).click()
  await admin.waitForURL(/\/admin\/posts\/\d+\?created=draft/)
  postId = Number(admin.url().match(/posts\/(\d+)/)![1])
  await expect(admin.getByTestId('editor-notice')).toContainText('Draft created')
  await expect(admin.getByTestId('entry-status')).toHaveText('Draft')

  // The saved content round-trips back into the editor.
  const rte = admin.getByTestId('rte')
  await expect(rte.locator('h2')).toHaveText(H2S)
  await expect(rte.locator('table th').first()).toHaveText('Light source')
  expect(errors, errors.join('\n')).toEqual([])
})

test('a draft is hidden from visitors but previewable by the admin', async ({ browser }) => {
  const { ctx, page } = await visitorPage(browser)
  const res = await page.goto(`/blog/${SLUG}`)
  expect(res?.status()).toBe(404)
  await page.goto('/blog')
  await expect(page.getByRole('link', { name: TITLE })).toHaveCount(0)
  await ctx.close()

  await admin.goto(`/blog/${SLUG}`)
  await expect(admin.locator('.preview-banner')).toContainText('Draft preview')
  await expect(admin.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
})

test('publish the article', async () => {
  await admin.goto(`/admin/posts/${postId}`)
  await admin.getByRole('button', { name: 'Publish', exact: true }).click()
  await expect(admin.getByTestId('editor-notice')).toContainText('Post published')
  await expect(admin.getByTestId('entry-status')).toHaveText('Published')
  await expect(admin.getByRole('button', { name: 'Update' })).toBeVisible()
})

test('the published article renders correctly on the website', async ({ browser }) => {
  const { ctx, page } = await visitorPage(browser)
  const errors = trackErrors(page)
  const res = await page.goto(`/blog/${SLUG}`)
  expect(res?.status()).toBe(200)

  // SEO
  await expect(page).toHaveTitle(META_TITLE)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', META_DESC)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://funwithfeet.net/blog/${SLUG}`)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow')
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\/funwithfeet\.net\/uploads\/\d{4}\/\d{2}\/.+\.jpg$/)
  const ld = await jsonLd(page)
  const posting = ld.find((d) => d['@type'] === 'BlogPosting')!
  expect(posting.headline).toBe(TITLE)
  expect(posting.articleSection).toBe('Photography Tips')
  expect(ld.some((d) => d['@type'] === 'BreadcrumbList')).toBe(true)

  // Header area
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(TITLE)
  await expect(page.locator('.article-hero .eyebrow')).toHaveText('Photography Tips')
  await expect(page.locator('.article-hero .lead')).toHaveText(EXCERPT)
  await expect(page.locator('.crumb')).toContainText('Photography Tips')
  const cover = page.locator('.article-cover img')
  await expect(cover).toHaveAttribute('alt', 'Fresh pedicure photographed in daylight')
  expect(await cover.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)

  // Body content written in the editor
  const prose = page.locator('.prose')
  await expect(prose.locator('h2')).toHaveText(H2S)
  await expect(prose.locator('h2').first()).toHaveAttribute('id', 'use-soft-natural-light')
  await expect(page.locator('.article-aside .toc a')).toHaveCount(4)
  await expect(page.locator('.article-aside .toc a').first()).toHaveAttribute('href', '#use-soft-natural-light')
  await expect(prose.locator('strong', { hasText: 'Light, angles and a clean background' })).toBeVisible()
  await expect(prose.locator('em', { hasText: 'Avoid the flash' })).toBeVisible()
  await expect(prose.locator('ul > li')).toHaveCount(3)
  await expect(prose.locator('ol > li')).toHaveText(['Overhead soles and arches', 'Side profile with pointed toes', 'Close-up of a fresh pedicure'])
  await expect(prose.locator('blockquote')).toContainText('Always watermark previews')
  await expect(prose.locator('table th')).toHaveText(['Light source', 'Best for', 'Result'])
  await expect(prose.locator('table td', { hasText: 'Golden hour' })).toBeVisible()
  const inline = prose.locator('img[alt="Feet photographed in soft window light"]')
  await inline.scrollIntoViewIfNeeded()
  await expect.poll(() => inline.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)

  const internal = prose.getByRole('link', { name: 'Read our complete guide', exact: true })
  await expect(internal).toHaveAttribute('href', '/how-to-sell-feet-pics')
  expect(await internal.getAttribute('target')).toBeNull()
  const affiliate = prose.getByRole('link', { name: 'Create your free seller profile', exact: true })
  await expect(affiliate).toHaveAttribute('href', /feetfinder\.com\/affiliate/)
  await expect(affiliate).toHaveAttribute('target', '_blank')
  await expect(affiliate).toHaveAttribute('rel', /sponsored/)

  // Automatic extras: mid-article CTA, tags, author box, related posts
  await expect(prose.locator('.inline-cta a')).toHaveAttribute('rel', /sponsored/)
  await expect(page.locator('.article-tags .chip')).toHaveText(['photography', 'lighting', 'beginners'])
  await expect(page.locator('.author-box')).toContainText('FunWithFeet Editorial Team')
  await expect(page.getByRole('heading', { name: 'Related Articles' })).toBeVisible()

  await page.screenshot({ path: SHOT('article-desktop'), fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: SHOT('article-mobile'), fullPage: true })
  expect(errors, errors.join('\n')).toEqual([])
  await ctx.close()
})

test('the article appears everywhere it should', async ({ browser, request }) => {
  const { ctx, page } = await visitorPage(browser)

  await page.goto('/blog')
  await expect(page.getByRole('link', { name: TITLE })).toBeVisible()
  await page.getByRole('link', { name: TITLE }).click()
  await expect(page).toHaveURL(new RegExp(`/blog/${SLUG}$`))

  await page.goto('/blog/category/photography-tips')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Photography Tips')
  await expect(page.getByRole('link', { name: TITLE })).toBeVisible()

  await page.goto('/')
  await expect(page.locator('#latest-guides')).toContainText(TITLE)

  await page.goto('/blog?q=reflector')
  await expect(page.getByText('1 article found')).toBeVisible()
  await expect(page.getByRole('link', { name: TITLE })).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  await ctx.close()

  expect(await (await request.get('/sitemap.xml')).text()).toContain(`https://funwithfeet.net/blog/${SLUG}</loc>`)
  const feed = await (await request.get('/feed.xml')).text()
  expect(feed).toContain(`https://funwithfeet.net/blog/${SLUG}`)
  expect(feed).toContain('Lighting, Angles &amp; Editing Tips')
  expect(await (await request.get('/llms.txt')).text()).toContain(TITLE)
})

test('editing a published article updates the live page (Ctrl+S saves)', async ({ browser }) => {
  await admin.goto(`/admin/posts/${postId}`)
  await admin.getByPlaceholder('Post title').fill(TITLE_UPDATED)
  await expect(admin.getByLabel('URL slug')).toHaveValue(SLUG) // published slug is kept
  await admin.getByTestId('rte').click()
  await admin.keyboard.press('Control+End')
  await enter()
  await type('Updated for 2026: phone cameras handle low light far better now, but daylight still wins.')
  await admin.keyboard.press('Control+s')
  await expect(admin.getByTestId('editor-notice')).toContainText('Post updated')
  await expect(admin.locator('.adm-savebar')).toContainText('Last saved')

  const { ctx, page } = await visitorPage(browser)
  await page.goto(`/blog/${SLUG}`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(TITLE_UPDATED)
  await expect(page.locator('.prose')).toContainText('Updated for 2026')
  await ctx.close()
})

test('unpublish hides the article, publishing again restores it', async ({ browser, request }) => {
  await admin.goto(`/admin/posts/${postId}`)
  await admin.getByRole('button', { name: 'Unpublish' }).click()
  await expect(admin.getByTestId('editor-notice')).toContainText('unpublished')
  await expect(admin.getByTestId('entry-status')).toHaveText('Draft')

  const { ctx, page } = await visitorPage(browser)
  expect((await page.goto(`/blog/${SLUG}`))?.status()).toBe(404)
  expect(await (await request.get('/sitemap.xml')).text()).not.toContain(`/blog/${SLUG}<`)

  await admin.getByRole('button', { name: 'Publish', exact: true }).click()
  await expect(admin.getByTestId('entry-status')).toHaveText('Published')
  expect((await page.goto(`/blog/${SLUG}`))?.status()).toBe(200)
  await ctx.close()
})

test('scheduled posts stay hidden, and posts can be deleted', async ({ browser }) => {
  const title = 'Scheduled E2E Post'
  await admin.goto('/admin/posts/new')
  await admin.getByPlaceholder('Post title').fill(title)
  await admin.getByTestId('rte').click()
  await type('This post is scheduled for the future and must stay hidden until then.')
  await admin.getByLabel('Publish date').fill('2030-01-15T10:00')
  await admin.getByRole('button', { name: 'Schedule' }).click()
  await admin.waitForURL(/created=scheduled/)
  await expect(admin.getByTestId('entry-status')).toHaveText('Scheduled')

  const { ctx, page } = await visitorPage(browser)
  expect((await page.goto('/blog/scheduled-e2e-post'))?.status()).toBe(404)
  await ctx.close()

  await admin.goto('/admin/posts?status=scheduled')
  const row = admin.getByRole('row', { name: new RegExp(title) })
  await expect(row).toContainText('Scheduled')
  admin.once('dialog', (d) => d.accept())
  await row.getByRole('button', { name: `Delete ${title}` }).click()
  await expect(admin.getByRole('status')).toHaveText('Post deleted.')
  await expect(admin.getByRole('row', { name: new RegExp(title) })).toHaveCount(0)
})

test('categories can be created, renamed and deleted', async () => {
  await admin.goto('/admin/categories')
  await admin.getByLabel('Name').fill('E2E Category')
  await admin.getByLabel('Description').fill('Temporary category from the e2e test.')
  await admin.getByRole('button', { name: 'Add category' }).click()
  await expect(admin.getByRole('status')).toHaveText('Category created.')
  const table = admin.getByTestId('categories-table')
  await expect(table).toContainText('/blog/category/e2e-category')

  await table.getByRole('link', { name: 'E2E Category' }).click()
  // Wait for the edit form to replace the "add" form before typing into it.
  await admin.waitForURL(/[?&]edit=\d+/)
  await expect(admin.getByRole('heading', { name: 'Edit “E2E Category”' })).toBeVisible()
  await admin.getByLabel('Name').fill('E2E Category Renamed')
  await admin.getByRole('button', { name: 'Update category' }).click()
  await expect(admin.getByRole('status')).toHaveText('Category updated.')
  await expect(table).toContainText('E2E Category Renamed')

  admin.once('dialog', (d) => d.accept())
  await admin.getByRole('row', { name: /E2E Category Renamed/ }).getByRole('button', { name: 'Delete' }).click()
  await expect(admin.getByRole('status')).toContainText('Category deleted')
  await expect(table).not.toContainText('E2E Category')
})

test('CMS pages: create with the HTML editor, publish, view and delete', async ({ browser }) => {
  await admin.goto('/admin/pages/new')
  await admin.getByPlaceholder('Page title').fill('E2E Test Page')
  await admin.getByTestId('rte').click()
  await type('This page was written by the end-to-end test.')

  // Round-trip through the HTML source view.
  await tool('Edit HTML source').click()
  const source = admin.getByLabel('HTML source')
  await expect(source).toHaveValue(/<p>This page was written/)
  await source.fill(`${await source.inputValue()}<h2>Added in HTML mode</h2><p>Raw HTML works too.</p>`)
  await tool('Back to visual editor').click()
  await expect(admin.getByTestId('rte').locator('h2')).toHaveText('Added in HTML mode')

  await admin.getByRole('button', { name: 'Publish', exact: true }).click()
  await admin.waitForURL(/\/admin\/pages\/\d+\?created=published/)

  const { ctx, page } = await visitorPage(browser)
  expect((await page.goto('/e2e-test-page'))?.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('E2E Test Page')
  await expect(page.locator('.prose h2')).toHaveText('Added in HTML mode')

  admin.once('dialog', (d) => d.accept())
  await admin.getByRole('button', { name: 'Delete page' }).click()
  await admin.waitForURL(/\/admin\/pages\?deleted=1/)
  expect((await page.goto('/e2e-test-page'))?.status()).toBe(404)
  await ctx.close()
})

test('uploaded images are listed in the media library', async () => {
  await admin.goto('/admin/media')
  await expect(admin.getByTestId('media-grid').locator('.adm-media-card')).toHaveCount(2)
  await expect(admin.getByTestId('media-grid')).toContainText('feet-pics-pedicure.jpg')
})

test('contact form messages arrive in the admin inbox', async ({ browser }) => {
  const { ctx, page } = await visitorPage(browser)
  await page.goto('/contact')
  await page.getByLabel('Your name').fill('Test Visitor')
  await page.getByLabel('Email address').fill('visitor@example.com')
  await page.getByLabel('Subject').selectOption('Content correction')
  await page.getByLabel('Message').fill('Hello! The pricing table on the blog is really helpful. Thank you.')
  await page.getByRole('button', { name: 'Send Message' }).click()
  await expect(page.getByRole('status')).toContainText('your message has been sent')
  await ctx.close()

  await admin.goto('/admin/messages')
  const msg = admin.getByTestId('message').first()
  await expect(msg).toContainText('Test Visitor')
  await expect(msg).toContainText('visitor@example.com')
  await expect(msg).toContainText('The pricing table on the blog is really helpful')
  await expect(msg.locator('.pill-unread')).toBeVisible()
  await expect(admin.locator('.adm-nav .count')).toHaveText('1')

  await msg.getByRole('button', { name: 'Mark as read' }).click()
  await expect(msg.locator('.pill-unread')).toHaveCount(0)
  await expect(admin.locator('.adm-nav .count')).toHaveCount(0)
})

test('sign out ends the session', async () => {
  await admin.goto('/admin')
  await admin.getByRole('button', { name: 'Sign out' }).click()
  await admin.waitForURL(/\/admin\/login/)
  await admin.goto('/admin/posts')
  await expect(admin).toHaveURL(/\/admin\/login/)
})
