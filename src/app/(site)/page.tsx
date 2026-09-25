import Link from 'next/link'
import { PostGrid } from '@/components/blog/PostCard'
import { IconTile } from '@/components/site/icons'
import { CheckList, CtaButton, FaqList, faqLd, JsonLd, type FaqItem } from '@/components/site/ui'
import { listLivePosts } from '@/lib/posts'
import { buildMetadata } from '@/lib/seo'
import { absoluteUrl, SITE } from '@/lib/site'

// Shows the latest blog posts, so render per request.
export const dynamic = 'force-dynamic'

export const metadata = buildMetadata({
  title: 'Fun With Feet: Sell Feet Pics Safely & Make Money Online',
  description:
    'Learn how Fun With Feet works, how to sell feet pics online, stay private, avoid scams, set prices, and start earning from feet pictures safely.',
  keywords:
    'fun with feet, funwithfeet, sell feet pics, feet pics, sell feet pictures, how to sell feet pics, sell feet pics online, buy feet pics, feet pics app, feet pics marketplace, where to sell feet pics, sell feet pics for free, how to sell feet pics without getting scammed',
  path: '/',
  twitterDescription:
    'A guide to selling feet pics safely with Fun With Feet — stay private, avoid scams, set your prices, and start earning from feet pictures.',
})

const FAQ: FaqItem[] = [
  { q: 'Is Fun With Feet safe for selling feet pics?', a: 'Fun With Feet is designed to give creators a more private and organized way to sell feet pics. You should still follow safety best practices, avoid sharing personal information, and keep communication professional.' },
  { q: 'Can I sell feet pics without showing my face?', a: 'Yes. Many creators prefer to sell feet pics without showing their face. Focus on clear foot content, good lighting, and a professional profile.' },
  { q: 'How much money can I make selling feet pics?', a: 'Earnings depend on your photo quality, pricing, consistency, buyer demand, and whether you offer custom requests or bundles. There is no guaranteed income, but a strong profile can improve your chances.' },
  { q: 'What type of feet pictures sell best?', a: 'Clear, well-lit feet pics usually perform better. Popular styles include pedicure photos, soles, arches, heels, socks, barefoot lifestyle shots, and custom themed sets.' },
  { q: 'Is Fun With Feet good for beginners?', a: 'Yes. Fun With Feet can be useful for beginners because it gives you a dedicated place to create a profile, upload content, and learn how to sell feet pictures online.' },
  { q: 'Can buyers purchase feet pics on Fun With Feet?', a: 'Yes. Buyers use feet pics marketplaces to discover creators, browse content, and request specific styles of feet pictures.' },
  { q: 'How do I avoid scams when selling feet pics?', a: 'Keep conversations on-platform, avoid advance-payment tricks, never share personal banking details directly with buyers, watermark previews, and do not send custom content before payment is confirmed.' },
  { q: 'What is the difference between Fun With Feet and social media?', a: 'Social media is general and often not built for selling feet pictures. Fun With Feet is more niche, which means the audience is more relevant to feet pics and foot content.' },
]

const COMPARISON: Array<[string, string, string]> = [
  ['Buyers already looking for feet pics', 'Yes', 'No'],
  ['Privacy-focused creator profile', 'Yes', 'Limited'],
  ['Built for feet pictures', 'Yes', 'No'],
  ['Lower risk of random spam', 'Better', 'Higher'],
  ['Pricing control', 'Yes', 'Manual'],
  ['Content organization', 'Easier', 'Difficult'],
  ['Risk of account reports', 'Lower', 'Higher'],
  ['Professional selling setup', 'Yes', 'Limited'],
]

