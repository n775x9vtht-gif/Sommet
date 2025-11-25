// services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// ⚠️ Mets ici les infos de TON projet Supabase
// (Depuis Supabase -> Settings -> API -> Project URL + anon public)
const HARDCODED_SUPABASE_URL = 'https://ujfifxsvataasviiacxy.supabase.co';
const HARDCODED_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZmlmeHN2YXRhYXN2aWlhY3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2ODIwNjUsImV4cCI6MjA3OTI1ODA2NX0.3wh5j_c-sD1E_c1zoJyoXXLz2xQru9UigNsO-YZ_p5c';

// Safe environment variable access (Vite / Node)
const metaEnv =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : ({} as any);

// @ts-ignore
const processEnv = typeof process !== 'undefined' ? process.env || {} : {};

// Front (Vite) : VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
// Backend (si un jour tu en as un) : SUPABASE_URL / SUPABASE_ANON_KEY
const supabaseUrl: string =
  (metaEnv as any).VITE_SUPABASE_URL ||
  (processEnv as any).SUPABASE_URL ||
  HARDCODED_SUPABASE_URL;

const supabaseAnonKey: string =
  (metaEnv as any).VITE_SUPABASE_ANON_KEY ||
  (processEnv as any).SUPABASE_ANON_KEY ||
  HARDCODED_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase non configuré : supabaseUrl ou supabaseAnonKey vides.'
  );
}

// 👉 ICI : on crée toujours un client (avec les fallbacks si besoin)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
