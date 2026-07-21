import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export interface SupabaseConfig {
  configured: boolean;
  url: string | null;
  key: string | null;
  source: 'env' | 'local' | null;
}

export async function fetchSupabaseConfig(): Promise<SupabaseConfig> {
  // Try local storage first
  const localUrl = localStorage.getItem('glance_supabase_url');
  const localKey = localStorage.getItem('glance_supabase_key');

  if (localUrl && localKey) {
    return {
      configured: true,
      url: localUrl,
      key: localKey,
      source: 'local'
    };
  }

  // Fallback to server env config
  try {
    const res = await fetch('/api/supabase/config');
    const data = await res.json();
    if (data.configured) {
      return {
        configured: true,
        url: data.supabaseUrl,
        key: data.supabaseKey,
        source: 'env'
      };
    }
  } catch (e) {
    console.error('Failed to fetch Supabase config from server:', e);
  }

  return {
    configured: false,
    url: null,
    key: null,
    source: null
  };
}

export async function initSupabase(): Promise<SupabaseClient | null> {
  if (supabaseInstance) return supabaseInstance;

  const config = await fetchSupabaseConfig();
  if (config.url && config.key) {
    try {
      supabaseInstance = createClient(config.url, config.key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      return supabaseInstance;
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
    }
  }

  return null;
}

export function getSupabase(): SupabaseClient | null {
  return supabaseInstance;
}

export function saveLocalSupabaseConfig(url: string, key: string) {
  localStorage.setItem('glance_supabase_url', url.trim());
  localStorage.setItem('glance_supabase_key', key.trim());
  // Clear cached instance so next init fetches new config
  supabaseInstance = null;
}

export function clearLocalSupabaseConfig() {
  localStorage.removeItem('glance_supabase_url');
  localStorage.removeItem('glance_supabase_key');
  supabaseInstance = null;
}
