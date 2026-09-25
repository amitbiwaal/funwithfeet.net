import { SITE_NOINDEX } from '@/lib/site'

/** Reminder that the whole site is hidden from search engines (see SITE_NOINDEX). Server component. */
export function NoindexNotice() {
  if (!SITE_NOINDEX) return null
  return (
    <p className="adm-alert info" role="status" data-testid="noindex-notice">
      <span>
        Search engines are told not to index this site (noindex). To appear in Google, set{' '}
        <code>SITE_NOINDEX=false</code> in Vercel → Settings → Environment Variables and redeploy.
      </span>
    </p>
  )
}
