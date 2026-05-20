import type { Metadata } from 'next'
import '../../styles/admin.css'

export const metadata: Metadata = {
  title: { default: 'Admin · DermaPride', template: '%s · Admin' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
