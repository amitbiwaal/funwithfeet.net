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
export async function listLinkTargets(): Promise<LinkTarget[]> {
  const [live, published, cats] = await Promise.all([listLivePosts({ limit: 1000 }), listPublishedPages(), listCategories()])
  const posts = live.posts.map<LinkTarget>((p) => ({ title: p.title, path: `/blog/${p.slug}`, type: 'Post' }))
  const pages = published.map<LinkTarget>((p) => ({ title: p.title, path: `/${p.slug}`, type: 'Page' }))
  const categories = cats.map<LinkTarget>((c) => ({ title: `${c.name} (category)`, path: `/blog/category/${c.slug}`, type: 'Category' }))
  return [...LANDING_PAGES, ...posts, ...pages, ...categories]
}
