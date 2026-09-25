import Link from 'next/link'
import { IconTile } from '@/components/site/icons'
import { Breadcrumb, CheckList, CtaButton, JsonLd } from '@/components/site/ui'
import { breadcrumbLd, buildMetadata } from '@/lib/seo'
import { absoluteUrl, SITE } from '@/lib/site'

export const metadata = buildMetadata({
  title: 'About FunWithFeet.net — Independent Guides for Feet Pic Sellers',
  description:
    'Who we are, how we research our guides, how the site is funded, and the editorial standards behind every FunWithFeet.net article.',
  path: '/about',
})

const aboutLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About FunWithFeet.net',
  url: absoluteUrl('/about'),
  about: { '@type': 'Organization', name: SITE.brand, url: absoluteUrl('/'), logo: absoluteUrl(SITE.logo) },
}

export default function AboutPage() {
  return (
    <main id="top">
      <JsonLd data={aboutLd} />
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])} />

      <section className="hero">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'About' }]} />
          <p className="eyebrow">About Us</p>
          <h1>
            An Independent Guide to Selling Feet Pics <mark>Safely</mark>
          </h1>
          <p className="lead">
            FunWithFeet.net exists for one reason: most advice about selling feet pics is either hype or guesswork. We write
            clear, honest guides that put your privacy and safety first — and tell you what to realistically expect.
          </p>
          <div className="hero-stats">
            <div><strong>Safety First</strong><span>Every guide starts with privacy and scam protection.</span></div>
            <div><strong>No Hype</strong><span>Price ranges, not promises. Earnings are never guaranteed.</span></div>
            <div><strong>Adults Only</strong><span>Written for creators and buyers aged 18 and over.</span></div>
          </div>
        </div>
      </section>

      <section id="what-we-do">
        <div className="wrap">
          <p className="eyebrow">What We Do</p>
          <h2>Practical Guides, Written for Real Sellers</h2>
          <p className="lead">We cover the questions new sellers actually ask — from the first photo to the first payout.</p>
          <div className="grid grid-3 grid-bordered mt-30">
            <article className="cell"><IconTile name="book" /><h3>Step-by-Step Guides</h3><p>Setting up an anonymous profile, taking photos that sell, pricing sets and getting paid through the platform.</p></article>
            <article className="cell"><IconTile name="shieldCheck" /><h3>Safety &amp; Privacy</h3><p>How to stay anonymous, spot the common scams early and keep every conversation and payment on-platform.</p></article>
            <article className="cell"><IconTile name="tag" /><h3>Honest Numbers</h3><p>Realistic price ranges based on what sellers commonly report — clearly labelled as estimates, never promises.</p></article>
          </div>
        </div>
      </section>

      <section className="alt" id="standards">
        <div className="wrap">
          <p className="eyebrow">Editorial Standards</p>
          <h2>How We Research and Write Every Article</h2>
          <p className="lead">Our guides follow the same rules whether or not a link on the page earns us a commission.</p>
          <div className="grid grid-2 gap-40 mt-28">
            <CheckList
              items={[
                <><strong>Safety over conversions</strong> — we never recommend a shortcut we consider unsafe, even if it would sell more.</>,
                <><strong>Estimates, clearly labelled</strong> — prices and earnings are shown as ranges with plain-language caveats.</>,
                <><strong>Checked against platform rules</strong> — we confirm fees, verification and payout terms before writing about them.</>,
              ]}
            />
            <CheckList
              items={[
                <><strong>Kept up to date</strong> — articles show when they were last updated, and we revise them when things change.</>,
                <><strong>Not legal or tax advice</strong> — we explain the basics and point you to qualified professionals for your situation.</>,
                <><strong>Corrections welcome</strong> — spot something wrong? <Link href="/contact">Tell us</Link> and we will review it.</>,
              ]}
            />
          </div>
        </div>
      </section>

      <section className="teal" id="funding">
        <div className="wrap">
          <p className="eyebrow">How We&apos;re Funded</p>
          <h2>Transparent About Affiliate Links</h2>
          <p className="lead">
            Some buttons on this site are affiliate links. If you sign up through one, we may earn a commission at no extra
            cost to you. That is how we pay for hosting and research — and it never changes our safety advice.
          </p>
          <p>
            We are not officially affiliated with Fun With Feet or any marketplace unless we clearly say so. Read our full{' '}
            <Link href="/disclaimer">affiliate disclosure</Link>.
          </p>
        </div>
      </section>

      <section id="start-here">
        <div className="wrap">
          <p className="eyebrow">Start Here</p>
          <h2>Our Most Useful Guides</h2>
          <div className="grid grid-3 grid-bordered mt-28">
            <article className="cell"><h3><Link href="/how-to-sell-feet-pics">How to Sell Feet Pics</Link></h3><p>The complete 2026 walkthrough: platforms, photos, pricing, safety, legal and tax basics.</p></article>
            <article className="cell"><h3><Link href="/sell-feet-pics">Sell Feet Pics Online</Link></h3><p>Staying anonymous, what to charge, and the five steps from first photo to first payout.</p></article>
            <article className="cell"><h3><Link href="/blog">The Blog</Link></h3><p>Shorter guides on scams, pricing, photography and growing a loyal base of repeat buyers.</p></article>
          </div>
        </div>
      </section>

      <section id="final-cta">
        <div className="wrap">
          <div className="cta-band">
            <p className="eyebrow">Get In Touch</p>
            <h2>Questions, Corrections or Ideas?</h2>
            <p>We read every message. Use the contact form for feedback, corrections, partnership enquiries or privacy requests.</p>
            <div className="hero-cta mt-22">
              <Link className="btn" href="/contact">Contact Us</Link>
              <CtaButton className="btn-dark">Start Selling Feet Pics</CtaButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
