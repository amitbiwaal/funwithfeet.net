import { listCategories } from './categories'
import { listPublishedPages } from './pages'
import { listLivePosts } from './posts'

export type LinkTarget = { title: string; path: string; type: 'Guide' | 'Post' | 'Page' | 'Category' }

/** Hand-built pages that always exist. */
export const LANDING_PAGES: LinkTarget[] = [
  { title: 'Home', path: '/', type: 'Guide' },
  { title: 'How to Sell Feet Pics — complete guide', path: '/how-to-sell-feet-pics', type: 'Guide' },
  { title: 'Sell Feet Pics Online', path: '/sell-feet-pics', type: 'Guide' },
  { title: 'Blog', path: '/blog', type: 'Guide' },
  { title: 'About', path: '/about', type: 'Guide' },
  { title: 'Contact', path: '/contact', type: 'Guide' },
]

/** Every public URL an editor can link to: landing pages, live posts, published pages, categories. */
export function listLinkTargets(): LinkTarget[] {
  const posts = listLivePosts({ limit: 1000 }).posts.map<LinkTarget>((p) => ({ title: p.title, path: `/blog/${p.slug}`, type: 'Post' }))
  const pages = listPublishedPages().map<LinkTarget>((p) => ({ title: p.title, path: `/${p.slug}`, type: 'Page' }))
  const categories = listCategories().map<LinkTarget>((c) => ({ title: `${c.name} (category)`, path: `/blog/category/${c.slug}`, type: 'Category' }))
  return [...LANDING_PAGES, ...posts, ...pages, ...categories]
}
