// components/SuccessPage.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { IconMountain } from './Icons';

interface SuccessPageProps {
  onEnterApp: () => void;
  plan?: 'explorateur' | 'batisseur';
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onEnterApp, plan }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // On récupère le session_id dans l’URL (Stripe remplace {CHECKOUT_SESSION_ID})
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('session_id');
    if (sid) {
      setSessionId(sid);
    }
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
    if (!sessionId) {
      setErrorMsg(
        "Impossible de retrouver l'identifiant de paiement. Recharge la page ou contacte le support."
      );
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Créer le compte Supabase (pour avoir un user_id)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName || null,
          },
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

      const userId = data.user?.id;
      if (!userId) {
        setErrorMsg(
          "Impossible de récupérer ton identifiant utilisateur. Contacte le support."
        );
        setLoading(false);
        return;
      }

      // 2️⃣ Vérifier le paiement + mettre à jour le plan/les crédits côté serveur
      const confirmRes = await fetch('/api/confirm-stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          email,
          userId,
        }),
      });

      const confirmData = await confirmRes.json().catch(() => null);

      if (!confirmRes.ok || !confirmData?.success) {
        console.error(
          '❌ Erreur confirm-stripe-checkout:',
          confirmRes.status,
          confirmData
        );
        setErrorMsg(
          confirmData?.error ||
            "Impossible de vérifier le paiement. Si le problème persiste, contacte le support avec ton email."
        );
        setLoading(false);
        return;
      }

      // 3️⃣ Tout est ok → on entre dans l'app
      setSuccessMsg('Compte créé avec succès ! Redirection vers Sommet…');
      localStorage.removeItem('sommet_guest_mode');

      setTimeout(() => {
        onEnterApp();
      }, 600);
    } catch (err: any) {
      console.error('Erreur inattendue lors de la création de compte:', err);
      setErrorMsg(
        "Erreur inattendue. Réessaie dans quelques instants ou contacte le support."
      );
      setLoading(false);
    }
  };

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
          <p className="mt-2 text-sm text-slate-400 text-center">
            Dernière étape : crée ton mot de passe pour accéder à Sommet.
          </p>
          {plan && (
            <p className="mt-1 text-xs text-gold-300 text-center">
              Offre détectée : <strong>{plan === 'batisseur' ? 'Bâtisseur' : 'Explorateur'}</strong>
            </p>
          )}
        </div>

        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Prénom (optionnel)
            </label>
            <input
              type="text"
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/60"
              placeholder="Rémi"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

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
            className="w-full mt-2 py-3 bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/60 text-dark-900 font-bold text-sm rounded-xl transition-colors"
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