import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EntryEditor } from '@/components/admin/EntryEditor'
import { param } from '@/components/admin/Flash'
import { requireAdmin } from '@/lib/auth'
import { listCategories } from '@/lib/categories'
import { postToEntry } from '@/lib/editor-entries'
import { getPostById } from '@/lib/posts'
import { deletePostAction, savePostAction } from '../actions'

export const metadata: Metadata = { title: 'Edit post' }

const CREATED: Record<string, string> = {
  draft: 'Draft created. Keep writing, then publish when it’s ready.',
  published: 'Post published! It is now live on the blog.',
  scheduled: 'Post scheduled. It will go live at the publish date.',
}

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditPostPage({ params, searchParams }: Props) {
  await requireAdmin()
  const { id } = await params
  const post = getPostById(Number(id))
  if (!post) notFound()
  const created = param((await searchParams).created)
  const categories = listCategories().map((c) => ({ id: c.id, name: c.name }))

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Edit post</h1>
          <p><Link href="/admin/posts">← All posts</Link></p>
        </div>
        <Link className="btn btn-plain" href="/admin/posts/new">New post</Link>
      </div>
      <EntryEditor
        key={post.id}
        initial={postToEntry(post)}
        categories={categories}
        saveAction={savePostAction}
        deleteAction={deletePostAction}
        flash={CREATED[created]}
      />
    </>
  )
}
