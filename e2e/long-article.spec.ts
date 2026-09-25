import { expect, test, type Page } from '@playwright/test'
import { ASSET, jsonLd, login, SHOT, trackErrors, visitorPage } from './helpers'

/**
 * Writes a LONG article in the CMS editor that uses every formatting option
 * (headings H2–H4, bold, italic, underline, strikethrough, inline code, bullet,
 * nested and numbered lists, table, images, quote, code block, divider, internal
 * links chosen from the link picker, an external link and an affiliate link),
 * publishes it, and checks that every element renders AND is styled correctly
 * on the public site, on desktop and mobile. Re-runnable: an earlier copy is
 * deleted first.
 */

const TITLE = 'Feet Pic Photography Masterclass: Lighting, Angles, Props & Editing'
const SLUG = 'feet-pic-photography-masterclass'
const META_TITLE = 'Feet Pic Photography Guide: Lighting, Angles & Editing'
const META_DESC =
  'Shoot feet pics that sell with just a phone: soft lighting setups, the angles buyers search for, simple props, light editing and privacy-safe exports.'
const EXCERPT =
  'Everything you need to shoot feet pics that sell with nothing more than a phone: light, angles, props, editing and privacy-safe exporting, step by step.'
const H2S = [
  '1. Prepare your feet before you shoot',
  '2. Light is everything',
  '3. The angles buyers search for',
  '4. Props that lift a plain photo',
  '5. Edit lightly and protect your privacy',
  'Quick checklist before you publish',
  'Frequently asked questions',
]

test.describe.configure({ mode: 'serial' })

let admin: Page

test.beforeAll(async ({ browser }) => {
  admin = await browser.newPage({ viewport: { width: 1366, height: 900 } })
  await login(admin)
})
test.afterAll(async () => {
  await admin.close()
})

// ---------- small writing helpers (mirror what an editor does by hand) ----------
const toolbar = () => admin.getByRole('toolbar', { name: 'Formatting' })
const tool = (name: string) => toolbar().getByRole('button', { name, exact: true })
const key = (k: string) => admin.keyboard.press(k)
const typeText = (t: string) => admin.keyboard.type(t)
const insert = (t: string) => admin.keyboard.insertText(t)
async function para(t: string) {
  await insert(t)
  await key('Enter')
}
async function heading(level: 2 | 3 | 4, t: string) {
  await admin.getByLabel('Text style').selectOption(`h${level}`)
  await typeText(t)
  await key('Enter')
}
async function marked(toolName: string, t: string) {
  await tool(toolName).click()
  await typeText(t)
  await tool(toolName).click()
}
/** Select the last `text` typed and turn it into a link using the link dialog. */
async function linkLast(text: string, configure: (dialog: ReturnType<Page['getByRole']>) => Promise<void>) {
  for (let i = 0; i < text.length; i++) await key('Shift+ArrowLeft')
  await tool('Link').click()
  const dialog = admin.getByRole('dialog', { name: 'Insert link' })
  await configure(dialog)
  await dialog.getByRole('button', { name: 'Apply link' }).click()
  await expect(dialog).toBeHidden()
}
async function pickInternal(dialog: ReturnType<Page['getByRole']>, search: string, item: RegExp, expectedPath: string) {
  await dialog.getByLabel('Or link to a page on this site').fill(search)
  await dialog.getByRole('button', { name: item }).click()
  await expect(dialog.getByLabel('URL', { exact: true })).toHaveValue(expectedPath)
}
async function insertImage(file: string, alt: string) {
  await tool('Insert image').click()
  const dialog = admin.getByRole('dialog', { name: 'Insert image' })
  await dialog.getByLabel('Upload an image').setInputFiles(ASSET(file))
  await expect(dialog.locator('.adm-pick[aria-pressed="true"]')).toBeVisible()
  await dialog.getByLabel(/Alt text/).fill(alt)
  await dialog.getByRole('button', { name: 'Insert image' }).click()
  await expect(dialog).toBeHidden()
  // No cursor moves here on purpose: typing must continue BELOW the new image.
}

