'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { getCategoryById } from '@/lib/categories'
import { sanitizeContent } from '@/lib/content'
import { cleanImageUrl, cleanIsoDate, postToEntry, str } from '@/lib/editor-entries'
import type { SaveResult } from '@/lib/editor-types'
import { createPost, deletePost, getPostById, isLive, uniquePostSlug, updatePost, type PostInput, type PostStatus } from '@/lib/posts'
import { formatDateTime, nowIso, parseTags, stripHtml } from '@/lib/utils'

type Intent = 'draft' | 'publish' | 'update' | 'unpublish'

export async function savePostAction(fd: FormData): Promise<SaveResult | undefined> {
  await requireAdmin()

  const id = Number(fd.get('id')) || null
  const intent = (['draft', 'publish', 'update', 'unpublish'].includes(String(fd.get('intent')))
    ? String(fd.get('intent'))
    : 'draft') as Intent

  const existing = id ? getPostById(id) : undefined
  if (id && !existing) return { ok: false, error: 'This post no longer exists.' }

  const title = str(fd, 'title', 200)
  if (!title) return { ok: false, error: 'Please add a title before saving.' }

  const content = sanitizeContent(String(fd.get('content') ?? ''))

  let status: PostStatus = existing?.status ?? 'draft'
  if (intent === 'publish') status = 'published'
  if (intent === 'draft' || intent === 'unpublish') status = 'draft'

  if (status === 'published' && stripHtml(content).length < 20) {
    return { ok: false, error: 'Write some content before publishing (at least a sentence).' }
  }

  let publishedAt = cleanIsoDate(str(fd, 'published_at', 40)) ?? existing?.published_at ?? null
  if (status === 'published' && !publishedAt) publishedAt = nowIso()

  const rawCategory = Number(fd.get('category_id')) || null
  const categoryId = rawCategory && getCategoryById(rawCategory) ? rawCategory : null

  const input: PostInput = {
    title,
    slug: uniquePostSlug(str(fd, 'slug', 120) || title, id ?? undefined),
    excerpt: str(fd, 'excerpt', 400),
    content,
    cover_image: cleanImageUrl(str(fd, 'cover_image', 500)),
    cover_alt: str(fd, 'cover_alt', 200),
    category_id: categoryId,
    tags: parseTags(str(fd, 'tags', 500)).join(', '),
    status,
    featured: fd.get('featured') === '1',
    meta_title: str(fd, 'meta_title', 120),
    meta_description: str(fd, 'meta_description', 300),
    noindex: fd.get('noindex') === '1',
    author_name: str(fd, 'author_name', 100),
    published_at: publishedAt,
  }

  if (!id) {
    const newId = createPost(input)
    revalidatePath('/', 'layout')
    const created = status === 'draft' ? 'draft' : isLive(input) ? 'published' : 'scheduled'
    redirect(`/admin/posts/${newId}?created=${created}`)
  }

  updatePost(id, input)
  revalidatePath('/', 'layout')

  const fresh = getPostById(id)!
  const entry = postToEntry(fresh)
  let message = 'Post updated.'
  if (intent === 'draft') message = 'Draft saved.'
  if (intent === 'unpublish') message = 'Post unpublished — it is now a draft and hidden from the site.'
  if (intent === 'publish') message = entry.live ? 'Post published! It is now live on the blog.' : `Post scheduled for ${formatDateTime(fresh.published_at)}.`
  if (intent === 'update' && status === 'published' && !entry.live) message = `Scheduled post updated (goes live ${formatDateTime(fresh.published_at)}).`
  return { ok: true, message, entry }
}

export async function deletePostAction(fd: FormData) {
  await requireAdmin()
  const id = Number(fd.get('id'))
  if (id) deletePost(id)
  revalidatePath('/', 'layout')
  redirect('/admin/posts?deleted=1')
}
