import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { IconMountain, IconCheck } from './Icons';

interface SuccessPageProps {
  onEnterApp: () => void;
}

type PlanType = 'camp_de_base' | 'explorateur' | 'batisseur';

const SuccessPage: React.FC<SuccessPageProps> = ({ onEnterApp }) => {
  const [plan, setPlan] = useState<PlanType>('camp_de_base');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 🧠 Récupère le plan depuis l’URL: ?plan=explorateur | batisseur
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const p = params.get('plan');

      if (p === 'explorateur' || p === 'batisseur') {
        setPlan(p);
      } else {
        setPlan('camp_de_base');
      }
    } catch (e) {
      console.error('Erreur en lisant les paramètres d’URL', e);
      setPlan('camp_de_base');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Merci de renseigner un email et un mot de passe.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1️⃣ Création de l’utilisateur Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Erreur signUp Supabase :', error);
        setErrorMsg(error.message);
        setIsSubmitting(false);
        return;
      }

      const user = data.user;
      if (!user) {
        setErrorMsg("Impossible de récupérer l'utilisateur après inscription.");
        setIsSubmitting(false);
        return;
      }

      // 2️⃣ Mise à jour / création du profil avec le BON plan
      // On écrase le plan par défaut "camp_de_base" en fonction de ce qui a été acheté.
      let planToSet: PlanType = 'camp_de_base';
      let generationCredits: number | null = null;
      let analysisCredits: number | null = null;
      let mvpBlueprintCredits: number | null = null;
      let pdfExportsUsed: number | null = 0;
      let marketAnalysesUsed: number | null = 0;

      if (plan === 'explorateur') {
        planToSet = 'explorateur';
        generationCredits = 20;
        analysisCredits = 1;
        mvpBlueprintCredits = 1;
        // export PDF illimité ou 1, selon ta logique; pour l’instant on garde 0 used
      } else if (plan === 'batisseur') {
        planToSet = 'batisseur';
        // Pour l’abonnement, tu peux choisir :
        // soit laisser les crédits à null (illimité géré côté app),
        // soit mettre un gros nombre si tu veux limiter.
        generationCredits = null;
        analysisCredits = null;
        mvpBlueprintCredits = null;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            full_name: null,
            avatar_url: null,
            plan: planToSet,
            generation_credits: generationCredits,
            analysis_credits: analysisCredits,
            mvp_blueprint_credits: mvpBlueprintCredits,
            pdf_exports_used: pdfExportsUsed,
            market_analyses_used: marketAnalysesUsed,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      if (profileError) {
        console.error('Erreur lors de la mise à jour du profil :', profileError);
        setErrorMsg("Votre compte a été créé, mais une erreur est survenue lors de l'initialisation du profil.");
        setIsSubmitting(false);
        return;
      }

      // 3️⃣ Tout est bon → on entre dans l’app Sommet
      await onEnterApp();
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error('Erreur inattendue lors de la création de compte :', err);
      setErrorMsg("Une erreur inattendue est survenue, veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const planLabel =
    plan === 'explorateur'
      ? "Offre Explorateur"
      : plan === 'batisseur'
      ? "Offre Bâtisseur"
      : "Camp de Base";

  return (
    <div className="min-h-screen bg-dark-950 text-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-dark-900 border border-dark-700 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
            <IconMountain className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-300 font-bold">
              Paiement confirmé
            </p>
            <h1 className="text-2xl font-black text-white">Bienvenue sur Sommet</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 text-sm text-green-400">
          <IconCheck className="w-4 h-4" />
          <span>Votre {planLabel} est activé.</span>
        </div>

        <p className="text-slate-400 text-sm mb-6">
          Il ne reste plus qu&apos;à créer votre accès Sommet. Cet email servira à vous connecter
          et à recevoir vos futures notifications.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl bg-dark-800 border border-dark-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl bg-dark-800 border border-dark-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="••••••••"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Minimum 6 caractères. Vous pourrez le modifier plus tard.
            </p>
          </div>

          {errorMsg && (
            <div className="text-xs text-red-400 bg-red-900/20 border border-red-900/40 rounded-lg px-3 py-2">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-900 rounded-xl font-bold text-sm text-white transition-colors"
          >
            {isSubmitting ? 'Création de votre accès…' : 'Créer mon accès Sommet'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuccessPage;