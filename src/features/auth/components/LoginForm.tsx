import { useState, type FormEvent } from 'react'
import { signInWithPassword } from '../services/authService'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(undefined)
    setIsSubmitting(true)
    try {
      await signInWithPassword(email, password)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to sign in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      <div><h1 className="text-xl font-semibold">Layout Spike</h1><p className="text-sm text-slate-600">Administrator sign in</p></div>
      <label className="block text-sm font-medium">Email<input className="mt-1 w-full rounded border border-slate-300 px-3 py-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label className="block text-sm font-medium">Password<input className="mt-1 w-full rounded border border-slate-300 px-3 py-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
      {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      <button className="w-full rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50" disabled={isSubmitting} type="submit">{isSubmitting ? 'Signing in...' : 'Sign in'}</button>
    </form>
  )
}
