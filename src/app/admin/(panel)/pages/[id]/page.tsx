import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EntryEditor } from '@/components/admin/EntryEditor'
import { param } from '@/components/admin/Flash'
import { requireAdmin } from '@/lib/auth'
import { pageToEntry } from '@/lib/editor-entries'
import { getPageById } from '@/lib/pages'
import { deletePageAction, savePageAction } from '../actions'

export const metadata: Metadata = { title: 'Edit page' }

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function EditPagePage({ params, searchParams }: Props) {
  await requireAdmin()
  const { id } = await params
  const page = await getPageById(Number(id))
  if (!page) notFound()
  const created = param((await searchParams).created)

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Edit page</h1>
          <p><Link href="/admin/pages">← All pages</Link></p>
        </div>
      </div>
      <EntryEditor
        key={page.id}
        initial={pageToEntry(page)}
        saveAction={savePageAction}
        deleteAction={deletePageAction}
        flash={created === 'published' ? 'Page published.' : created ? 'Draft created.' : undefined}
      />
    </>
  )
}