test('an earlier copy of the article is removed (so the test can be re-run)', async () => {
  const listUrl = `/admin/posts?q=${encodeURIComponent('Photography Masterclass')}`
  await admin.goto(listUrl)
  const rows = admin.getByRole('row', { name: /Photography Masterclass/ })
  while ((await rows.count()) > 0) {
    admin.once('dialog', (d) => d.accept())
    await rows.first().getByRole('button', { name: /^Delete / }).click()
    await admin.waitForURL(/deleted=1/)
    await admin.goto(listUrl)
  }
  await expect(rows).toHaveCount(0)
})

test('write a long article with every formatting option', async () => {
  test.setTimeout(300_000)
  const errors = trackErrors(admin)
  await admin.goto('/admin/posts/new')
  await admin.getByPlaceholder('Post title').fill(TITLE)
  await admin.getByLabel('URL slug').fill(SLUG)
  await admin.getByTestId('rte').click()

  // Intro: bold, italic, strikethrough and an internal link picked from the site list
  await typeText('Great feet pics are ')
  await marked('Bold', 'not')
  await typeText(' about expensive gear. ')
  await marked('Italic', 'Light, angle and a clean background')
  await typeText(' do almost all of the work, and you already have all three for free.')
  await key('Enter')
  await typeText('This masterclass skips ')
  await marked('Strikethrough', 'a professional studio')
  await typeText(' and shows you what to do with the phone already in your pocket. If you are brand new, start with our ')
  await typeText('complete guide on how to sell feet pics')
  await linkLast('complete guide on how to sell feet pics', (d) =>
    pickInternal(d, 'How to Sell', /How to Sell Feet Pics — complete guide/, '/how-to-sell-feet-pics'),
  )
  await typeText(', then come back here.')
  await key('Enter')

  // H2 + bullet list with a nested list and underline
  await heading(2, H2S[0])
  await para('Buyers notice skin and nails before anything else. Ten minutes of preparation the evening before makes every single photo look better, and it costs nothing.')
  await tool('Bullet list').click()
  await typeText('Moisturise the night before so skin looks smooth rather than shiny')
  await key('Enter')
  await typeText('File and tidy your nails; a ')
  await marked('Underline', 'neutral nude or classic red polish')
  await typeText(' photographs best')
  await key('Enter')
  await typeText('Avoid tight socks and shoes for a few hours before you shoot')
  await key('Enter')
  await key('Tab') // nested list
  await typeText('Compression socks can leave visible lines for up to an hour')
  await key('Enter')
  await typeText('Sandal straps leave faint tan lines, so plan themed sets around them')
  await key('Enter')
  await key('Enter') // back to the first level
  await key('Enter') // leave the list
  await para('If the skin around your heels is dry, use a gentle foot file two or three days before the shoot rather than the same evening, so any redness has time to settle. A thin layer of unscented lotion about an hour before you start gives a healthy look without the greasy shine that cameras exaggerate.')

  // H2 + H3 + H4 + numbered list + table + image
  await heading(2, H2S[1])
  await para('Lighting decides whether a photo looks premium or cheap. You do not need to buy anything: a window and a white wall are enough for most sets.')
  await heading(3, 'Natural window light')
  await para('Stand side-on to a large window between mid-morning and late afternoon. Soft daylight wraps around the foot, shows texture and keeps colours true. Avoid direct midday sun, which creates hard shadows and blown-out highlights on the soles.')
  await para('On a phone, tap to focus on the arch and then drag the exposure slider down a little. Slightly darker photos keep detail in the soles, and you can always brighten them later without losing texture. Turn off beauty filters and portrait mode, which smooth skin unnaturally.')
  await heading(3, 'When you have to shoot at night')
  await para('Evening shoots are fine as long as you control the light. Turn off overhead bulbs, which cast a yellow cast from above, and build a simple setup instead.')
  await heading(4, 'A two-lamp setup that costs nothing')
  await tool('Numbered list').click()
  await typeText('Place your main lamp at roughly 45 degrees to one side')
  await key('Enter')
  await typeText('Bounce a second, weaker lamp off a white wall to soften the shadows')
  await key('Enter')
  await typeText('Switch off every other light so the colours do not mix')
  await key('Enter')
  await key('Enter')
  await para('Here is how the common options compare:')
  await tool('Insert table').click()
  const cells = [
    'Setup', 'Cost', 'Best for',
    'Window daylight', 'Free', 'Soles, arches and pedicures',
    'Golden hour outdoors', 'Free', 'Beach and poolside sets',
    'Ring light', '$20 to $40', 'Close-ups and nail art',
  ]
  for (let i = 0; i < cells.length; i++) {
    await typeText(cells[i])
    if (i < cells.length - 1) await key('Tab') // Tab past the last cell of a row adds a new row
  }
  await key('Control+End')
  await insertImage('sell-feet-pics/feet-pics-poolside.jpg', 'Feet by a pool in warm golden hour light')

  // H2 + numbered list with bold lead-ins + image + two-paragraph quote
  await heading(2, H2S[2])
  await para('Buyers filter by the views they love, so give every set variety. Shoot far more frames than you need and keep only the sharpest.')
  await tool('Numbered list').click()
  await marked('Bold', 'Soles and arches:')
  await typeText(' shot from slightly above with relaxed toes')
  await key('Enter')
  await marked('Bold', 'Top-down pedicure:')
  await typeText(' straight overhead, both feet parallel')
  await key('Enter')
  await marked('Bold', 'Side profile:')
  await typeText(' low angle with pointed toes to show the arch')
  await key('Enter')
  await key('Enter')
  await insertImage('sell-feet-pics/feet-pics-soles.jpg', 'Close-up of soles and arches photographed from slightly above')
  await tool('Quote').click()
  await marked('Bold', 'Pro tip:')
  await typeText(' shoot at least thirty frames for every five you plan to sell.')
  await key('Enter')
  await typeText('The difference between an average and a great photo is usually a tiny change in toe position.')
  await key('Enter')
  await key('Enter') // leave the quote
  await heading(3, 'Composition basics')
  await para('Keep the feet as the clear subject. Fill most of the frame, leave a little breathing room around the toes and keep the horizon or the edge of the bed straight. Shoot a few frames with the feet slightly off-centre; asymmetry often looks more natural than a perfectly centred pose.')
  await para('Check every corner of the frame before you press the shutter. A charging cable, a pet hair on the sheet or a corner of a magazine is enough to make a set look careless, and buyers zoom in on everything.')

  // H2 + bullet list + internal link to another article
  await heading(2, H2S[3])
  await para('A single prop can turn a plain photo into a themed set that buyers remember and come back for.')
  await tool('Bullet list').click()
  await typeText('Anklets and toe rings for a jewellery set')
  await key('Enter')
  await typeText('Cozy socks or sheer nylons for covered sets')
  await key('Enter')
  await typeText('Heels, ballet flats or clean white sneakers')
  await key('Enter')
  await typeText('Seasonal props such as sand, petals or fairy lights')
  await key('Enter')
  await key('Enter')
  await para('You do not need to spend much. Most sellers build a small kit over time: two or three pairs of socks in different colours, one anklet, one pair of heels and a plain throw for the background. Rotate them so each set feels different even when it is shot in the same room.')
  await typeText('Themed sets usually sell for more, so read our ')
  await typeText('feet pic pricing guide')
  await linkLast('feet pic pricing guide', (d) => pickInternal(d, 'charge', /How Much Should You Charge/, '/blog/how-much-to-charge-for-feet-pics'))
  await typeText(' before you set your prices.')
  await key('Enter')

  // H2 + H3 + external link + inline code + code block + divider
  await heading(2, H2S[4])
  await para('Keep edits subtle: crop, straighten, brighten slightly and warm the white balance a touch. Heavy filters and smoothing make buyers suspicious and can get listings rejected.')
  await para('Your phone’s built-in editor is enough. Save one set of adjustments and apply the same settings to every photo in a set so the colours match; a consistent look across your whole profile makes it feel professional and helps buyers recognise your work.')
  await heading(3, 'Strip location data before uploading')
  await typeText('Phone photos can store GPS coordinates in their ')
  await typeText('EXIF data')
  await linkLast('EXIF data', async (d) => {
    await d.getByLabel('URL', { exact: true }).fill('https://en.wikipedia.org/wiki/Exif')
    await d.getByLabel('Open in a new tab').check()
  })
  await typeText('. Rename files to something neutral such as ')
  await marked('Inline code', 'pedicure-set-01.jpg')
  await typeText(' instead of the default camera names.')
  await key('Enter')
  await para('A clear listing description helps buyers choose. Copy this template and adjust it for each set:')
  await tool('Code block').click()
  await typeText('Fresh Red Pedicure Set: 8 photos')
  await key('Enter')
  await typeText('- Natural window light, clean white background')
  await key('Enter')
  await typeText('- Soles, arches and top-down angles')
  await key('Enter')
  await typeText('- Delivered instantly after purchase')
  await key('Enter')
  await key('Enter')
  await key('Enter') // triple Enter leaves the code block
  await tool('Divider').click()

  // Checklist + FAQ + affiliate link + safety link
  await heading(2, H2S[5])
  await tool('Bullet list').click()
  await typeText('Background clear of mail, mirrors and anything personal')
  await key('Enter')
  await typeText('Location data removed from every file')
  await key('Enter')
  await typeText('Previews watermarked, full sets delivered clean')
  await key('Enter')
  await key('Enter')
  await typeText('Before you publish anything, read our ')
  await typeText('safety and privacy articles')
  await linkLast('safety and privacy articles', (d) => pickInternal(d, 'Safety', /Safety & Privacy \(category\)/, '/blog/category/safety-privacy'))
  await typeText('.')
  await key('Enter')
  await heading(2, H2S[6])
  await heading(3, 'Do I need a professional camera?')
  await para('No. Any phone from the last few years takes sharp enough photos. Good light and a steady hand matter far more than the camera.')
  await heading(3, 'What background works best?')
  await para('Plain and light: a white sheet, a light rug or a wooden floor. Busy patterns pull attention away from the feet.')
  await heading(3, 'How many photos should a set have?')
  await para('Between five and ten is the sweet spot for most buyers. Larger bundles work well once you have regular customers.')
  await typeText('Ready to put this into practice? ')
  await typeText('Create your free seller profile')
  await linkLast('Create your free seller profile', (d) => d.getByRole('button', { name: 'Use the affiliate link' }).click())
  await typeText(' and upload your first set today.')

  // Sidebar
  await admin.getByLabel('Excerpt').fill(EXCERPT)
  await admin.getByRole('button', { name: 'Set cover image' }).click()
  const cover = admin.getByRole('dialog', { name: 'Cover image' })
  await cover.getByLabel('Upload an image').setInputFiles(ASSET('how-to-sell-feet-pics/niche-red-pedicure.jpg'))
  await expect(cover.locator('.adm-pick[aria-pressed="true"]')).toBeVisible()
  await cover.getByLabel(/Alt text/).fill('Freshly painted red pedicure photographed in daylight')
  await cover.getByRole('button', { name: 'Use as cover' }).click()
  await admin.getByLabel('Category').selectOption({ label: 'Photography Tips' })
  await admin.getByLabel('Tags').fill('photography, lighting, editing, beginners')
  await admin.getByLabel(/Meta title/).fill(META_TITLE)
  await admin.getByLabel(/Meta description/).fill(META_DESC)

  await admin.getByRole('button', { name: 'Save draft' }).click()
  await admin.waitForURL(/\/admin\/posts\/\d+\?created=draft/)
  await expect(admin.getByTestId('editor-notice')).toContainText('Draft created')

  // Everything survived the save and reload.
  const rte = admin.getByTestId('rte')
  await expect(rte.locator('h2')).toHaveText(H2S)
  await expect(rte.locator('h4')).toHaveText('A two-lamp setup that costs nothing')
  await expect(rte.locator('pre code')).toContainText('Fresh Red Pedicure Set')
  await admin.screenshot({ path: SHOT('long-article-editor'), fullPage: true })

  await admin.getByRole('button', { name: 'Publish', exact: true }).click()
  await expect(admin.getByTestId('editor-notice')).toContainText('Post published')
  expect(errors, errors.join('\n')).toEqual([])
})

