function requiredEnvironmentVariable(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_PUBLISHABLE_KEY'): string {
  const value = import.meta.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Add it to your .env.local file.`)
  }

  return value
}

export const environment = {
  supabaseUrl: requiredEnvironmentVariable('VITE_SUPABASE_URL'),
  supabasePublishableKey: requiredEnvironmentVariable('VITE_SUPABASE_PUBLISHABLE_KEY'),
}
