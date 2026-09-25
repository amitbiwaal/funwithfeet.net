import { Breadcrumb, CheckList, JsonLd } from '@/components/site/ui'
import { breadcrumbLd, buildMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { ContactForm } from './ContactForm'

export const metadata = buildMetadata({
  title: 'Contact FunWithFeet.net',
  description: 'Send FunWithFeet.net a question, correction, partnership enquiry or privacy request. We reply within 2–3 business days.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <main id="top">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact FunWithFeet.net',
          url: absoluteUrl('/contact'),
        }}
      />
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])} />

      <section className="hero">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Contact' }]} />
          <p className="eyebrow">Contact</p>
          <h1>Get in Touch</h1>
          <p className="lead">
            Questions about a guide, a correction, a partnership idea or a privacy request — send us a message and a real person
            will read it.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap contact-grid">
          <div className="card">
            <h2>Send a Message</h2>
            <ContactForm />
          </div>
          <div className="panel">
            <h3>Before you write</h3>
            <CheckList
              className="compact"
              items={[
                <><strong>We&apos;re an independent guide.</strong> We can&apos;t access or change accounts on any marketplace.</>,
                <><strong>Account or payout issues?</strong> Contact the platform&apos;s own support team directly.</>,
                <><strong>Found a mistake?</strong> Tell us the page and what&apos;s wrong — corrections are reviewed quickly.</>,
                <><strong>Privacy requests</strong> are handled within 30 days, as described in our privacy policy.</>,
              ]}
            />
            <p className="small-note mt-22">We usually reply within 2–3 business days. This site is for adults aged 18+.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