test('every formatting type renders on the website', async ({ browser }) => {
  const { ctx, page } = await visitorPage(browser)
  const errors = trackErrors(page)
  expect((await page.goto(`/blog/${SLUG}`))?.status()).toBe(200)

  await expect(page).toHaveTitle(META_TITLE)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(TITLE)
  await expect(page.locator('.article-hero .eyebrow')).toHaveText('Photography Tips')

  const prose = page.locator('.prose')
  await expect(prose.locator('h2')).toHaveText(H2S)
  await expect(prose.locator('h3')).toHaveCount(7)
  await expect(prose.locator('h4')).toHaveText('A two-lamp setup that costs nothing')
  await expect(prose.locator('strong', { hasText: 'not' }).first()).toBeVisible()
  await expect(prose.locator('em', { hasText: 'Light, angle and a clean background' })).toBeVisible()
  await expect(prose.locator('s', { hasText: 'a professional studio' })).toBeVisible()
  await expect(prose.locator('u', { hasText: 'neutral nude or classic red polish' })).toBeVisible()
  await expect(prose.locator('p code', { hasText: 'pedicure-set-01.jpg' })).toBeVisible()
  await expect(prose.locator('pre code')).toContainText('- Delivered instantly after purchase')
  await expect(prose.locator('ul > li > ul > li')).toHaveCount(2)
  await expect(prose.locator('ol').first().locator(':scope > li')).toHaveCount(3)
  await expect(prose.locator('ol li strong', { hasText: 'Soles and arches:' })).toBeVisible()
  await expect(prose.locator('table th')).toHaveText(['Setup', 'Cost', 'Best for'])
  await expect(prose.locator('table tbody tr')).toHaveCount(4)
  await expect(prose.locator('blockquote p')).toHaveCount(2)
  await expect(prose.locator('hr')).toHaveCount(1)

  const images = prose.locator('img')
  await expect(images).toHaveCount(2)
  for (const img of await images.all()) {
    await expect(img).toHaveAttribute('alt', /.+/)
    await expect(img).toHaveAttribute('width', /^\d+$/) // reserves space, no layout shift
    await expect(img).toHaveAttribute('height', /^\d+$/)
    await img.scrollIntoViewIfNeeded()
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0)
  }

  // Links: 3 internal (picked from the site list), 1 external, 1 affiliate
  await expect(prose.getByRole('link', { name: 'complete guide on how to sell feet pics' })).toHaveAttribute('href', '/how-to-sell-feet-pics')
  await expect(prose.getByRole('link', { name: 'feet pic pricing guide' })).toHaveAttribute('href', '/blog/how-much-to-charge-for-feet-pics')
  await expect(prose.getByRole('link', { name: 'safety and privacy articles' })).toHaveAttribute('href', '/blog/category/safety-privacy')
  const external = prose.getByRole('link', { name: 'EXIF data' })
  await expect(external).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Exif')
  await expect(external).toHaveAttribute('target', '_blank')
  await expect(external).toHaveAttribute('rel', /noopener/)
  await expect(prose.getByRole('link', { name: 'Create your free seller profile' })).toHaveAttribute('rel', /sponsored/)

  // Table of contents lists H2 and H3 sections; inline CTA is injected; prev/next links exist
  await expect(page.locator('.article-aside .toc li.lvl-2')).toHaveCount(7)
  await expect(page.locator('.article-aside .toc li.lvl-3')).toHaveCount(7)
  await expect(prose.locator('.inline-cta')).toHaveCount(1)
  await expect(page.getByRole('navigation', { name: 'More articles' })).toBeVisible()

  const posting = (await jsonLd(page)).find((d) => d['@type'] === 'BlogPosting') as { wordCount: number }
  expect(posting.wordCount).toBeGreaterThan(1000)
  expect(errors, errors.join('\n')).toEqual([])
  await ctx.close()
})

