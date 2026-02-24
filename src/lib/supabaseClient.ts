// src/lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wnotjxleeltjysdlplkc.supabase.co";
const supabaseAnonKey = "sb_publishable_RMwjLRavgSgRELMsoYINtg_l4AldW2o"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);