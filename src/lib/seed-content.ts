import { SITE } from './site'

export const SEED_CATEGORIES = [
  { name: 'Selling Guides', slug: 'selling-guides', description: 'Step-by-step guides for starting and growing as a feet pic seller.' },
  { name: 'Safety & Privacy', slug: 'safety-privacy', description: 'Staying anonymous, avoiding scams and protecting your content.' },
  { name: 'Pricing & Earnings', slug: 'pricing-earnings', description: 'What to charge, how bundles work and realistic earning expectations.' },
  { name: 'Photography Tips', slug: 'photography-tips', description: 'Lighting, angles, props and editing for feet pics that sell.' },
]

const aff = `href="${SITE.affiliateUrl}" target="_blank" rel="noopener sponsored"`

export const SEED_PAGES = [
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    meta_title: 'Privacy Policy | FunWithFeet.net',
    meta_description: 'How FunWithFeet.net collects, uses and protects information when you visit the site or contact us.',
    content: `
<p>This Privacy Policy explains what information FunWithFeet.net ("we", "us") collects when you visit this website, how it is used, and the choices you have. FunWithFeet.net is an independent informational guide. We do not sell anything directly and we do not run the marketplaces we write about.</p>
<h2>Information we collect</h2>
<h3>Information you give us</h3>
<p>If you use our <a href="/contact">contact form</a>, we receive the name, email address, subject and message you enter. We use this only to read and reply to your message.</p>
<h3>Information collected automatically</h3>
<p>Like most websites, our hosting server records standard technical logs such as IP address, browser type, the page requested and the time of the request. These logs are used for security, troubleshooting and preventing abuse, and are kept for a limited period.</p>
<h2>Cookies</h2>
<p>Public pages on FunWithFeet.net do not set advertising or tracking cookies of their own. A single strictly necessary cookie is used to keep site administrators signed in to the content management area; it is never set for regular visitors.</p>
<p>If we add privacy-friendly analytics in the future, this policy will be updated before it goes live.</p>
<h2>Affiliate links and third-party sites</h2>
<p>Some links on this site are affiliate links. When you click one, you leave FunWithFeet.net and the destination site (for example, a feet pics marketplace) may set its own cookies to record that you arrived from us. Those sites have their own privacy policies, which we do not control. Please review them before creating an account or sharing personal information.</p>
<h2>How we use information</h2>
<ul>
<li>To reply to messages sent through the contact form.</li>
<li>To keep the website secure and working properly.</li>
<li>To understand which guides are useful so we can improve them.</li>
</ul>
<p>We do not sell, rent or trade your personal information.</p>
<h2>Data retention</h2>
<p>Contact form messages are kept only as long as needed to handle your request and are then deleted. Server logs are rotated automatically.</p>
<h2>Your rights</h2>
<p>Depending on where you live (for example, under the GDPR in the EU/UK or the CCPA in California), you may have the right to access, correct or delete personal information we hold about you. To make a request, use the <a href="/contact">contact form</a> and choose "Privacy request".</p>
<h2>Age requirement</h2>
<p>This website is intended for adults aged 18 and over. We do not knowingly collect information from anyone under 18.</p>
<h2>Changes to this policy</h2>
<p>We may update this policy from time to time. The "Last updated" date at the top of this page shows when it last changed.</p>
`.trim(),
  },
  {
    title: 'Terms of Use',
    slug: 'terms',
    meta_title: 'Terms of Use | FunWithFeet.net',
    meta_description: 'The terms that apply when you use FunWithFeet.net, an independent guide to selling feet pics safely.',
    content: `
<p>By accessing or using FunWithFeet.net (the "Site") you agree to these Terms of Use. If you do not agree, please do not use the Site.</p>
<h2>Adults only</h2>
<p>The Site is intended for adults aged 18 or over. By using it you confirm that you are at least 18 years old and legally able to agree to these terms where you live.</p>
<h2>Informational content only</h2>
<p>Everything on the Site is general information and opinion. It is not legal, tax, financial or professional advice. Laws, platform rules and tax treatment differ by country and change over time, so always check the rules that apply to you and speak to a qualified professional when in doubt.</p>
<h2>No guaranteed earnings</h2>
<p>Any figures, price ranges or examples on the Site are illustrations based on commonly reported information. They are not promises. Many sellers earn little or nothing, and your results depend on many factors outside our control.</p>
<h2>Affiliate links and third-party services</h2>
<p>The Site contains links to third-party websites, including affiliate links for which we may earn a commission. We do not operate, control or endorse those services and are not responsible for their content, policies, payments or conduct. Your use of any third-party service is governed by that service's own terms.</p>
<h2>Acceptable use</h2>
<ul>
<li>Do not use the Site for any unlawful purpose.</li>
<li>Do not attempt to access admin areas, interfere with the Site's security or overload its servers.</li>
<li>Do not copy or republish substantial parts of our content without permission.</li>
</ul>
<h2>Intellectual property</h2>
<p>The Site's original text, layout and graphics are owned by FunWithFeet.net. Brand names, logos and trademarks mentioned on the Site belong to their respective owners.</p>
<h2>Disclaimer and limitation of liability</h2>
<p>The Site is provided "as is" without warranties of any kind. To the fullest extent permitted by law, FunWithFeet.net is not liable for any loss or damage arising from your use of the Site or any third-party service linked from it.</p>
<h2>Changes</h2>
<p>We may update these terms at any time. Continued use of the Site after changes are published means you accept the updated terms.</p>
<h2>Contact</h2>
<p>Questions about these terms? Reach us through the <a href="/contact">contact page</a>.</p>
`.trim(),
  },
  {
    title: 'Affiliate Disclosure & Disclaimer',
    slug: 'disclaimer',
    meta_title: 'Affiliate Disclosure & Disclaimer | FunWithFeet.net',
    meta_description: 'How FunWithFeet.net is funded, our affiliate relationships, and important disclaimers about earnings and advice.',
    content: `
<p>FunWithFeet.net is an independent informational guide. We want you to know exactly how the site is funded and what our content is — and is not.</p>
<h2>Affiliate links</h2>
<p>Some links on this site, including most "Sell Feet Pics" and "Start Selling" buttons, are affiliate links. If you sign up or make a purchase through one of them, we may earn a commission <strong>at no extra cost to you</strong>. Affiliate links are marked with <code>rel="sponsored"</code> in the page code.</p>
<p>Commissions help pay for hosting and research. They never change what we say about safety, privacy or pricing, and we will never recommend a practice we consider unsafe because it pays.</p>
<h2>Not officially affiliated</h2>
<p>We are not officially affiliated with, endorsed by, or operated by Fun With Feet, FeetFinder or any other marketplace unless we clearly say so. All brand names, logos and trademarks belong to their respective owners.</p>
<h2>Earnings disclaimer</h2>
<p>Price ranges and earning examples on this site are indicative only, based on commonly reported seller experiences. There is no guaranteed income from selling feet pics, and results vary enormously between sellers.</p>
<h2>Not professional advice</h2>
<p>Our guides cover legal and tax topics in general terms only. They are not legal, tax or financial advice. Check the rules where you live and consult a qualified professional for advice about your situation.</p>
<h2>Adults only</h2>
<p>All content on this site is intended for adults aged 18 and over.</p>
`.trim(),
  },
]

