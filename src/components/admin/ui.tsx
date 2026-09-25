'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export function Modal({
  title,
  onClose,
  children,
  footer,
  wide = false,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="adm-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={`adm-modal${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} ref={ref}>
        <div className="adm-modal-head">
          <h2>{title}</h2>
          <button type="button" className="adm-close" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>
        <div className="adm-modal-body">{children}</div>
        {footer && <div className="adm-modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

/** Submit button that asks for confirmation first (used for deletes). */
export function ConfirmButton({
  children,
  message,
  className = 'btn btn-sm btn-danger',
  label,
  form,
}: {
  children: ReactNode
  message: string
  className?: string
  label?: string
  form?: string
}) {
  return (
    <button
      type="submit"
      form={form}
      className={className}
      aria-label={label}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault()
      }}
    >
      {children}
    </button>
  )
}

export function CopyButton({ text, label = 'Copy URL' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="btn btn-sm btn-plain"
      onClick={async () => {
        const full = text.startsWith('/') ? `${window.location.origin}${text}` : text
        try {
          await navigator.clipboard.writeText(full)
        } catch {
          window.prompt('Copy this URL:', full)
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? 'Copied!' : label}
    </button>
  )
}
