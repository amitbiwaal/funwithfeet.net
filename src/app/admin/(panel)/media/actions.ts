'use server'

import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { str } from '@/lib/editor-entries'
import { deleteMedia, updateMediaAlt } from '@/lib/media'

export async function deleteMediaAction(fd: FormData) {
  await requireAdmin()
  const id = Number(fd.get('id'))
  if (id) await deleteMedia(id)
  redirect('/admin/media?saved=deleted')
}

export async function updateMediaAltAction(fd: FormData) {
  await requireAdmin()
  const id = Number(fd.get('id'))
  if (id) await updateMediaAlt(id, str(fd, 'alt', 200))
  redirect('/admin/media?saved=alt')
}
