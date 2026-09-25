import { all, get, run } from './db'
import { nowIso, slugify, stripHtml, truncate } from './utils'

export type PostStatus = 'draft' | 'published'

export type Post = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  cover_alt: string
  category_id: number | null
  category_name: string | null
  category_slug: string | null
  tags: string
  status: PostStatus
  featured: number
  meta_title: string
  meta_description: string
  noindex: number
  author_name: string
  published_at: string | null
  created_at: string
  updated_at: string
}

export type PostInput = {
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  cover_alt: string
  category_id: number | null
  tags: string
  status: PostStatus
  featured: boolean
  meta_title: string
  meta_description: string
  noindex: boolean
  author_name: string
  published_at: string | null
}

const SELECT = `
  SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM posts p
    LEFT JOIN categories c ON c.id = p.category_id`

const LIVE = `p.status = 'published' AND p.published_at IS NOT NULL AND p.published_at <= @now`

/** Published and not scheduled for the future. */
export function isLive(post: Pick<Post, 'status' | 'published_at'>): boolean {
  return post.status === 'published' && !!post.published_at && post.published_at <= nowIso()
}

export async function listLivePosts(opts: { limit?: number; offset?: number; categoryId?: number; q?: string; excludeId?: number } = {}) {
  const where = [LIVE]
  const params: Record<string, unknown> = { now: nowIso(), limit: opts.limit ?? 12, offset: opts.offset ?? 0 }
  if (opts.categoryId) {
    where.push('p.category_id = @categoryId')
    params.categoryId = opts.categoryId
  }
  if (opts.excludeId) {
    where.push('p.id != @excludeId')
    params.excludeId = opts.excludeId
  }
  if (opts.q) {
    where.push(`(p.title LIKE @q ESCAPE '\\' OR p.excerpt LIKE @q ESCAPE '\\' OR p.content LIKE @q ESCAPE '\\' OR p.tags LIKE @q ESCAPE '\\')`)
    params.q = `%${opts.q.replace(/[\\%_]/g, (m) => `\\${m}`)}%`
  }
  const whereSql = where.join(' AND ')
  const [posts, count] = await Promise.all([
    all<Post>(`${SELECT} WHERE ${whereSql} ORDER BY p.published_at DESC LIMIT @limit OFFSET @offset`, params),
    get<{ total: number }>(`SELECT COUNT(*) AS total FROM posts p WHERE ${whereSql}`, params),
  ])
  return { posts, total: count?.total ?? 0 }
}

export async function getFeaturedPost(): Promise<Post | undefined> {
  return get<Post>(`${SELECT} WHERE ${LIVE} AND p.featured = 1 ORDER BY p.published_at DESC LIMIT 1`, { now: nowIso() })
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return get<Post>(`${SELECT} WHERE p.slug = ?`, [slug])
}

export async function getPostById(id: number): Promise<Post | undefined> {
  return get<Post>(`${SELECT} WHERE p.id = ?`, [id])
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const now = nowIso()
  const sameCategory = post.category_id
    ? await all<Post>(
        `${SELECT} WHERE ${LIVE} AND p.category_id = @cat AND p.id != @id ORDER BY p.published_at DESC LIMIT @limit`,
        { now, cat: post.category_id, id: post.id, limit },
      )
    : []
  if (sameCategory.length >= limit) return sameCategory
  const exclude = [post.id, ...sameCategory.map((p) => p.id)]
  const params: Record<string, unknown> = { now, limit: limit - sameCategory.length }
  exclude.forEach((id, i) => (params[`x${i}`] = id))
  const others = await all<Post>(
    `${SELECT} WHERE ${LIVE} AND p.id NOT IN (${exclude.map((_, i) => `@x${i}`).join(',')})
     ORDER BY p.published_at DESC LIMIT @limit`,
    params,
  )
  return [...sameCategory, ...others]
}

export type AdminPostFilter = 'all' | 'published' | 'draft' | 'scheduled'

