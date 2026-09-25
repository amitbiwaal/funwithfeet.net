'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore, useTransition, type FormEvent } from 'react'
import type { EditorEntry, SaveResult } from '@/lib/editor-types'
import { SITE } from '@/lib/site'
import { cx, formatDateTime, slugify, stripHtml, truncate } from '@/lib/utils'
import { MediaPicker } from './MediaPicker'
import { RichTextEditor } from './RichTextEditor'
import { ConfirmButton } from './ui'

type Category = { id: number; name: string }

const noop = () => () => {}
/** false during SSR and hydration, true afterwards — avoids timezone hydration mismatches. */
function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false)
}

function isoToLocal(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

function localToIso(local: string): string {
  if (!local) return ''
  const d = new Date(local)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString()
}

function Counter({ value, max }: { value: string; max: number }) {
  return <span className={cx('adm-count', value.length > max && 'over')}>{value.length}/{max}</span>
}

export function EntryEditor({
  initial,
  categories = [],
  saveAction,
  deleteAction,
  flash,
}: {
  initial: EditorEntry
  categories?: Category[]
  saveAction: (fd: FormData) => Promise<SaveResult | undefined>
  deleteAction?: (fd: FormData) => Promise<void>
  flash?: string
}) {
  const isPost = initial.kind === 'post'
  const noun = isPost ? 'post' : 'page'
  const isClient = useIsClient()

  const [e, setE] = useState<EditorEntry>(initial)
  const [savedSlug, setSavedSlug] = useState(initial.slug)
  const [content, setContent] = useState(initial.content)
  const [slugTouched, setSlugTouched] = useState(!!initial.id)
  const [publishLocal, setPublishLocal] = useState(() => isoToLocal(initial.published_at))
  // Whether the chosen publish date is in the future ("Schedule" instead of "Publish").
  const [isFutureDate, setIsFutureDate] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(
    flash ? { type: 'success', text: flash } : null,
  )
  const [coverOpen, setCoverOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const primarySaveRef = useRef<HTMLButtonElement>(null)

  const set = <K extends keyof EditorEntry>(key: K, value: EditorEntry[K]) => {
    setE((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return
    const handler = (ev: BeforeUnloadEvent) => ev.preventDefault()
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  // Ctrl/Cmd + S saves (as draft for drafts, as update for published entries).
  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's') {
        ev.preventDefault()
        formRef.current?.requestSubmit(primarySaveRef.current ?? undefined)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const submitter = (ev.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    const fd = new FormData(ev.currentTarget, submitter)
    setNotice(null)
    startTransition(async () => {
      const res = await saveAction(fd)
      if (!res) return // new entry: the action redirected to its edit page
      if (res.ok && res.entry) {
        setE(res.entry)
        setSavedSlug(res.entry.slug)
        setPublishLocal(isoToLocal(res.entry.published_at))
        setIsFutureDate(res.entry.status === 'published' && !res.entry.live)
        setSlugTouched(true)
        setDirty(false)
        setNotice({ type: 'success', text: res.message ?? 'Saved.' })
      } else {
        setNotice({ type: 'error', text: res.error ?? 'Something went wrong.' })
      }
    })
  }

  const isPublished = e.status === 'published'
  const statusLabel = !isPublished ? 'Draft' : e.live ? 'Published' : 'Scheduled'
  const prefix = isPost ? '/blog/' : '/'
  const serpTitle = e.meta_title || `${e.title || 'Untitled'} | ${isPost ? 'Fun With Feet' : 'FunWithFeet.net'}`
  const serpDesc = e.meta_description || truncate(e.excerpt || stripHtml(content), 158) || 'Add a meta description…'

  return (
    <>
      {notice && (
        <p className={`adm-alert ${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'} data-testid="editor-notice">
          <span>{notice.text}</span>
          {notice.type === 'success' && e.publicPath && (
            <a href={e.publicPath} target="_blank" rel="noopener">
              {e.live ? `View ${noun} ↗` : 'Preview ↗'}
            </a>
          )}
        </p>
      )}

      <form ref={formRef} className="adm-editor" onSubmit={onSubmit} aria-busy={pending}>
        <input type="hidden" name="id" value={e.id ?? ''} />
        <input type="hidden" name="content" value={content} />
        <input type="hidden" name="published_at" value={localToIso(publishLocal)} />

        <div className="adm-editor-main">
          <div>
            <label className="visually-hidden" htmlFor="entry-title">Title</label>
            <input
              id="entry-title"
              name="title"
              className="adm-title-input"
              placeholder={isPost ? 'Post title' : 'Page title'}
              value={e.title}
              maxLength={200}
              required
              onChange={(ev) => {
                const title = ev.target.value
                setE((prev) => ({ ...prev, title, slug: slugTouched ? prev.slug : slugify(title) }))
                setDirty(true)
              }}
            />
          </div>

          <div>
            <div className="adm-slug">
              <span>funwithfeet.net{prefix}</span>
              <input
                name="slug"
                aria-label="URL slug"
                value={e.slug}
                placeholder="url-slug"
                onChange={(ev) => {
                  setSlugTouched(true)
                  set('slug', ev.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
                }}
                onBlur={() => set('slug', slugify(e.slug || e.title))}
              />
            </div>
            {isPublished && e.id && e.slug !== savedSlug && (
              <p className="adm-hint warn">Changing the URL of a published {noun} breaks existing links to it.</p>
            )}
          </div>

          <RichTextEditor
            initialHtml={initial.content}
            placeholder={isPost ? 'Write your article… Use headings (H2) to structure it.' : 'Write the page content…'}
            onChange={(html) => {
              setContent(html)
              setDirty(true)
            }}
          />

          {isPost && (
            <div className="adm-box">
              <div className="adm-box-head">
                <label htmlFor="entry-excerpt">Excerpt</label>
                <Counter value={e.excerpt} max={300} />
              </div>
              <div className="adm-box-body">
                <textarea
                  id="entry-excerpt"
                  name="excerpt"
                  className="adm-textarea"
                  maxLength={400}
                  value={e.excerpt}
                  placeholder="One or two sentences shown on blog cards and under the title."
                  onChange={(ev) => set('excerpt', ev.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="adm-editor-side">
          {/* PUBLISH */}
          <div className="adm-box">
            <div className="adm-box-head">Publish</div>
            <div className="adm-box-body">
              <div className="adm-status-line">
                Status:{' '}
                <span className={`pill pill-${statusLabel.toLowerCase()}`} data-testid="entry-status">{statusLabel}</span>
                {e.publicPath && (
                  <a href={e.publicPath} target="_blank" rel="noopener">
                    {e.live ? 'View ↗' : 'Preview ↗'}
                  </a>
                )}
              </div>
              <div className="adm-field">
                <label htmlFor="entry-date">Publish date</label>
                <input
                  id="entry-date"
                  type="datetime-local"
                  className="adm-input"
                  value={isClient ? publishLocal : ''}
                  onChange={(ev) => {
                    setPublishLocal(ev.target.value)
                    setIsFutureDate(!!ev.target.value && new Date(ev.target.value).getTime() > Date.now())
                    setDirty(true)
                  }}
                />
                <p className="adm-hint">Empty = publish now. A future date schedules it.</p>
              </div>
              <p className={cx('adm-savebar', dirty && 'dirty')}>
                {dirty ? 'Unsaved changes' : e.updated_at ? `Last saved ${formatDateTime(e.updated_at)}` : 'Not saved yet'}
              </p>
              <div className="adm-publish-actions">
                {isPublished ? (
                  <>
                    <button ref={primarySaveRef} className="btn btn-teal" name="intent" value="update" disabled={pending}>
                      {pending ? 'Saving…' : 'Update'}
                    </button>
                    <button className="btn btn-plain" name="intent" value="unpublish" disabled={pending}>
                      Unpublish
                    </button>
                  </>
                ) : (
                  <>
                    <button ref={primarySaveRef} className="btn btn-plain" name="intent" value="draft" disabled={pending}>
                      Save draft
                    </button>
                    <button className="btn" name="intent" value="publish" disabled={pending}>
                      {pending ? 'Saving…' : isFutureDate ? 'Schedule' : 'Publish'}
                    </button>
                  </>
                )}
              </div>
              {e.id && deleteAction && (
                <ConfirmButton
                  form="delete-entry-form"
                  className="adm-linkbtn"
                  message={`Delete this ${noun} permanently? This cannot be undone.`}
                >
                  Delete {noun}
                </ConfirmButton>
              )}
            </div>
          </div>

          {/* COVER IMAGE */}
          {isPost && (
            <div className="adm-box">
              <div className="adm-box-head">Cover image</div>
              <div className="adm-box-body">
                <input type="hidden" name="cover_image" value={e.cover_image} />
                <div className={cx('adm-cover', e.cover_image && 'has-image')}>
                  {e.cover_image ? (

                    <img src={e.cover_image} alt={e.cover_alt || 'Cover image'} data-testid="cover-preview" />
                  ) : (
                    <span className="adm-hint">No cover image</span>
                  )}
                </div>
                <div className="adm-actions">
                  <button type="button" className="btn btn-sm btn-plain" onClick={() => setCoverOpen(true)}>
                    {e.cover_image ? 'Change cover' : 'Set cover image'}
                  </button>
                  {e.cover_image && (
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => set('cover_image', '')}>
                      Remove
                    </button>
                  )}
                </div>
                <div className="adm-field">
                  <label htmlFor="entry-cover-alt">Cover alt text</label>
                  <input
                    id="entry-cover-alt"
                    name="cover_alt"
                    className="adm-input"
                    maxLength={200}
                    value={e.cover_alt}
                    onChange={(ev) => set('cover_alt', ev.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ORGANISE */}
          {isPost && (
            <div className="adm-box">
              <div className="adm-box-head">
                Organise <Link href="/admin/categories">Manage</Link>
              </div>
              <div className="adm-box-body">
                <div className="adm-field">
                  <label htmlFor="entry-category">Category</label>
                  <select
                    id="entry-category"
                    name="category_id"
                    className="adm-select"
                    value={e.category_id ?? ''}
                    onChange={(ev) => set('category_id', ev.target.value ? Number(ev.target.value) : null)}
                  >
                    <option value="">— No category —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="adm-field">
                  <label htmlFor="entry-tags">Tags</label>
                  <input
                    id="entry-tags"
                    name="tags"
                    className="adm-input"
                    placeholder="pricing, beginners, safety"
                    value={e.tags}
                    onChange={(ev) => set('tags', ev.target.value)}
                  />
                  <p className="adm-hint">Separate tags with commas.</p>
                </div>
                <div className="adm-field">
                  <label htmlFor="entry-author">Author</label>
                  <input
                    id="entry-author"
                    name="author_name"
                    className="adm-input"
                    placeholder={SITE.editorialAuthor}
                    value={e.author_name}
                    onChange={(ev) => set('author_name', ev.target.value)}
                  />
                </div>
                <label className="adm-check">
                  <input type="checkbox" name="featured" value="1" checked={e.featured} onChange={(ev) => set('featured', ev.target.checked)} />
                  Feature at the top of the blog
                </label>
              </div>
            </div>
          )}

          {/* SEO */}
          <div className="adm-box">
            <div className="adm-box-head">SEO</div>
            <div className="adm-box-body">
              <div className="adm-field">
                <label htmlFor="entry-meta-title">
                  Meta title <Counter value={e.meta_title} max={60} />
                </label>
                <input
                  id="entry-meta-title"
                  name="meta_title"
                  className="adm-input"
                  maxLength={120}
                  placeholder={serpTitle}
                  value={e.meta_title}
                  onChange={(ev) => set('meta_title', ev.target.value)}
                />
              </div>
              <div className="adm-field">
                <label htmlFor="entry-meta-desc">
                  Meta description <Counter value={e.meta_description} max={160} />
                </label>
                <textarea
                  id="entry-meta-desc"
                  name="meta_description"
                  className="adm-textarea"
                  maxLength={300}
                  value={e.meta_description}
                  onChange={(ev) => set('meta_description', ev.target.value)}
                />
              </div>
              <div>
                <span className="adm-label">Google preview</span>
                <div className="serp" aria-label="Search result preview">
                  <div className="u">funwithfeet.net › {isPost ? `blog › ${e.slug || '…'}` : e.slug || '…'}</div>
                  <div className="t">{serpTitle}</div>
                  <div className="d">{serpDesc}</div>
                </div>
              </div>
              <label className="adm-check">
                <input type="checkbox" name="noindex" value="1" checked={e.noindex} onChange={(ev) => set('noindex', ev.target.checked)} />
                Hide from search engines (noindex)
              </label>
            </div>
          </div>
        </div>
      </form>

      {e.id && deleteAction && (
        <form id="delete-entry-form" action={deleteAction} hidden>
          <input type="hidden" name="id" value={e.id} />
        </form>
      )}

      {coverOpen && (
        <MediaPicker
          title="Cover image"
          confirmLabel="Use as cover"
          initialAlt={e.cover_alt}
          onClose={() => setCoverOpen(false)}
          onPick={({ url, alt }) => {
            setE((prev) => ({ ...prev, cover_image: url, cover_alt: alt || prev.cover_alt }))
            setDirty(true)
            setCoverOpen(false)
          }}
        />
      )}
    </>
  )
}
