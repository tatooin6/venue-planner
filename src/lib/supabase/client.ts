import { createClient } from '@supabase/supabase-js'
import { environment } from '../config'

export const supabase = createClient(environment.supabaseUrl, environment.supabasePublishableKey)
