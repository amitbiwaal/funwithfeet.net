# FunWithFeet.net

The FunWithFeet.net website: Next.js 16 (App Router), React 19 and TypeScript, with a built-in CMS for the blog and simple pages.

- **Public site**: Home, How to Sell Feet Pics, Sell Feet Pics, Blog (index, categories, search, articles), About, Contact, and CMS pages (Privacy Policy, Terms, Affiliate Disclosure), all in the original flat teal/coral design.
- **Admin / CMS** at `/admin`: dashboard, posts (rich-text editor, drafts, scheduling, SEO fields, cover images), pages, categories, media library, **SEO & Links report**, contact-form inbox, account.
- **SEO**: per-page meta, Open Graph, JSON-LD (FAQ, HowTo, Article, BlogPosting, Breadcrumb), sitemap, robots, RSS feed and `llms.txt`. The sitemap, RSS feed and `llms.txt` update automatically when you publish.

## Quick start

```bash
npm install
cp .env.example .env.local   # then set ADMIN_EMAIL and ADMIN_PASSWORD
npm run dev                  # http://localhost:3000
```

On the first run, the app creates the database in `./data/` with:
- the admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- four starter categories and the three legal pages
- two starter blog articles (skip them with `SEED_DEMO_CONTENT=false`)

Sign in at **http://localhost:3000/admin**.

Forgot the password? Run:

```bash
npm run admin:create -- admin@funwithfeet.net "a-new-long-password"
```

## Writing a blog post

1. **Admin → New Post**. Add a title; the URL slug fills in automatically.
2. Write with the toolbar: headings (H2/H3/H4), bold, italic, underline, strikethrough, inline code, bullet/numbered lists (Tab nests a list), quotes, code blocks, dividers, tables, images and links. **HTML** switches to source view.
   - **Internal links:** the link dialog lists every guide, post, page and category. Search, click, done.
   - **Affiliate links:** one click on **Use the affiliate link** adds the link with `rel="sponsored"`.
   - Images keep their width/height, so the page does not jump while they load.
3. In the sidebar, set the cover image, category, tags, excerpt, and the SEO title and description. A Google preview shows how it will look in search.
4. **Save draft** (use the Preview link to check it privately), then **Publish**. To schedule, set a future publish date and click **Schedule**.
5. **Ctrl+S** saves. Leaving the page with unsaved changes shows a warning.

Longer articles automatically get a table of contents, a mid-article call-to-action, an author box, previous/next article links and related posts.

## SEO & internal linking

- **Admin → SEO & Links** checks every post and page: internal links out, links in from other articles (to find orphans), broken internal links (to deleted, draft or scheduled posts), thin content, missing H2, meta description, excerpt, cover image, alt text, and title length.
- `sitemap.xml` lists every live post, category and page, with image entries. Noindex content is left out.
- `robots.txt` blocks `/admin`, `/api/` and internal search results (`/blog?q=`).
- Structured data: WebSite, Organization and FAQ (home); Article, HowTo and FAQ (guides); BlogPosting and Breadcrumb (articles); Blog (blog index); CollectionPage (categories).
- Other signals: canonical URLs, Open Graph and Twitter tags, an RSS feed, and `llms.txt` for AI search engines.

## Database

The CMS uses **SQLite**: a single file at `DATA_DIR/cms.db` (default `./data/cms.db`). Uploaded images are saved in `DATA_DIR/uploads/`.

| Table | Holds |
|---|---|
| `posts` | blog articles: content, status, publish date, SEO fields, cover, category, tags |
| `pages` | CMS pages (Privacy, Terms, Disclaimer, …) |
| `categories` | blog categories |
| `media` | uploaded image records (file, size, dimensions, alt text) |
| `messages` | contact-form submissions |
| `users`, `sessions` | admin accounts and sign-in sessions |

- The schema is created and upgraded automatically on start (see `MIGRATIONS` in `src/lib/db.ts`).
- **Backup:** copy the whole `DATA_DIR` folder, for example with a nightly cron job.
- SQLite easily handles a content site of this size, including thousands of posts and heavy read traffic.
- **When to move to Postgres:** only if you need several servers or a serverless host. All database code lives in `src/lib/*.ts`, so the change stays contained.

## Project layout

```
src/app/(site)/        public pages (landing pages, blog, about, contact, CMS pages)
src/app/admin/         admin panel (login + (panel) routes and Server Actions)
src/app/api/admin/     upload + media-list endpoints for the editor
src/app/uploads/       serves uploaded images from DATA_DIR
src/app/sitemap.ts     robots.ts, feed.xml/, llms.txt/ — generated from the database
src/components/        site/, blog/, admin/ (TipTap editor, media picker, forms)
src/lib/               db (SQLite + migrations), auth, posts, pages, media, content sanitizer, SEO
src/proxy.ts           redirects signed-out visitors away from /admin
e2e/                   Playwright end-to-end tests
_legacy-static/        the original static HTML, kept for reference (not served)
```

Site-wide settings (affiliate link, brand name, disclaimer, Search Console verification) live in `src/lib/site.ts`.

## Tests

```bash
npm run test:e2e        # production build (into .next-e2e) + all Playwright tests
npm run test:e2e:headed # same, with a visible browser
npx playwright show-report
```

`e2e/long-article.spec.ts` writes a 1,000+ word article that uses every formatting option, publishes it, and checks that each element renders and is styled correctly on desktop and mobile. To publish that article into your own running site, run:

```bash
E2E_BASE_URL=http://localhost:3000 E2E_ADMIN_EMAIL=you@example.com E2E_ADMIN_PASSWORD='…' npx playwright test long-article
```

Only run the `long-article` spec this way. The other specs create and delete test content.

The tests run against `next build` + `next start` on port 3100, using a separate database in `e2e/.data` that is wiped before each run. Your real content is never touched. The CMS test signs in, writes a complete article in the editor (headings, lists, a table, an image upload, internal and affiliate links, cover image, category, tags, SEO), then checks the article on the public site, the blog index, its category page, the home page, search, the sitemap, RSS and `llms.txt`. It then covers editing, unpublishing, scheduling, deleting, pages, categories, the media library, the contact inbox and signing out. Screenshots are saved to `e2e/screenshots/`.

Other checks: `npm run lint` and `npm run typecheck`.

## Deploying

The CMS stores its data in SQLite and uploaded files on disk, so it needs a **Node.js server with a persistent disk**: a VPS (for example Hostinger, DigitalOcean or Hetzner), Railway or Render with a volume, or similar.

```bash
npm ci
npm run build
DATA_DIR=/var/lib/funwithfeet ADMIN_EMAIL=... ADMIN_PASSWORD=... npm start   # port 3000; use -p to change
```

- Put it behind nginx or Caddy with HTTPS. Session cookies are `Secure` in production.
- Back up `DATA_DIR`: `cms.db` holds the content and `uploads/` holds the images.
- Serverless hosts such as Vercel have no persistent disk. To use one, move the database to a hosted service (for example Turso/libSQL or Postgres) and the uploads to object storage. Only `src/lib/db.ts` and `src/lib/media.ts` would need to change.
- With several server instances, set `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (see the Next.js self-hosting docs).
