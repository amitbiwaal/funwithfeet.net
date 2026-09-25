'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { deleteMessage, setMessageRead } from '@/lib/messages'

export async function toggleReadAction(fd: FormData) {
  await requireAdmin()
  const id = Number(fd.get('id'))
  if (id) await setMessageRead(id, fd.get('read') === '1')
  revalidatePath('/admin', 'layout')
}

export async function deleteMessageAction(fd: FormData) {
  await requireAdmin()
  const id = Number(fd.get('id'))
  if (id) await deleteMessage(id)
  revalidatePath('/admin', 'layout')
}
