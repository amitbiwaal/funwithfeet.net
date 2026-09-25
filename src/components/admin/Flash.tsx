/** Success / error banner driven by ?saved=… / ?error=… query params after a redirect. */
export function Flash({ ok, error }: { ok?: string | null; error?: string | null }) {
  if (error) return <p className="adm-alert error" role="alert">{error}</p>
  if (ok) return <p className="adm-alert success" role="status">{ok}</p>
  return null
}

export function param(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? ''
}
