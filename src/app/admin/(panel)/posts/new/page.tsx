import type { Metadata } from 'next'
import Link from 'next/link'
import { EntryEditor } from '@/components/admin/EntryEditor'
import { requireAdmin } from '@/lib/auth'
import { listCategories } from '@/lib/categories'
import { emptyEntry } from '@/lib/editor-types'
import { savePostAction } from '../actions'

export const metadata: Metadata = { title: 'New post' }

export default async function NewPostPage() {
  await requireAdmin()
  const categories = listCategories().map((c) => ({ id: c.id, name: c.name }))
  return (
    <>
      <div className="adm-head">
        <div>
          <h1>New post</h1>
          <p><Link href="/admin/posts">← All posts</Link></p>
        </div>
      </div>
      <EntryEditor initial={emptyEntry('post')} categories={categories} saveAction={savePostAction} />
    </>
  )
}
