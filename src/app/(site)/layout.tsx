import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#top">
        Skip to content
      </a>
      <Header />
      {children}
      <Footer />
    </>
  )
}
