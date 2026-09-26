import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../../features/auth/components/useAuth'
import { AppPage } from '../../pages/AppPage'
import { LoginPage } from '../../pages/LoginPage'

function RootRedirect() {
  const { session, isLoading } = useAuth()
  if (isLoading) return <main className="p-8">Loading session...</main>
  return <Navigate to={session ? '/app' : '/login'} replace />
}

function ProtectedRoute() {
  const { session, isLoading } = useAuth()
  if (isLoading) return <main className="p-8">Loading session...</main>
  return session ? <AppPage /> : <Navigate to="/login" replace />
}

export function AppRouter() {
  return <BrowserRouter><Routes><Route path="/" element={<RootRedirect />} /><Route path="/login" element={<LoginPage />} /><Route path="/app" element={<ProtectedRoute />} /><Route path="*" element={<RootRedirect />} /></Routes></BrowserRouter>
}
