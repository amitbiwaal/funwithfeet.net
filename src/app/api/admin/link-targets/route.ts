import { getCurrentUser } from '@/lib/auth'
import { listLinkTargets } from '@/lib/link-targets'

/** Internal pages/posts the editor's link dialog can link to. */
export async function GET() {
  if (!(await getCurrentUser())) return Response.json({ error: 'Please sign in again.' }, { status: 401 })
  return Response.json({ items: listLinkTargets() }, { headers: { 'Cache-Control': 'no-store' } })
}
