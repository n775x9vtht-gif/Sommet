import React, { useState, useEffect } from 'react';
import { analyzeIdea } from '../services/geminiService';
import { MarketAnalysis, SavedIdea } from '../types';
import { IconChart, IconMountain, IconLock, IconArrowRight } from './Icons';
import { consumeMarketAnalysis } from '../services/creditsService';

interface MarketAnalyzerProps {
  initialIdea?: SavedIdea | null;
  onSave?: (ideaId: string, analysis: MarketAnalysis) => void;
  isGuestMode?: boolean;
  onTriggerAuth?: () => void;
  onOpenPricing?: () => void; // ✅ pour CTA upgrade
}

const MarketAnalyzer: React.FC<MarketAnalyzerProps> = ({
  initialIdea,
  onSave,
  isGuestMode = false,
  onTriggerAuth,
  onOpenPricing,
}) => {
  const [inputIdea, setInputIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [quotaLocked, setQuotaLocked] = useState(false); // ✅ plus d'analyse dispo

  useEffect(() => {
    if (initialIdea) {
      setInputIdea(`${initialIdea.title} - ${initialIdea.description}`);
      setAnalysis(initialIdea.analysis || null);
    }
  }, [initialIdea]);

  const handleOpenPricing = () => {
    // Si le parent a donné un handler, on l’utilise
    if (onOpenPricing) {
      onOpenPricing();
    } else if (typeof window !== 'undefined') {
      // Sinon, fallback sur l’event global (comme pour le PDF)
      try {
        window.dispatchEvent(new Event('sommet:open_pricing'));
      } catch (err) {
        console.warn('Impossible de dispatcher sommet:open_pricing', err);
      }
    }
    setQuotaLocked(false);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isGuestMode) {
      onTriggerAuth?.();
      return;
    }

    if (!inputIdea) return;

    // 🟡 1. Consommer 1 crédit d'analyse de marché
    const remaining = await consumeMarketAnalysis();

    // ❌ Cas technique : RPC qui plante vraiment
    if (remaining === null) {
      alert(
        "Impossible de vérifier vos crédits d'analyse pour le moment. Réessayez dans quelques instants."
      );
      return;
    }

    // 🚫 Cas : plus d'analyses disponibles (Camp de Base & Explorateur → 1 seule analyse)
    if (remaining < 0) {
      setQuotaLocked(true);
      return;
    }

    // 🟢 2. Si tout est OK, on lance l'analyse IA
    setLoading(true);
    // Tu peux garder l'analyse précédente ou la vider. Là on garde.
    // setAnalysis(null);

    try {
      const result = await analyzeIdea(inputIdea);
      const newAnalysis: MarketAnalysis = {
        score: result.score,
        swot: {
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          opportunities: result.opportunities,
          threats: result.threats,
        },
        competitors: result.competitors,
        go_to_market: result.go_to_market,
        verdict: result.verdict,
      };

      setAnalysis(newAnalysis);

      if (initialIdea && onSave) {
        onSave(initialIdea.id, newAnalysis);
      }
    } catch (error) {
      console.error(error);
      alert('Erreur d’analyse. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-20">
      {/* Header Standardisé */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-dark-800 rounded-2xl mb-6 border border-dark-700 shadow-lg">
          <IconChart className="w-8 h-8 text-brand-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Validateur de Marché
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Ne partez pas à l&apos;aveugle. Obtenez une analyse stratégique digne
          d&apos;un fond d&apos;investissement.
        </p>
      </div>

      {/* Formulaire Standardisé */}
      <form
        onSubmit={handleAnalyze}
        className="bg-dark-800 p-8 md:p-10 rounded-[2rem] border border-dark-700 shadow-2xl mb-10 relative overflow-hidden max-w-4xl mx-auto"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-purple-600"></div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">
          Pitch de votre idée
        </label>
        <textarea
          value={inputIdea}
          onChange={(e) => setInputIdea(e.target.value)}
          disabled={isGuestMode}
          placeholder="Décrivez votre concept ici..."
          className={`w-full h-32 bg-dark-900 border border-dark-600 text-white rounded-2xl px-6 py-4 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none mb-8 placeholder-slate-600 text-lg leading-relaxed ${
            isGuestMode ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          required={!isGuestMode}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center transition-all shadow-lg group ${
            loading
              ? 'bg-dark-700 text-slate-400 cursor-not-allowed'
              : isGuestMode
              ? 'bg-gold-500 hover:bg-gold-400 text-dark-900 shadow-gold-500/20'
              : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-900/40 hover:-translate-y-1'
          }`}
        >
          {isGuestMode ? (
            <>
              <IconLock className="w-5 h-5 mr-3" />
              S&apos;inscrire pour analyser
            </>
          ) : loading ? (
            <span className="flex items-center">
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
              Analyse stratégique en cours...
            </span>
          ) : (
            <>
              <IconChart className="w-6 h-6 mr-3" />
              Lancer l&apos;audit de viabilité
              <IconArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* 🔒 Modal "plus de crédits d'analyse" – même style que le Générateur */}
      {quotaLocked && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-dark-950/70 backdrop-blur-sm"
            onClick={() => setQuotaLocked(false)}
          />
          <div className="relative max-w-lg w-full bg-dark-900 rounded-2xl border border-gold-500/40 shadow-2xl p-8">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center p-3 bg-dark-800 rounded-xl border border-gold-500/40 mb-4">
                <IconLock className="w-6 h-6 text-gold-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                Plus de crédits d&apos;analyse
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                Vous avez utilisé l&apos;analyse de marché incluse dans votre offre
                actuelle (<span className="font-semibold">Camp de Base</span> ou{' '}
                <span className="font-semibold">Explorateur</span>).
                <br />
                Passez à une offre supérieure pour débloquer davantage d&apos;analyses
                IA et affiner votre stratégie de lancement.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-2">
                <button
                  onClick={() => setQuotaLocked(false)}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-dark-600 bg-dark-800 text-slate-200 text-sm font-bold hover:bg-dark-700 transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={handleOpenPricing}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-dark-900 text-sm font-bold shadow-lg shadow-gold-500/30 transition-transform hover:-translate-y-0.5"
                >
                  Voir les offres
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {analysis && (
        <div className="animate-fade-in space-y-8">
          {/* Score Card */}
          <div className="bg-dark-800 border border-dark-700 rounded-[2rem] overflow-hidden shadow-2xl relative hover:border-gold-500/30 transition-colors duration-500">
            <div className="bg-dark-900/50 p-6 border-b border-dark-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <IconMountain className="w-5 h-5 text-gold-500" />
                <span className="font-bold text-white text-lg">
                  Rapport d&apos;analyse IA
                </span>
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                Généré à l&apos;instant
              </div>
            </div>

            <div className="p-10 flex flex-col md:flex-row items-center gap-12">
              {/* Score Circle */}
              <div className="flex flex-col items-center justify-center flex-shrink-0">
                <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-dark-900"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    <path
                      className={
                        analysis.score >= 80
                          ? 'text-green-500'
                          : analysis.score >= 60
                          ? 'text-gold-500'
                          : 'text-red-500'
                      }
                      strokeDasharray={`${analysis.score}, 100`}
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-5xl font-black text-white tracking-tight">
                      {analysis.score}
                    </span>
                  </div>
                </div>
                <div
                  className={`text-sm font-bold px-4 py-1.5 rounded-full border ${
                    analysis.score >= 80
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : analysis.score >= 60
                      ? 'bg-gold-500/10 text-gold-400 border-gold-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
                >
                  {analysis.score >= 80
                    ? 'Potentiel Élevé'
                    : analysis.score >= 60
                    ? 'Potentiel Modéré'
                    : 'Risque Élevé'}
                </div>
              </div>

              {/* Verdict Text */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-4">
                  L&apos;avis de l&apos;Expert
                </h3>
                <p className="text-xl text-slate-300 leading-relaxed font-light italic">
                  &quot;{analysis.verdict}&quot;
                </p>
              </div>
            </div>
          </div>

          {/* SWOT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Forces */}
            <div className="bg-dark-800 rounded-[1.5rem] p-8 border border-dark-700 hover:border-green-500/20 transition-colors">
              <h3 className="text-base font-bold text-white mb-6 flex items-center uppercase tracking-widest">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-3 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                Forces
              </h3>
              <ul className="space-y-4">
                {analysis.swot.strengths.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start text-slate-300 text-sm leading-relaxed"
                  >
                    <span className="text-green-500 mr-3 font-bold text-lg leading-none">
                      +
                    </span>{' '}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Faiblesses */}
            <div className="bg-dark-800 rounded-[1.5rem] p-8 border border-dark-700 hover:border-red-500/20 transition-colors">
              <h3 className="text-base font-bold text-white mb-6 flex items-center uppercase tracking-widest">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-3 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                Faiblesses
              </h3>
              <ul className="space-y-4">
                {analysis.swot.weaknesses.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start text-slate-300 text-sm leading-relaxed"
                  >
                    <span className="text-red-500 mr-3 font-bold text-lg leading-none">
                      -
                    </span>{' '}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunités */}
            <div className="bg-dark-800 rounded-[1.5rem] p-8 border border-dark-700 hover:border-blue-500/20 transition-colors">
              <h3 className="text-base font-bold text-white mb-6 flex items-center uppercase tracking-widest">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                Opportunités
              </h3>
              <ul className="space-y-4">
                {analysis.swot.opportunities.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start text-slate-300 text-sm leading-relaxed"
                  >
                    <span className="text-blue-500 mr-3 font-bold text-lg leading-none">
                      ↗
                    </span>{' '}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Menaces */}
            <div className="bg-dark-800 rounded-[1.5rem] p-8 border border-dark-700 hover:border-orange-500/20 transition-colors">
              <h3 className="text-base font-bold text-white mb-6 flex items-center uppercase tracking-widest">
                <span className="w-2.5 h-2.5 bg-orange-500 rounded-full mr-3 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                Menaces
              </h3>
              <ul className="space-y-4">
                {analysis.swot.threats.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start text-slate-300 text-sm leading-relaxed"
                  >
                    <span className="text-orange-500 mr-3 font-bold text-lg leading-none">
                      !
                    </span>{' '}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Competitors & Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-dark-800 rounded-[1.5rem] p-8 border border-dark-700">
              <h3 className="text-base font-bold text-white mb-6 uppercase tracking-widest">
                Concurrents
              </h3>
              <div className="flex flex-wrap gap-3">
                {analysis.competitors.map((comp, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-dark-900 text-slate-300 rounded-xl text-sm border border-dark-600 font-medium"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 bg-dark-800 rounded-[1.5rem] p-8 border border-dark-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <h3 className="text-base font-bold text-brand-400 mb-6 uppercase tracking-widest">
                Stratégie Go-To-Market
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg">
                {analysis.go_to_market}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketAnalyzer;
