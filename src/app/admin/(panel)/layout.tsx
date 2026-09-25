import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { requireAdmin } from '@/lib/auth'
import { unreadMessageCount } from '@/lib/messages'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin()
  const unread = await unreadMessageCount()
  return (
    <div className="adm-shell">
      <AdminSidebar email={user.email} unread={unread} />
      <main className="adm-main" id="admin-main">
        {children}
      </main>
    </div>
  )
}
