'use client'

import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { NodeSelection, TextSelection } from '@tiptap/pm/state'
import { TableKit } from '@tiptap/extension-table'
import { CharacterCount, Placeholder } from '@tiptap/extensions'
import { useEffect, useState, type ReactNode } from 'react'
import { SITE } from '@/lib/site'
import { MediaPicker } from './MediaPicker'
import { Modal } from './ui'

const I: Record<string, ReactNode> = {
  link: (<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>),
  ul: (<><line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></>),
  ol: (<><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></>),
  quote: (<><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2.02-2-2H4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .01-1 1.03V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2.02-2-2h-4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></>),
  hr: (<line x1="3" y1="12" x2="21" y2="12" />),
  image: (<><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>),
  table: (<><rect x="3" y="3" width="18" height="18" rx="1" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="12" y1="3" x2="12" y2="21" /></>),
  undo: (<><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></>),
  redo: (<><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" /></>),
  code: (<><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>),
  codeBlock: (<><rect x="3" y="4" width="18" height="16" rx="2" /><polyline points="10 9 7 12 10 15" /><polyline points="14 9 17 12 14 15" /></>),
}

function Svg({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {I[name]}
    </svg>
  )
}

function Btn({
  label,
  onClick,
  active,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className="rte-btn"
      title={label}
      aria-label={label}
      aria-pressed={active === undefined ? undefined : active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

type LinkDraft = { href: string; newTab: boolean; sponsored: boolean; nofollow: boolean; hadLink: boolean }
type LinkTarget = { title: string; path: string; type: string }

/** Searchable list of the site's own pages, posts and categories for internal linking. */
function InternalLinkPicker({ selected, onPick }: { selected: string; onPick: (path: string) => void }) {
  const [targets, setTargets] = useState<LinkTarget[] | null>(null)
  const [q, setQ] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/link-targets')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setTargets(d.items ?? [])
      })
      .catch(() => {
        if (!cancelled) setTargets([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const needle = q.trim().toLowerCase()
  const shown = (targets ?? []).filter((t) => !needle || t.title.toLowerCase().includes(needle) || t.path.includes(needle))

  return (
    <div className="adm-field">
      <label htmlFor="link-search">Or link to a page on this site</label>
      <input
        id="link-search"
        className="adm-input"
        placeholder="Search posts, guides, pages…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault()
        }}
      />
      <div className="adm-link-list" role="group" aria-label="Pages on this site">
        {targets === null ? (
          <p className="adm-hint">Loading…</p>
        ) : shown.length === 0 ? (
          <p className="adm-hint">Nothing matches.</p>
        ) : (
          shown.slice(0, 50).map((t) => (
            <button
              key={t.path}
              type="button"
              className="adm-link-item"
              aria-pressed={selected === t.path}
              onClick={() => onPick(t.path)}
            >
              <span>
                {t.title}
                <small>{t.path}</small>
              </span>
              <span className="pill pill-published">{t.type}</span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

function LinkDialog({ editor, initial, onClose }: { editor: Editor; initial: LinkDraft; onClose: () => void }) {
  const [d, setD] = useState(initial)
  const apply = () => {
    const href = d.href.trim()
    if (!href) return
    const rel = [d.newTab && 'noopener', d.sponsored && 'sponsored', d.nofollow && 'nofollow'].filter(Boolean).join(' ') || null
    const attrs = { href, target: d.newTab ? '_blank' : null, rel }
    const chain = editor.chain().focus()
    if (editor.state.selection.empty && !editor.isActive('link')) {
      chain.insertContent({ type: 'text', text: href, marks: [{ type: 'link', attrs }] }).run()
    } else {
      chain.extendMarkRange('link').setLink(attrs).run()
    }
    // Put the cursor just after the link so the author can keep typing. TipTap's
    // focus() waits a frame; focus the view right away so no keystroke is lost.
    editor.chain().focus().setTextSelection(editor.state.selection.to).run()
    editor.view.focus()
    onClose()
  }
  return (
    <Modal
      title={initial.hadLink ? 'Edit link' : 'Insert link'}
      onClose={onClose}
      footer={
        <>
          {initial.hadLink && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                editor.chain().focus().extendMarkRange('link').unsetLink().run()
                onClose()
              }}
            >
              Remove link
            </button>
          )}
          <button type="button" className="btn btn-plain" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-teal" onClick={apply} disabled={!d.href.trim()}>Apply link</button>
        </>
      }
    >
      <div className="adm-field">
        <label htmlFor="link-url">URL</label>
        <input
          id="link-url"
          className="adm-input"
          autoFocus
          placeholder="https://example.com or /how-to-sell-feet-pics"
          value={d.href}
          onChange={(e) => setD({ ...d, href: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              apply()
            }
          }}
        />
        <p className="adm-hint">
          Internal pages start with <code>/</code>.{' '}
          <button
            type="button"
            className="adm-linkbtn"
            onClick={() => setD({ ...d, href: SITE.affiliateUrl, newTab: true, sponsored: true })}
          >
            Use the affiliate link
          </button>
        </p>
      </div>
      <InternalLinkPicker
        selected={d.href.trim()}
        onPick={(path) => setD({ ...d, href: path, newTab: false, sponsored: false, nofollow: false })}
      />
      <label className="adm-check"><input type="checkbox" checked={d.newTab} onChange={(e) => setD({ ...d, newTab: e.target.checked })} /> Open in a new tab</label>
      <label className="adm-check"><input type="checkbox" checked={d.sponsored} onChange={(e) => setD({ ...d, sponsored: e.target.checked })} /> Affiliate / sponsored link (rel=&quot;sponsored&quot;)</label>
      <label className="adm-check"><input type="checkbox" checked={d.nofollow} onChange={(e) => setD({ ...d, nofollow: e.target.checked })} /> nofollow</label>
    </Modal>
  )
}

export function RichTextEditor({
  initialHtml,
  onChange,
  placeholder = 'Start writing…',
}: {
  initialHtml: string
  onChange: (html: string) => void
  placeholder?: string
}) {
  const [mode, setMode] = useState<'visual' | 'html'>('visual')
  const [source, setSource] = useState('')
  const [link, setLink] = useState<LinkDraft | null>(null)
  const [imageOpen, setImageOpen] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: false }),
      // Non-inclusive: text typed right after a link is never swallowed into it.
      // Links get target/rel only when chosen in the link dialog.
      Link.extend({ inclusive: () => false }).configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: { target: null, rel: null },
      }),
      Image.configure({ allowBase64: false }),
      TableKit.configure({ table: { resizable: false } }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: initialHtml,
    editorProps: {
      attributes: { class: 'prose rte-content', 'aria-label': 'Content editor', 'data-testid': 'rte' },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
  })

  const s = useEditorState({
    editor,
    // The snapshot only picks up the editor after its first transaction, so fall
    // back to the instance from useEditor — otherwise the toolbar never appears.
    selector: ({ editor: snap }) => {
      const e = snap ?? editor
      return e
        ? {
            bold: e.isActive('bold'),
            italic: e.isActive('italic'),
            underline: e.isActive('underline'),
            strike: e.isActive('strike'),
            code: e.isActive('code'),
            link: e.isActive('link'),
            bullet: e.isActive('bulletList'),
            ordered: e.isActive('orderedList'),
            quote: e.isActive('blockquote'),
            codeBlock: e.isActive('codeBlock'),
            table: e.isActive('table'),
            block: e.isActive('heading', { level: 2 })
              ? 'h2'
              : e.isActive('heading', { level: 3 })
                ? 'h3'
                : e.isActive('heading', { level: 4 })
                  ? 'h4'
                  : 'p',
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
            words: e.storage.characterCount.words() as number,
          }
        : null
    },
  })

  if (!editor || !s) {
    return (
      <div className="rte">
        <div className="rte-content">Loading editor…</div>
      </div>
    )
  }

  const setBlock = (v: string) => {
    const c = editor.chain().focus()
    if (v === 'p') c.setParagraph().run()
    else c.setHeading({ level: Number(v.slice(1)) as 2 | 3 | 4 }).run()
  }

  const toggleMode = () => {
    if (mode === 'visual') {
      setSource(editor.getHTML())
      setMode('html')
    } else {
      editor.commands.setContent(source, { emitUpdate: true })
      onChange(editor.isEmpty ? '' : editor.getHTML())
      setMode('visual')
    }
  }

  const openLink = () => {
    const attrs = editor.getAttributes('link') as { href?: string; target?: string; rel?: string }
    const rel = attrs.rel ?? ''
    setLink({
      href: attrs.href ?? '',
      newTab: attrs.target === '_blank',
      sponsored: rel.includes('sponsored'),
      nofollow: rel.includes('nofollow'),
      hadLink: !!attrs.href,
    })
  }

  const visual = mode === 'visual'

  return (
    <div className="rte">
      <div className="rte-toolbar" role="toolbar" aria-label="Formatting">
        <select
          className="rte-select"
          aria-label="Text style"
          value={s.block}
          disabled={!visual}
          onChange={(e) => setBlock(e.target.value)}
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>
        <span className="rte-sep" />
        <Btn label="Bold" active={s.bold} disabled={!visual} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></Btn>
        <Btn label="Italic" active={s.italic} disabled={!visual} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></Btn>
        <Btn label="Underline" active={s.underline} disabled={!visual} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></Btn>
        <Btn label="Strikethrough" active={s.strike} disabled={!visual} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></Btn>
        <Btn label="Inline code" active={s.code} disabled={!visual} onClick={() => editor.chain().focus().toggleCode().run()}><Svg name="code" /></Btn>
        <Btn label="Link" active={s.link} disabled={!visual} onClick={openLink}><Svg name="link" /></Btn>
        <span className="rte-sep" />
        <Btn label="Bullet list" active={s.bullet} disabled={!visual} onClick={() => editor.chain().focus().toggleBulletList().run()}><Svg name="ul" /></Btn>
        <Btn label="Numbered list" active={s.ordered} disabled={!visual} onClick={() => editor.chain().focus().toggleOrderedList().run()}><Svg name="ol" /></Btn>
        <Btn label="Quote" active={s.quote} disabled={!visual} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Svg name="quote" /></Btn>
        <Btn label="Code block" active={s.codeBlock} disabled={!visual} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Svg name="codeBlock" /></Btn>
        <Btn label="Divider" disabled={!visual} onClick={() => editor.chain().focus().setHorizontalRule().run()}><Svg name="hr" /></Btn>
        <span className="rte-sep" />
        <Btn label="Insert image" disabled={!visual} onClick={() => setImageOpen(true)}><Svg name="image" /></Btn>
        <Btn
          label="Insert table"
          disabled={!visual || s.table}
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          <Svg name="table" />
        </Btn>
        <span className="rte-sep" />
        <Btn label="Undo" disabled={!visual || !s.canUndo} onClick={() => editor.chain().focus().undo().run()}><Svg name="undo" /></Btn>
        <Btn label="Redo" disabled={!visual || !s.canRedo} onClick={() => editor.chain().focus().redo().run()}><Svg name="redo" /></Btn>
        <span className="rte-sep" />
        <Btn label={visual ? 'Edit HTML source' : 'Back to visual editor'} active={!visual} onClick={toggleMode}>
          {visual ? 'HTML' : 'Visual'}
        </Btn>
      </div>

      {visual && s.table && (
        <div className="rte-tablebar" role="toolbar" aria-label="Table">
          <span>Table:</span>
          <Btn label="Add row" onClick={() => editor.chain().focus().addRowAfter().run()}>+ Row</Btn>
          <Btn label="Add column" onClick={() => editor.chain().focus().addColumnAfter().run()}>+ Column</Btn>
          <Btn label="Delete row" onClick={() => editor.chain().focus().deleteRow().run()}>− Row</Btn>
          <Btn label="Delete column" onClick={() => editor.chain().focus().deleteColumn().run()}>− Column</Btn>
          <Btn label="Toggle header row" onClick={() => editor.chain().focus().toggleHeaderRow().run()}>Header row</Btn>
          <Btn label="Delete table" onClick={() => editor.chain().focus().deleteTable().run()}>Delete table</Btn>
        </div>
      )}

      {visual ? (
        <EditorContent editor={editor} />
      ) : (
        <textarea
          className="rte-source"
          aria-label="HTML source"
          value={source}
          spellCheck={false}
          onChange={(e) => {
            setSource(e.target.value)
            onChange(e.target.value)
          }}
        />
      )}

      <div className="rte-footer">
        <span>{visual ? 'Tip: type “## ” for a heading, “- ” for a list, “> ” for a quote.' : 'Editing raw HTML. Unsupported tags are removed on save.'}</span>
        <span>
          {s.words} words · ~{Math.max(1, Math.round(s.words / 220))} min read
        </span>
      </div>

      {link && <LinkDialog editor={editor} initial={link} onClose={() => setLink(null)} />}
      {imageOpen && (
        <MediaPicker
          title="Insert image"
          confirmLabel="Insert image"
          onClose={() => setImageOpen(false)}
          onPick={({ url, alt, width, height }) => {
            // width/height reserve space on the page so text does not jump while images load.
            editor
              .chain()
              .focus()
              .setImage({ src: url, alt, width, height })
              .command(({ tr, state }) => {
                // The new image is left selected, so anything typed next would replace it.
                // Move the cursor into the paragraph below the image (adding one if needed).
                if (!(tr.selection instanceof NodeSelection)) return true
                const after = tr.selection.to
                if (!tr.doc.resolve(after).nodeAfter?.isTextblock) tr.insert(after, state.schema.nodes.paragraph.create())
                tr.setSelection(TextSelection.create(tr.doc, after + 1))
                return true
              })
              .run()
            editor.view.focus()
            setImageOpen(false)
          }}
        />
      )}
    </div>
  )
}