const GLOSSARY: Array<[string, string]> = [
  ['Feet Pic Marketplace', 'A platform where creators can sell feet pics to interested buyers.'],
  ['Custom Set', "Personalized feet pictures created based on a buyer's request."],
  ['Bundle', 'A group of feet pics sold together as one package.'],
  ['Watermark', 'A mark added to preview images to help protect them from theft.'],
  ['Verification', 'A process that helps build trust between creators and buyers.'],
  ['Payout', 'The payment a creator receives after selling content.'],
  ['Buyer Request', 'A message from a buyer asking for a specific type of feet picture.'],
  ['Preview Image', 'A sample image used to show content style without giving away the full set.'],
]

const CATEGORIES = [
  'Everyday feet pics', 'Pedicure & nail art', 'Soles and arches', 'Heels and shoes', 'Custom requests', 'Themed photo sets',
  'Seasonal content', 'Premium bundles', 'Sock feet pics', 'Barefoot lifestyle photos', 'Foot care content', 'Creator bundles',
]

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.brand,
  url: absoluteUrl('/'),
  description: 'Independent guide to selling feet pics safely with Fun With Feet, a dedicated feet pics marketplace.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${absoluteUrl('/blog')}?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: absoluteUrl('/'),
  logo: absoluteUrl(SITE.logo),
  description:
    'Fun With Feet is a dedicated feet pics marketplace where creators sell feet pics safely and connect with buyers searching for foot content.',
}

