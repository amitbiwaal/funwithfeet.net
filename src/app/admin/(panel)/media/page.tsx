import type { Metadata } from 'next'
import { Flash, param } from '@/components/admin/Flash'
import { MediaUploader } from '@/components/admin/MediaUploader'
import { ConfirmButton, CopyButton } from '@/components/admin/ui'
import { requireAdmin } from '@/lib/auth'
import { listMedia } from '@/lib/media'
import { formatBytes, formatDate } from '@/lib/utils'
import { deleteMediaAction, updateMediaAltAction } from './actions'

export const metadata: Metadata = { title: 'Media' }

const SAVED: Record<string, string> = { deleted: 'Image deleted.', alt: 'Alt text saved.' }

export default async function MediaPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin()
  const sp = await searchParams
  const items = listMedia()

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Media library</h1>
          <p>Images uploaded here can be used as cover images or inserted into posts and pages.</p>
        </div>
      </div>
      <Flash ok={SAVED[param(sp.saved)]} />
      <div className="adm-card">
        <MediaUploader />
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <h2>{items.length} image{items.length === 1 ? '' : 's'}</h2>
        </div>
        {items.length === 0 ? (
          <p className="adm-empty">No images uploaded yet.</p>
        ) : (
          <div className="adm-media-grid" data-testid="media-grid">
            {items.map((m) => (
              <div className="adm-media-card" key={m.id}>
                <div className="img">
                  <img src={m.url} alt={m.alt || m.original_name} loading="lazy" />
                </div>
                <div className="meta">
                  <strong title={m.original_name}>{m.original_name}</strong>
                  <span>
                    {m.width && m.height ? `${m.width}×${m.height} · ` : ''}
                    {formatBytes(m.size)} · {formatDate(m.created_at, { month: 'short' })}
                  </span>
                  <form action={updateMediaAltAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <input className="adm-input" name="alt" defaultValue={m.alt} placeholder="Alt text" aria-label={`Alt text for ${m.original_name}`} maxLength={200} />
                    <button className="btn btn-sm btn-plain" type="submit">Save</button>
                  </form>
                  <div className="adm-row-actions">
                    <CopyButton text={m.url} />
                    <form action={deleteMediaAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <ConfirmButton message="Delete this image? Posts that use it will show a broken image.">Delete</ConfirmButton>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
