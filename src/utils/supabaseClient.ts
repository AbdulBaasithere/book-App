import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export interface SupabaseConfig {
  configured: boolean;
  url: string | null;
  key: string | null;
  source: 'env' | 'local' | null;
}

// Synchronously attempts to initialize Supabase from import.meta.env or localStorage if available
function trySyncInit(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  // 1. Check localStorage first
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('glance_supabase_url')?.trim() : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('glance_supabase_key')?.trim() : null;

  if (localUrl && localKey) {
    try {
      supabaseInstance = createClient(localUrl, localKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      return supabaseInstance;
    } catch (e) {
      console.error('Failed to initialize Supabase from localStorage credentials:', e);
    }
  }

  // 2. Check import.meta.env (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY)
  const viteUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
  const viteKey = ((import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY) as string | undefined)?.trim();

  if (viteUrl && viteKey) {
    try {
      supabaseInstance = createClient(viteUrl, viteKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      return supabaseInstance;
    } catch (e) {
      console.error('Failed to initialize Supabase from import.meta.env:', e);
    }
  }

  return null;
}

export async function fetchSupabaseConfig(): Promise<SupabaseConfig> {
  // 1. Try local storage first
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('glance_supabase_url')?.trim() : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('glance_supabase_key')?.trim() : null;

  if (localUrl && localKey) {
    return {
      configured: true,
      url: localUrl,
      key: localKey,
      source: 'local'
    };
  }

  // 2. Try Vite client environment variables (for Vercel / Netlify / static SPA deployments)
  const viteUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
  const viteKey = ((import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY) as string | undefined)?.trim();

  if (viteUrl && viteKey) {
    return {
      configured: true,
      url: viteUrl,
      key: viteKey,
      source: 'env'
    };
  }

  // 3. Fallback to server env config (/api/supabase/config)
  try {
    const res = await fetch('/api/supabase/config');
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      return { configured: false, url: null, key: null, source: null };
    }
    const data = await res.json();
    if (data.configured && data.supabaseUrl && data.supabaseKey) {
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
  const existing = trySyncInit();
  if (existing) return existing;

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
  return trySyncInit();
}

export function isSupabaseInitialized(): boolean {
  return trySyncInit() !== null;
}

export function saveLocalSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('glance_supabase_url', url.trim());
    localStorage.setItem('glance_supabase_key', key.trim());
  }
  supabaseInstance = null;
  trySyncInit();
}

export function clearLocalSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('glance_supabase_url');
    localStorage.removeItem('glance_supabase_key');
  }
  supabaseInstance = null;
}

