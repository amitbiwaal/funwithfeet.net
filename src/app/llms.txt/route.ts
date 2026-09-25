import { listLivePosts, postSummary } from '@/lib/posts'
import { absoluteUrl, SITE } from '@/lib/site'

export const dynamic = 'force-dynamic'

/** llms.txt for AI search engines — the original static file, plus the latest blog articles. */
export function GET() {
  const { posts } = listLivePosts({ limit: 25 })
  const articles = posts.map((p) => `- ${p.title}: ${absoluteUrl(`/blog/${p.slug}`)} — ${postSummary(p, 160)}`).join('\n')

  const body = `# FunWithFeet.net — Sell Feet Pics Safely with Fun With Feet

> FunWithFeet.net is an independent, affiliate-supported informational website that explains how creators can sell feet pics safely and earn money using Fun With Feet, a dedicated feet pics marketplace. It also covers how buyers can discover creators and purchase foot content.

## Summary
The site is a complete guide to the Fun With Feet feet pics marketplace: what it is, key features (privacy-focused selling, creator profiles, simple uploads, flexible pricing, buyer marketplace, safer communication), benefits, a step-by-step selling process, content categories, safety and privacy guidance, a comparison with selling on social media, pricing, legal and tax basics, FAQs, and a blog with practical guides.

## Primary Topics
- How to sell feet pics safely online
- Buying and selling feet pictures on a dedicated marketplace
- Fun With Feet features, benefits, and pricing flexibility
- Privacy and anonymity for foot content creators
- Getting started, earning tips, and avoiding scams

## Key Pages
- Home / Main guide: ${absoluteUrl('/')}
- How to Sell Feet Pics (beginner walkthrough: 4-step setup, what you need, niches, earnings, pricing, safety, legal/tax, country notes, FAQ): ${absoluteUrl('/how-to-sell-feet-pics')}
- Sell Feet Pics (full guide: pricing, legality, anonymity, scams, step-by-step): ${absoluteUrl('/sell-feet-pics')}
- Blog (guides on pricing, safety, photography): ${absoluteUrl('/blog')}
- About & editorial standards: ${absoluteUrl('/about')}
- Features: ${absoluteUrl('/#features')}
- How It Works: ${absoluteUrl('/#how-it-works')}
- Safety & Privacy: ${absoluteUrl('/#safety')}
- FAQ: ${absoluteUrl('/#faq')}

## Latest Articles
${articles || '- (none yet)'}

## Primary Keywords
fun with feet, funwithfeet, sell feet pics, feet pics, sell feet pictures, how to sell feet pics, sell feet pics online, buy feet pics, feet pics marketplace, where to sell feet pics

## Call to Action
Primary CTA links direct users to the Fun With Feet / FeetFinder marketplace to create a private creator profile and start selling feet pics.

## Disclaimer
${SITE.disclaimer}

## Contact
${absoluteUrl('/contact')}
`
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
