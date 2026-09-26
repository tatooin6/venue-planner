import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { AuthContext } from './authContext'
import type { Session } from '@supabase/supabase-js'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setIsLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsLoading(false)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  return <AuthContext value={{ session, isLoading }}>{children}</AuthContext>
}
