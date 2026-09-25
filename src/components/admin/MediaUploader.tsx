'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cx } from '@/lib/utils'
import { uploadImage } from './MediaPicker'

export function MediaUploader() {
  const router = useRouter()
  const [over, setOver] = useState(false)
  const [status, setStatus] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  async function handle(files: FileList | null) {
    if (!files?.length) return
    setErrors([])
    const errs: string[] = []
    let done = 0
    for (const file of Array.from(files)) {
      setStatus(`Uploading ${file.name}…`)
      try {
        await uploadImage(file)
        done++
      } catch (e) {
        errs.push(`${file.name}: ${e instanceof Error ? e.message : 'failed'}`)
      }
    }
    setErrors(errs)
    setStatus(done ? `${done} image${done === 1 ? '' : 's'} uploaded.` : '')
    router.refresh()
  }

  return (
    <div>
      <label
        className={cx('adm-drop', over && 'over')}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          handle(e.dataTransfer.files)
        }}
      >
        <strong>Drop images here or click to upload</strong>
        <p>JPG, PNG, WebP, GIF or AVIF · up to 4 MB each</p>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          aria-label="Upload images"
          onChange={(e) => {
            handle(e.target.files)
            e.target.value = ''
          }}
        />
      </label>
      {status && <p className="adm-alert success mt-14" role="status">{status}</p>}
      {errors.map((err) => (
        <p key={err} className="adm-alert error" role="alert">{err}</p>
      ))}
    </div>
  )
}