test('formatting is styled with the site design', async ({ browser }) => {
  const { ctx, page } = await visitorPage(browser)
  await page.goto(`/blog/${SLUG}`)
  const css = (selector: string, prop: string, pseudo?: string) =>
    page.locator(selector).first().evaluate((el, [p, ps]) => getComputedStyle(el, ps || undefined).getPropertyValue(p), [prop, pseudo ?? ''] as const)

  const CORAL = 'rgb(255, 107, 94)'
  const INK = 'rgb(20, 32, 31)'
  const TEAL = 'rgb(15, 118, 110)'
  expect(await css('.prose h2', 'border-left-color')).toBe(CORAL)
  expect(await css('.prose h2', 'border-left-width')).toBe('4px')
  expect(await css('.prose blockquote', 'border-left-color')).toBe(CORAL)
  expect(await css('.prose pre', 'background-color')).toBe(INK)
  expect(await css('.prose th', 'background-color')).toBe(INK)
  expect(await css('.prose ul > li', 'background-color', '::before')).toBe(TEAL)
  expect(await css('.prose ol > li', 'border-radius', '::before')).toBe('50%')
  expect(await css('.prose img', 'border-radius')).toBe('14px')
  expect(await css('.prose p code', 'background-color')).toBe('rgb(245, 249, 248)')
  expect(await css('.prose u', 'text-decoration-line')).toContain('underline')
  expect(await css('.prose s', 'text-decoration-line')).toContain('line-through')
  expect(await css('.prose a[href="/how-to-sell-feet-pics"]', 'color')).toBe('rgb(11, 87, 81)')
  expect(await css('.prose .table-scroll', 'border-radius')).toBe('14px')
  expect(await css('.prose hr', 'border-top-width')).toBe('1px')

  await page.screenshot({ path: SHOT('long-article-desktop'), fullPage: true })

  // Phone: nothing sticks out sideways, the table scrolls inside its own box.
  await page.setViewportSize({ width: 375, height: 812 })
  await page.reload()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBe(0)
  await expect(page.locator('details.toc-mobile')).toBeVisible()
  await page.screenshot({ path: SHOT('long-article-mobile'), fullPage: true })
  await ctx.close()
})

test('internal linking shows up in the SEO report and the sitemap', async ({ request }) => {
  await admin.goto('/admin/seo')
  const row = admin.getByTestId('seo-posts').getByRole('row', { name: /Photography Masterclass/ })
  await expect(row).toBeVisible()
  const cells = row.locator('td')
  await expect(cells.nth(2)).toHaveText('3') // links out: guide, pricing article, category
  await expect(cells.nth(4)).toHaveText('2') // external: Wikipedia + the affiliate link
  const pricing = admin.getByTestId('seo-posts').getByRole('row', { name: /How Much Should You Charge/ })
  await expect(pricing.locator('td').nth(3)).not.toHaveText('0') // now linked from the masterclass
  await expect(admin.getByTestId('broken-links')).toHaveCount(0)
  await admin.screenshot({ path: SHOT('admin-seo-report'), fullPage: true })

  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain(`/blog/${SLUG}</loc>`)
  expect(sitemap).toMatch(/<image:loc>[^<]*niche-red-pedicure[^<]*<\/image:loc>/)
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Disallow: /blog?q=')
})
