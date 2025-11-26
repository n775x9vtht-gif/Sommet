// components/SuccessPage.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { IconMountain } from './Icons';

type PlanType = 'camp_de_base' | 'explorateur' | 'batisseur';

interface SuccessPageProps {
  onEnterApp: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onEnterApp }) => {
  const [plan, setPlan] = useState<PlanType>('camp_de_base');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const params = new URLSearchParams(window.location.search);
    const rawPlan = params.get('plan');

    if (rawPlan === 'explorateur' || rawPlan === 'batisseur') {
      setPlan(rawPlan);
    } else {
      setPlan('camp_de_base');
    }

    // Si un jour tu ajoutes ?email=... dans l’URL :
    // const emailFromUrl = params.get('email');
    // if (emailFromUrl) setEmail(emailFromUrl);
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email) {
      setErrorMsg('Merci de renseigner ton email.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Ton mot de passe doit faire au moins 6 caractères.');
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Création du compte auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {},
        },
      });

      if (error) {
        console.error('Erreur Supabase signUp:', error);
        setErrorMsg(
          error.message ||
            "Impossible de créer ton compte. Réessaie ou contacte le support."
        );
        setLoading(false);
        return;
      }

      const user = data.user;
      if (user) {
        // 2️⃣ Mise à jour du profil avec le bon plan
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            plan,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (profileError) {
          console.error('Erreur lors de la mise à jour du plan :', profileError);
          // On ne bloque pas l’accès, mais on log l’erreur
        }
      }

      setSuccessMsg('Compte créé avec succès ! Redirection vers Sommet…');
      localStorage.removeItem('sommet_guest_mode');

      setTimeout(() => {
        onEnterApp();
      }, 500);
    } catch (err: any) {
      console.error('Erreur inattendue lors de la création de compte:', err);
      setErrorMsg("Erreur inattendue. Réessaie dans quelques instants.");
      setLoading(false);
    }
  };

  // 🧠 Texte dynamique selon le plan
  const planLabel =
    plan === 'batisseur'
      ? 'Votre plan Bâtisseur est activé.'
      : plan === 'explorateur'
      ? 'Votre pack Explorateur est activé.'
      : 'Votre Camp de Base est activé.';

  return (
    <div className="min-h-screen bg-dark-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-dark-900 border border-dark-700 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
            <IconMountain className="w-6 h-6 text-gold-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white text-center">
            Paiement confirmé 🎉
          </h1>
          <p className="mt-2 text-sm text-emerald-400 text-center">
            {planLabel}
          </p>
          <p className="mt-1 text-xs text-slate-400 text-center">
            Il ne reste plus qu&apos;à créer ton mot de passe pour accéder à Sommet.
          </p>
        </div>

        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Email utilisé pour le paiement
            </label>
            <input
              type="email"
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/60"
              placeholder="toi@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/60"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="mt-1 text-[10px] text-slate-500">
              Minimum 6 caractères. Tu pourras le modifier plus tard.
            </p>
          </div>

          {errorMsg && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-xl px-3 py-2">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2">
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-brand-500 hover:bg-brand-400 disabled:bg-brand-500/60 text-white font-bold text-sm rounded-xl transition-colors"
          >
            {loading ? 'Création en cours…' : 'Créer mon accès Sommet'}
          </button>
        </form>

        <p className="mt-4 text-[10px] text-slate-500 text-center">
          En cas de souci, contacte-nous avec l&apos;email utilisé pour le paiement.
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;