export async function listPostsForAdmin(filter: AdminPostFilter = 'all', q = ''): Promise<Post[]> {
  const where: string[] = []
  const params: Record<string, unknown> = { now: nowIso() }
  if (filter === 'published') where.push(LIVE)
  if (filter === 'draft') where.push(`p.status = 'draft'`)
  if (filter === 'scheduled') where.push(`p.status = 'published' AND p.published_at > @now`)
  if (q) {
    where.push(`(p.title LIKE @q OR p.slug LIKE @q)`)
    params.q = `%${q}%`
  }
  return all<Post>(`${SELECT} ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY p.updated_at DESC`, params)
}

type PostCounts = { total: number; published: number | null; drafts: number | null; scheduled: number | null }

export async function postCounts(): Promise<PostCounts> {
  const row = await get<PostCounts>(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN status = 'published' AND published_at <= @now THEN 1 ELSE 0 END) AS published,
       SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS drafts,
       SUM(CASE WHEN status = 'published' AND published_at > @now THEN 1 ELSE 0 END) AS scheduled
     FROM posts`,
    { now: nowIso() },
  )
  return row ?? { total: 0, published: null, drafts: null, scheduled: null }
}

/** A slug that is not used by any other post. */
export async function uniquePostSlug(wanted: string, excludeId?: number): Promise<string> {
  const base = slugify(wanted) || 'post'
  let slug = base
  let n = 2
  while (await get('SELECT id FROM posts WHERE slug = ? AND id != ?', [slug, excludeId ?? -1])) slug = `${base}-${n++}`
  return slug
}

function toRow(input: PostInput) {
  return {
    ...input,
    featured: input.featured ? 1 : 0,
    noindex: input.noindex ? 1 : 0,
  }
}

export async function createPost(input: PostInput): Promise<number> {
  const res = await run(
    `INSERT INTO posts (title, slug, excerpt, content, cover_image, cover_alt, category_id, tags, status, featured,
                        meta_title, meta_description, noindex, author_name, published_at)
     VALUES (@title, @slug, @excerpt, @content, @cover_image, @cover_alt, @category_id, @tags, @status, @featured,
             @meta_title, @meta_description, @noindex, @author_name, @published_at)`,
    toRow(input),
  )
  return res.lastInsertRowid
}

export async function updatePost(id: number, input: PostInput) {
  await run(
    `UPDATE posts SET title = @title, slug = @slug, excerpt = @excerpt, content = @content,
            cover_image = @cover_image, cover_alt = @cover_alt, category_id = @category_id, tags = @tags,
            status = @status, featured = @featured, meta_title = @meta_title,
            meta_description = @meta_description, noindex = @noindex, author_name = @author_name,
            published_at = @published_at, updated_at = @updated_at
      WHERE id = @id`,
    { ...toRow(input), id, updated_at: nowIso() },
  )
}

export async function deletePost(id: number) {
  await run('DELETE FROM posts WHERE id = ?', [id])
}

export async function listAllLiveForSitemap() {
  return all<{
    slug: string
    updated_at: string
    published_at: string
    noindex: number
    cover_image: string
    content: string
  }>(
    `SELECT slug, updated_at, published_at, noindex, cover_image, content FROM posts p WHERE ${LIVE} ORDER BY p.published_at DESC`,
    { now: nowIso() },
  )
}

/** Short plain-text summary: the excerpt, or the start of the article body. */
export function postSummary(post: Pick<Post, 'excerpt' | 'content'>, max = 150): string {
  return truncate(post.excerpt || stripHtml(post.content), max)
}

/** The live posts published just before and just after this one (for previous/next links). */
export async function getAdjacentPosts(post: Post): Promise<{ older?: Post; newer?: Post }> {
  if (!post.published_at) return {}
  const params = { now: nowIso(), pub: post.published_at, id: post.id }
  const [older, newer] = await Promise.all([
    get<Post>(
      `${SELECT} WHERE ${LIVE} AND (p.published_at < @pub OR (p.published_at = @pub AND p.id < @id))
       ORDER BY p.published_at DESC, p.id DESC LIMIT 1`,
      params,
    ),
    get<Post>(
      `${SELECT} WHERE ${LIVE} AND (p.published_at > @pub OR (p.published_at = @pub AND p.id > @id))
       ORDER BY p.published_at ASC, p.id ASC LIMIT 1`,
      params,
    ),
  ])
  return { older, newer }
}
