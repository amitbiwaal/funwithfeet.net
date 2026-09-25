import type { Metadata } from 'next'
import Link from 'next/link'
import { Flash, param } from '@/components/admin/Flash'
import { ConfirmButton } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'
import { listCategories } from '@/lib/categories'
import { deleteCategoryAction, saveCategoryAction } from './actions'

export const metadata: Metadata = { title: 'Categories' }

const SAVED: Record<string, string> = {
  created: 'Category created.',
  updated: 'Category updated.',
  deleted: 'Category deleted. Its posts are now uncategorised.',
}

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin()
  const sp = await searchParams
  const categories = await listCategories()
  const editing = categories.find((c) => c.id === Number(param(sp.edit)))

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Categories</h1>
          <p>Group blog posts by topic. Each category gets its own page at /blog/category/slug.</p>
        </div>
      </div>

      <Flash ok={SAVED[param(sp.saved)]} error={param(sp.error) || null} />

      <div className="adm-grid-side">
        <div className="adm-card">
          <h2>{editing ? `Edit “${editing.name}”` : 'Add a category'}</h2>
          <form className="adm-form" action={saveCategoryAction}>
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <div className="adm-field">
              <label htmlFor="cat-name">Name</label>
              <input id="cat-name" name="name" className="adm-input" required maxLength={60} defaultValue={editing?.name} key={`n${editing?.id}`} />
            </div>
            <div className="adm-field">
              <label htmlFor="cat-slug">Slug</label>
              <input id="cat-slug" name="slug" className="adm-input" maxLength={80} placeholder="auto from name" defaultValue={editing?.slug} key={`s${editing?.id}`} />
            </div>
            <div className="adm-field">
              <label htmlFor="cat-desc">Description</label>
              <textarea id="cat-desc" name="description" className="adm-textarea" maxLength={300} defaultValue={editing?.description} key={`d${editing?.id}`} />
              <p className="adm-hint">Shown on the category page and used as its meta description.</p>
            </div>
            <div className="adm-actions">
              <button className="btn btn-teal" type="submit">{editing ? 'Update category' : 'Add category'}</button>
              {editing && <Link className="btn btn-plain" href="/admin/categories">Cancel</Link>}
            </div>
          </form>
        </div>

        <div className="adm-table-wrap">
          {categories.length === 0 ? (
            <p className="adm-empty">No categories yet.</p>
          ) : (
            <table className="adm-table" data-testid="categories-table">
              <thead><tr><th>Name</th><th>Posts</th><th>Actions</th></tr></thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td className="title-cell">
                      <Link href={`/admin/categories?edit=${c.id}`}>{c.name}</Link>
                      <span className="sub">/blog/category/{c.slug}</span>
                    </td>
                    <td>{c.post_count} <span className="adm-hint">({c.live_count} live)</span></td>
                    <td>
                      <div className="adm-row-actions">
                        <Link className="btn btn-sm btn-plain" href={`/admin/categories?edit=${c.id}`}>Edit</Link>
                        <a className="btn btn-sm btn-plain" href={`/blog/category/${c.slug}`} target="_blank" rel="noopener">View</a>
                        <form action={deleteCategoryAction}>
                          <input type="hidden" name="id" value={c.id} />
                          <ConfirmButton message={`Delete the category “${c.name}”? Posts stay, but become uncategorised.`}>Delete</ConfirmButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
