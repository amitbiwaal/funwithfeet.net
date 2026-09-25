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

This changes the local database. For the live site, run it with the live database's `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` set in your shell.

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

The CMS uses **SQLite** through the libSQL client:

- **Live site:** a hosted [Turso](https://turso.tech) database (`TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`). Uploaded images go to **Vercel Blob** under `uploads/`.
- **Local development and tests:** without `TURSO_DATABASE_URL`, a single file at `DATA_DIR/cms.db` (default `./data/cms.db`), with uploaded images in `DATA_DIR/uploads/`.

Either way, images are served from `/uploads/…` on the site's own domain, so links in articles don't depend on where the files are stored.

| Table | Holds |
|---|---|
| `posts` | blog articles: content, status, publish date, SEO fields, cover, category, tags |
| `pages` | CMS pages (Privacy, Terms, Disclaimer, …) |
| `categories` | blog categories |
| `media` | uploaded image records (file, size, dimensions, alt text) |
| `messages` | contact-form submissions |
| `users`, `sessions` | admin accounts and sign-in sessions |

- The schema is created and upgraded automatically on first use (see `MIGRATIONS` in `src/lib/db.ts`; applied versions are recorded in `schema_migrations`).
- **Backup:** for the live database, use Turso's dashboard or CLI (point-in-time restore depends on your Turso plan). Locally, copy the whole `DATA_DIR` folder.
- SQLite easily handles a content site of this size, including thousands of posts and heavy read traffic.

## Project layout

```
src/app/(site)/        public pages (landing pages, blog, about, contact, CMS pages)
src/app/admin/         admin panel (login + (panel) routes and Server Actions)
src/app/api/admin/     upload + media-list endpoints for the editor
src/app/uploads/       serves uploaded images from Vercel Blob or DATA_DIR
src/app/sitemap.ts     robots.ts, feed.xml/, llms.txt/ — generated from the database
src/components/        site/, blog/, admin/ (TipTap editor, media picker, forms)
src/lib/               db (Turso / local SQLite + migrations), auth, posts, pages, media, content sanitizer, SEO
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

### Vercel

Vercel has no persistent disk, so the live site keeps its database in Turso and its images in Vercel Blob.

1. Import the GitHub repository in Vercel. The Next.js defaults are fine.
2. **Database:** add Turso to the project (Vercel → Storage, or create a database at turso.tech). The project needs `TURSO_DATABASE_URL` (`libsql://…`) and `TURSO_AUTH_TOKEN`. If the integration adds them under a prefix, rename them. Choose the location closest to your Vercel Functions region (by default Washington, D.C., which is AWS `us-east-1`).
3. **Images:** Vercel → Storage → create a **Blob** store and connect it to the project. Vercel adds the credentials. If you create a *private* store, also set `BLOB_ACCESS=private`.
4. **Admin account:** set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in Settings → Environment Variables **before the first visit**. The first request creates the tables, this admin, and the starter content.
5. Redeploy. Environment variable changes only apply to new deployments.

If the database variables are missing, every page fails and the function logs say `TURSO_DATABASE_URL is not set`.

Uploads are limited to 4 MB per image because Vercel rejects larger request bodies.

### A server with a disk

On a VPS (for example Hostinger, DigitalOcean or Hetzner), or Railway or Render with a volume, you can skip Turso and Blob and keep everything in `DATA_DIR`:

```bash
npm ci
npm run build
DATA_DIR=/var/lib/funwithfeet ADMIN_EMAIL=... ADMIN_PASSWORD=... npm start   # port 3000; use -p to change
```

- Put it behind nginx or Caddy with HTTPS. Session cookies are `Secure` in production.
- Back up `DATA_DIR`: `cms.db` holds the content and `uploads/` holds the images.
- With several server instances, set `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (see the Next.js self-hosting docs).
