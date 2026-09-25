import { Icon } from '@/components/site/icons'
import { Breadcrumb, CheckList, CtaButton, FaqList, faqLd, JsonLd, type FaqItem } from '@/components/site/ui'
import { breadcrumbLd, buildMetadata, PUBLISHER_LD } from '@/lib/seo'
import { absoluteUrl, SITE } from '@/lib/site'

export const metadata = buildMetadata({
  title: 'How to Sell Feet Pics: 2026 Master Guide | Fun With Feet',
  description:
    'How to sell feet pics online step by step: pick a platform, take photos that sell, price them right, and get paid weekly — while keeping your identity private.',
  keywords:
    'how to sell feet pics, how to sell feet pictures online, sell feet pics for beginners, start selling feet pics, feet pics niches, how much to charge for feet pics, sell feet pics anonymously, sell feet pics usa uk australia canada',
  path: '/how-to-sell-feet-pics',
  type: 'article',
  twitterDescription:
    'Pick a platform, take photos that sell, price them right, and get paid weekly — while keeping your identity private.',
})

const STEPS = [
  { title: 'Create a free, anonymous profile', text: 'Sign up with a creator name and a separate email. No real name, no face required — just a bio and a few categories.', ld: 'Sign up with a creator name and separate email; no real name or face required.' },
  { title: 'Upload your best content', text: 'Add clear, well-lit photos and sets. Post free previews to pull buyers in and price your premium content behind them.', ld: 'Add clear, well-lit photos and sets, with free previews in front of premium content.' },
  { title: 'Match with verified buyers', text: 'ID-verified buyers browse, message, and unlock your content. Discovery helps them find you even with zero following.', ld: 'ID-verified buyers browse, message, and unlock your content through built-in discovery.' },
  { title: 'Get paid fast and anonymously', text: 'Earnings build in your account and pay out to your bank. Buyers never see your identity, and you never see theirs.', ld: 'Earnings accumulate and pay out to your bank while your identity stays private.' },
]

const FAQ: FaqItem[] = [
  { q: 'Can you really make money selling feet pics?', a: "Yes, but it's a side hustle that rewards effort, not quick money. Most beginners earn modestly at first and some earn nothing, while consistent sellers who post regularly and market themselves often reach steady monthly income. Treating it like a small business is what makes the difference." },
  { q: 'How much do feet pics sell for?', a: 'Most single photos sell for around $5–$20+, sets for $15–$60, videos from $10–$100+, and customs at 2–3× your standard rate. Subscriptions ($10–$25/month) add recurring income. These are estimates — actual prices depend on quality, niche, and demand.' },
  { q: 'Where can I sell feet pics?', a: 'Sell on a dedicated, verified feet-content marketplace where buyers are already searching and payments are handled securely on-platform — that beats trading over social DMs. Look for verified buyers, built-in discovery, secure payouts, and privacy controls.' },
  { q: 'Can men or guys sell feet pics?', a: 'Yes. Men can absolutely sell feet pics — there\'s real buyer demand for male feet, and "male feet" is a recognized category. The setup and safety steps are the same regardless of gender.' },
  { q: 'How do I sell feet pics without getting scammed?', a: 'Follow one rule: payment first, content after, and never move off the platform. Ignore fake payment screenshots, "verification fee" requests, and pressure to use Cash App or Telegram. Use the platform\'s payment system and report red flags.' },
  { q: 'How do I sell feet pics anonymously?', a: 'Use a creator name (never your real one), keep your face out of shots, remove identifying background details, strip photo metadata, and watermark previews. Keep a separate email and socials, and use geographic blocking where offered.' },
  { q: 'Can I sell feet pics for free, without a subscription?', a: "Many platforms let you create a seller profile for free and only take a cut when you make a sale, so there's no upfront cost to start. Always confirm a platform's current fees and payout terms before relying on them." },
  { q: 'Is it illegal to sell feet pics?', a: "For adults 18 and over selling their own foot photos, it's legal in the US, UK, and most countries — feet pictures aren't explicit content. You must be able to verify you're 18+, and the income is taxable." },
  { q: 'What kind of feet pics sell best?', a: 'Fresh pedicures, clean soles and arches, nylons and socks, feet in heels or sneakers, and themed or custom content tend to sell best. Pick one or two styles, do them well, and let a clear niche become your signature.' },
  { q: 'How do I get paid?', a: "Earnings accumulate in your account and pay out to your bank on the platform's schedule. Buyers pay through secure checkout and never see your identity, and purchases typically show a discreet descriptor on their statement." },
]

