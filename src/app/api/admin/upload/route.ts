import { getCurrentUser } from '@/lib/auth'
import { saveUpload } from '@/lib/media'

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  if (!(await getCurrentUser())) return Response.json({ error: 'Please sign in again.' }, { status: 401 })
  if (!sameOrigin(req)) return Response.json({ error: 'Cross-site upload blocked.' }, { status: 403 })

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return Response.json({ error: 'Upload failed — the file may be too large.' }, { status: 400 })
  }
  const file = form.get('file')
  if (!(file instanceof File)) return Response.json({ error: 'No file received.' }, { status: 400 })

  try {
    const item = await saveUpload(file, String(form.get('alt') ?? ''))
    return Response.json({ item })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Upload failed.' }, { status: 400 })
  }
}
