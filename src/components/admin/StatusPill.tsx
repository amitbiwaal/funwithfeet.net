import { isLive } from '@/lib/posts'

export function StatusPill({ status, publishedAt }: { status: string; publishedAt: string | null }) {
  const label =
    status === 'draft' ? 'Draft' : isLive({ status: 'published', published_at: publishedAt }) ? 'Published' : 'Scheduled'
  return <span className={`pill pill-${label.toLowerCase()}`}>{label}</span>
}
