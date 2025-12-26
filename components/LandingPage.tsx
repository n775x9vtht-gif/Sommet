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
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden antialiased">
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={onEnterApp}
      />

      {/* Navbar - Modern & Clean */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 rotate-3 hover:rotate-0 transition-transform">
              <IconMountain className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
              Sommet
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth('LOGIN')}
              className="hidden sm:block text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors"
            >
              Connexion
            </button>
            <button
              onClick={() => openAuth('REGISTER')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:shadow-lg hover:shadow-slate-900/25 hover:scale-105"
            >
              Commencer gratuitement
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Bold & Minimal */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-50 via-white to-transparent rounded-full blur-3xl opacity-60 -z-10"></div>

        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 text-amber-900 text-sm font-bold mb-8 shadow-sm">
            <IconTrophy className="w-4 h-4 text-amber-600" />
            <span>De l'idée à la Licorne</span>
          </div>

          {/* Main headline */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.95]">
            <span className="block text-slate-900">Transformez</span>
            <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              votre idée
            </span>
            <span className="block text-slate-900">en business</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            L'IA qui génère vos idées, valide leur potentiel et construit votre roadmap complète en quelques minutes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => openAuth('REGISTER')}
              className="group w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 flex items-center justify-center gap-3"
            >
              Démarrer gratuitement
              <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onEnterDemo}
              className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-slate-50 text-slate-700 rounded-full font-semibold text-lg border-2 border-slate-200 hover:border-slate-300 transition-all"
            >
              Voir la démo
            </button>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white"></div>
              </div>
              <span className="font-semibold text-slate-700">+500 fondateurs</span>
            </div>
            <div className="flex items-center gap-2">
              <IconCheck className="w-5 h-5 text-green-600" />
              <span>Aucune carte bancaire requise</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid - Modern Layout */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6 text-slate-900">
              Tout ce qu'il faut pour <br/>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">réussir votre lancement</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              De l'idéation à l'exécution, une plateforme complète pour les fondateurs ambitieux.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Large */}
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-10 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <IconBulb className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black mb-4">Générateur d'idées IA</h3>
                <p className="text-blue-100 text-lg mb-6 max-w-md">
                  Entrez vos domaines d'intérêt et laissez notre IA analyser les tendances pour vous proposer des micro-SaaS réalisables et rentables.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">100% personnalisé</span>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">Niches rentables</span>
                </div>
              </div>
            </div>

            {/* Feature 2 - Small */}
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-8 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <IconChart className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-3">Validation instantanée</h3>
              <p className="text-orange-50 text-base">
                Score de viabilité sur 100 avec analyse SWOT complète
              </p>
            </div>

            {/* Feature 3 - Small */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <IconBlueprint className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-3">Blueprint MVP</h3>
              <p className="text-purple-50 text-base">
                Stack technique et roadmap sur 4 semaines
              </p>
            </div>

            {/* Feature 4 - Large */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-10 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl">
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <IconConstruction className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-3xl font-black mb-4">Le Chantier + Sherpa IA</h3>
                <p className="text-slate-300 text-lg mb-6 max-w-md">
                  Tableau Kanban intelligent qui transforme votre plan en tâches concrètes. Bloqué ? Le Sherpa vous donne le code exact à copier-coller.
                </p>
                <div className="bg-slate-950/50 backdrop-blur-sm p-4 rounded-xl border border-white/10 font-mono text-sm text-green-400">
                  <span className="text-slate-500">// Votre assistant technique personnel</span><br/>
                  <span>supabase.auth.signUp(&#123;...&#125;)</span>
                </div>
              </div>
            </div>

            {/* Feature 5 - Daily News */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <IconClock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-3">Daily Brief</h3>
              <p className="text-green-50 text-base mb-4">
                Opportunité business vérifiée chaque matin à 6h
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Actif aujourd'hui</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Step by step */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6 text-slate-900">
              De l'idée au lancement<br/>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">en 4 étapes simples</span>
            </h2>
          </div>

          <div className="space-y-20">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 border border-slate-200 shadow-lg">
                  <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        <span className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold">SaaS</span>
                        <span className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold">IA</span>
                      </div>
                      <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-green-100 text-green-700">Faible concurrence</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">NoteForce AI</h3>
                    <p className="text-amber-600 text-sm mb-4 italic font-semibold">
                      "Transformez vos meetings en actions automatiques"
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Un outil qui enregistre vos réunions, génère des résumés et crée automatiquement des tâches dans votre gestionnaire de projet.
                    </p>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-4">
                  Étape 1
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-6">
                  Générez des idées<br/>
                  <span className="text-blue-600">sur mesure</span>
                </h3>
                <p className="text-xl text-slate-600 leading-relaxed mb-6">
                  Indiquez vos domaines d'intérêt et compétences. L'IA analyse les tendances du marché et vous propose 5 idées de micro-SaaS réalisables.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-700 font-medium">
                    <IconCheck className="w-5 h-5 text-blue-600 mr-3" />
                    Adapté à votre profil
                  </li>
                  <li className="flex items-center text-slate-700 font-medium">
                    <IconCheck className="w-5 h-5 text-blue-600 mr-3" />
                    Marchés peu saturés
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold mb-4">
                  Étape 2
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-6">
                  Validez le potentiel<br/>
                  <span className="text-amber-600">avant de coder</span>
                </h3>
                <p className="text-xl text-slate-600 leading-relaxed mb-6">
                  Obtenez un score de viabilité sur 100, une analyse SWOT complète et identifiez les concurrents cachés. Ne lancez que ce qui peut gagner.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-700 font-medium">
                    <IconCheck className="w-5 h-5 text-amber-600 mr-3" />
                    Score objectif et détaillé
                  </li>
                  <li className="flex items-center text-slate-700 font-medium">
                    <IconCheck className="w-5 h-5 text-amber-600 mr-3" />
                    Analyse des menaces réelles
                  </li>
                </ul>
              </div>
              <div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200 shadow-lg">
                  <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        />
                        <path
                          className="text-green-500"
                          strokeDasharray="87, 100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-black text-slate-900">87</span>
                      </div>
                    </div>
                    <div className="inline-block px-4 py-2 bg-green-100 text-green-700 text-sm font-bold rounded-full mb-6">
                      Potentiel Élevé
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="text-xs text-slate-500 font-bold mb-1">FORCES</div>
                        <div className="text-sm text-slate-900 font-bold">Marché en croissance</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="text-xs text-slate-500 font-bold mb-1">CONCURRENCE</div>
                        <div className="text-sm text-slate-900 font-bold">Faible</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-200 shadow-lg">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <IconList className="w-5 h-5 text-purple-600" />
                      </div>
                      Roadmap MVP
                    </h3>
                    <div className="space-y-6 relative border-l-2 border-purple-200 ml-5 py-2">
                      <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-purple-600 border-2 border-white shadow-lg"></div>
                        <span className="inline-block text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full mb-2">
                          SEMAINE 1
                        </span>
                        <p className="text-slate-900 font-bold text-lg mb-1">Fondations & Design</p>
                        <p className="text-sm text-slate-600">Landing page, maquettes Figma, setup Next.js</p>
                      </div>
                      <div className="relative pl-8 opacity-50">
                        <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                        <span className="inline-block text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full mb-2">
                          SEMAINE 2
                        </span>
                        <p className="text-slate-700 font-bold text-lg mb-1">Core Features</p>
                        <p className="text-sm text-slate-500">Base de données, auth, feature principale</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-4">
                  Étape 3
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-6">
                  Obtenez votre plan<br/>
                  <span className="text-purple-600">d'attaque complet</span>
                </h3>
                <p className="text-xl text-slate-600 leading-relaxed mb-6">
                  Stack technique recommandée, roadmap détaillée sur 4 semaines et métriques de succès. Tout pour passer à l'action immédiatement.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-700 font-medium">
                    <IconCheck className="w-5 h-5 text-purple-600 mr-3" />
                    Outils adaptés à votre niveau
                  </li>
                  <li className="flex items-center text-slate-700 font-medium">
                    <IconCheck className="w-5 h-5 text-purple-600 mr-3" />
                    Timeline réaliste et actionnable
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold mb-4">
                  Étape 4
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-6">
                  Construisez avec<br/>
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">un CTO dans la poche</span>
                </h3>
                <p className="text-xl text-slate-600 leading-relaxed mb-6">
                  Le Chantier transforme votre plan en tâches Kanban. Bloqué sur une étape ? Le Sherpa IA vous donne le code exact à copier-coller.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-700 font-medium">
                    <IconCheck className="w-5 h-5 text-amber-600 mr-3" />
                    Kanban automatique et intelligent
                  </li>
                  <li className="flex items-center text-slate-700 font-medium">
                    <IconCheck className="w-5 h-5 text-amber-600 mr-3" />
                    Assistant code intégré
                  </li>
                </ul>
              </div>
              <div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 border border-slate-200 shadow-lg">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <IconSherpa className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="font-bold text-slate-900">Le Sherpa</span>
                      <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">En ligne</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl font-mono text-sm text-green-400 mb-4">
                      <span className="text-slate-500">// Setup Supabase Auth</span><br/>
                      supabase.auth.signUp(&#123;<br/>
                      &nbsp;&nbsp;email: 'user@app.com',<br/>
                      &nbsp;&nbsp;password: 'secure123'<br/>
                      &#125;)
                    </div>
                    <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                      <IconCodeBlockCopy className="w-4 h-4" />
                      Copier le code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Modern & Clear */}
      <section className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6 text-slate-900">
              Commencez gratuitement,<br/>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                passez à la vitesse supérieure
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choisissez le plan adapté à votre ambition. Changez à tout moment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-slate-300 transition-all">
              <div className="mb-6">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <IconMountain className="w-7 h-7 text-slate-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Camp de Base</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black text-slate-900">0€</span>
                  <span className="text-slate-500 font-semibold">/vie</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Pour découvrir la puissance de Sommet sans engagement.
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-sm">
                  <IconCheck className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700"><strong>3 Crédits</strong> de génération</span>
                </li>
                <li className="flex items-start text-sm">
                  <IconCheck className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700"><strong>1 Analyse</strong> simplifiée</span>
                </li>
                <li className="flex items-start text-sm opacity-40">
                  <IconX className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Blueprint MVP</span>
                </li>
                <li className="flex items-start text-sm opacity-40">
                  <IconX className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Accès au Chantier</span>
                </li>
              </ul>

              <button
                onClick={() => openAuth('REGISTER')}
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full font-bold transition-all"
              >
                Commencer gratuitement
              </button>
            </div>

            {/* Explorateur Plan */}
            <div className="bg-white rounded-3xl p-8 border-2 border-blue-500 shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                POPULAIRE
              </div>
              <div className="mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <IconDiamond className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">L'Explorateur</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black text-blue-600">4,99€</span>
                  <span className="text-slate-500 font-semibold">/pack</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Validez une idée précise avec un plan d'action exploitable.
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-sm">
                  <IconCheck className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700"><strong>20 Crédits</strong> de génération</span>
                </li>
                <li className="flex items-start text-sm">
                  <IconCheck className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700"><strong>1 Analyse</strong> complète</span>
                </li>
                <li className="flex items-start text-sm">
                  <IconCheck className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700"><strong>1 Blueprint</strong> MVP détaillé</span>
                </li>
                <li className="flex items-start text-sm">
                  <IconCheck className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Export PDF complet</span>
                </li>
                <li className="flex items-start text-sm opacity-40">
                  <IconX className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Accès au Chantier</span>
                </li>
              </ul>

              <button
                onClick={() => handleCheckout('explorateur')}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105"
              >
                Acheter le pack
              </button>
            </div>

            {/* Bâtisseur Plan */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-4">
                    <IconRocket className="w-7 h-7 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-black mb-2">Le Bâtisseur</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-black text-amber-400">12,99€</span>
                    <span className="text-slate-400 font-semibold">/mois</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Pour ceux qui passent à l'action et veulent tout gérer au même endroit.
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start text-sm">
                    <IconCheck className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Générations <strong>ILLIMITÉES</strong></span>
                  </li>
                  <li className="flex items-start text-sm">
                    <IconCheck className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Analyses <strong>ILLIMITÉES</strong></span>
                  </li>
                  <li className="flex items-start text-sm">
                    <IconCheck className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span><strong>Accès complet</strong> au Chantier</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <IconCheck className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span><strong>Assistant Sherpa</strong> IA</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <IconCheck className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Support prioritaire 24/7</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleCheckout('batisseur')}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-full font-bold transition-all shadow-lg hover:scale-105"
                >
                  S'abonner maintenant
                </button>
                <p className="text-xs text-slate-400 mt-3 text-center">
                  Annulable à tout moment en un clic
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Clean */}
      <section id="faq" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black tracking-tight mb-6 text-slate-900">
              Questions fréquentes
            </h2>
            <p className="text-xl text-slate-600">
              Tout ce qu'il faut savoir avant de démarrer
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Sommet, c'est quoi exactement ?",
                a: "Sommet est une plateforme IA pensée pour les fondateurs qui veulent passer de l'idée au micro-SaaS lancé. Le Générateur trouve des concepts alignés à vos compétences, le Valideur évalue le potentiel marché, le Blueprint prépare votre plan d'attaque et le Chantier vous aide à exécuter, étape par étape."
              },
              {
                q: "En quoi Sommet est différent d'un simple ChatGPT ?",
                a: "Sommet ne se contente pas de 'répondre à des prompts'. La plateforme est structurée autour d'un parcours fondateur complet : génération d'idées actionnables, analyse de marché, plan technique, tâches à exécuter et snippets de code prêts à l'emploi. Vous n'avez pas à deviner quoi demander à l'IA : le workflow est guidé de A à Z."
              },
              {
                q: "Est-ce adapté si je ne suis pas développeur ?",
                a: "Oui. Sommet est conçu pour les fondateurs non-tech : les tâches sont expliquées clairement, le Sherpa vous propose du code à copier-coller, et chaque étape est contextualisée. Vous pouvez démarrer avec un niveau technique très bas et apprendre en avançant."
              },
              {
                q: "Combien de temps pour passer d'une idée à un MVP ?",
                a: "La plupart des projets peuvent atteindre un MVP testable en quelques semaines si vous suivez la roadmap générée. Sommet ne fait pas tout à votre place, mais il réduit drastiquement le temps passé à chercher quoi faire, dans quel ordre et avec quels outils."
              },
              {
                q: "Puis-je annuler mon abonnement à tout moment ?",
                a: "Oui. Le plan Bâtisseur est sans engagement : vous pouvez arrêter à tout moment depuis votre espace. Vous gardez l'accès à vos projets, idées enregistrées et Blueprints déjà générés."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                <summary className="flex items-center justify-between w-full px-6 py-5 cursor-pointer list-none">
                  <span className="text-base font-bold text-slate-900 text-left pr-4">
                    {faq.q}
                  </span>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-slate-600 group-open:text-blue-600 transition-colors flex-shrink-0">
                    <IconPlus className="w-5 h-5 group-open:rotate-45 transition-transform" />
                  </div>
                </summary>
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Prêt à gravir le sommet ?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Rejoignez les centaines de fondateurs qui transforment leurs idées en business rentables.
          </p>
          <button
            onClick={() => openAuth('REGISTER')}
            className="inline-flex items-center gap-3 px-12 py-6 bg-white hover:bg-slate-50 text-blue-700 rounded-full font-black text-xl transition-all shadow-2xl hover:scale-105 hover:shadow-white/20"
          >
            Démarrer gratuitement
            <IconArrowRight className="w-6 h-6" />
          </button>
          <p className="text-blue-200 text-sm mt-6">
            ✓ Aucune carte bancaire requise &nbsp;&nbsp;•&nbsp;&nbsp; ✓ 3 crédits offerts
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <IconMountain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">Sommet</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <a href="#pricing" className="hover:text-slate-900 font-medium transition-colors">Tarifs</a>
              <a href="#faq" className="hover:text-slate-900 font-medium transition-colors">FAQ</a>
              <span>© 2025 Sommet - Tous droits réservés</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
