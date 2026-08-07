// ============================================================================
//  AERION Live Telemetry - Supabase Client Initialization
// ============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

/**
 * Returns the Supabase client singleton.
 * Returns null if environment variables are not configured,
 * enabling graceful fallback to demo mode.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !url ||
    !key ||
    url === 'https://your-project-id.supabase.co' ||
    key === 'your-anon-key-here'
  ) {
    console.warn(
      '[AERION] Supabase credentials not configured. Running in DEMO MODE.\n' +
      'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    );
    return null;
  }

  supabase = createClient(url, key, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });

  return supabase;
}
