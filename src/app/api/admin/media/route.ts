import { getCurrentUser } from '@/lib/auth'
import { listMedia } from '@/lib/media'

export async function GET() {
  if (!(await getCurrentUser())) return Response.json({ error: 'Please sign in again.' }, { status: 401 })
  return Response.json(
    { items: listMedia() },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