const NICHES = [
  { src: 'niche-red-pedicure.jpg', alt: 'Fresh red pedicure feet pic with neatly painted toenails', title: 'Fresh pedicures', text: 'Clean, painted nails with crisp color. Reliably one of the most-requested looks.' },
  { src: 'niche-soles-arches.jpg', alt: 'Close-up sole and arch feet pic, the most requested selling angle', title: 'Soles & arches', text: 'Overhead and low-angle shots that show off arches and clean soles.' },
  { src: 'niche-cozy-socks.jpg', alt: 'Feet in cozy knitted socks for a fully covered feet pic set', title: 'Nylons & socks', text: 'Sheer nylons, cozy socks, and slow reveals add texture buyers pay extra for.' },
  { src: 'niche-high-heels.jpg', alt: 'Feet in high heels for a footwear-themed feet pic set', title: 'Heels & shoes', text: 'Feet in heels, ballet flats, or sneakers — style plus feet widens your audience.' },
  { src: 'niche-beach-sand.jpg', alt: 'Feet in beach sand for a seasonal feet pic set', title: 'Themed & seasonal', text: 'Holiday themes, props, and jewelry give regulars a reason to keep buying.' },
  { src: 'niche-anklets-jewellery.jpg', alt: 'Feet wearing an anklet and toe ring for a custom feet pic request', title: 'Custom requests', text: 'Personalized poses and props are the highest-margin content you can offer.' },
]

const EARNINGS: Array<[string, string, string]> = [
  ['Single photo', '$5–$20+', 'Quality, exclusivity, personalization'],
  ['Photo set / bundle', '$15–$60', 'Number of photos, theme, effort'],
  ['Short video', '$10–$100+', 'Length and exclusivity'],
  ['Custom request', '2–3× standard rates', 'Specific poses, props, personalization'],
  ['Monthly subscription', '$10–$25 / mo', 'Consistency and extras for regulars'],
]

const graphLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How to Sell Feet Pics: 2026 Master Guide',
      description:
        'How to sell feet pics online step by step: pick a platform, take photos that sell, price them right, and get paid weekly — while keeping your identity private.',
      inLanguage: 'en',
      image: absoluteUrl(SITE.ogImage),
      author: { '@type': 'Organization', name: SITE.brand },
      publisher: PUBLISHER_LD,
      mainEntityOfPage: absoluteUrl('/how-to-sell-feet-pics'),
    },
    {
      '@type': 'HowTo',
      name: 'How to Sell Feet Pics in 4 Steps',
      step: STEPS.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.ld })),
    },
    { ...faqLd(FAQ), '@context': undefined },
  ],
}

