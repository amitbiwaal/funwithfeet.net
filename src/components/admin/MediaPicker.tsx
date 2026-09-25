'use client'

import { useEffect, useState, type KeyboardEvent } from 'react'
import type { MediaItem } from '@/lib/media'
import { Modal } from './ui'

export type PickedImage = { url: string; alt: string; width?: number; height?: number }

// The picker renders inside the editor <form>; Enter must not submit it.
const blockEnter = (e: KeyboardEvent) => {
  if (e.key === 'Enter') e.preventDefault()
}

export async function uploadImage(file: File, alt = ''): Promise<MediaItem> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('alt', alt)
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Upload failed.')
  return data.item as MediaItem
}

/**
 * Pick an image: upload a new one, choose from the media library, or paste a
 * URL. Used by the editor's "Insert image" button and the cover image box.
 */
export function MediaPicker({
  title,
  confirmLabel,
  initialAlt = '',
  onClose,
  onPick,
}: {
  title: string
  confirmLabel: string
  initialAlt?: string
  onClose: () => void
  onPick: (img: PickedImage) => void
}) {
  const [tab, setTab] = useState<'upload' | 'library' | 'url'>('upload')
  const [items, setItems] = useState<MediaItem[] | null>(null)
  const [selected, setSelected] = useState<string>('')
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState(initialAlt)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setItems(d.items ?? [])
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function onFile(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const item = await uploadImage(file, alt)
      setItems((prev) => [item, ...(prev ?? [])])
      setSelected(item.url)
      if (!alt) setAlt(item.original_name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '))
      setTab('library')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
    } finally {
      setBusy(false)
    }
  }

  const chosen = tab === 'url' ? url.trim() : selected
  const valid = !!chosen && (chosen.startsWith('/') || /^https?:\/\//i.test(chosen))

  return (
    <Modal
      title={title}
      onClose={onClose}
      wide
      footer={
        <>
          <button type="button" className="btn btn-plain" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-teal"
            disabled={!valid || busy}
            onClick={() => {
              const item = tab === 'url' ? undefined : items?.find((m) => m.url === chosen)
              onPick({ url: chosen, alt: alt.trim(), width: item?.width ?? undefined, height: item?.height ?? undefined })
            }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="adm-seg" role="group" aria-label="Image source">
        <button type="button" aria-pressed={tab === 'upload'} onClick={() => setTab('upload')}>Upload</button>
        <button type="button" aria-pressed={tab === 'library'} onClick={() => setTab('library')}>
          Media library{items ? ` (${items.length})` : ''}
        </button>
        <button type="button" aria-pressed={tab === 'url'} onClick={() => setTab('url')}>From URL</button>
      </div>

      {error && <p className="adm-alert error" role="alert">{error}</p>}

      {tab === 'upload' && (
        <label className="adm-drop">
          <strong>{busy ? 'Uploading…' : 'Choose an image to upload'}</strong>
          <p>JPG, PNG, WebP, GIF or AVIF · up to 5 MB</p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            aria-label="Upload an image"
            disabled={busy}
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
      )}

      {tab === 'library' &&
        (items === null ? (
          <p>Loading…</p>
        ) : items.length === 0 ? (
          <p className="adm-hint">No images yet — upload one first.</p>
        ) : (
          <div className="adm-pick-grid">
            {items.map((m) => (
              <button
                key={m.id}
                type="button"
                className="adm-pick"
                aria-pressed={selected === m.url}
                title={m.original_name}
                onClick={() => {
                  setSelected(m.url)
                  if (m.alt) setAlt(m.alt)
                }}
              >
                <img src={m.url} alt={m.alt || m.original_name} loading="lazy" />
              </button>
            ))}
          </div>
        ))}

      {tab === 'url' && (
        <div className="adm-field">
          <label htmlFor="mp-url">Image URL</label>
          <input
            id="mp-url"
            className="adm-input"
            placeholder="https://… or /assets/…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={blockEnter}
          />
        </div>
      )}

      <div className="adm-field">
        <label htmlFor="mp-alt">Alt text (describe the image for screen readers and SEO)</label>
        <input id="mp-alt" className="adm-input" value={alt} maxLength={200} onChange={(e) => setAlt(e.target.value)} onKeyDown={blockEnter} />
      </div>
    </Modal>
  )
}