type SeedPost = {
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  cover_alt: string
  category: string
  tags: string
  featured: boolean
  meta_title: string
  meta_description: string
  author_name: string
}

export const SEED_POSTS: SeedPost[] = [
  {
    title: '7 Feet Pic Scams Every New Seller Should Know (and How to Avoid Them)',
    slug: 'feet-pic-scams-how-to-avoid-them',
    category: 'safety-privacy',
    tags: 'scams, safety, beginners',
    featured: false,
    author_name: SITE.editorialAuthor,
    cover_image: '/assets/how-to-sell-feet-pics/niche-sneakers-sport.jpg',
    cover_alt: 'Feet in trainers and athletic socks on a plain floor',
    meta_title: '7 Feet Pic Scams to Avoid in 2026 | Fun With Feet',
    meta_description: 'The seven scams that target new feet pic sellers — fake payments, verification fees, overpayments and more — and the simple rules that stop every one.',
    excerpt: 'Almost every scam aimed at feet pic sellers follows one of seven patterns. Learn to spot them in the first message and you will never lose a set to a fake buyer.',
    content: `
<p>Scams are the most common bad experience new sellers report. The good news: nearly all of them follow the same handful of scripts, and one rule defeats most of them — <strong>payment first, content after, and never move off the platform.</strong></p>
<h2>1. "I'll pay after you send it"</h2>
<p>The oldest trick in the book. The buyer is friendly, sounds genuine and promises to pay the moment the photos arrive. Once they have the content, they disappear.</p>
<ul>
<li>Never deliver anything until the marketplace confirms the payment has cleared.</li>
<li>There are no exceptions for "regulars", "big spenders" or anyone in a hurry.</li>
</ul>
<h2>2. The fake payment screenshot</h2>
<p>A buyer sends a screenshot "proving" they paid. Screenshots are trivially easy to fake. The only proof of payment is the balance in your own seller dashboard.</p>
<h2>3. The verification or "unlock" fee</h2>
<p>You are told your account, payout or a large order needs a small fee to be released. Legitimate platforms never ask sellers to pay to receive money. Anyone asking you to send money first is running a scam.</p>
<h2>4. The overpayment refund</h2>
<p>The buyer "accidentally" pays too much and asks you to send the difference back. The original payment is later reversed or was never real — and the "refund" you sent is gone for good.</p>
<blockquote><p>If a buyer sends more than the agreed price, do not refund anything yourself. Contact the platform's support and let them handle it.</p></blockquote>
<h2>5. "Let's talk on Telegram / Cash App instead"</h2>
<p>Moving the conversation or the payment off-platform removes every protection you have: no held payments, no chat history support can review, no way to get the buyer banned. It is also how scammers collect your phone number and real name.</p>
<h2>6. The free sample to "prove it's you"</h2>
<p>A buyer asks for a free custom photo to confirm you are real before they commit to a big order. The big order never comes. Your public previews and profile are the proof — customs are always paid first.</p>
<h2>7. Stolen-content resellers</h2>
<p>Some "buyers" purchase once and resell your set elsewhere. You cannot stop this completely, but you can make it much less attractive:</p>
<ol>
<li>Watermark every public preview.</li>
<li>Strip location data (EXIF) from photos before uploading.</li>
<li>Never post the same photos on your personal social media.</li>
</ol>
<h2>A quick red-flag checklist</h2>
<table><tbody>
<tr><th><p>Red flag</p></th><th><p>What to do</p></th></tr>
<tr><td><p>Asks to pay later</p></td><td><p>Decline. Payment first, always.</p></td></tr>
<tr><td><p>Sends a payment screenshot</p></td><td><p>Check your dashboard, ignore the image.</p></td></tr>
<tr><td><p>Wants you to pay a fee</p></td><td><p>Block and report.</p></td></tr>
<tr><td><p>Wants your phone or messenger</p></td><td><p>Keep the chat on-platform.</p></td></tr>
<tr><td><p>Pushes after you say no</p></td><td><p>Block and report — it protects other sellers too.</p></td></tr>
</tbody></table>
<h2>Sell where the platform holds the payment</h2>
<p>Scammers love sellers who seem desperate, so set fair prices from day one — our <a href="/blog/how-much-to-charge-for-feet-pics">feet pic pricing guide</a> shows realistic ranges.</p>
<p>A dedicated marketplace that holds the buyer's money until the sale completes removes most of these scams before they start. If you are just getting started, <a ${aff}>create a free seller profile</a> and keep every conversation and payment inside the platform. For the full walkthrough, read our guide on <a href="/how-to-sell-feet-pics">how to sell feet pics</a>.</p>
`.trim(),
  },
  {
    title: 'How Much Should You Charge for Feet Pics? A 2026 Pricing Guide',
    slug: 'how-much-to-charge-for-feet-pics',
    category: 'pricing-earnings',
    tags: 'pricing, bundles, custom requests',
    featured: true,
    author_name: SITE.editorialAuthor,
    cover_image: '/assets/how-to-sell-feet-pics/niche-barefoot-natural.jpg',
    cover_alt: 'Natural bare feet resting on a plain light sheet',
    meta_title: 'How Much to Charge for Feet Pics (2026 Pricing Guide)',
    meta_description: 'Realistic prices for feet pic singles, bundles, customs and subscriptions, plus a simple week-one pricing plan for new sellers.',
    excerpt: 'Most new sellers start too low. Here are realistic price ranges for singles, bundles, customs and subscriptions — and a simple plan for your first week.',
    content: `
<p>Pricing is where new sellers lose the most money, and almost always by going too low. Cheap listings don't signal value — they signal inexperience, and they attract the buyers who haggle hardest. Here is how to set prices that sell <em>and</em> respect your time.</p>
<h2>Typical feet pic prices in 2026</h2>
<p>These ranges reflect what sellers commonly report on dedicated marketplaces. Treat them as a starting point for testing, not a promise.</p>
<table><tbody>
<tr><th><p>Content type</p></th><th><p>Typical range</p></th><th><p>What moves the price</p></th></tr>
<tr><td><p>Single photo</p></td><td><p>$5 – $15</p></td><td><p>Lighting, angle, popular theme</p></td></tr>
<tr><td><p>Small bundle (5–10 photos)</p></td><td><p>$20 – $50</p></td><td><p>Coherent theme, variety of angles</p></td></tr>
<tr><td><p>Custom request</p></td><td><p>$25 – $100+</p></td><td><p>Poses, props, turnaround, exclusivity</p></td></tr>
<tr><td><p>Short video clip</p></td><td><p>$20 – $80</p></td><td><p>Length and complexity</p></td></tr>
<tr><td><p>Monthly subscription</p></td><td><p>$10 – $25 / mo</p></td><td><p>Upload frequency and extras</p></td></tr>
</tbody></table>
<h2>Five pricing rules that protect your income</h2>
<ol>
<li><strong>Start mid-range, not at the bottom.</strong> A $2 photo tells buyers your work is worth $2 — and raising prices later is harder than lowering them.</li>
<li><strong>Price bundles below the sum of singles.</strong> Around 60–70% of the individual total gives buyers an obvious reason to choose the bigger option.</li>
<li><strong>Charge 2–3× for customs.</strong> It is your time, your setup and it is exclusive. Always collect payment before you create anything.</li>
<li><strong>Add a premium for exclusivity.</strong> Retiring a set after one sale is worth a significant multiple.</li>
<li><strong>Know your take-home.</strong> Subtract the platform commission before deciding whether a price is worth your time.</li>
</ol>
<h2>A simple plan for week one</h2>
<ul>
<li>Singles at <strong>$8–$12</strong> — high enough to signal quality, low enough for an impulse buy.</li>
<li>One starter bundle at <strong>$25–$35</strong> with eight to ten photos in a single clear theme.</li>
<li>Customs quoted per request, starting around <strong>$30</strong>.</li>
<li>Review after ten sales: if everything sells instantly you are too cheap; if nothing moves in a month, look at photo quality and catalogue size before cutting prices.</li>
</ul>
<blockquote><p><strong>Tip:</strong> use limited-time bundle offers instead of permanent discounts. A permanent discount just resets your baseline price.</p></blockquote>
<h2>What actually raises your prices over time</h2>
<p>Reviews, repeat buyers and a larger catalogue all justify moving up a tier. Sellers who upload consistently, reply within a day and nurture a handful of regulars usually earn far more than those who simply post the cheapest photos.</p>
<p>Higher prices also attract more fake buyers, so learn the <a href="/blog/feet-pic-scams-how-to-avoid-them">seven feet pic scams to watch out for</a> before your first sale.</p>
<h2>Ready to set your first prices?</h2>
<p>You can list singles, bundles and customs with your own prices on a dedicated marketplace. <a ${aff}>Create your free seller profile</a>, then use the week-one plan above. For everything else — from photos to payouts — see our complete guide on <a href="/how-to-sell-feet-pics">how to sell feet pics</a>.</p>
<p><em>Prices are indicative only and earnings are not guaranteed.</em></p>
`.trim(),
  },
]