export default function HowToSellPage() {
  return (
    <main id="top">
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'How to Sell Feet Pics', path: '/how-to-sell-feet-pics' }])} />
      <JsonLd data={graphLd} />

      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'How to Sell Feet Pics' }]} />
          <p className="eyebrow">The 2026 Guide</p>
          <h1>
            How to Sell <mark className="mark-text">Feet Pics</mark>
          </h1>
          <p className="lead">
            Learning how to sell feet pics is simpler than it looks: create an anonymous profile, upload a few good photos, set
            your prices, and get paid — all without showing your face or handing buyers your real details. This guide walks you
            through every step, from where to sell and what to charge to staying safe and anonymous.
          </p>
          <div className="hbadges">
            {['100% anonymous', 'Verified buyers only', 'Secure, discreet payouts', 'Free to join'].map((b) => (
              <span className="hbadge" key={b}>
                <Icon name="check" />
                {b}
              </span>
            ))}
          </div>
          <div className="hero-cta spaced">
            <CtaButton>Start Selling Now</CtaButton>
            <a className="btn btn-ghost btn-light" href="#steps">See the 4 steps</a>
          </div>
        </div>
      </section>

      {/* 4 STEPS */}
      <section id="steps">
        <div className="wrap">
          <p className="eyebrow">The Short Version</p>
          <h2>How to Sell Feet Pics in 4 Steps</h2>
          <p className="lead">The whole process comes down to four moves. None of them are complicated, and you can finish the setup in an afternoon.</p>
          <div className="stepcards">
            {STEPS.map((s, i) => (
              <article className="stepcard" key={s.title}>
                <span className="n">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
          <div className="actions mt-30"><CtaButton>Create your free profile</CtaButton></div>
        </div>
      </section>

      {/* WHAT YOU NEED */}
      <section className="alt" id="what-you-need">
        <div className="wrap">
          <p className="eyebrow">Before You Start</p>
          <h2>What You Actually Need to Start</h2>
          <p className="lead">You do not need professional gear or a big following. If you own a smartphone, you already have most of what it takes to start selling feet pics today.</p>
          <div className="panels">
            <article className="panel">
              <h3>The essentials</h3>
              <CheckList
                className="compact"
                items={[
                  <><strong>A phone camera.</strong> A modern phone shoots more than well enough — no DSLR needed.</>,
                  <><strong>Good light.</strong> Soft daylight near a window beats harsh flash every time.</>,
                  <><strong>A creator name.</strong> Never your real name — pick a pseudonym you&apos;ll use everywhere.</>,
                  <><strong>A verified platform.</strong> Somewhere buyers already are, with secure payments and ID checks.</>,
                  <><strong>A little patience.</strong> Sales build over weeks, not hours. Treat it like a small business.</>,
                ]}
              />
            </article>
            <article className="panel">
              <h3>A simple must-read checklist</h3>
              <CheckList
                className="compact"
                items={[
                  'Groom first — a quick pedicure and moisturized skin make a real difference on camera.',
                  'Shoot 10–15 varied photos so you launch with a full profile, not one lonely image.',
                  'Keep backgrounds clean and free of anything that identifies you.',
                  'Set a separate email and a dedicated social handle before you go live.',
                  'Review how your previews look while logged out.',
                ]}
              />
            </article>
          </div>
          <figure className="shot shot-wide">
            <img src="/assets/how-to-sell-feet-pics/feet-pic-lighting-setup.jpg" alt="Bare feet photographed in soft window daylight against a plain neutral background" width={1200} height={460} loading="lazy" />
            <figcaption>Soft daylight near a window and a clean, plain background — that is the whole setup.</figcaption>
          </figure>
        </div>
      </section>

      {/* WHERE TO SELL */}
      <section id="where-to-sell">
        <div className="wrap">
          <p className="eyebrow">Choosing a Platform</p>
          <h2>Where to Sell Feet Pics</h2>
          <div className="prose-block">
            <p className="lead">The single biggest decision is <em>where</em> to sell. You can trade with strangers over social DMs, but a dedicated, verified marketplace is safer and far more likely to make you money — because buyers are already there looking for exactly what you offer.</p>
            <p className="mt-16">When you&apos;re deciding where to sell feet pics, look for four things: a real base of verified buyers (not bots), built-in discovery so people can find you with no following, secure on-platform payments that protect both sides, and privacy controls that keep you anonymous. A platform that nails those matters far more than one that simply advertises the lowest fee.</p>
            <p>Fun With Feet is built around exactly that: verified buyers, anonymous profiles, secure checkout, and content protection — so beginners can start from zero and still get found. Whatever platform you pick, confirm its current fees, payout options, and verification in your dashboard before you rely on them, since terms can change.</p>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="alt" id="what-you-get">
        <div className="wrap">
          <p className="eyebrow">The Seller Advantage</p>
          <h2>What You Get on Fun With Feet</h2>
          <p className="lead">Everything here is built for the person doing the work — earning more, staying private, and getting found.</p>
          <div className="grid grid-3 grid-bordered grid-muted mt-30">
            <article className="cell"><h3>Higher earnings</h3><p>Keep the large majority of every sale, with no surprise cuts eating into your payouts.</p></article>
            <article className="cell"><h3>Full anonymity</h3><p>No face, no real name to buyers. You stay a creator persona from first upload to withdrawal.</p></article>
            <article className="cell"><h3>Verified buyers only</h3><p>Buyers are checked, so you&apos;re dealing with real, ready-to-pay people — not freeloaders and bots.</p></article>
            <article className="cell"><h3>Content protection</h3><p>Blurred previews and watermarking help stop your paid content from leaking.</p></article>
            <article className="cell"><h3>Discreet billing</h3><p>Purchases show a discreet descriptor on the buyer&apos;s statement, keeping every transaction private.</p></article>
            <article className="cell"><h3>No exclusivity</h3><p>Sell here and elsewhere. Keep every audience you build — your business stays yours.</p></article>
          </div>
        </div>
      </section>

      {/* MID CTA */}
      <section id="cta-1">
        <div className="wrap">
          <div className="cta-band center">
            <h2>The Photos Are Already on Your Phone</h2>
            <p>You don&apos;t need to buy anything or wait for the &quot;right&quot; moment. Set up a free, anonymous profile and turn photos you can already take into income.</p>
            <CtaButton>Start Selling Today</CtaButton>
          </div>
        </div>
      </section>

      {/* WHAT SELLS BEST */}
      <section className="alt" id="what-sells">
        <div className="wrap">
          <p className="eyebrow">Content That Converts</p>
          <h2>What Feet Pics Sell Best?</h2>
          <p className="lead">Buyers search by what they love, and sellers earn more when they lean into a clear style. These are the categories that consistently move on feet-content marketplaces.</p>
          <div className="gallery gallery-cards">
            {NICHES.map((n) => (
              <figure className="shotcard" key={n.src}>
                <img src={`/assets/how-to-sell-feet-pics/${n.src}`} alt={n.alt} width={800} height={600} loading="lazy" />
                <figcaption><h3>{n.title}</h3><p>{n.text}</p></figcaption>
              </figure>
            ))}
          </div>
          <div className="note">Tip: you don&apos;t have to do all of these. Pick one or two styles, do them well, and let a clear niche become your signature.</div>
        </div>
      </section>

      {/* PICK YOUR NICHE */}
      <section id="niche">
        <div className="wrap">
          <p className="eyebrow">Find Your Angle</p>
          <h2>Pick Your Niche</h2>
          <p className="lead">Buyers filter by category, so owning a niche helps the right people find you fast. Start with one that feels natural — you can always add more.</p>
          <div className="chips">
            {['Pedicure', 'Soles', 'Arches', 'High Heels', 'Ballet Flats', 'Nylons', 'Socks', 'Nail Polish', 'Athletic Feet', 'Beach Feet', 'Anklets & Toe Rings', 'Themed', 'Male Feet', 'Tattoos', 'Sneakers'].map((c) => (
              <span className="chip" key={c}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW MUCH CAN YOU EARN */}
      <section className="alt" id="earnings">
        <div className="wrap">
          <p className="eyebrow">Realistic Numbers</p>
          <h2>How Much Can You Earn Selling Feet Pics?</h2>
          <p className="lead">Here&apos;s the honest answer: how much you make selling feet pics depends on effort, consistency, and audience. Most photos sell for $5–$25, and bundles, videos, and subscriptions stack on top. Below are typical starting ranges.</p>
          <div className="table-wrap mt-26">
            <table className="cmp cmp-teal">
              <thead>
                <tr><th>Content type</th><th>Typical price range</th><th>What usually moves the price</th></tr>
              </thead>
              <tbody>
                {EARNINGS.map(([type, price, moves]) => (
                  <tr key={type}>
                    <td data-label="Content type">{type}</td>
                    <td className="amt" data-label="Typical price range">{price}</td>
                    <td data-label="What usually moves the price">{moves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted mt-16">These are general estimates for testing, not guarantees. Many beginners earn modestly at first — some earn nothing for the first few weeks — and income is inconsistent. There is no reliable &quot;average,&quot; so treat every figure as a starting point rather than a promise.</p>
          <div className="panel mt-22">
            <h3>What separates higher earners from everyone else</h3>
            <CheckList
              className="compact"
              items={[
                <><strong>Consistency.</strong> Posting a few strong previews several times a week beats occasional bursts.</>,
                <><strong>Repeat buyers.</strong> Most income comes from a handful of loyal regulars, so nurture them.</>,
                <><strong>Customs.</strong> Saying yes to personalized requests unlocks your highest-margin sales.</>,
                <><strong>Clean previews.</strong> Professional-looking free shots earn the trust that converts browsers to buyers.</>,
              ]}
            />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing">
        <div className="wrap">
          <p className="eyebrow">Don&apos;t Leave Money on the Table</p>
          <h2>How to Price Your Sets Without Underselling</h2>
          <p className="lead">New sellers almost always start too low. The ranges above are starting points for testing — adjust based on views, purchases, repeat orders, and how much time each set takes you.</p>
          <div className="panels">
            <article className="panel">
              <h3>Simple pricing rules</h3>
              <CheckList
                className="compact"
                items={[
                  'Start near the low end to gather your first reviews, then raise prices as demand grows.',
                  'Bundle sets at roughly 60–70% of the individual total — bundles reliably lift order value.',
                  'Charge 2–3× for customs, and always collect payment before you create them.',
                  'Use a subscription to turn one-off buyers into steady monthly income.',
                  'Reward regulars with loyalty perks instead of discounting everything.',
                ]}
              />
            </article>
            <article className="panel">
              <h3>A starting point for week one</h3>
              <CheckList
                className="compact"
                items={[
                  'Singles at $5–$8 to build early reviews.',
                  'One starter bundle around $20–$35.',
                  'Customs opening at $20+ per photo.',
                  'Review what sells after 8–10 orders, then adjust up.',
                ]}
              />
            </article>
          </div>
          <div className="note">These are testing ideas, not fixed market prices. The real signal is your own data — track what buyers actually purchase and price toward a fair hourly return.</div>
        </div>
      </section>

      {/* SAFETY */}
      <section className="deep" id="safety">
        <div className="wrap">
          <p className="eyebrow">Trust &amp; Safety</p>
          <h2>How to Sell Feet Pics Without Getting Scammed</h2>
          <p className="lead">Scams are the most common bad experience new sellers report — and nearly all of them follow the same few patterns. One rule defeats most: <strong>payment first, content after, and never move off the platform.</strong></p>
          <div className="panels">
            <article className="panel">
              <h3>Red flags to block</h3>
              <CheckList
                variant="crosses"
                className="compact"
                items={[
                  '"Pay after delivery" — they receive content, then vanish.',
                  'Fake payment screenshots — a screenshot is not real money.',
                  <>&quot;Verification&quot; or &quot;unlock&quot; fees — nobody legit asks <em>you</em> to pay first.</>,
                  'Pressure to use Cash App, PayPal F&F, or Telegram to dodge protection.',
                  '"Send a free sample to prove it\'s you" — a classic disappearing act.',
                ]}
              />
            </article>
            <article className="panel">
              <h3>Stay anonymous</h3>
              <CheckList
                className="compact"
                items={[
                  'Use a creator name unrelated to your personal accounts.',
                  'Keep your face out of shots and remove identifying background details.',
                  'Strip photo metadata and watermark your previews.',
                  'Use geographic blocking where offered to hide your home region.',
                  'Keep a separate email and dedicated socials.',
                ]}
              />
            </article>
          </div>
          <p className="note"><strong>One honesty note:</strong> &quot;no face&quot; doesn&apos;t mean fully anonymous. You stay pseudonymous to buyers, but a verified platform, your bank, and tax authorities still hold your real details. Buyer-facing privacy and being invisible to the system are two different things.</p>
        </div>
      </section>

      {/* LEGAL & TAX */}
      <section id="legal">
        <div className="wrap">
          <p className="eyebrow">The Legal Side</p>
          <h2>Is It Legal to Sell Feet Pics — and Is It Taxable?</h2>
          <p className="lead">For adults aged 18 and over, selling your own feet photos is legal in the US, UK, and most countries — feet pictures aren&apos;t explicit content, which is part of why the niche is so accessible. That said, the specifics depend on your situation.</p>
          <div className="panels">
            <article className="panel">
              <h3>The conditions that actually matter</h3>
              <CheckList
                className="compact"
                items={[
                  'You must be 18+ and able to verify it.',
                  'Only sell content you created and have the right to distribute.',
                  'Everyone depicted must be a consenting adult, with any required consent records kept.',
                  'Laws, platform rules, and tax treatment vary by country and region.',
                ]}
              />
            </article>
            <article className="panel">
              <h3>Keeping it clean at tax time</h3>
              <CheckList
                className="compact"
                items={[
                  'Income from selling feet pics is generally taxable — even part-time, even with no tax form.',
                  'In the US, sellers commonly report on Schedule C, and self-employment tax can apply once net earnings reach $400.',
                  'Set aside a buffer (many use ~25–30%) as a general planning habit, not a fixed rule.',
                  'Keep records from your first sale, and check the current rules for your country.',
                ]}
              />
            </article>
          </div>
          <figure className="shot shot-wide">
            <img src="/assets/how-to-sell-feet-pics/is-selling-feet-pics-legal.jpg" alt="Bare feet resting on a light bedsheet, illustrating a typical non-explicit feet pic listing" width={1200} height={460} loading="lazy" />
          </figure>
          <div className="note">This is general information, not legal or tax advice. Rules change and vary by location — confirm the specifics for your situation, and consult a qualified professional when in doubt.</div>
        </div>
      </section>

      {/* COUNTRY GUIDES */}
      <section className="alt" id="countries">
        <div className="wrap">
          <p className="eyebrow">Where You Are Matters</p>
          <h2>How to Sell Feet Pics in the US, UK, Canada &amp; Australia</h2>
          <p className="lead">The core steps are the same everywhere, but payout options and tax rules differ by country. Here&apos;s the quick version — see our dedicated country guides for the full detail.</p>
          <div className="countries">
            <article className="country"><h3>🇺🇸 United States</h3><p>Legal for adults 18+. Report earnings as self-employment income (commonly Schedule C); set aside for taxes.</p></article>
            <article className="country"><h3>🇬🇧 United Kingdom</h3><p>Legal for adults 18+. Declare earnings to HMRC as self-employed income once you pass the trading allowance.</p></article>
            <article className="country"><h3>🇨🇦 Canada</h3><p>Legal for adults 18+. Report as self-employment/business income and keep records of expenses.</p></article>
            <article className="country"><h3>🇦🇺 Australia</h3><p>Legal for adults 18+. Declare income to the ATO; an ABN may help if you&apos;re treating it as a business.</p></article>
          </div>
          <p className="muted mt-16">General guidance only — tax thresholds and rules change. Confirm the current requirements with your local tax authority or a professional.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="wrap">
          <p className="eyebrow">Questions</p>
          <h2>How to Sell Feet Pics — Frequently Asked Questions</h2>
          <FaqList items={FAQ} />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="deep centre" id="start">
        <div className="wrap">
          <h2>Ready to Start Selling Feet Pics?</h2>
          <p className="lead" style={{ margin: '14px auto 24px', maxWidth: 620 }}>
            Create a free, anonymous profile in minutes, upload your first set, and start earning from verified buyers — with
            your privacy protected the whole way.
          </p>
          <CtaButton>Start Selling Now</CtaButton>
          <p className="muted mt-16">Free to join · Verify in minutes · Stay anonymous</p>
        </div>
      </section>
    </main>
  )
}
