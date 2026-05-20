import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'

export const metadata = { title: 'Dashboard' }

export default async function AdminDashboardPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  return <AdminShell session={session} />
}
