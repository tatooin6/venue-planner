import { Navigate } from 'react-router-dom'
import { LoginForm } from '../features/auth/components/LoginForm'
import { useAuth } from '../features/auth/components/useAuth'

export function LoginPage() {
  const { session, isLoading } = useAuth()
  if (isLoading) return <main className="p-8">Loading session...</main>
  if (session) return <Navigate to="/app" replace />
  return <main className="flex min-h-screen items-center justify-center p-6"><LoginForm /></main>
}
