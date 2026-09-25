import Link from 'next/link'
import { IconTile } from '@/components/site/icons'
import { Breadcrumb, CheckList, CtaButton, FaqList, faqLd, JsonLd, type FaqItem } from '@/components/site/ui'
import { buildMetadata, PUBLISHER_LD } from '@/lib/seo'
import { absoluteUrl, SITE } from '@/lib/site'

export const metadata = buildMetadata({
  title: 'Sell Feet Pics Online — Safe, Anonymous & Legal | Fun With Feet',
  description:
    'Learn how to sell feet pics online safely and anonymously. Pricing guides, legal facts, scam protection, step-by-step setup, and how much money you can make.',
  keywords:
    'sell feet pics, sell feet pictures, how to sell feet pics, sell feet pics online, sell feet pics anonymously, is it legal to sell feet pics, how much money selling feet pics, buy feet pics, feet pics marketplace, feet pic prices',
  path: '/sell-feet-pics',
  type: 'article',
  // Kept out of the index (as on the original site) to avoid competing with /how-to-sell-feet-pics.
  noindex: true,
  ogDescription: 'A complete guide to selling feet pics online: what to charge, how to stay anonymous, whether it is legal, and how to avoid scams.',
  twitterTitle: 'Sell Feet Pics Online — Safe, Anonymous & Legal',
})

const FAQ: FaqItem[] = [
  { q: 'Do I need to show my face to sell feet pics?', a: 'No. The majority of sellers never show their face. Age verification documents go to the platform, not to buyers, and your public profile only needs a seller name and your foot content.' },
  { q: 'How much should a beginner charge for feet pics?', a: 'Most beginners start single photos around $5 to $15, small bundles around $20 to $40, and custom requests from $25 upward. Prices rise as your gallery, reviews, and repeat buyers grow.' },
  { q: 'Is selling feet pics legal?', a: 'In most countries, selling non-explicit photographs of your own feet is legal for adults aged 18 or over. You are responsible for declaring the income as self-employment earnings and for following your local laws.' },
  { q: 'How do sellers actually get paid?', a: 'Payment is handled by the marketplace. Buyers pay the platform, the platform holds the funds, and you request a payout to your chosen method. You should never accept a direct transfer from a buyer.' },
  { q: 'How long does it take to make the first sale?', a: 'It varies widely. Sellers with a full gallery of twenty or more photos, a written bio, and clear pricing generally see interest faster than a profile with three images and no description.' },
  { q: 'Can someone steal my feet pics?', a: 'Content theft is possible on any platform. Watermark preview images, strip EXIF metadata before uploading, and avoid posting the same photos publicly on social media where anyone can save them.' },
  { q: 'What makes a feet pic sell well?', a: 'Clean, well-lit photos with a tidy background and a clear focus on the feet. Fresh pedicures, soles, arches, socks, heels, and seasonal themed sets are consistently popular.' },
  { q: 'Do I have to pay tax on money from feet pics?', a: 'Generally yes. In most countries this counts as self-employment or hobby income. Keep a simple record of every payout and speak to a local tax professional about your specific situation.' },
  { q: 'Can I stop selling whenever I want?', a: 'Yes. You control your own listings and can unpublish content, pause your profile, or close your account at any time.' },
  { q: 'What should I never agree to as a seller?', a: 'Never move to private messaging apps, never send content before payment clears, never accept gift cards or overpayment refunds, and never share your real name, address, workplace, or banking details with a buyer.' },
]

