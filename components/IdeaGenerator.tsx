import React, { useState } from 'react';
import { generateIdeas } from '../services/geminiService';
import { GeneratedIdea, SavedIdea } from '../types';
import {
  IconSparkles,
  IconSave,
  IconCheck,
  IconLock,
  IconArrowRight,
  IconBulb,
} from './Icons';
import { createIdea } from '../services/ideaService';
import { consumeCredit } from '../services/creditsService';

interface IdeaGeneratorProps {
  onSave: (idea: SavedIdea) => void;
  savedIdeaIds: string[];
  isGuestMode?: boolean;
  onTriggerAuth?: () => void;
  onOpenPricing?: () => void; // ✅ CTA vers la page Pricing
}

const IdeaGenerator: React.FC<IdeaGeneratorProps> = ({
  onSave,
  savedIdeaIds,
  isGuestMode = false,
  onTriggerAuth,
  onOpenPricing,
}) => {
  const [domain, setDomain] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);

  // ✅ Modale d’erreur / upgrade crédits
  const [errorModal, setErrorModal] = useState<null | {
    title: string;
    message: string;
    cta?: 'pricing' | 'none';
  }>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isGuestMode) {
      onTriggerAuth?.();
      return;
    }

    if (!domain || !keywords) return;

    // 🟡 1. Consommer 1 crédit AVANT de lancer l'IA
    const remaining = await consumeCredit();

    // ❌ Erreur technique / auth
    if (remaining === null) {
      setErrorModal({
        title: "Impossible de vérifier vos crédits",
        message:
          "Un problème technique est survenu pendant la vérification de vos crédits de génération.\n\nRéessayez dans quelques instants. Si le problème persiste, contactez le support Sommet.",
        cta: 'none',
      });
      return;
    }

    // 🚫 Plus de crédits disponibles
    if (remaining < 0) {
      setErrorModal({
        title: 'Plus de crédits de génération',
        message:
          "Vous avez utilisé tous les crédits du Générateur de Pépites pour votre offre actuelle.\n\nPassez à une offre supérieure pour débloquer plus de générations et continuer à explorer de nouveaux concepts.",
        cta: 'pricing',
      });
      return;
    }

    // 🟢 2. Prévenir la sidebar qu'il reste X crédits (pour mise à jour UI)
    try {
      window.dispatchEvent(
        new CustomEvent('sommet:credits-updated', { detail: { remaining } })
      );
    } catch (err) {
      console.warn('Impossible de dispatcher l’event credits-updated :', err);
    }

    // 🟢 3. Si tout est ok : on lance la génération
    setLoading(true);
    setIdeas([]);

    try {
      const result = await generateIdeas(keywords, domain);
      const formattedIdeas = result.ideas.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
        difficulty: item.difficulty as 'Faible' | 'Moyenne' | 'Élevée',
      }));
      setIdeas(formattedIdeas);
    } catch (error) {
      console.error(error);
      setErrorModal({
        title: 'Erreur lors de la génération',
        message:
          "Une erreur est survenue pendant la génération des idées.\n\nVérifiez votre connexion et réessayez.",
        cta: 'none',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIdea = async (idea: GeneratedIdea, isSaved: boolean) => {
    if (isSaved) return;

    // Construire l'objet SavedIdea
    const savedIdea: SavedIdea = {
      ...idea,
      savedAt: Date.now(),
    };

    // 1) Sauvegarde dans Supabase
    const created = await createIdea(savedIdea);

    if (!created) {
      alert("Impossible de sauvegarder l'idée (erreur Supabase).");
      return;
    }

    // 2) Mise à jour de l'état via le parent
    onSave(savedIdea);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto animate-fade-in pb-20">
        {/* Header Standardisé */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-dark-800 rounded-2xl mb-6 border border-dark-700 shadow-lg">
            <IconBulb className="w-8 h-8 text-brand-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Générateur de Pépites
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Transformez vos passions en opportunités de marché. Notre IA explore
            des niches inexploitées pour vous.
          </p>
        </div>

        {/* Formulaire Style 'Sommet' */}
        <form
          onSubmit={handleGenerate}
          className="bg-dark-800 p-8 md:p-10 rounded-[2rem] border border-dark-700 shadow-2xl mb-16 relative overflow-hidden max-w-4xl mx-auto"
        >
          {/* Decorative gradient line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 via-purple-500 to-gold-500"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                Domaine d&apos;intérêt
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Ex: Immobilier, Fitness, Crypto..."
                disabled={isGuestMode}
                className={`w-full bg-dark-900 border border-dark-600 text-white rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600 text-lg ${
                  isGuestMode ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                required={!isGuestMode}
              />
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                Vos atouts / Compétences
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Ex: React, Marketing, Design..."
                disabled={isGuestMode}
                className={`w-full bg-dark-900 border border-dark-600 text-white rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600 text-lg ${
                  isGuestMode ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                required={!isGuestMode}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center transition-all shadow-lg group ${
              loading
                ? 'bg-dark-700 text-slate-400 cursor-not-allowed'
                : isGuestMode
                ? 'bg-gold-500 hover:bg-gold-400 text-dark-900 hover:-translate-y-1 shadow-gold-500/20'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-900/50 hover:-translate-y-1'
            }`}
          >
            {isGuestMode ? (
              <>
                <IconLock className="w-5 h-5 mr-3" />
                S&apos;inscrire pour générer
              </>
            ) : loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Recherche de pépites en cours...
              </>
            ) : (
              <>
                <IconSparkles className="w-6 h-6 mr-3" />
                Découvrir des concepts gagnants
                <IconArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {ideas.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {ideas.map((idea) => {
              const isSaved = savedIdeaIds.includes(idea.id);
              return (
                <div
                  key={idea.id}
                  className="group relative bg-dark-800 border border-dark-700 rounded-[2rem] p-1 shadow-2xl hover:border-brand-500/30 transition-all duration-500 hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="bg-dark-800 rounded-[1.9rem] p-8 h-full flex flex-col relative overflow-hidden">
                    {/* Ambient Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <span className="px-3 py-1 rounded-lg bg-dark-900/50 text-slate-300 text-xs font-bold border border-dark-700 uppercase tracking-wide">
                        {idea.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold border bg-opacity-10 ${
                          idea.difficulty === 'Faible'
                            ? 'bg-green-500 text-green-400 border-green-500/20'
                            : idea.difficulty === 'Moyenne'
                            ? 'bg-yellow-500 text-yellow-400 border-yellow-500/20'
                            : 'bg-red-500 text-red-400 border-red-500/20'
                        }`}
                      >
                        Diff: {idea.difficulty}
                      </span>
                    </div>

                    <div className="relative z-10 flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-100 transition-colors leading-tight">
                        {idea.title}
                      </h3>
                      <p className="text-gold-500 text-sm font-medium mb-6 italic">
                        "{idea.tagline}"
                      </p>
                      <div className="pl-5 border-l-2 border-dark-600 mb-8 group-hover:border-brand-500/30 transition-colors">
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {idea.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-dark-900/50 p-3 rounded-xl border border-dark-700/50">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">
                            Cible
                          </span>
                          <p className="text-xs text-slate-300 font-medium line-clamp-2">
                            {idea.targetAudience}
                          </p>
                        </div>
                        <div className="bg-dark-900/50 p-3 rounded-xl border border-dark-700/50">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">
                            Modèle
                          </span>
                          <p className="text-xs text-slate-300 font-medium line-clamp-2">
                            {idea.revenueModel}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 mt-auto pt-6 border-t border-dark-700/50">
                      <button
                        onClick={() => handleSaveIdea(idea, isSaved)}
                        disabled={isSaved}
                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center border shadow-lg ${
                          isSaved
                            ? 'bg-green-500/10 border-green-500/20 text-green-400 cursor-default'
                            : 'bg-white text-dark-900 border-white hover:bg-slate-200 hover:-translate-y-0.5'
                        }`}
                      >
                        {isSaved ? (
                          <>
                            <IconCheck className="w-4 h-4 mr-2" />
                            Enregistré dans le coffre
                          </>
                        ) : (
                          <>
                            <IconSave className="w-4 h-4 mr-2" />
                            Sauvegarder cette idée
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🔔 Modale d'info / upgrade crédits Générateur */}
      {errorModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
            onClick={() => setErrorModal(null)}
          ></div>
          <div className="relative w-full max-w-md bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/40 flex items-center justify-center">
                <IconLock className="w-4 h-4 text-gold-400" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">
                {errorModal.title}
              </h2>
            </div>

            <p className="text-sm text-slate-300 whitespace-pre-line mb-6">
              {errorModal.message}
            </p>

            <div className="flex justify-end gap-3 text-xs">
              <button
                type="button"
                onClick={() => setErrorModal(null)}
                className="px-3 py-2 rounded-lg border border-dark-700 text-slate-300 hover:bg-dark-800 transition-colors"
              >
                Fermer
              </button>

              {errorModal.cta === 'pricing' && (
                <button
                  type="button"
                  onClick={() => {
                    setErrorModal(null);
                    onOpenPricing?.();
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-gold-500 hover:bg-gold-400 text-dark-900 shadow-lg shadow-gold-500/20 transition-colors"
                >
                  Voir les offres
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IdeaGenerator;
