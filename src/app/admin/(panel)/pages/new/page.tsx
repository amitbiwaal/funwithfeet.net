import type { Metadata } from 'next'
import Link from 'next/link'
import { EntryEditor } from '@/components/admin/EntryEditor'
import { requireAdmin } from '@/lib/auth'
import { emptyEntry } from '@/lib/editor-types'
import { savePageAction } from '../actions'

export const metadata: Metadata = { title: 'New page' }

export default async function NewPagePage() {
  await requireAdmin()
  return (
    <>
      <div className="adm-head">
        <div>
          <h1>New page</h1>
          <p><Link href="/admin/pages">← All pages</Link></p>
        </div>
      </div>
      <EntryEditor initial={emptyEntry('page')} saveAction={savePageAction} />
    </>
  )
}
