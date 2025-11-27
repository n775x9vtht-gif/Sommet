import { getSupabaseClient } from './supabaseClient';

export type PlanType = 'camp_de_base' | 'explorateur' | 'batisseur';

export interface UserProfile {
  id: string;
  full_name: string;
  plan: PlanType;
  generation_credits: number;
  analysis_credits: number;
  pdf_exports_used: number;
  mvp_analyses_used: number;
  created_at: string;
}

/**
 * Récupère le profil complet de l'utilisateur connecté depuis la table `profiles`.
 * Retourne `null` si pas connecté ou si le profil n'existe pas.
 */
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const supabase = getSupabaseClient();
    // 1) Récupérer l'utilisateur connecté
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Erreur Supabase auth.getUser :', userError);
      return null;
    }

    if (!user) {
      return null;
    }

    // 2) Récupérer son profil
    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
        id,
        full_name,
        plan,
        generation_credits,
        analysis_credits,
        pdf_exports_used,
        mvp_analyses_used,
        created_at
      `
      )
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Erreur chargement profil (profiles) :', error);
      return null;
    }

    if (!data) {
      console.warn('Aucun profil trouvé pour cet utilisateur dans la table profiles.');
      return null;
    }

    return data as UserProfile;
  } catch (e) {
    console.error('Erreur inattendue dans getCurrentUserProfile :', e);
    return null;
  }
};
