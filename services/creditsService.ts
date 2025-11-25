import { supabase } from './supabaseClient';

/**
 * Petit helper pour dire au reste de l'app "le profil a changé"
 * → La Sidebar écoute cet event et recharge le profil.
 */
const notifyProfileRefresh = () => {
  if (typeof window === 'undefined') return;

  try {
    const anyWindow = window as any;

    const ev =
      typeof anyWindow.Event === 'function'
        ? new anyWindow.Event('sommetProfileShouldRefresh')
        : null;

    if (ev && typeof anyWindow.dispatchEvent === 'function') {
      anyWindow.dispatchEvent(ev);
    }
  } catch (err) {
    console.warn("Impossible d'émettre l’event de refresh profil :", err);
  }
};

/**
 * Helper générique pour extraire un entier depuis data renvoyé par Supabase RPC.
 *  - soit data est un nombre simple    → on le renvoie
 *  - soit data est un objet           → on lit data[fieldName]
 *  - sinon                             → null
 */
const extractNumberField = (
  data: unknown,
  fieldName: string
): number | null => {
  if (typeof data === 'number') {
    return data;
  }
  if (
    data &&
    typeof data === 'object' &&
    typeof (data as any)[fieldName] === 'number'
  ) {
    return (data as any)[fieldName];
  }
  return null;
};

/**
 * 🔴 Consomme 1 crédit de génération (Générateur d'idées).
 * Retourne :
 *  - nombre de crédits restants (>= 0)
 *  - -1 si plus de crédits dispo (limite offre atteinte)
 *  - null en cas d'erreur technique
 *
 * ⚠️ Nécessite que la fonction SQL `consume_generation_credit` :
 *  - lève `RAISE EXCEPTION 'Plus de crédits de génération disponibles';` quand quota atteint
 *  - retourne un int ou un champ `remaining_credits` sinon
 */
export const consumeCredit = async (): Promise<number | null> => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Erreur auth.getUser dans consumeCredit :', userError);
      return null;
    }

    if (!user) {
      console.warn('Aucun utilisateur connecté dans consumeCredit');
      return null;
    }

    const { data, error } = await supabase.rpc(
      'consume_generation_credit',
      {}
    );

    if (error) {
      console.error('Erreur RPC consume_generation_credit :', error);

      // 👉 Cas fonctionnel : plus de crédits sur l’offre
      if (
        typeof error.message === 'string' &&
        error.message.includes('Plus de crédits de génération disponibles')
      ) {
        // on notifie quand même le profil (pour mettre à jour le compteur éventuel)
        notifyProfileRefresh();
        return -1;
      }

      // 👉 Cas vraiment technique
      return null;
    }

    const remaining = extractNumberField(data, 'remaining_credits');

    // 🔔 prévenir la Sidebar
    notifyProfileRefresh();

    return remaining;
  } catch (e) {
    console.error('Erreur inattendue dans consumeCredit :', e);
    return null;
  }
};

/**
 * 🔵 Consomme 1 crédit d'analyse de marché (Validateur).
 * Retourne :
 *  - nombre d'analyses restantes (>= 0)
 *  - -1 si plus de crédits dispo (limite offre atteinte)
 *  - null en cas d'erreur technique
 *
 * ⚠️ Nécessite que la fonction SQL `consume_analysis_credit` :
 *  - lève `RAISE EXCEPTION 'Plus de crédits d’analyse disponibles';` quand quota atteint
 *  - retourne un int ou un champ `remaining_analyses` sinon
 */
export const consumeMarketAnalysis = async (): Promise<number | null> => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error(
        'Erreur auth.getUser dans consumeMarketAnalysis :',
        userError
      );
      return null;
    }

    if (!user) {
      console.warn('Aucun utilisateur connecté dans consumeMarketAnalysis');
      return null;
    }

    const { data, error } = await supabase.rpc(
      'consume_analysis_credit',
      {}
    );

    if (error) {
      console.error('Erreur RPC consume_analysis_credit :', error);

      // 👉 Cas fonctionnel : plus de crédits d’analyse
      if (
        typeof error.message === 'string' &&
        error.message.includes('Plus de crédits d’analyse disponibles')
      ) {
        notifyProfileRefresh();
        return -1;
      }

      // 👉 Cas technique
      return null;
    }

    const remaining = extractNumberField(data, 'remaining_analyses');

    // 🔔 prévenir la Sidebar
    notifyProfileRefresh();

    return remaining;
  } catch (e) {
    console.error(
      'Erreur inattendue dans consumeMarketAnalysis :',
      e
    );
    return null;
  }
};

/**
 * 🟣 Consomme 1 "droit Blueprint" (MVP Builder).
 *
 * Pour ton offre :
 *  - Explorateur : 1 Blueprint
 *  - Bâtisseur : illimité (la fonction SQL peut retourner NULL ou ignorer le compteur)
 *
 * Retourne :
 *  - nombre de blueprints restants (>= 0) pour Explorateur
 *  - null en cas d'erreur ou pour Bâtisseur (illimité)
 */
export const consumeMvpBlueprint = async (): Promise<number | null> => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error(
        'Erreur auth.getUser dans consumeMvpBlueprint :',
        userError
      );
      return null;
    }

    if (!user) {
      console.warn('Aucun utilisateur connecté dans consumeMvpBlueprint');
      return null;
    }

    const { data, error } = await supabase.rpc(
      'consume_mvp_blueprint',
      {}
    );

    if (error) {
      console.error('Erreur RPC consume_mvp_blueprint :', error);
      return null;
    }

    const remaining = extractNumberField(
      data,
      'remaining_blueprints'
    );

    // 🔔 prévenir la Sidebar (si un jour tu affiches aussi ce quota)
    notifyProfileRefresh();

    return remaining;
  } catch (e) {
    console.error('Erreur inattendue dans consumeMvpBlueprint :', e);
    return null;
  }
};
