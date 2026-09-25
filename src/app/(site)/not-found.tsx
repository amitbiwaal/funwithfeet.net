import { NotFoundContent } from '@/components/site/NotFoundContent'

// notFound() inside public pages renders within the (site) layout, which
// already provides the header and footer.
export default function SiteNotFound() {
  return <NotFoundContent />
}
