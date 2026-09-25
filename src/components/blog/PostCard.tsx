import Link from 'next/link'
import { LogoMark } from '@/components/site/LogoMark'
import { postSummary, type Post } from '@/lib/posts'
import { formatDate, readingMinutes } from '@/lib/utils'

function Thumb({ post, eager = false }: { post: Post; eager?: boolean }) {
  return (
    <div className="thumb">
      {post.cover_image ? (
        <img src={post.cover_image} alt={post.cover_alt || post.title} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      ) : (
        <div className="thumb-fallback">
          <LogoMark className="" />
        </div>
      )}
    </div>
  )
}

function Meta({ post }: { post: Post }) {
  return (
    <div className="post-meta">
      {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>}
      <span aria-hidden="true">·</span>
      <span>{readingMinutes(post.content)} min read</span>
    </div>
  )
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card">
      <Thumb post={post} />
      <div className="body">
        {post.category_name && <span className="tag">{post.category_name}</span>}
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{postSummary(post)}</p>
        <Meta post={post} />
      </div>
    </article>
  )
}

export function PostFeature({ post }: { post: Post }) {
  return (
    <article className="post-feature">
      <Thumb post={post} eager />
      <div className="body">
        <span className="tag">Featured{post.category_name ? ` · ${post.category_name}` : ''}</span>
        <h2>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{postSummary(post, 220)}</p>
        <Meta post={post} />
      </div>
    </article>
  )
}

/** Horizontal row (image left, text right) used for blog listings. */
export function PostRow({ post }: { post: Post }) {
  return (
    <article className="post-row">
      <Thumb post={post} />
      <div className="body">
        {post.category_name && <span className="tag">{post.category_name}</span>}
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{postSummary(post, 170)}</p>
        <Meta post={post} />
      </div>
    </article>
  )
}

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="post-list">
      {posts.map((p) => (
        <PostRow key={p.id} post={p} />
      ))}
    </div>
  )
}

export function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="post-grid">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  )
}
