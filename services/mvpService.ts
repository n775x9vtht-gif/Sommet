// services/mvpService.ts
import { supabase } from './supabaseClient';

/**
 * Consomme 1 "slot" d'analyse MVP.
 *
 * Retourne :
 *  - nombre >= 1 : nombre total d'analyses MVP effectuées
 *  - -1 : plus autorisé (limite atteinte pour le plan)
 *  - null : erreur
 */
export async function consumeMvpAnalysis(): Promise<number | null> {
  if (!supabase) {
    console.error('Supabase non configuré');
    return null;
  }

  try {
    const { data, error } = await supabase.rpc('consume_mvp_analysis');

    if (error) {
      console.error('Erreur RPC consume_mvp_analysis:', error);
      return null;
    }

    return data as number;
  } catch (e) {
    console.error('Erreur inattendue consumeMvpAnalysis:', e);
    return null;
  }
}
