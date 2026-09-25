'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createCategory, deleteCategory, getCategoryById, uniqueCategorySlug, updateCategory } from '@/lib/categories'
import { str } from '@/lib/editor-entries'

export async function saveCategoryAction(fd: FormData) {
  await requireAdmin()
  const id = Number(fd.get('id')) || null
  const name = str(fd, 'name', 60)
  if (!name) redirect(`/admin/categories?${id ? `edit=${id}&` : ''}error=${encodeURIComponent('Please enter a category name.')}`)
  if (id && !getCategoryById(id)) redirect('/admin/categories')

  const input = {
    name,
    slug: uniqueCategorySlug(str(fd, 'slug', 80) || name, id ?? undefined),
    description: str(fd, 'description', 300),
  }
  if (id) updateCategory(id, input)
  else createCategory(input)

  revalidatePath('/', 'layout')
  redirect(`/admin/categories?saved=${id ? 'updated' : 'created'}`)
}

export async function deleteCategoryAction(fd: FormData) {
  await requireAdmin()
  const id = Number(fd.get('id'))
  if (id) deleteCategory(id)
  revalidatePath('/', 'layout')
  redirect('/admin/categories?saved=deleted')
}
