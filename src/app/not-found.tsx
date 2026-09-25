import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { NotFoundContent } from '@/components/site/NotFoundContent'

// URLs that match no route at all render here, outside the (site) layout,
// so this version brings its own header and footer.
export default function NotFound() {
  return (
    <>
      <Header />
      <NotFoundContent />
      <Footer />
    </>
  )
}
