// components/SuccessPage.tsx
import React, { useState } from 'react';
import { IconMountain } from './Icons';
import { supabase } from '../services/supabaseClient';

const SuccessPage: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sessionId = new URLSearchParams(window.location.search).get('session_id');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!sessionId) {
      setErrorMsg("Session Stripe introuvable. Contacte le support.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ On demande au backend de créer le compte (Stripe + Supabase admin)
      const res = await fetch('/api/complete-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          password,
          fullName: fullName || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Erreur lors de la création du compte');
      }

      const email = data.email as string;

      // 2️⃣ On connecte l'utilisateur côté front avec Supabase (auth classique)
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        console.error(loginError);
        setErrorMsg(
          "Votre compte a été créé, mais la connexion a échoué. Essayez de vous connecter depuis la page d'accueil."
        );
        return;
      }

      console.log('✅ Connecté en tant que', loginData.user?.email);
      onEnterApp();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Erreur inattendue lors de l'activation du compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-dark-900 border border-dark-700 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-dark-800 rounded-xl flex items-center justify-center border border-dark-700 mb-3">
            <IconMountain className="w-6 h-6 text-gold-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Paiement confirmé 🎉
          </h1>
          <p className="text-slate-400 text-sm text-center">
            Dernière étape : créez votre mot de passe pour accéder à Sommet.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Prénom (optionnel)
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
              placeholder="Votre prénom"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
              placeholder="Au moins 8 caractères"
              required
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-dark-900 transition-all shadow-lg mt-2 ${
              loading
                ? 'bg-slate-600 cursor-not-allowed'
                : 'bg-gold-500 hover:bg-gold-400 hover:-translate-y-0.5'
            }`}
          >
            {loading ? 'Activation en cours…' : "Créer mon accès Sommet"}
          </button>
        </form>

        <p className="mt-4 text-[11px] text-slate-500 text-center">
          En cas de souci, contactez-nous avec l&apos;email utilisé pour le paiement.
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;