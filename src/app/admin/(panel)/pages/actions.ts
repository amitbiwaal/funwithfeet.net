'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { sanitizeContent } from '@/lib/content'
import { pageToEntry, str } from '@/lib/editor-entries'
import type { SaveResult } from '@/lib/editor-types'
import { createPage, deletePage, getPageById, uniquePageSlug, updatePage, type PageInput } from '@/lib/pages'

export async function savePageAction(fd: FormData): Promise<SaveResult | undefined> {
  await requireAdmin()

  const id = Number(fd.get('id')) || null
  const intent = String(fd.get('intent') ?? 'draft')
  const existing = id ? getPageById(id) : undefined
  if (id && !existing) return { ok: false, error: 'This page no longer exists.' }

  const title = str(fd, 'title', 200)
  if (!title) return { ok: false, error: 'Please add a title before saving.' }

  let status = existing?.status ?? 'draft'
  if (intent === 'publish') status = 'published'
  if (intent === 'draft' || intent === 'unpublish') status = 'draft'

  const input: PageInput = {
    title,
    slug: uniquePageSlug(str(fd, 'slug', 120) || title, id ?? undefined),
    content: sanitizeContent(String(fd.get('content') ?? '')),
    status,
    meta_title: str(fd, 'meta_title', 120),
    meta_description: str(fd, 'meta_description', 300),
    noindex: fd.get('noindex') === '1',
  }

  if (!id) {
    const newId = createPage(input)
    revalidatePath('/', 'layout')
    redirect(`/admin/pages/${newId}?created=${status}`)
  }

  updatePage(id, input)
  revalidatePath('/', 'layout')
  const entry = pageToEntry(getPageById(id)!)
  const message =
    intent === 'publish' ? 'Page published.' : intent === 'unpublish' ? 'Page unpublished — it is now a draft.' : intent === 'draft' ? 'Draft saved.' : 'Page updated.'
  return { ok: true, message, entry }
}

export async function deletePageAction(fd: FormData) {
  await requireAdmin()
  const id = Number(fd.get('id'))
  if (id) deletePage(id)
  revalidatePath('/', 'layout')
  redirect('/admin/pages?deleted=1')
}
