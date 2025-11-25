// services/marketService.ts
import { supabase } from './supabaseClient';

/**
 * Consomme 1 analyse de marché.
 *
 * Retourne :
 *  - nombre >= 1 : nombre total d'analyses effectuées
 *  - -1 : plus autorisé (quota atteint)
 *  - null : erreur
 */
export async function consumeMarketAnalysis(): Promise<number | null> {
  try {
    const { data, error } = await supabase.rpc('consume_market_analysis');

    if (error) {
      console.error('Erreur RPC consume_market_analysis :', error);
      return null;
    }

    return data as number;
  } catch (e) {
    console.error('Erreur inattendue consumeMarketAnalysis :', e);
    return null;
  }
}
