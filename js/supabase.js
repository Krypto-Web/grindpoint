// =============================================
// GRINDPOINT — Supabase Client
// Replace the values below with yours from:
// supabase.com > project > settings > API
// =============================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://your-project-id.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-public-key-here'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
