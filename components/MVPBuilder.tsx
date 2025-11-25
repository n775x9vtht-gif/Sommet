import React, { useState, useEffect } from 'react';
import { generateMVPBlueprint } from '../services/geminiService';
import { generateProjectReport } from '../services/pdfService';
import { SavedIdea, MVPBlueprint } from '../types';
import {
  IconTools,
  IconLayer,
  IconList,
  IconRocket,
  IconCheck,
  IconArrowRight,
  IconDownload,
  IconBlueprint,
  IconLock,
  IconDiamond,
} from './Icons';
import { getCurrentUserProfile } from '../services/profileService';
import { consumeMvpBlueprint } from '../services/creditsService'; // ✅ gestion quotas Blueprint

interface MVPBuilderProps {
  savedIdeas: SavedIdea[];
  initialIdea?: SavedIdea | null;
  onSaveBlueprint: (ideaId: string, blueprint: MVPBlueprint) => void;
  onOpenPricing?: () => void; // ✅ pour ouvrir la page Pricing depuis la modale / l'écran verrouillé
}

const MVPBuilder: React.FC<MVPBuilderProps> = ({
  savedIdeas,
  initialIdea,
  onSaveBlueprint,
  onOpenPricing,
}) => {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 👉 Gestion du plan utilisateur
  const [plan, setPlan] = useState<string>('camp_de_base');
  const [profileLoading, setProfileLoading] = useState(true);

  // 👉 Modale d'erreur / upgrade
  const [errorModal, setErrorModal] = useState<null | {
    title: string;
    message: string;
    cta?: 'pricing' | 'none';
  }>(null);

  useEffect(() => {
    // Charger le profil pour connaître le plan
    (async () => {
      const profile = await getCurrentUserProfile();
      const userPlan = profile?.plan || 'camp_de_base';
      setPlan(userPlan);
      setProfileLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (initialIdea) {
      setSelectedIdeaId(initialIdea.id);
    } else if (savedIdeas.length > 0 && !selectedIdeaId) {
      setSelectedIdeaId(savedIdeas[0].id);
    }
  }, [initialIdea, savedIdeas]);

  const selectedIdea = savedIdeas.find((i) => i.id === selectedIdeaId);

  const handleGenerate = async () => {
    if (!selectedIdea) return;

    // Reset éventuelle ancienne modale
    setErrorModal(null);

    // 🟡 1. Consommer un crédit de Blueprint (Explorateur = 1, Bâtisseur = illimité)
    const remaining = await consumeMvpBlueprint();

    // ❌ Cas erreur / quota déjà utilisé
    if (remaining === null) {
      // 👉 Cas typique : Explorateur qui tente un 2e Blueprint
      if (plan === 'explorateur') {
        setErrorModal({
          title: "Blueprint déjà utilisé",
          message:
            "Avec l'offre Explorateur, vous disposez d'un seul Blueprint MVP complet.\n\nPassez à l'offre Bâtisseur pour débloquer des Blueprints illimités, accéder au Chantier et utiliser l'assistant Sherpa pour vous accompagner dans l'exécution.",
          cta: 'pricing',
        });
      } else {
        // Vrai cas technique : autre plan + souci SQL / réseau
        setErrorModal({
          title: "Impossible de vérifier vos droits Blueprint",
          message:
            "Un problème technique est survenu pendant la vérification de vos droits. Réessayez dans quelques instants. Si le problème persiste, contactez le support Sommet.",
          cta: 'none',
        });
      }
      return;
    }

    // 🚫 Cas : plus de Blueprint disponibles (si ton SQL renvoie un nombre < 0)
    if (remaining < 0) {
      setErrorModal({
        title: "Blueprint déjà utilisé",
        message:
          "Avec l'offre Explorateur, vous disposez d'un seul Blueprint MVP complet.\n\nPassez à l'offre Bâtisseur pour débloquer des Blueprints illimités, accéder au Chantier et utiliser l'assistant Sherpa pour vous accompagner dans l'exécution.",
        cta: 'pricing',
      });
      return;
    }

    // 🟢 2. Si tout est OK, on génère le plan
    setLoading(true);
    try {
      const context = `${selectedIdea.title}: ${selectedIdea.description} (Tagline: ${selectedIdea.tagline})`;
      const blueprint = await generateMVPBlueprint(context);
      onSaveBlueprint(selectedIdea.id, blueprint);
    } catch (e) {
      console.error(e);
      setErrorModal({
        title: "Erreur lors de la génération du plan",
        message:
          "L'Architecte MVP a rencontré une erreur pendant la génération du Blueprint. Réessayez dans quelques instants.",
        cta: 'none',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (selectedIdea) {
      // pdfService gère déjà les droits selon le plan (Camp de Base = 0 export)
      generateProjectReport(selectedIdea);
    }
  };

  // --- ÉTATS SPÉCIAUX ---

  // 1) Profil en cours de chargement
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <svg
            className="animate-spin h-6 w-6 text-brand-500"
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
          <p className="text-sm">Chargement de votre espace Sommet...</p>
        </div>
      </div>
    );
  }

  // 2) Plan gratuit : accès Blueprint interdit
  if (plan === 'camp_de_base') {
    return (
      <div className="max-w-3xl mx-auto min-h-[70vh] flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mb-6 shadow-xl">
          <IconLock className="w-8 h-8 text-gold-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
          Blueprint réservé aux Explorateurs & Bâtisseurs
        </h1>
        <p className="text-slate-400 mb-6 text-lg leading-relaxed max-w-xl">
          Le plan d&apos;attaque complet (stack technique, roadmap et Killer Feature)
          est disponible avec les offres{' '}
          <span className="text-gold-400 font-semibold">
            L&apos;Explorateur
          </span>{' '}
          et{' '}
          <span className="text-gold-400 font-semibold">Le Bâtisseur</span>.
        </p>
        <div className="bg-dark-800 border border-gold-500/30 rounded-2xl px-6 py-4 flex items-center gap-3 mb-8 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
          <IconDiamond className="w-5 h-5 text-gold-400" />
          <p className="text-sm text-slate-300">
            Avec le Camp de Base, vous pouvez générer des idées et faire une
            première analyse de marché. Passez au niveau supérieur pour
            construire votre MVP.
          </p>
        </div>

        {/* CTA UPGRADE */}
        <button
          onClick={() => onOpenPricing?.()}
          className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-dark-900 rounded-2xl font-bold shadow-lg shadow-gold-500/20 hover:-translate-y-1 transition-all text-sm uppercase tracking-wide"
        >
          Voir les offres
        </button>

        <p className="text-xs text-slate-500 mt-4 max-w-sm">
          Astuce : utilisez d&apos;abord le Validateur pour tester votre idée, puis
          upgradez pour transformer le concept en plan d&apos;exécution.
        </p>
      </div>
    );
  }

  // 3) Aucun projet sauvegardé (mais utilisateur payant)
  if (savedIdeas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="w-24 h-24 bg-dark-800 rounded-3xl flex items-center justify-center mb-8 border border-dark-700 shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500">
          <IconBlueprint className="w-12 h-12 text-slate-600" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
          Aucun projet disponible
        </h2>
        <p className="text-slate-400 max-w-md mb-10 text-lg leading-relaxed">
          Commencez par générer et sauvegarder une idée pour pouvoir construire
          son plan.
        </p>
      </div>
    );
  }

  // --- UI normale (plans payants) ---

  return (
    <>
      <div className="max-w-7xl mx-auto animate-fade-in pb-32">
        {/* Header Standardisé */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-dark-800 rounded-2xl mb-6 border border-dark-700 shadow-lg">
            <IconBlueprint className="w-8 h-8 text-brand-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            L&apos;Architecte <span className="text-brand-500">MVP</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Transformez votre idée floue en un plan d&apos;attaque militaire.
            Stack technique, feuille de route et fonctionnalités essentielles.
          </p>
        </div>

        {/* Selection Bar */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16 bg-dark-800/50 p-4 rounded-2xl border border-dark-700 backdrop-blur-sm max-w-3xl mx-auto shadow-xl">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Projet Actuel :
          </span>
          <select
            value={selectedIdeaId}
            onChange={(e) => setSelectedIdeaId(e.target.value)}
            className="bg-dark-900 text-white border border-dark-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500 min-w-[280px] font-bold shadow-inner"
          >
            {savedIdeas.map((idea) => (
              <option key={idea.id} value={idea.id}>
                {idea.title}
              </option>
            ))}
          </select>

          {selectedIdea?.blueprint && (
            <button
              onClick={handleDownloadPDF}
              className="ml-0 md:ml-4 bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold px-6 py-3 rounded-xl flex items-center transition-all shadow-lg shadow-gold-500/20 hover:-translate-y-0.5"
            >
              <IconDownload className="w-4 h-4 mr-2" />
              Télécharger le Rapport (PDF)
            </button>
          )}
        </div>

        {/* Main Content Area */}
        {!selectedIdea?.blueprint ? (
          // STATE: Ready to Generate
          <div className="bg-dark-800 border border-dark-700 rounded-[2rem] p-12 md:p-16 text-center shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-purple-600"></div>
            <div className="max-w-lg mx-auto space-y-8">
              <div className="w-24 h-24 bg-dark-900 rounded-full flex items-center justify-center mx-auto border border-dark-600 shadow-inner">
                <IconRocket className="w-10 h-10 text-brand-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-white">
                  Prêt à construire &quot;{selectedIdea?.title}&quot; ?
                </h3>
                <p className="text-slate-400 leading-relaxed text-lg">
                  Notre IA &quot;CTO&quot; va définir pour vous la
                  fonctionnalité unique, les outils exacts et le planning.
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center transition-all shadow-lg group ${
                  loading
                    ? 'bg-dark-700 text-slate-400 cursor-not-allowed'
                    : 'bg-brand-600 hover:bg-brand-500 text-white hover:-translate-y-1 shadow-brand-900/40'
                }`}
              >
                {loading ? (
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
                    L&apos;Architecte dessine les plans...
                  </>
                ) : (
                  <>
                    Générer le Blueprint MVP
                    <IconArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          // STATE: Blueprint Display
          <div className="space-y-12 animate-fade-in-up">
            {/* 1. The CORE FEATURE (Hero) */}
            <div className="bg-gradient-to-br from-dark-800 to-dark-900 border border-gold-500/30 rounded-[2rem] p-10 md:p-12 relative overflow-hidden shadow-[0_0_50px_-12px_rgba(212,175,55,0.1)]">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gold-500/10 rounded-xl border border-gold-500/20">
                  <IconLayer className="w-6 h-6 text-gold-500" />
                </div>
                <span className="text-sm font-bold text-gold-500 uppercase tracking-widest">
                  La Killer Feature
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                {selectedIdea.blueprint.coreFeature.name}
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-4xl font-light">
                {selectedIdea.blueprint.coreFeature.description}
              </p>
              <div className="bg-dark-950/60 p-6 rounded-2xl border border-dark-700/50 inline-block backdrop-blur-sm">
                <span className="text-gold-400 font-bold text-base uppercase tracking-wide block mb-2">
                  Pourquoi c&apos;est vital :
                </span>
                <span className="text-slate-400 text-lg italic">
                  &quot;{selectedIdea.blueprint.coreFeature.valueProp}&quot;
                </span>
              </div>
            </div>

            {/* 2. The TECH STACK (Grid) */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center border border-dark-700">
                  <IconTools className="w-5 h-5 text-brand-500" />
                </div>
                Arsenal Technique
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {selectedIdea.blueprint.techStack.map((tool, idx) => {
                  const cleanDomain =
                    tool.website
                      ?.replace(/^https?:\/\//, '')
                      .replace(/\/$/, '') || '';

                  return (
                    <div
                      key={idx}
                      className="group bg-dark-800 border border-dark-700 p-6 rounded-[1.5rem] hover:border-brand-500/30 transition-all hover:-translate-y-1 shadow-lg"
                    >
                      <div className="flex justify-between items-start mb-5">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-dark-900 px-2 py-1 rounded">
                          {tool.category}
                        </div>
                        {cleanDomain && (
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`}
                            alt={tool.toolName}
                            className="w-10 h-10 rounded-xl shadow-lg bg-white p-1 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                'none';
                            }}
                          />
                        )}
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                        {tool.toolName}
                      </h4>
                      <p className="text-sm text-slate-400 mb-6 min-h-[60px] leading-relaxed">
                        {tool.reason}
                      </p>
                      <a
                        href={`https://${cleanDomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-brand-500 hover:text-brand-400 flex items-center uppercase tracking-wide"
                      >
                        Visiter le site
                        <IconArrowRight className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. The ROADMAP (Timeline) */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
                <div className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center border border-dark-700">
                  <IconList className="w-5 h-5 text-brand-500" />
                </div>
                Plan de 4 Semaines
              </h3>
              <div className="relative border-l-2 border-dark-700 ml-5 md:ml-12 space-y-12 pb-4">
                {selectedIdea.blueprint.roadmap.map((step, idx) => (
                  <div key={idx} className="relative pl-8 md:pl-12 group">
                    <div className="absolute -left-[1px] -translate-x-1/2 top-1.5 w-4 h-4 rounded-full bg-dark-900 border-2 border-brand-500 z-10 group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>

                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="min-w-[120px]">
                        <span className="text-xs font-bold text-brand-400 uppercase tracking-widest bg-brand-900/20 px-3 py-1.5 rounded-lg border border-brand-500/20">
                          Semaine {step.week}
                        </span>
                      </div>
                      <div className="flex-1 bg-dark-800 p-8 rounded-[1.5rem] border border-dark-700 shadow-xl hover:border-dark-600 transition-colors">
                        <h4 className="text-xl font-bold text-white mb-6">
                          {step.phase}
                        </h4>
                        <ul className="space-y-4">
                          {step.tasks.map((task, tIdx) => (
                            <li
                              key={tIdx}
                              className="flex items-start text-slate-300 text-sm leading-relaxed"
                            >
                              <IconCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🔔 Modale d'info / upgrade */}
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

export default MVPBuilder;
