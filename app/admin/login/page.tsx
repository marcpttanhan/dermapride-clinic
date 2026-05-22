import { Suspense } from 'react'
import LoginForm from '@/components/admin/LoginForm'

export const metadata = { title: 'Admin Login' }

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
