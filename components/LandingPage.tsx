import React, { useState, useEffect } from 'react';
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [founderCount, setFounderCount] = useState(0);

  const openAuth = (mode: 'LOGIN' | 'REGISTER') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // Animated counter for social proof
  useEffect(() => {
    const target = 500;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setFounderCount(target);
        clearInterval(timer);
      } else {
        setFounderCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  // Mouse tracking for gradient effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      {/* Advanced grid background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.03),transparent_50%)]"></div>
      </div>

      {/* Dynamic gradient that follows mouse */}
      <div
        className="fixed inset-0 -z-10 opacity-30 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`
        }}
      ></div>

      {/* Animated gradient mesh */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[128px] animate-pulse-slow"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[128px] animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[128px] animate-pulse-slow" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          50% { transform: translateY(-100vh) translateX(20px); }
        }
        @keyframes draw-path {
          to { stroke-dashoffset: 0; }
        }
        @keyframes scale-in {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={onEnterApp}
      />

      {/* Navbar - Ultra minimal with animated logo */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-900/5 shadow-sm shadow-slate-900/5">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer">
            {/* Clean vertical mountain logo */}
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
                <defs>
                  <linearGradient id="mountainGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#1e40af" />
                    <stop offset="30%" stopColor="#3b82f6" />
                    <stop offset="60%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>

                {/* Single vertical mountain peak */}
                <path
                  d="M 24 4 L 42 44 L 6 44 Z"
                  fill="url(#mountainGradient)"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Snow cap at summit */}
                <path
                  d="M 18 16 L 24 4 L 30 16 Z"
                  fill="white"
                  opacity="0.95"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent tracking-tight leading-none">
                Sommet
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Idea to Unicorn
              </span>
            </div>
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
              className="group bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-xl hover:shadow-slate-900/25 hover:scale-105 relative overflow-hidden"
            >
              <span className="relative z-10">Commencer</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium with advanced effects */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Spotlight effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Glassmorphism badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-xl border border-slate-200/60 text-slate-700 text-sm font-medium mb-12 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10 transition-all hover:scale-105">
            <div className="relative flex items-center">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse"></div>
              <div className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
            </div>
            <span className="tracking-tight bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent font-semibold">
              De l'idée à la licorne
            </span>
          </div>

          {/* Hero headline with gradient animation */}
          <h1 className="text-[4.5rem] md:text-[6.5rem] font-black tracking-[-0.05em] mb-8 leading-[0.9]">
            <span className="block text-slate-900 animate-fade-in">Transformez</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-fade-in" style={{animationDelay: '0.1s'}}>
              vos idées
            </span>
            <span className="block text-slate-900 animate-fade-in" style={{animationDelay: '0.2s'}}>en startups</span>
          </h1>

          {/* Subheadline */}
          <p className="text-2xl md:text-3xl text-slate-600 max-w-3xl mx-auto mb-14 leading-relaxed font-normal animate-fade-in" style={{animationDelay: '0.3s'}}>
            L'IA qui génère, valide et construit<br/>votre roadmap complète.{' '}
            <span className="text-slate-400 italic">En quelques minutes.</span>
          </p>

          {/* CTA with advanced effects */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <button
              onClick={() => openAuth('REGISTER')}
              className="group relative w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-slate-900/20 hover:shadow-3xl hover:shadow-slate-900/30 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Démarrer gratuitement
                <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
            </button>
            <button
              onClick={onEnterDemo}
              className="w-full sm:w-auto px-10 py-5 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 hover:text-slate-900 rounded-2xl font-semibold text-lg border-2 border-slate-200 hover:border-slate-300 transition-all shadow-lg hover:shadow-xl"
            >
              Voir la démo
            </button>
          </div>

          {/* Enhanced social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm animate-fade-in" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  'from-blue-400 to-blue-600',
                  'from-purple-400 to-purple-600',
                  'from-cyan-400 to-cyan-600',
                  'from-pink-400 to-pink-600'
                ].map((gradient, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} border-2 border-white shadow-lg`}
                    style={{
                      animation: 'scale-in 0.4s ease-out',
                      animationDelay: `${0.6 + i * 0.1}s`,
                      animationFillMode: 'backwards'
                    }}
                  ></div>
                ))}
              </div>
              <span className="text-slate-700 font-semibold text-base">
                +{founderCount} fondateurs
              </span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200/50">
              <IconCheck className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">Gratuit sans CB</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats section - New */}
      <section className="py-16 px-6 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Fondateurs actifs' },
              { number: '2K+', label: 'Idées générées' },
              { number: '94%', label: 'Score moyen' },
              { number: '3 sem', label: 'Vers le MVP' }
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 hover:border-slate-300 transition-all hover:scale-105 hover:shadow-lg"
                style={{
                  animation: 'fade-in 0.6s ease-out',
                  animationDelay: `${i * 0.1}s`,
                  animationFillMode: 'backwards'
                }}
              >
                <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Enhanced bento grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-7xl font-black tracking-tight mb-8 text-slate-900 leading-tight">
              Tout pour réussir<br/>
              <span className="bg-gradient-to-r from-slate-400 to-slate-600 bg-clip-text text-transparent">votre lancement</span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-2xl mx-auto">
              Une plateforme complète pour passer de zéro au MVP
            </p>
          </div>

          {/* Bento grid with glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Large */}
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-50/80 to-white/80 backdrop-blur-sm rounded-3xl p-12 border border-slate-200/60 hover:border-blue-300/60 transition-all group hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                  <IconBulb className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-4xl font-black mb-6 text-slate-900 tracking-tight">Générateur d'idées IA</h3>
                <p className="text-slate-600 text-xl mb-8 max-w-lg leading-relaxed">
                  Entrez vos centres d'intérêt. Notre IA analyse les tendances et vous propose des micro-SaaS viables et rentables.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-5 py-2.5 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm">100% personnalisé</span>
                  <span className="px-5 py-2.5 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm">Niches rentables</span>
                  <span className="px-5 py-2.5 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm">Basé sur data</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-amber-50/80 to-white/80 backdrop-blur-sm rounded-3xl p-10 border border-slate-200/60 hover:border-amber-300/60 transition-all group hover:shadow-2xl hover:shadow-amber-500/10 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                  <IconChart className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-slate-900 tracking-tight">Validation instantanée</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Score de viabilité sur 100 avec analyse SWOT complète et identification des menaces cachées
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50/80 to-white/80 backdrop-blur-sm rounded-3xl p-10 border border-slate-200/60 hover:border-purple-300/60 transition-all group hover:shadow-2xl hover:shadow-purple-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                  <IconBlueprint className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-slate-900 tracking-tight">Blueprint MVP</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Stack technique personnalisée et roadmap détaillée sur 4 semaines avec métriques de succès
                </p>
              </div>
            </div>

            {/* Feature 4 - Large */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-white border border-slate-700 hover:border-slate-600 transition-all group hover:shadow-2xl hover:shadow-cyan-500/20 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-xl">
                  <IconConstruction className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-4xl font-black mb-6 tracking-tight">Le Chantier + Sherpa IA</h3>
                <p className="text-slate-300 text-xl mb-8 max-w-lg leading-relaxed">
                  Tableau Kanban intelligent qui transforme votre plan en tâches concrètes. Bloqué ? Le Sherpa vous donne le code exact à copier-coller.
                </p>
                <div className="bg-slate-950/60 backdrop-blur-sm p-6 rounded-2xl border border-white/10 font-mono text-sm text-green-400 shadow-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-500 text-xs ml-2">sherpa.ts</span>
                  </div>
                  <span className="text-slate-500">// Votre CTO personnel</span><br/>
                  <span className="text-purple-400">const</span> <span className="text-blue-400">auth</span> = <span className="text-cyan-400">supabase</span>.<span className="text-yellow-400">auth</span><br/>
                  &nbsp;&nbsp;.<span className="text-yellow-400">signUp</span>(&#123;<span className="text-green-400">...</span>&#125;)
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-green-50/80 to-white/80 backdrop-blur-sm rounded-3xl p-10 border border-slate-200/60 hover:border-green-300/60 transition-all group hover:shadow-2xl hover:shadow-green-500/10 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                  <IconClock className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-slate-900 tracking-tight">Daily Brief</h3>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  Opportunité business vérifiée et tendances du marché chaque matin à 6h
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-sm font-semibold text-green-700">Actif aujourd'hui</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Premium glassmorphism */}
      <section className="py-32 px-6 bg-gradient-to-b from-slate-50/50 to-white relative overflow-hidden" id="pricing">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-blue-500/5 to-transparent rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-black tracking-tight mb-8 text-slate-900">
              Tarifs simples,<br/>
              <span className="bg-gradient-to-r from-slate-400 to-slate-600 bg-clip-text text-transparent">transparents</span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-2xl mx-auto">
              Commencez gratuitement. Passez à la vitesse supérieure quand vous êtes prêt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-2xl hover:scale-105">
              <div className="mb-8">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <IconMountain className="w-7 h-7 text-slate-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">Camp de Base</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-6xl font-black text-slate-900">0€</span>
                  <span className="text-slate-500 font-medium">/vie</span>
                </div>
                <p className="text-slate-600 text-base">
                  Découvrez la puissance de Sommet
                </p>
              </div>

              <ul className="space-y-4 mb-10">
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
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-bold text-sm transition-all hover:scale-105"
              >
                Commencer
              </button>
            </div>

            {/* Pro - Featured */}
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-10 border-2 border-blue-500 hover:border-blue-600 transition-all shadow-2xl shadow-blue-500/20 hover:shadow-3xl hover:shadow-blue-500/30 hover:scale-105 relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-black rounded-full shadow-xl">
                ⭐ POPULAIRE
              </div>
              <div className="mb-8 mt-2">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                  <IconDiamond className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">L'Explorateur</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">4,99€</span>
                  <span className="text-slate-500 font-medium">/pack</span>
                </div>
                <p className="text-slate-600 text-base">
                  Validez une idée précise
                </p>
              </div>

              <ul className="space-y-4 mb-10">
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
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold text-sm transition-all shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:scale-105"
              >
                Acheter
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 text-white border border-slate-700 hover:border-slate-600 transition-all hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-xl">
                    <IconRocket className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-black mb-3">Le Bâtisseur</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-6xl font-black text-white">12,99€</span>
                    <span className="text-slate-400 font-medium">/mois</span>
                  </div>
                  <p className="text-slate-300 text-base">
                    Pour ceux qui passent à l'action
                  </p>
                </div>

                <ul className="space-y-4 mb-10">
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
                  className="w-full py-4 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-bold text-sm transition-all hover:scale-105 shadow-xl"
                >
                  S'abonner
                </button>
                <p className="text-xs text-slate-400 mt-4 text-center">
                  Annulable à tout moment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Minimal with glassmorphism */}
      <section id="faq" className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black tracking-tight mb-6 text-slate-900">
              Questions
            </h2>
            <p className="text-xl text-slate-600">
              Tout ce qu'il faut savoir
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Qu'est-ce que Sommet ?",
                a: "Une plateforme IA qui vous guide de l'idée au micro-SaaS lancé. Génération, validation, plan technique et exécution guidée avec le Sherpa."
              },
              {
                q: "Différence avec ChatGPT ?",
                a: "Sommet structure le parcours complet : idées actionnables, analyse marché approfondie, plan technique personnalisé, tâches concrètes et code prêt à l'emploi. Workflow guidé de A à Z, pas besoin de savoir quoi demander."
              },
              {
                q: "Sans être développeur ?",
                a: "Absolument. Tâches expliquées clairement, code à copier-coller via le Sherpa IA, étapes contextualisées avec le 'pourquoi'. Niveau technique bas accepté, vous apprenez en avançant."
              },
              {
                q: "Temps pour un MVP ?",
                a: "La plupart atteignent un MVP testable en 3-4 semaines avec la roadmap générée. Sommet réduit drastiquement le temps passé à chercher quoi faire, dans quel ordre et avec quels outils."
              },
              {
                q: "Annulation ?",
                a: "Oui, à tout moment en un clic. Vous gardez l'accès complet à tous vos projets, idées enregistrées et Blueprints déjà générés."
              }
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white/60 backdrop-blur-sm hover:bg-white rounded-2xl transition-all border border-slate-200/60 hover:border-slate-300 hover:shadow-lg"
              >
                <summary className="flex items-center justify-between w-full px-8 py-6 cursor-pointer list-none">
                  <span className="font-bold text-slate-900 text-left pr-6 text-base">
                    {faq.q}
                  </span>
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 text-slate-600 group-open:bg-blue-100 group-open:text-blue-600 transition-all flex-shrink-0 border border-slate-200 group-open:border-blue-200">
                    <IconPlus className="w-5 h-5 group-open:rotate-45 transition-transform duration-300" />
                  </div>
                </summary>
                <div className="px-8 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-6">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Premium gradient */}
      <section className="py-40 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tight">
            Prêt à démarrer ?
          </h2>
          <p className="text-2xl text-slate-300 mb-14 leading-relaxed max-w-2xl mx-auto">
            Rejoignez les centaines de fondateurs qui transforment leurs idées en business rentables.
          </p>
          <button
            onClick={() => openAuth('REGISTER')}
            className="group inline-flex items-center gap-3 px-12 py-6 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-black text-xl transition-all shadow-2xl hover:shadow-3xl hover:scale-105"
          >
            Commencer gratuitement
            <IconArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-slate-400 text-base mt-8 flex items-center justify-center gap-6">
            <span className="flex items-center gap-2">
              <IconCheck className="w-5 h-5 text-green-400" />
              Gratuit
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <IconCheck className="w-5 h-5 text-green-400" />
              Sans CB
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <IconCheck className="w-5 h-5 text-green-400" />
              3 crédits offerts
            </span>
          </p>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              {/* Clean vertical mountain logo */}
              <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none">
                <defs>
                  <linearGradient id="mountainGradientFooter" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#1e40af" />
                    <stop offset="30%" stopColor="#3b82f6" />
                    <stop offset="60%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>

                {/* Single vertical mountain peak */}
                <path
                  d="M 24 4 L 42 44 L 6 44 Z"
                  fill="url(#mountainGradientFooter)"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Snow cap at summit */}
                <path
                  d="M 18 16 L 24 4 L 30 16 Z"
                  fill="white"
                  opacity="0.95"
                />
              </svg>
              <span className="font-bold text-xl text-slate-900">Sommet</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-600">
              <a href="#pricing" className="hover:text-slate-900 font-medium transition-colors">Tarifs</a>
              <a href="#faq" className="hover:text-slate-900 font-medium transition-colors">FAQ</a>
              <span>© 2025 Sommet</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
