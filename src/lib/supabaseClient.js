/**
 * Supabase browser client (anon key only — never use service role here).
 *
 * Required Vercel / local .env variables:
 *   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
 *   VITE_SUPABASE_ANON_KEY=your_anon_key
 *
 * Get values from Supabase Dashboard → Project Settings → API
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[K&C RFQ] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. RFQ submissions are disabled until configured.',
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

export const RFQ_BUCKET = 'rfq-files';
export const CASE_STUDY_PHOTOS_BUCKET = 'case-study-photos';
