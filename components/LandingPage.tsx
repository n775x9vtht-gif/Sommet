import React, { useState } from 'react';
import {
  IconRocket,
  IconMountain,
  IconCheck,
  IconArrowRight,
  IconTrophy,
  IconChart,
  IconClock,
  IconSherpa,
  IconDiamond,
  IconX,
  IconPlus,
  IconCopy,
  IconCodeBlockCopy,
  IconBulb,
  IconConstruction,
  IconBlueprint,
  IconList,
  IconTools
} from './Icons';
import AuthModal from './AuthModal';

interface LandingPageProps {
  onEnterApp: () => void;
  onEnterDemo: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onEnterDemo }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('REGISTER');

  const openAuth = (mode: 'LOGIN' | 'REGISTER') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleCheckout = async (plan: 'explorateur' | 'batisseur') => {
    const priceId =
      plan === 'explorateur'
        ? 'price_1SXR8gF1yiAtAmIj0NQNnVmH'
        : 'price_1SXR94F1yiAtAmIjmLg0JIkT';

    const mode: 'payment' | 'subscription' =
      plan === 'explorateur' ? 'payment' : 'subscription';

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, mode }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('❌ Réponse non OK de /api/create-checkout-session :', errorData);
        throw new Error('Réponse non OK');
      }

      const data = await response.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error('❌ Pas d\'URL dans la réponse Stripe :', data);
        alert("Impossible de démarrer le paiement Stripe.");
      }
    } catch (error) {
      console.error('❌ Erreur lors du démarrage du paiement Stripe :', error);
      alert('Impossible de démarrer le paiement Stripe.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden antialiased relative">
      {/* Subtle grid background - Stripe style */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Gradient mesh background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[128px] animate-pulse-slow"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[128px] animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[128px] animate-pulse-slow" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={onEnterApp}
      />

      {/* Navbar - Ultra minimal */}
      <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-2xl border-b border-slate-900/5">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            {/* Logo: Ascending path to summit */}
            <div className="relative w-9 h-9">
              {/* Mountain peak */}
              <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none">
                {/* Base gradient definition */}
                <defs>
                  <linearGradient id="summitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="50%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                {/* Mountain outline */}
                <path
                  d="M 6 28 L 18 8 L 30 28 Z"
                  fill="url(#summitGradient)"
                  className="group-hover:opacity-90 transition-opacity"
                />
                {/* Ascending path/arrow */}
                <path
                  d="M 8 26 Q 14 20, 18 14 Q 22 20, 28 26"
                  stroke="white"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  className="group-hover:stroke-[3] transition-all"
                />
                {/* Success flag at summit */}
                <circle
                  cx="18"
                  cy="8"
                  r="2.5"
                  fill="white"
                  className="group-hover:r-3 transition-all"
                />
              </svg>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tight">
              Sommet
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth('LOGIN')}
              className="hidden sm:block text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors px-4 py-2"
            >
              Se connecter
            </button>
            <button
              onClick={() => openAuth('REGISTER')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:shadow-lg hover:shadow-slate-900/20 hover:scale-[1.02]"
            >
              Commencer
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          {/* Premium badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 text-slate-700 text-sm font-medium mb-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse"></div>
            <span className="tracking-tight">De l'idée à la licorne</span>
          </div>

          {/* Ultra clean headline */}
          <h1 className="text-[4rem] md:text-[5.5rem] font-bold tracking-[-0.04em] mb-8 leading-[0.95] text-slate-900">
            <span className="block">Transformez</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              vos idées
            </span>
            <span className="block">en startups</span>
          </h1>

          {/* Clean subheadline */}
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed font-normal">
            L'IA qui génère, valide et construit votre roadmap complète.<br/>
            <span className="text-slate-500">En quelques minutes.</span>
          </p>

          {/* Clean CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => openAuth('REGISTER')}
              className="group w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-base transition-all shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Commencer gratuitement
              <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={onEnterDemo}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-base border border-slate-200 hover:border-slate-300 transition-all"
            >
              Voir la démo
            </button>
          </div>

          {/* Minimal social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-white"></div>
              </div>
              <span className="text-slate-700 font-medium">+500 fondateurs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconCheck className="w-4 h-4 text-green-600" />
              <span>Gratuit sans CB</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Clean grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 leading-tight">
              Tout pour réussir<br/>
              <span className="text-slate-400">votre lancement</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Une plateforme complète pour passer de zéro au MVP
            </p>
          </div>

          {/* Clean feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Feature 1 - Large */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-50 to-white rounded-2xl p-10 border border-slate-200 hover:border-slate-300 transition-all group hover:shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <IconBulb className="w-6 h-6 text-slate-900" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-slate-900 tracking-tight">Générateur d'idées IA</h3>
                <p className="text-slate-600 text-lg mb-6 max-w-md leading-relaxed">
                  Entrez vos centres d'intérêt. Notre IA analyse les tendances et vous propose des micro-SaaS viables.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700">100% personnalisé</span>
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700">Niches rentables</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 transition-all group hover:shadow-lg">
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <IconChart className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 tracking-tight">Validation</h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Score sur 100 avec analyse SWOT complète
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 transition-all group hover:shadow-lg">
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <IconBlueprint className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 tracking-tight">Blueprint MVP</h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Stack technique et roadmap 4 semaines
              </p>
            </div>

            {/* Feature 4 - Large */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 text-white border border-slate-700 hover:border-slate-600 transition-all group hover:shadow-xl relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <IconConstruction className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">Le Chantier + Sherpa</h3>
                <p className="text-slate-300 text-lg mb-6 max-w-md leading-relaxed">
                  Kanban intelligent + assistant code IA. Bloqué ? Le Sherpa vous donne le code exact.
                </p>
                <div className="bg-slate-950/50 backdrop-blur-sm p-4 rounded-xl border border-white/10 font-mono text-sm text-green-400">
                  <span className="text-slate-500">// Votre CTO personnel</span><br/>
                  <span>supabase.auth.signUp(&#123;...&#125;)</span>
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 transition-all group hover:shadow-lg">
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <IconClock className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 tracking-tight">Daily Brief</h3>
              <p className="text-slate-600 text-base mb-4 leading-relaxed">
                Opportunité business vérifiée chaque matin
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Actif aujourd'hui</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Ultra clean */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-slate-50" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
              Tarifs simples,<br/>
              <span className="text-slate-400">transparents</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Commencez gratuitement. Passez à la vitesse supérieure quand vous êtes prêt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-lg">
              <div className="mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <IconMountain className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Camp de Base</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-bold text-slate-900">0€</span>
                  <span className="text-slate-500 font-medium text-sm">/vie</span>
                </div>
                <p className="text-slate-600 text-sm">
                  Découvrez la puissance de Sommet
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-sm text-slate-700">
                  <IconCheck className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>3 Crédits</strong> génération</span>
                </li>
                <li className="flex items-start text-sm text-slate-700">
                  <IconCheck className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>1 Analyse</strong> simplifiée</span>
                </li>
                <li className="flex items-start text-sm text-slate-400">
                  <IconX className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Blueprint MVP</span>
                </li>
              </ul>

              <button
                onClick={() => openAuth('REGISTER')}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-semibold text-sm transition-all"
              >
                Commencer
              </button>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-500 hover:border-blue-600 transition-all shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                POPULAIRE
              </div>
              <div className="mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <IconDiamond className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">L'Explorateur</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-bold text-blue-600">4,99€</span>
                  <span className="text-slate-500 font-medium text-sm">/pack</span>
                </div>
                <p className="text-slate-600 text-sm">
                  Validez une idée précise
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-sm text-slate-700">
                  <IconCheck className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>20 Crédits</strong> génération</span>
                </li>
                <li className="flex items-start text-sm text-slate-700">
                  <IconCheck className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>1 Analyse</strong> complète</span>
                </li>
                <li className="flex items-start text-sm text-slate-700">
                  <IconCheck className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>1 Blueprint</strong> MVP</span>
                </li>
                <li className="flex items-start text-sm text-slate-700">
                  <IconCheck className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Export PDF</span>
                </li>
              </ul>

              <button
                onClick={() => handleCheckout('explorateur')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                Acheter
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white border border-slate-700 hover:border-slate-600 transition-all hover:shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4 border border-white/20">
                    <IconRocket className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Le Bâtisseur</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-5xl font-bold">12,99€</span>
                    <span className="text-slate-400 font-medium text-sm">/mois</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Pour ceux qui passent à l'action
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start text-sm">
                    <IconCheck className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span><strong>ILLIMITÉ</strong> générations</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <IconCheck className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span><strong>ILLIMITÉ</strong> analyses</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <IconCheck className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Accès <strong>Chantier</strong></span>
                  </li>
                  <li className="flex items-start text-sm">
                    <IconCheck className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span><strong>Sherpa IA</strong></span>
                  </li>
                </ul>

                <button
                  onClick={() => handleCheckout('batisseur')}
                  className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02]"
                >
                  S'abonner
                </button>
                <p className="text-xs text-slate-400 mt-3 text-center">
                  Annulable à tout moment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Minimal */}
      <section id="faq" className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4 text-slate-900">
              Questions
            </h2>
            <p className="text-lg text-slate-600">
              Tout ce qu'il faut savoir
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Qu'est-ce que Sommet ?",
                a: "Une plateforme IA qui vous guide de l'idée au micro-SaaS lancé. Génération, validation, plan technique et exécution guidée."
              },
              {
                q: "Différence avec ChatGPT ?",
                a: "Sommet structure le parcours complet : idées actionnables, analyse marché, plan technique, tâches et code prêt à l'emploi. Workflow guidé de A à Z."
              },
              {
                q: "Sans être développeur ?",
                a: "Oui. Tâches expliquées clairement, code à copier-coller via le Sherpa, étapes contextualisées. Niveau technique bas accepté."
              },
              {
                q: "Temps pour un MVP ?",
                a: "Quelques semaines avec la roadmap générée. Sommet réduit le temps passé à chercher quoi faire et comment."
              },
              {
                q: "Annulation ?",
                a: "Oui, à tout moment. Vous gardez l'accès à vos projets, idées et Blueprints générés."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-slate-50/50 hover:bg-slate-50 rounded-xl transition-colors border border-slate-200/50">
                <summary className="flex items-center justify-between w-full px-6 py-4 cursor-pointer list-none">
                  <span className="font-semibold text-slate-900 text-left pr-4 text-sm">
                    {faq.q}
                  </span>
                  <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-white text-slate-600 group-open:text-slate-900 transition-colors flex-shrink-0 border border-slate-200">
                    <IconPlus className="w-4 h-4 group-open:rotate-45 transition-transform" />
                  </div>
                </summary>
                <div className="px-6 pb-4 text-slate-600 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Minimal gradient */}
      <section className="py-32 px-6 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Prêt à démarrer ?
          </h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Rejoignez les fondateurs qui transforment leurs idées en business.
          </p>
          <button
            onClick={() => openAuth('REGISTER')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-base transition-all shadow-xl hover:scale-[1.02]"
          >
            Commencer gratuitement
            <IconArrowRight className="w-4 h-4" />
          </button>
          <p className="text-slate-500 text-sm mt-6">
            Gratuit • Sans CB • 3 crédits offerts
          </p>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-10 px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              {/* Footer logo - same as navbar */}
              <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none">
                <defs>
                  <linearGradient id="summitGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="50%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <path d="M 6 28 L 18 8 L 30 28 Z" fill="url(#summitGradientFooter)" />
                <path d="M 8 26 Q 14 20, 18 14 Q 22 20, 28 26" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="18" cy="8" r="2.5" fill="white" />
              </svg>
              <span className="font-semibold text-slate-900">Sommet</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <a href="#pricing" className="hover:text-slate-900 transition-colors">Tarifs</a>
              <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
              <span>© 2025 Sommet</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
