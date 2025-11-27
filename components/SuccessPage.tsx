// components/SuccessPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../services/supabaseClient';
import { IconMountain } from './Icons';

type SuccessPlan = 'explorateur' | 'batisseur';

interface SuccessPageProps {
  onEnterApp: () => void;
  plan?: SuccessPlan;
}

// Helpers UI pour le badge plan (glassmorphism)
function getPlanLabel(plan?: SuccessPlan): string {
  if (plan === 'explorateur') return 'Explorateur';
  if (plan === 'batisseur') return 'Bâtisseur';
  return 'Camp de Base';
}

function getPlanBadgeClass(plan?: SuccessPlan): string {
  const base =
    'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold ' +
    'backdrop-blur bg-white/5 border shadow-sm shadow-black/30 whitespace-nowrap';

  switch (plan) {
    case 'explorateur':
      return `${base} text-sky-100 border-sky-400/60 bg-sky-500/15`;
    case 'batisseur':
      return `${base} text-amber-100 border-amber-400/80 bg-amber-500/20`;
    default:
      return `${base} text-slate-200 border-slate-500/50`;
  }
}

function getPlanDotClass(plan?: SuccessPlan): string {
  switch (plan) {
    case 'explorateur':
      return 'w-2 h-2 rounded-full bg-sky-400';
    case 'batisseur':
      return 'w-2 h-2 rounded-full bg-amber-400';
    default:
      return 'w-2 h-2 rounded-full bg-slate-400';
  }
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onEnterApp, plan }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(''); // rempli depuis Stripe
  const [sessionId, setSessionId] = useState<string | null>(null);

  const supabase = useMemo(() => getSupabaseClient(), []);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sid = params.get('session_id');
      setSessionId(sid);

      if (sid) {
        // Aller chercher l'email utilisé sur Stripe
        fetch('/api/get-stripe-session-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sid }),
        })
          .then(async (res) => {
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error(data.error || 'Erreur lors de la récupération de la session Stripe');
            }
            return res.json();
          })
          .then((data: { email?: string }) => {
            if (data.email) {
              setEmail(data.email);
            } else {
              setErrorMsg(
                "Impossible de récupérer l'email utilisé pour le paiement. Contacte le support si le problème persiste."
              );
            }
          })
          .catch((err) => {
            console.error('Erreur get-stripe-session-email:', err);
            setErrorMsg(
              "Impossible de récupérer l'email utilisé pour le paiement. Contacte le support si le problème persiste."
            );
          })
          .finally(() => setInitialLoading(false));
      } else {
        setErrorMsg("Session de paiement introuvable dans l'URL.");
        setInitialLoading(false);
      }
    } else {
      setInitialLoading(false);
    }
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!sessionId) {
      setErrorMsg("Session de paiement introuvable. Contacte le support.");
      return;
    }

    if (!email) {
      setErrorMsg("Email Stripe introuvable. Contacte le support.");
      return;
    }

    if (!password || password.length < 8) {
      setErrorMsg('Ton mot de passe doit faire au moins 8 caractères.');
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Création du compte côté Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName || null,
            last_name: lastName || null,
          },
        },
      });

      if (signUpError) {
        console.error('Erreur Supabase signUp:', signUpError);
        setErrorMsg(
          signUpError.message ||
            "Impossible de créer ton compte. Réessaie ou contacte le support."
        );
        setLoading(false);
        return;
      }

      // 2️⃣ Confirmation du paiement + attribution du plan/crédits
      const confirmRes = await fetch('/api/confirm-stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, email }),
      });

      if (!confirmRes.ok) {
        const data = await confirmRes.json().catch(() => ({}));
        console.error('Erreur confirm-stripe-checkout:', data);
        setErrorMsg(
          data.error ||
            "Impossible de vérifier le paiement. Si le problème persiste, contacte le support avec ton email."
        );
        setLoading(false);
        return;
      }

      // 3️⃣ Succès → redirection vers Sommet
      setSuccessMsg('Compte créé avec succès ! Redirection vers Sommet…');
      localStorage.removeItem('sommet_guest_mode');

      setTimeout(() => {
        onEnterApp();
      }, 700);
    } catch (err: any) {
      console.error('Erreur inattendue lors de la création de compte:', err);
      setErrorMsg("Erreur inattendue. Réessaie dans quelques instants.");
      setLoading(false);
    }
  };

  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-dark-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-dark-900 border border-dark-700 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
            <IconMountain className="w-6 h-6 text-gold-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white text-center">
            Paiement confirmé 🎉
          </h1>
          <p className="mt-2 text-sm text-slate-400 text-center">
            Dernière étape : crée ton accès Sommet.
          </p>

          {/* Plan choisi */}
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center gap-3 bg-dark-950/70 px-3 py-2 rounded-full border border-dark-700 flex-nowrap">
              <span className="text-[10px] font-semibold tracking-[0.14em] text-slate-500 uppercase whitespace-nowrap">
                Plan choisi
              </span>
              <span className={getPlanBadgeClass(plan)}>
                <span className={getPlanDotClass(plan)} />
                <span>{getPlanLabel(plan)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Prénom
              </label>
              <input
                type="text"
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/60"
                placeholder="Rémi"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Nom
              </label>
              <input
                type="text"
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/60"
                placeholder="Moreira"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Email utilisé pour le paiement
            </label>
            <input
              type="email"
              className="w-full bg-dark-800/70 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none cursor-not-allowed opacity-90"
              value={email}
              readOnly
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Cet email servira pour te connecter et recevoir tes reçus.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/60"
              placeholder="Au moins 8 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              autoComplete="new-password"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Minimum 8 caractères. Tu pourras le modifier plus tard.
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
            disabled={loading || initialLoading || !email || !sessionId}
            className="w-full mt-2 py-3 bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/60 text-dark-900 font-bold text-sm rounded-xl transition-colors flex items-center justify-center"
          >
            {(loading || initialLoading) ? 'Vérification en cours…' : 'Créer mon accès Sommet'}
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