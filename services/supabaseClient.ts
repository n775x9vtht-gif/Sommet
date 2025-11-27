// services/supabaseClient.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type EnvKeys = 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY';

const getEnv = (key: EnvKeys): string | undefined => {
  const fromImportMeta =
    typeof import.meta !== 'undefined' ? import.meta.env?.[key] : undefined;

  if (fromImportMeta) return fromImportMeta;

  if (typeof process !== 'undefined' && process.env) {
    const nodeKey = key.replace('VITE_', '');
    return process.env[key] ?? process.env[nodeKey];
  }

  return undefined;
};

let cachedSupabase: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (cachedSupabase) return cachedSupabase;

  const supabaseUrl = getEnv('VITE_SUPABASE_URL');
  const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      'Supabase non configuré : définis VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans ton environnement. Utilisation d’un client placeholder pour garder l’UI affichable.'
    );

    // On retourne un client placeholder pour éviter de casser le rendu côté client.
    cachedSupabase = createClient(
      supabaseUrl ?? 'https://placeholder.supabase.co',
      supabaseAnonKey ?? 'public-anon-key'
    );
    return cachedSupabase;
  }

  cachedSupabase = createClient(supabaseUrl, supabaseAnonKey);
  return cachedSupabase;
};