const FIVE_STEPS = [
  { name: 'Prepare Your Feet', ld: 'Moisturise, tidy your nails, and give your feet a rest day before shooting so the skin looks smooth and even.', text: 'Moisturise the night before, tidy your nails, and avoid tight shoes for a few hours before shooting so there are no marks or red pressure lines. A fresh pedicure is the single biggest visual upgrade available.' },
  { name: 'Set Up the Shot', ld: 'Use daylight near a window, a clean background, and a steady phone. Shoot far more frames than you need.', text: 'Daylight near a window beats any indoor bulb. Use a clean, plain surface — a bedsheet, a rug, a wooden floor. Steady the phone, shoot from several angles, and take far more frames than you plan to keep.' },
  { name: 'Create Your Account', ld: 'Register on a dedicated feet pics marketplace, complete age verification, and choose a seller name unconnected to your real identity.', text: 'Register with your dedicated seller email, complete the 18+ verification, and write a short bio describing your content style and what customs you accept. Skip anything personal.' },
  { name: 'Upload, Organise, and Price', ld: 'Group photos into sets, write searchable titles, watermark previews, and set clear prices for singles, bundles, and customs.', text: 'Group photos into themed sets, write titles using words buyers actually search, watermark the previews, and set your prices for singles, bundles, and custom work.' },
  { name: 'Sell, Deliver, and Withdraw', ld: 'Keep every conversation and payment on-platform, deliver content only after payment clears, and withdraw earnings through the platform payout system.', text: "Reply to enquiries promptly, deliver only once payment has cleared, keep every message on-platform, and request payouts through the platform's own system." },
]

const GALLERY = [
  { src: 'feet-pics-pedicure.jpg', alt: 'Fresh pedicure feet pic with painted toenails', title: 'Fresh Pedicure Sets', sub: 'Painted nails, clean edges, close crop' },
  { src: 'feet-pics-beach-sand.jpg', alt: 'Feet in sand at the beach for a seasonal feet pic set', title: 'Beach & Sand', sub: 'Seasonal sets that sell hardest in summer' },
  { src: 'feet-pics-soles.jpg', alt: 'Close-up sole shot, one of the most requested feet pic styles', title: 'Soles & Arches', sub: 'Consistently the most requested angle' },
  { src: 'feet-pics-anklet-jewellery.jpg', alt: 'Feet with an anklet and toe ring for a jewellery-themed set', title: 'Anklets & Jewellery', sub: 'Small props that lift a plain shot' },
  { src: 'feet-pics-cozy-socks.jpg', alt: 'Feet in cozy knitted socks for a covered feet pic set', title: 'Socks & Tights', sub: 'Fully covered, great for cautious starters' },
  { src: 'feet-pics-poolside.jpg', alt: 'Feet at the poolside with water in the background', title: 'Poolside & Water', sub: 'Wet skin and reflections read as premium' },
  { src: 'feet-pics-heels.jpg', alt: 'Feet in high heels for a footwear-themed feet pic set', title: 'Heels & Shoes', sub: 'On, half-off, and just removed all sell' },
  { src: 'feet-pics-sport-shoes.jpg', alt: 'Feet in sports trainers and athletic socks', title: 'Sport & Trainers', sub: 'A steady niche with dedicated buyers' },
]

const PRICES: Array<[string, string, string]> = [
  ['Single photo', '$5 – $15', 'Lighting quality, angle, whether it is part of a popular theme'],
  ['Small bundle (5–10 photos)', '$20 – $50', 'Set coherence, variety of angles, exclusivity of the theme'],
  ['Large bundle (20+ photos)', '$50 – $120', 'Volume, whether the set is retired after sale'],
  ['Custom request', '$25 – $100+', 'Specific poses, props, turnaround time, exclusivity'],
  ['Short video clip', '$20 – $80', 'Length, sound, complexity of the request'],
  ['Monthly subscription', '$10 – $40 / mo', 'Upload frequency and how much back catalogue is included'],
]

const articleLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Sell Feet Pics Online — Safe, Anonymous and Secure',
  description: 'A complete guide to selling feet pics online: pricing, legality, anonymity, scam protection, and step-by-step setup.',
  image: absoluteUrl(SITE.ogImage),
  author: { '@type': 'Organization', name: SITE.brand },
  publisher: PUBLISHER_LD,
  mainEntityOfPage: absoluteUrl('/sell-feet-pics'),
}

const howToLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Sell Feet Pics Online in Five Steps',
  description: 'A beginner-friendly process for selling feet pictures online safely and anonymously.',
  step: FIVE_STEPS.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.ld })),
}

export default function SellFeetPicsPage() {
  return (
    <main id="top">
      <JsonLd data={articleLd} />
      <JsonLd data={howToLd} />
      <JsonLd data={faqLd(FAQ)} />

      {/* 1. HERO */}
      <section className="hero">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Sell Feet Pics' }]} />
          <p className="eyebrow">Sell Feet Pics Online</p>
          <h1>
            Get Paid to Sell Feet Pics — <mark>Safe, Anonymous, Secure</mark>
          </h1>
          <p className="lead">
            Turn your feet pics into real income on a platform built for it. Keep your face and your name out of it, set your
            own prices, talk to verified buyers inside the app, and get paid without ever handing over your bank details to a
            stranger.
          </p>
          <div className="hero-cta">
            <CtaButton>Start Selling Feet Pics Free</CtaButton>
            <a className="btn btn-ghost" href="#how-much">See What You Can Earn</a>
          </div>
          <div className="hero-stats">
            <div><strong>No Face Needed</strong><span>Your ID goes to the platform for age checks, never to a buyer.</span></div>
            <div><strong>You Set The Price</strong><span>Singles, bundles, custom sets — every number is yours to pick.</span></div>
            <div><strong>Payments Held Safely</strong><span>Buyers pay the platform first, so nothing is delivered unpaid.</span></div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how-it-works">
        <div className="wrap">
          <p className="eyebrow">The Short Version</p>
          <h2>How Selling Feet Pics on FunWithFeet Works</h2>
          <p className="lead">Three steps stand between a folder of photos on your phone and your first payout. None of them require any experience.</p>
          <div className="grid grid-3 grid-bordered mt-30">
            <article className="cell">
              <IconTile name="userPlus" />
              <h3>Create Your Seller Profile</h3>
              <p>Sign up with an email that is not tied to your personal accounts, pick a seller name, and pass the 18+ age check. Your bio and your photos are all buyers ever see.</p>
            </article>
            <article className="cell">
              <IconTile name="upload" />
              <h3>Upload &amp; Price Your Sets</h3>
              <p>Group your photos into themed sets, write titles buyers actually search for, watermark your previews, then set a price for singles, bundles, and custom requests.</p>
            </article>
            <article className="cell">
              <IconTile name="cardPay" />
              <h3>Get Paid Through the Platform</h3>
              <p>The buyer pays the marketplace, the funds are held, and you release the content. When the sale settles, you request a payout. No bank details ever change hands directly.</p>
            </article>
          </div>
          <div className="actions mt-28"><CtaButton>Create Your Free Seller Account</CtaButton></div>
        </div>
      </section>

      {/* 3. BUILT FOR BOTH SIDES */}
      <section className="alt" id="built-for">
        <div className="wrap">
          <p className="eyebrow">Why This Setup</p>
          <h2>Built for Buyers &amp; Sellers Who Want It Done Properly</h2>
          <p className="lead">Selling feet pics through DMs means chasing payments, blocking time-wasters, and hoping nobody screenshots your profile. A dedicated marketplace removes most of that friction.</p>
          <div className="grid grid-4 grid-bordered mt-30">
            <article className="cell"><IconTile name="shield" /><h3>Verified Accounts</h3><p>Both sides confirm they are adults before anything is listed or bought, which filters out a large share of fake accounts.</p></article>
            <article className="cell"><IconTile name="lock" /><h3>Held Payments</h3><p>Money sits with the platform until the sale completes, so you are never asked to send photos and hope for a transfer afterwards.</p></article>
            <article className="cell"><IconTile name="message" /><h3>On-Platform Chat</h3><p>Every conversation stays inside the app where it is logged, reportable, and separate from your personal phone number.</p></article>
            <article className="cell"><IconTile name="search" /><h3>Buyers Already Looking</h3><p>People arrive searching for foot content specifically, so your set does not have to fight a general feed for attention.</p></article>
          </div>
        </div>
      </section>

      {/* 4. CTA BAND */}
      <section id="cta-1">
        <div className="wrap">
          <div className="cta-band">
            <p className="eyebrow">Get Started Today</p>
            <h2>Your Photos Are Already on Your Phone</h2>
            <p>Setting up a seller profile takes about ten minutes. Uploading your first set takes another ten. Everything after that is just choosing what you are comfortable selling and at what price.</p>
            <div className="mt-22"><CtaButton>Start Selling Today</CtaButton></div>
          </div>
        </div>
      </section>

      {/* 5. SELLING SAFELY & ANONYMOUSLY */}
      <section className="alt" id="safely">
        <div className="wrap">
          <p className="eyebrow">The Full Guide</p>
          <h2>Selling Feet Pics Online Safely and Anonymously</h2>
          <p className="lead">Most problems new sellers run into are avoidable, and nearly all of them come down to the same handful of habits. Build these in from day one and the rest of the job is just taking good photos.</p>
          <ol className="numbered mt-28">
            <li><strong>Keep a seller identity that is completely separate.</strong> New email address, new username, no reused profile photo, no bio detail that could be reverse-searched. Do not recycle a handle you have used anywhere else.</li>
            <li><strong>Strip metadata before you upload.</strong> Phone photos can carry GPS coordinates in their EXIF data. Screenshot the photo, or use your phone&apos;s built-in &quot;remove location&quot; option when sharing, before it ever leaves your device.</li>
            <li><strong>Check the background of every single frame.</strong> A mirror, a window view, a letter on the table, a pet, a distinctive rug, a house number reflected in a glass — these are what actually identify people, not their feet.</li>
            <li><strong>Watermark everything that is publicly visible.</strong> Previews and profile images get a watermark. Paid content is delivered clean. This makes stolen previews traceable and much less useful to resell.</li>
            <li><strong>Never take a conversation off-platform.</strong> A buyer who wants your personal messenger, email, or phone number is asking you to leave the only system that can protect the payment or ban them.</li>
            <li><strong>Never send content before payment clears.</strong> &quot;I&apos;ll pay right after&quot; is the single most common scam in this market. The order comes first, every time, no exceptions for anyone.</li>
            <li><strong>Refuse gift cards, direct transfers, and overpayments.</strong> The overpayment scam — sending too much and asking for the difference back — has been running for twenty years and still catches new sellers weekly.</li>
            <li><strong>Decide your limits before anyone asks.</strong> Write down what you will and will not photograph. Having the answer ready makes it far easier to say no to a request that pushes past it.</li>
            <li><strong>Do not accept requests involving anything illegal or anything you cannot verify.</strong> If a request feels wrong, that is sufficient reason to decline it. You do not owe an explanation.</li>
            <li><strong>Keep records of your earnings.</strong> A simple spreadsheet of payouts and dates makes tax time straightforward instead of stressful.</li>
          </ol>
          <h3 className="mt-34">Using Your Feet as the Only Identifiable Feature</h3>
          <p>Feet themselves are not usually a reliable identifier in the way a face is, but distinctive tattoos, scars, birthmarks, and jewellery are. If you have any, decide deliberately whether to include or crop them. The same applies to nail art you also post publicly on your personal social media — matching a paid set to a public post is the easiest link anyone could make.</p>
        </div>
      </section>

      {/* 6. IS IT LEGAL */}
      <section id="legal">
        <div className="wrap">
          <p className="eyebrow">The Legal Question</p>
          <h2>Is It Legal to Sell Feet Pics?</h2>
          <div className="split">
            <div>
              <p>In most countries, yes. Photographs of your own feet, taken by you, with no nudity and no explicit content, sold by an adult to an adult, are ordinary digital goods. There is nothing unusual about the transaction from a legal standpoint.</p>
              <p><strong>The conditions that matter:</strong></p>
              <CheckList
                className="mt-14"
                items={[
                  <><strong>You must be 18 or over</strong> — every legitimate platform verifies this before you can list anything, and there is no version of this that works otherwise.</>,
                  <><strong>The photos must be yours</strong> — selling images you did not take, or that feature someone else, is copyright infringement at minimum.</>,
                  <><strong>The income is taxable</strong> — in most jurisdictions this is self-employment or hobby income and needs to be declared like any other earnings.</>,
                  <><strong>Non-explicit content keeps it simple</strong> — the moment content becomes explicit, a different and much stricter set of rules applies in most places.</>,
                ]}
              />
              <h3 className="mt-28">Where Can I Sell Pictures of My Feet Safely?</h3>
              <CheckList
                items={[
                  <><strong>Dedicated feet pic marketplaces</strong> — built for this exact transaction, with age verification and held payments.</>,
                  <><strong>General creator subscription platforms</strong> — workable, but you bring your own audience and compete with everything else on the site.</>,
                  <><strong>Your own store</strong> — full control and no commission, but you handle payments, chargebacks, marketing, and support yourself.</>,
                ]}
              />
              <p className="small-note mt-18">This is general information, not legal or tax advice. Rules vary by country and by state, so check what applies where you live.</p>
            </div>
            <figure className="shot">
              <img src="/assets/sell-feet-pics/is-it-legal-to-sell-feet-pics.jpg" alt="Bare feet resting on a light bedsheet, illustrating a typical non-explicit feet pic listing" width={800} height={600} loading="lazy" />
              <figcaption>Non-explicit, well-lit, clean background — the standard format for a sellable feet pic.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 7. GALLERY */}
      <section className="alt" id="gallery">
        <div className="wrap">
          <p className="eyebrow">Content That Sells</p>
          <h2>The Feet Pic Styles Buyers Search For Most</h2>
          <p className="lead">You do not need a studio or a professional camera. These are the categories that consistently attract buyers, all shot on ordinary phones in ordinary rooms.</p>
          <div className="gallery gallery-sq">
            {GALLERY.map((g) => (
              <figure className="shotcard" key={g.src}>
                <img src={`/assets/sell-feet-pics/${g.src}`} alt={g.alt} width={600} height={600} loading="lazy" />
                <figcaption><strong>{g.title}</strong><span>{g.sub}</span></figcaption>
              </figure>
            ))}
          </div>
          <div className="chips">
            {['Everyday barefoot', 'Nail art close-ups', 'Seasonal themes', 'Custom requests', 'Foot care routines', 'Bundle collections'].map((c) => (
              <span className="chip" key={c}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 8. HOW MUCH MONEY */}
      <section id="how-much">
        <div className="wrap">
          <p className="eyebrow">Realistic Numbers</p>
          <h2>How Much Money Can I Make Selling Pictures of My Feet?</h2>
          <p className="lead">Anyone promising a fixed monthly figure is guessing. What you earn depends on photo quality, how many sets you have listed, how often you upload, and whether you take custom requests. These ranges reflect what sellers commonly report.</p>
          <div className="table-wrap mt-26">
            <table className="cmp">
              <thead>
                <tr><th>Content Type</th><th>Typical Price Range</th><th>What Usually Moves the Price</th></tr>
              </thead>
              <tbody>
                {PRICES.map(([type, price, moves]) => (
                  <tr key={type}>
                    <td data-label="Content Type">{type}</td>
                    <td className="amt" data-label="Typical Price">{price}</td>
                    <td data-label="What Moves the Price">{moves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="table-note">Ranges are indicative only, based on commonly reported seller pricing. Earnings are not guaranteed and vary enormously between sellers.</p>

          <h3 className="mt-34">What Actually Separates High Earners From Everyone Else</h3>
          <div className="grid grid-2 gap-40 mt-18">
            <CheckList
              items={[
                <><strong>Volume of listings</strong> — a profile with forty photos gets found far more often than one with five.</>,
                <><strong>Consistency</strong> — uploading weekly keeps a profile surfacing to new buyers; posting once and stopping does not.</>,
                <><strong>Repeat buyers</strong> — a handful of regulars who buy every month is worth more than a stream of one-off sales.</>,
              ]}
            />
            <CheckList
              items={[
                <><strong>Custom work</strong> — the highest per-sale prices almost always come from custom requests, not the public catalogue.</>,
                <><strong>Fast, polite replies</strong> — buyers who get an answer within a day convert at a much higher rate.</>,
                <><strong>Bundling</strong> — pricing a set below the sum of its singles reliably raises the average order value.</>,
              ]}
            />
          </div>
        </div>
      </section>

      {/* 9. STAYING ANONYMOUS */}
      <section className="teal" id="anonymous">
        <div className="wrap">
          <p className="eyebrow">Privacy Checklist</p>
          <h2>Staying Anonymous While Selling Feet Pics</h2>
          <p className="lead">Anonymity is not one setting you switch on. It is a series of small choices that each remove one more way of connecting your seller profile to your real life.</p>
          <div className="grid grid-2 gap-40 mt-28">
            <CheckList
              items={[
                <><strong>Use a dedicated email</strong> that has never been used for a personal or work account.</>,
                <><strong>Choose a seller name</strong> with no relation to your real name, birth year, or existing handles.</>,
                <><strong>Never show your face</strong>, and be careful about hair, hands, and clothing that appear in your other public posts.</>,
                <><strong>Remove location data</strong> from every photo before uploading.</>,
                <><strong>Watch the background</strong> for mirrors, windows, mail, screens, and anything with text.</>,
                <><strong>Crop or hide identifying marks</strong> like distinctive tattoos, scars, and birthmarks if you would rather not be recognisable.</>,
              ]}
            />
            <CheckList
              variant="crosses"
              items={[
                <><strong>Do not reuse photos</strong> that already exist on your public social media accounts.</>,
                <><strong>Do not share your city</strong>, workplace, school, or any detail that narrows you down.</>,
                <><strong>Do not accept video calls</strong> or voice notes from buyers.</>,
                <><strong>Do not give out a phone number</strong>, personal messenger, or private email.</>,
                <><strong>Do not send bank details</strong> to anyone — payouts always run through the platform.</>,
                <><strong>Do not respond to pressure</strong>. A buyer pushing for personal information is not a buyer worth having.</>,
              ]}
            />
          </div>
          <h3 className="mt-34">What To Do If a Buyer Asks Something You Are Not Comfortable With</h3>
          <p>Say no once, clearly and politely, and do not negotiate. You are not obliged to explain your reasoning or offer an alternative. If they push after a clear no, block and report them — that is exactly what the report function is for, and using it protects other sellers too.</p>
        </div>
      </section>

      {/* 10. CTA BAND 2 */}
      <section className="alt" id="cta-2">
        <div className="wrap">
          <div className="cta-band deepcta">
            <p className="eyebrow">Free to Join</p>
            <h2>Sign Up Free and List Your First Set</h2>
            <p>Creating a seller account costs nothing. You only pay a commission when you actually sell something, which means there is no downside to setting up a profile and seeing what interest looks like.</p>
            <div className="mt-22"><CtaButton>Create My Free Account</CtaButton></div>
          </div>
        </div>
      </section>

      {/* 11. WHAT TO CHARGE */}
      <section id="pricing">
        <div className="wrap">
          <p className="eyebrow">Pricing Strategy</p>
          <h2>How Do You Know What to Charge?</h2>
          <p className="lead">Pricing is where new sellers lose the most money, almost always by going too low. Cheap listings do not signal value; they signal inexperience, and they attract the buyers who haggle hardest.</p>
          <div className="grid grid-2 gap-40 mt-26">
            <CheckList
              items={[
                <><strong>Start mid-range, not bottom</strong> — pricing a single photo at $2 tells buyers your work is worth $2, and raising prices later is harder than lowering them.</>,
                <><strong>Look at comparable sellers</strong> — browse profiles with a similar gallery size and quality, and price in the same band rather than under it.</>,
                <><strong>Price bundles below the sum of singles</strong> — a ten-photo set at $35 when singles are $8 gives an obvious reason to buy the bigger option.</>,
                <><strong>Charge more for custom work</strong> — it is your time, your specific effort, and it is exclusive. It should never cost the same as a catalogue photo.</>,
              ]}
            />
            <CheckList
              items={[
                <><strong>Add a premium for exclusivity</strong> — if you agree to retire a set after sale so nobody else can buy it, that is worth a significant multiple.</>,
                <><strong>Raise prices as your profile grows</strong> — more reviews, more repeat buyers, and a larger catalogue all justify moving up a tier.</>,
                <><strong>Use limited discounts, not permanent ones</strong> — an occasional bundle offer creates urgency; a permanently discounted profile just resets your baseline.</>,
                <><strong>Account for the platform fee</strong> — work out your actual take-home per sale before deciding whether a price is worth your time.</>,
              ]}
            />
          </div>
          <h3 className="mt-34">A Starting Point for Week One</h3>
          <ol className="numbered mt-18">
            <li><strong>Singles at $8–$12.</strong> High enough to signal quality, low enough for an impulse purchase from someone who has not bought from you before.</li>
            <li><strong>One starter bundle at $25–$35.</strong> Around eight to ten photos in a single clear theme. This is what most first-time buyers actually pick.</li>
            <li><strong>Customs starting at $30.</strong> Quote per request rather than posting a fixed rate, and price by how much time and setup the request needs.</li>
            <li><strong>Review after ten sales.</strong> If everything sells immediately, you are priced too low. If nothing moves in a month, the issue is usually photo quality or catalogue size, not price.</li>
          </ol>
        </div>
      </section>

      {/* 12. FIVE STEPS */}
      <section className="alt" id="five-steps">
        <div className="wrap">
          <p className="eyebrow">Step by Step</p>
          <h2>Five Simple Steps to Sell Feet Pics</h2>
          <div className="steps mt-28">
            {FIVE_STEPS.map((s, i) => (
              <div className="step" key={s.name}>
                <span className="num">{i + 1}</span>
                <div><h3>{s.name}</h3><p>{s.text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. PROS AND CONS */}
      <section id="pros-cons">
        <div className="wrap">
          <p className="eyebrow">An Honest Look</p>
          <h2>Pros and Cons of Selling Feet Pics</h2>
          <p className="lead">It is a legitimate way to earn, and it is also not effortless money. Both of those are true, and knowing the second one in advance is what stops people quitting in week three.</p>
          <div className="proscons">
            <div className="pc pc-pro">
              <div className="pc-head">What Works in Your Favour</div>
              <div className="pc-body">
                <CheckList
                  items={[
                    <><strong>Almost no startup cost</strong> — a phone and daylight are genuinely enough to begin.</>,
                    <><strong>You stay anonymous</strong> — no face, no name, no personal details on display.</>,
                    <><strong>Completely flexible</strong> — shoot when you want, upload when you want, pause whenever.</>,
                    <><strong>You own the pricing</strong> — no fixed rate card imposed on you.</>,
                    <><strong>Non-explicit content</strong> — the standard format keeps this far simpler than adult content.</>,
                    <><strong>Content keeps earning</strong> — a good set can sell repeatedly long after it was shot.</>,
                  ]}
                />
              </div>
            </div>
            <div className="pc pc-con">
              <div className="pc-head">What to Go In Expecting</div>
              <div className="pc-body">
                <CheckList
                  variant="crosses"
                  items={[
                    <><strong>Income is unpredictable</strong> — some weeks are quiet, and nothing about this is guaranteed.</>,
                    <><strong>It is a real time commitment</strong> — shooting, editing, listing, and replying all add up.</>,
                    <><strong>Time-wasters exist</strong> — you will get messages that never turn into a sale.</>,
                    <><strong>Content theft happens</strong> — watermarking limits it but cannot eliminate it entirely.</>,
                    <><strong>Platforms take a commission</strong> — your headline price is not your take-home.</>,
                    <><strong>Tax is your responsibility</strong> — nobody withholds it for you, so track your payouts.</>,
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. BOTH SIDES */}
      <section className="alt" id="both-sides">
        <div className="wrap">
          <p className="eyebrow">Buyers and Sellers</p>
          <h2>What You Get on Both Sides of the Marketplace</h2>
          <p className="lead">A marketplace only works when both sides are protected. Here is what each side actually gets.</p>
          <div className="sides">
            <div>
              <h3>For Sellers</h3>
              <CheckList
                className="mt-16"
                items={[
                  'Anonymous profile with no face or real name required',
                  'Full control over pricing, content, and what customs you accept',
                  'Payments held by the platform until the sale completes',
                  'An audience already searching for foot content',
                  'Block and report tools for anyone who oversteps',
                  'Unpublish, pause, or close your profile at any time',
                ]}
              />
            </div>
            <div>
              <h3>For Buyers</h3>
              <CheckList
                className="mt-16"
                items={[
                  'Verified adult sellers rather than anonymous DM accounts',
                  'Browse by category, style, and theme instead of hunting',
                  'Clear prices published upfront with no haggling required',
                  'Secure checkout without sending money to a stranger',
                  'Custom requests handled through a structured process',
                  'Ratings and history to judge a seller before buying',
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 15. WHERE CAN I BUY */}
      <section id="buy">
        <div className="wrap">
          <p className="eyebrow">For Buyers</p>
          <h2>Where Can I Buy Feet Pics?</h2>
          <p>If you are on the buying side, the shortlist is short for the same reason it is short for sellers: most places people try are not built for this and offer no protection to either party. Social media accounts offering foot content are frequently resellers of stolen images, and paying a stranger directly by transfer or gift card leaves you with no recourse whatsoever.</p>
          <p>A dedicated marketplace fixes both problems. Sellers are age-verified, content is listed with visible pricing, and payment runs through a checkout rather than a private transfer. If something goes wrong, there is a platform to report it to.</p>
          <h3 className="mt-30">What to Check Before Buying a Feet Pic Set</h3>
          <div className="grid grid-2 gap-40 mt-18">
            <CheckList
              items={[
                <><strong>A real catalogue</strong> — a seller with one or two images and no history is worth approaching carefully.</>,
                <><strong>Consistent style</strong> — wildly mismatched photo quality across a profile can indicate content that was not shot by that seller.</>,
                <><strong>Clear listed prices</strong> — published pricing means fewer surprises mid-conversation.</>,
              ]}
            />
            <CheckList
              variant="crosses"
              items={[
                <><strong>Never pay outside the platform</strong> — off-platform transfers have no protection at all.</>,
                <><strong>Never send gift cards</strong> — this is a scam pattern, not a payment method.</>,
                <><strong>Never request anything involving minors</strong> — this is illegal, and legitimate platforms report it immediately.</>,
              ]}
            />
          </div>
        </div>
      </section>

      {/* 16. FAQ */}
      <section className="alt" id="faq">
        <div className="wrap">
          <p className="eyebrow">Questions Answered</p>
          <h2>Selling Feet Pics — Frequently Asked Questions</h2>
          <FaqList items={FAQ} openFirst />
        </div>
      </section>

      {/* 17. FINAL CTA */}
      <section id="final-cta">
        <div className="wrap">
          <div className="cta-band">
            <p className="eyebrow">Your Next Step</p>
            <h2>Ready to Sell Your First Set of Feet Pics?</h2>
            <p>Set up an anonymous seller profile, upload a themed set, price it properly, and let buyers who are already searching for foot content find you. It is free to start and you can stop whenever you want.</p>
            <div className="mt-22"><CtaButton>Start Selling Feet Pics Now</CtaButton></div>
          </div>
          <p className="mt-26"><Link href="/">← Back to the Fun With Feet overview</Link></p>
        </div>
      </section>
    </main>
  )
}
