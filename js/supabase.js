// =============================================
// GRINDPOINT — Supabase Client
// Replace the values below with yours from:
// supabase.com > project > settings > API
// =============================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://mygpknbimytjaynwfpdz.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable__m1skyZ-JbPLhg0AsERGOA_Z3AWjxOE'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
