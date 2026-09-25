import Link from 'next/link'

export function NotFoundContent() {
  return (
    <main id="top">
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">Error 404</p>
          <h1>
            This Page Took a <mark>Wrong Step</mark>
          </h1>
          <p className="lead">
            The page you&apos;re looking for doesn&apos;t exist or has moved. Try one of these instead — or search the blog.
          </p>
          <form className="search-form" action="/blog" method="get" role="search">
            <label htmlFor="nf-search" className="visually-hidden">Search articles</label>
            <input id="nf-search" type="search" name="q" placeholder="Search articles…" maxLength={80} />
            <button type="submit">Search</button>
          </form>
          <div className="hero-cta mt-30">
            <Link className="btn" href="/">Back to Home</Link>
            <Link className="btn btn-ghost" href="/how-to-sell-feet-pics">How to Sell Feet Pics</Link>
            <Link className="btn btn-ghost" href="/blog">Read the Blog</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