export default async function HomePage() {
  const { posts: latest } = await listLivePosts({ limit: 3 })

  return (
    <main id="top">
      <JsonLd data={websiteLd} />
      <JsonLd data={organizationLd} />
      <JsonLd data={faqLd(FAQ)} />

      {/* 1. HERO */}
      <section className="hero hero-tall hero-home">
        <div className="wrap">
          <p className="eyebrow">The Feet Pics Marketplace</p>
          <h1>
            Sell Feet Pics Safely &amp; Earn with <mark>Fun With Feet</mark>
          </h1>
          <p className="lead">
            Want to <strong>sell feet pics</strong> without dealing with scams, privacy risks, or random buyers on social
            media? Fun With Feet is a dedicated feet pics marketplace designed for creators who want a safer, more focused
            way to monetize foot content and connect with people already searching for feet pictures online.
          </p>
          <div className="hero-cta">
            <CtaButton>Start Selling Feet Pics</CtaButton>
            <a className="btn btn-ghost" href="#how-it-works">
              See How It Works
            </a>
          </div>
          <div className="hero-stats">
            <div><strong>Private Selling</strong><span>Create a seller profile without exposing unnecessary personal details.</span></div>
            <div><strong>No Face Required</strong><span>Sell feet pictures while keeping your personal identity separate.</span></div>
            <div><strong>Buyer-Focused Marketplace</strong><span>Reach people who are already interested in feet pics and foot content.</span></div>
          </div>
        </div>
      </section>

      {/* 2. WHAT IS FUN WITH FEET */}
      <section id="about">
        <div className="wrap">
          <p className="eyebrow">What Is Fun With Feet</p>
          <h2>A Dedicated Marketplace for People Who Want to Sell Feet Pics</h2>
          <p className="lead">
            Fun With Feet is an online marketplace created for people who want to sell feet pics, feet pictures, and custom
            foot content in a more organized environment. Instead of posting on general social media platforms where your
            content can get ignored, reported, or stolen, Fun With Feet gives creators a niche space built around foot content.
          </p>
          <p>
            For new sellers, the biggest challenge is usually knowing where to start. Fun With Feet helps simplify the process
            by giving creators a place to create a profile, upload feet pics, set prices, and connect with interested buyers.
          </p>
          <p>
            Whether you are just learning how to sell feet pics or already have experience selling feet pictures online, Fun
            With Feet can help you build a more private and focused selling setup.
          </p>
          <p>
            New to this? Our full guide on{' '}
            <Link href="/sell-feet-pics">how to sell feet pics online safely and anonymously</Link> covers pricing, legality,
            privacy, and the exact steps to your first sale.
          </p>
        </div>
      </section>

      {/* 3. KEY FEATURES */}
      <section className="alt" id="features">
        <div className="wrap">
          <p className="eyebrow">Fun With Feet Features</p>
          <h2>Key Features That Make Selling Feet Pics Easier</h2>
          <p className="lead">
            Every feature on Fun With Feet is designed to help creators sell feet pics online while keeping privacy, control,
            and safety in mind.
          </p>
          <div className="grid grid-3 grid-bordered mt-30">
            <article className="cell"><IconTile name="lock" /><h3>Privacy-Focused Selling</h3><p>Sell feet pics without needing to reveal personal details such as full name, location, or private social profiles.</p></article>
            <article className="cell"><IconTile name="users" /><h3>Creator Profiles</h3><p>Build a dedicated seller profile where buyers can understand what type of feet pictures, custom sets, or bundles you offer.</p></article>
            <article className="cell"><IconTile name="upload" /><h3>Simple Uploads</h3><p>Upload your best feet pics, organize them into sets, and make it easier for buyers to browse your content.</p></article>
            <article className="cell"><IconTile name="tag" /><h3>Flexible Pricing</h3><p>Set your own prices for individual feet pictures, custom requests, bundles, and premium content.</p></article>
            <article className="cell"><IconTile name="card" /><h3>Buyer Marketplace</h3><p>Connect with people who are already interested in buying feet pics, instead of searching for buyers manually.</p></article>
            <article className="cell"><IconTile name="shieldCheck" /><h3>Safer Communication</h3><p>Keep buyer conversations related to your content and avoid sharing personal contact details outside the platform.</p></article>
          </div>
        </div>
      </section>

      {/* 4. BENEFITS */}
      <section id="benefits">
        <div className="wrap">
          <p className="eyebrow">Why It Pays Off</p>
          <h2>Benefits of Choosing Fun With Feet to Sell Feet Pics</h2>
          <p className="lead">
            Choosing the right feet pics marketplace matters. A focused platform can help you save time, protect your privacy,
            and reach people who are already searching for feet pictures.
          </p>
          <div className="grid grid-2 gap-40 mt-26">
            <CheckList
              items={[
                <><strong>Keep more control</strong> — decide what you post, how much you charge, and what type of custom requests you accept.</>,
                <><strong>Reach interested buyers</strong> — unlike social media, buyers on feet pics marketplaces are already looking for this type of content.</>,
                <><strong>Stay more private</strong> — build a creator profile without exposing unnecessary personal information.</>,
              ]}
            />
            <CheckList
              items={[
                <><strong>Sell on your schedule</strong> — upload content when you want and manage your profile around your own routine.</>,
                <><strong>Avoid random DMs</strong> — a structured marketplace can reduce the risk of fake buyers, spam, and time-wasters.</>,
                <><strong>Grow over time</strong> — consistent posting, better photo quality, and clear pricing can help you increase your chances of sales.</>,
              ]}
            />
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="alt" id="how-it-works">
        <div className="wrap">
          <p className="eyebrow">Simple Process</p>
          <h2>How to Sell Feet Pics on Fun With Feet in 4 Steps</h2>
          <div className="steps mt-28">
            <div className="step"><span className="num">1</span><div><h3>Create Your Account</h3><p>Sign up and create a private creator profile. Add basic details about the type of feet pics you want to sell.</p></div></div>
            <div className="step"><span className="num">2</span><div><h3>Upload Your Feet Pics</h3><p>Add clear, high-quality feet pictures. You can organize your content into categories, sets, or bundles.</p></div></div>
            <div className="step"><span className="num">3</span><div><h3>Set Your Prices</h3><p>Choose your pricing for single photos, photo bundles, custom feet pics, or special requests.</p></div></div>
            <div className="step"><span className="num">4</span><div><h3>Get Paid Securely</h3><p>When buyers purchase your content, follow the platform&apos;s payment process and keep all transactions safe and professional.</p></div></div>
          </div>
          <div className="actions mt-28"><CtaButton>Create Your Free Profile</CtaButton></div>
        </div>
      </section>

      {/* 6. CATEGORIES */}
      <section className="alt" id="categories">
        <div className="wrap">
          <p className="eyebrow">What You Can Sell</p>
          <h2>Categories &amp; Content You Can Sell on Fun With Feet</h2>
          <p className="lead">
            Fun With Feet supports different types of feet pics and foot content, so creators can choose a style that fits them.
          </p>
          <div className="chips">
            {CATEGORIES.map((c) => (
              <span className="chip" key={c}>{c}</span>
            ))}
          </div>
          <p className="mt-22">
            Buyers search for different styles of feet pictures, so organizing your content into clear categories can make
            your profile easier to discover.
          </p>
        </div>
      </section>

      {/* 7. SAFETY & PRIVACY */}
      <section className="teal teal-photo" id="safety">
        <div className="wrap">
          <p className="eyebrow">Safety &amp; Privacy</p>
          <h2>How Fun With Feet Helps You Sell Feet Pics More Safely</h2>
          <p className="lead">
            Privacy is one of the biggest concerns for new sellers. Fun With Feet is built around giving creators a more
            controlled way to sell feet pics online.
          </p>
          <div className="grid grid-2 gap-40 mt-28">
            <CheckList
              items={[
                <><strong>Stay anonymous</strong> — avoid showing your face if you do not want to.</>,
                <><strong>Avoid personal contact</strong> — keep conversations inside the platform instead of moving to personal apps.</>,
                <><strong>Use watermarks</strong> — protect preview images from being copied or misused.</>,
              ]}
            />
            <CheckList
              items={[
                <><strong>Set boundaries</strong> — choose what content you are comfortable selling and reject requests that do not feel right.</>,
                <><strong>Watch for scams</strong> — never accept suspicious payment methods or buyers asking you to move off-platform.</>,
                <><strong>Keep control</strong> — update, remove, or adjust your content whenever needed.</>,
              ]}
            />
          </div>
        </div>
      </section>

      {/* 8. WHY CHOOSE */}
      <section id="why">
        <div className="wrap">
          <p className="eyebrow">Unique Selling Points</p>
          <h2>Why Choose Fun With Feet Over Other Options?</h2>
          <p className="lead">
            Many people try to sell feet pics on social media, forums, or messaging apps, but those channels are not built for
            privacy, payments, or serious buyers.
          </p>
          <div className="grid grid-3 grid-bordered mt-28">
            <article className="cell"><IconTile name="target" /><h3>Niche Focus</h3><p>Fun With Feet is built around feet pics, which means users visiting the platform already understand the purpose of the marketplace.</p></article>
            <article className="cell"><IconTile name="award" /><h3>Better Buyer Intent</h3><p>People searching for Fun With Feet, funwithfeet, or feet pics marketplaces often have stronger intent than random social media users.</p></article>
            <article className="cell"><IconTile name="sliders" /><h3>More Control</h3><p>Manage your content, prices, profile, and communication from one dedicated place.</p></article>
          </div>
        </div>
      </section>

      {/* 9. COMPARISON */}
      <section className="alt" id="comparison">
        <div className="wrap">
          <p className="eyebrow">What Sets It Apart</p>
          <h2>Fun With Feet vs. Selling Feet Pics on Social Media</h2>
          <div className="table-wrap mt-26">
            <table className="cmp">
              <thead>
                <tr><th>Feature</th><th>Fun With Feet</th><th>Social Media</th></tr>
              </thead>
              <tbody>
                {COMPARISON.map(([feature, fwf, social]) => (
                  <tr key={feature}>
                    <td data-label="Feature">{feature}</td>
                    <td className="yes" data-label="Fun With Feet">{fwf}</td>
                    <td className="no" data-label="Social Media">{social}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 10. WHO IT'S FOR */}
      <section id="use-cases">
        <div className="wrap">
          <p className="eyebrow">Who It&apos;s For</p>
          <h2>Who Should Use Fun With Feet to Sell Feet Pics?</h2>
          <p className="lead">
            Fun With Feet can work for different types of creators who want to monetize feet pictures in a safer and more
            organized way.
          </p>
          <div className="grid grid-3 grid-bordered mt-28">
            <article className="cell"><IconTile name="rocket" /><h3>Beginners</h3><p>New to selling feet pics? Fun With Feet gives you a simple way to create a profile, upload content, and start learning how the marketplace works.</p></article>
            <article className="cell"><IconTile name="clock" /><h3>Side-Hustlers</h3><p>Want to earn extra income in your spare time? Upload feet pics, respond to buyers, and build your profile around your own schedule.</p></article>
            <article className="cell"><IconTile name="trending" /><h3>Existing Creators</h3><p>Already creating content online? Fun With Feet can become an additional channel where you sell feet pictures to a niche audience.</p></article>
          </div>
        </div>
      </section>

      {/* 11. WHY CREATORS TRUST IT */}
      <section className="deep" id="trust">
        <div className="wrap">
          <p className="eyebrow">Why Creators Trust It</p>
          <h2>Why Creators Use Fun With Feet for Selling Feet Pics</h2>
          <p className="lead">
            Creators choose Fun With Feet because it gives them a more focused place to sell feet pictures without relying only
            on social media algorithms or random DMs.
          </p>
          <div className="grid grid-2 gap-40 mt-28">
            <CheckList items={['Private creator profile', 'Niche buyer audience', 'Simple selling process']} />
            <CheckList items={['Custom content options', 'Flexible pricing', 'Beginner-friendly setup']} />
          </div>
        </div>
      </section>

      {/* 12. CREATOR EXPERIENCES */}
      <section id="reviews">
        <div className="wrap">
          <p className="eyebrow">Creator Experiences</p>
          <h2>Creators Use Fun With Feet to Sell Feet Pics More Confidently</h2>
          <div className="cards grid-3 mt-28">
            <div className="quote"><p>&quot;I wanted a more private way to sell feet pics without posting everything on social media. Fun With Feet made the process feel easier to manage.&quot;</p><div className="who">— Creator Review</div></div>
            <div className="quote"><p>&quot;The best part is having a profile focused only on feet pictures. It feels more organized than trying to handle random DMs.&quot;</p><div className="who">— Seller Review</div></div>
            <div className="quote"><p>&quot;As a beginner, I needed a simple place to start. Fun With Feet helped me understand how to price and present my content.&quot;</p><div className="who">— New Creator</div></div>
          </div>
        </div>
      </section>

      {/* 13. FAQ */}
      <section className="alt" id="faq">
        <div className="wrap">
          <p className="eyebrow">Questions Answered</p>
          <h2>Fun With Feet FAQ: Selling Feet Pics Online</h2>
          <FaqList items={FAQ} openFirst />
        </div>
      </section>

      {/* 14. GETTING STARTED */}
      <section id="getting-started">
        <div className="wrap">
          <p className="eyebrow">Getting Started Guide</p>
          <h2>Start Selling Feet Pics with Fun With Feet Today</h2>
          <p className="lead">Ready to turn your feet pictures into a side income opportunity? Follow this quick setup process.</p>
          <div className="steps mt-26">
            <div className="step"><span className="num">1</span><div><h3>Sign Up</h3><p>Create your Fun With Feet account and set up your private creator profile.</p></div></div>
            <div className="step"><span className="num">2</span><div><h3>Build Your Profile</h3><p>Add a short bio, content style, pricing details, and sample feet pics so buyers know what you offer.</p></div></div>
            <div className="step"><span className="num">3</span><div><h3>Publish &amp; Promote</h3><p>Upload your content, organize it into clear categories, and promote your profile safely without revealing personal information.</p></div></div>
          </div>
          <div className="actions mt-28"><CtaButton>Join Fun With Feet Now</CtaButton></div>
        </div>
      </section>

      {/* 15. TIPS */}
      <section className="alt" id="tips">
        <div className="wrap">
          <p className="eyebrow">Best Practices</p>
          <h2>Tips to Sell More Feet Pics on Fun With Feet</h2>
          <div className="grid grid-2 gap-40 mt-26">
            <CheckList
              items={[
                <><strong>Use good lighting</strong> — clear photos look more professional and can attract more buyer interest.</>,
                <><strong>Write clear titles</strong> — describe your content with simple words buyers may search for.</>,
                <><strong>Stay consistent</strong> — upload regularly so your profile feels active.</>,
              ]}
            />
            <CheckList
              items={[
                <><strong>Offer bundles</strong> — photo sets can increase your average order value.</>,
                <><strong>Protect your privacy</strong> — avoid sharing your real name, address, phone number, or private social profiles.</>,
                <><strong>Respond politely</strong> — professional replies can help build trust with repeat buyers.</>,
              ]}
            />
          </div>
        </div>
      </section>

      {/* 16. MISTAKES */}
      <section id="mistakes">
        <div className="wrap">
          <p className="eyebrow">Avoid These</p>
          <h2>Common Mistakes New Feet Pic Sellers Make</h2>
          <div className="grid grid-3 grid-bordered mt-28">
            <article className="cell"><h3>Underpricing</h3><p>Pricing too low can reduce the perceived value of your content. Start fair and adjust based on demand.</p></article>
            <article className="cell"><h3>Poor Photo Quality</h3><p>Blurry, dark, or messy photos can make your profile look less professional. Use clean backgrounds and natural lighting.</p></article>
            <article className="cell"><h3>Inconsistent Posting</h3><p>Uploading once and disappearing can limit your growth. Consistency helps keep your profile fresh.</p></article>
            <article className="cell"><h3>Sharing Personal Info</h3><p>Never share private details with buyers. Keep your seller identity separate from your personal life.</p></article>
            <article className="cell"><h3>Ignoring Buyer Requests</h3><p>Slow replies can cost sales. Respond politely, but only accept requests that match your comfort level.</p></article>
            <article className="cell"><h3>No Verification or Profile Details</h3><p>An empty profile can look less trustworthy. Add clear information, sample photos, and a professional bio.</p></article>
          </div>
        </div>
      </section>

      {/* 17. GLOSSARY */}
      <section className="alt" id="glossary">
        <div className="wrap">
          <p className="eyebrow">Quick Reference</p>
          <h2>Feet Pic Selling Glossary for Fun With Feet Beginners</h2>
          <dl className="glossary mt-26">
            {GLOSSARY.map(([term, def]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{def}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* LATEST FROM THE BLOG */}
      {latest.length > 0 && (
        <section id="latest-guides">
          <div className="wrap">
            <p className="eyebrow">From the Blog</p>
            <h2>Latest Guides for Feet Pic Sellers</h2>
            <p className="lead">Fresh, practical advice on pricing, safety, photography and growing your sales.</p>
            <PostGrid posts={latest} />
            <div className="actions mt-28">
              <Link className="btn btn-ghost" href="/blog">
                Read All Articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 18. FINAL CTA */}
      <section id="final-cta">
        <div className="wrap">
          <div className="cta-band">
            <p className="eyebrow">Your Next Step</p>
            <h2>Ready to Sell Feet Pics Safely with Fun With Feet?</h2>
            <p>
              Fun With Feet gives creators a focused way to sell feet pics, protect their privacy, set their own prices, and
              connect with people looking for feet pictures online. Create your profile, upload your best content, and start
              building your feet pics side hustle today.
            </p>
            <div className="mt-22"><CtaButton>Get Started with Fun With Feet</CtaButton></div>
          </div>
        </div>
      </section>
    </main>
  )
}
