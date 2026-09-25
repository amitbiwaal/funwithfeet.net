/** Shape shared by the admin editor (client) and its Server Actions. No server imports here. */
export type EntryKind = 'post' | 'page'

export type EditorEntry = {
  id: number | null
  kind: EntryKind
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string
  cover_alt: string
  category_id: number | null
  tags: string
  featured: boolean
  status: 'draft' | 'published'
  meta_title: string
  meta_description: string
  noindex: boolean
  author_name: string
  published_at: string | null
  updated_at: string | null
  /** Published and not scheduled in the future. */
  live: boolean
  /** Public URL path, e.g. /blog/my-post */
  publicPath: string | null
}

export type SaveResult = { ok: boolean; message?: string; error?: string; entry?: EditorEntry }

export function emptyEntry(kind: EntryKind): EditorEntry {
  return {
    id: null,
    kind,
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    cover_alt: '',
    category_id: null,
    tags: '',
    featured: false,
    status: 'draft',
    meta_title: '',
    meta_description: '',
    noindex: false,
    author_name: '',
    published_at: null,
    updated_at: null,
    live: false,
    publicPath: null,
  }
}
