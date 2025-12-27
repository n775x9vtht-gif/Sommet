import React, { useState } from 'react';
import {
  IconRocket,
  IconCheck,
  IconArrowRight,
  IconChart,
  IconBulb,
  IconConstruction,
  IconBlueprint,
  IconX,
  IconPlus
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

  const handleCheckout = async () => {
    const priceId = 'price_1SXR94F1yiAtAmIjmLg0JIkT'; // Launch plan
    const mode: 'subscription' = 'subscription';

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
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D2A26] font-sans overflow-x-hidden antialiased">
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={onEnterApp}
      />

      {/* Navbar - Minimal warm */}
      <nav className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-[#E8E3DD]">
        <div className="max-w-6xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer">
            {/* Bildr Logo - Simple B */}
            <div className="w-10 h-10 bg-[#8B3A62] rounded-lg flex items-center justify-center">
              <span className="text-[#FAF8F5] font-black text-xl font-serif">B</span>
            </div>
            <span className="font-black text-2xl text-[#2D2A26] tracking-tight">Bildr</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth('LOGIN')}
              className="hidden sm:block text-[#6B6560] hover:text-[#2D2A26] font-medium text-sm transition-colors px-4 py-2"
            >
              Se connecter
            </button>
            <button
              onClick={() => openAuth('REGISTER')}
              className="bg-[#8B3A62] hover:bg-[#6F2D4E] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg"
            >
              Commencer
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Clean & Warm */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E8E3DD] text-[#6B6560] text-sm font-medium mb-10">
            <div className="w-2 h-2 rounded-full bg-[#8B3A62]"></div>
            <span>Lancez votre SaaS sans coder</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1] font-serif">
            <span className="block text-[#2D2A26]">Build your SaaS.</span>
            <span className="block text-[#8B3A62]">Ship in days.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-[#6B6560] max-w-2xl mx-auto mb-12 leading-relaxed">
            De l'idée au code production-ready. Validation marché, architecture technique, et roadmap complète.
            <span className="block mt-2 text-[#9B968F] italic">Même si vous ne savez pas coder.</span>
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => openAuth('REGISTER')}
              className="w-full sm:w-auto px-8 py-4 bg-[#8B3A62] hover:bg-[#6F2D4E] text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Commencer gratuitement
              <IconArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onEnterDemo}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#F5F1EB] text-[#2D2A26] rounded-xl font-semibold text-lg border-2 border-[#E8E3DD] hover:border-[#D4CFC7] transition-all"
            >
              Voir la démo
            </button>
          </div>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-[#6B6560]">
            <IconCheck className="w-5 h-5 text-[#8B3A62]" />
            <span>Gratuit, sans carte bancaire</span>
          </div>
        </div>
      </section>

      {/* How it works - Simple 4 steps */}
      <section className="py-20 px-6 bg-white border-y border-[#E8E3DD]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-[#2D2A26] font-serif">
              Comment ça marche
            </h2>
            <p className="text-lg text-[#6B6560] max-w-2xl mx-auto">
              4 étapes simples pour passer de l'idée au SaaS lancé
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                number: "1",
                title: "Générez des idées",
                description: "Entrez vos centres d'intérêt. Obtenez des idées de micro-SaaS rentables et actionnables.",
                icon: IconBulb
              },
              {
                number: "2",
                title: "Validez votre marché",
                description: "Score de viabilité, analyse SWOT, concurrence identifiée. Sachez si ça vaut le coup avant de coder.",
                icon: IconChart
              },
              {
                number: "3",
                title: "Obtenez le plan complet",
                description: "Stack technique personnalisée, roadmap 4 semaines, architecture détaillée. Le blueprint de votre MVP.",
                icon: IconBlueprint
              },
              {
                number: "4",
                title: "Construisez étape par étape",
                description: "Tâches Kanban concrètes. Code production-ready à copier-coller. Votre co-fondateur technique personnel.",
                icon: IconConstruction
              }
            ].map((step, i) => (
              <div key={i} className="relative p-8 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DD] hover:border-[#8B3A62] transition-all group">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#8B3A62] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl font-serif">{step.number}</span>
                </div>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 ml-8 border border-[#E8E3DD]">
                  <step.icon className="w-6 h-6 text-[#8B3A62]" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-[#2D2A26] font-serif">{step.title}</h3>
                <p className="text-[#6B6560] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Clean grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-[#2D2A26] font-serif">
              Tout ce qu'il faut<br/>pour réussir
            </h2>
            <p className="text-xl text-[#6B6560] max-w-2xl mx-auto">
              Une plateforme complète pour aller de zéro au MVP
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Générateur d'idées",
                description: "Entrez vos passions. Recevez des niches SaaS validées et rentables.",
                icon: IconBulb
              },
              {
                title: "Validation instantanée",
                description: "Score sur 100, analyse SWOT, opportunités et menaces identifiées.",
                icon: IconChart
              },
              {
                title: "Blueprint technique",
                description: "Stack recommandée, roadmap détaillée, métriques de succès.",
                icon: IconBlueprint
              },
              {
                title: "Le Chantier",
                description: "Tableau Kanban qui transforme le plan en tâches concrètes à cocher.",
                icon: IconConstruction
              },
              {
                title: "Code production-ready",
                description: "Snippets à copier-coller. Pas de devinette, juste du code qui marche.",
                icon: IconRocket
              },
              {
                title: "Votre co-fondateur technique",
                description: "Bloqué ? Obtenez le code exact dont vous avez besoin, expliqué clairement.",
                icon: IconRocket
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-[#E8E3DD] hover:border-[#8B3A62] transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-[#FAF8F5] rounded-xl flex items-center justify-center mb-6 border border-[#E8E3DD]">
                  <feature.icon className="w-6 h-6 text-[#8B3A62]" />
                </div>
                <h3 className="text-xl font-black mb-3 text-[#2D2A26] font-serif">{feature.title}</h3>
                <p className="text-[#6B6560] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Simple 2 tiers */}
      <section className="py-24 px-6 bg-white border-y border-[#E8E3DD]" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-[#2D2A26] font-serif">
              Tarifs simples
            </h2>
            <p className="text-xl text-[#6B6560]">
              Commencez gratuitement. Payez quand vous êtes prêt à lancer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <div className="p-10 rounded-2xl bg-[#FAF8F5] border-2 border-[#E8E3DD] hover:border-[#D4CFC7] transition-all">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-[#2D2A26] mb-3 font-serif">Starter</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-6xl font-black text-[#2D2A26] font-serif">0€</span>
                  <span className="text-[#6B6560] font-medium">/vie</span>
                </div>
                <p className="text-[#6B6560]">
                  Découvrez Bildr et générez votre première idée
                </p>
              </div>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start text-sm text-[#2D2A26]">
                  <IconCheck className="w-5 h-5 text-[#8B3A62] mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>1 idée complète</strong> générée</span>
                </li>
                <li className="flex items-start text-sm text-[#2D2A26]">
                  <IconCheck className="w-5 h-5 text-[#8B3A62] mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>1 analyse</strong> de viabilité</span>
                </li>
                <li className="flex items-start text-sm text-[#9B968F]">
                  <IconX className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Blueprint MVP</span>
                </li>
                <li className="flex items-start text-sm text-[#9B968F]">
                  <IconX className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Code production-ready</span>
                </li>
              </ul>

              <button
                onClick={() => openAuth('REGISTER')}
                className="w-full py-4 bg-white hover:bg-[#F5F1EB] text-[#2D2A26] rounded-xl font-bold text-sm transition-all border-2 border-[#E8E3DD] hover:border-[#D4CFC7]"
              >
                Commencer
              </button>
            </div>

            {/* Launch - Featured */}
            <div className="p-10 rounded-2xl bg-[#8B3A62] text-white border-2 border-[#8B3A62] hover:shadow-2xl transition-all relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#2D2A26] text-white text-sm font-black rounded-full">
                ⭐ RECOMMANDÉ
              </div>
              <div className="mb-8 mt-2">
                <h3 className="text-2xl font-black mb-3 font-serif">Launch</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-6xl font-black font-serif">19€</span>
                  <span className="text-white/80 font-medium">/mois</span>
                </div>
                <p className="text-white/90">
                  Tout ce qu'il faut pour lancer votre SaaS
                </p>
              </div>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start text-sm">
                  <IconCheck className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>Idées illimitées</strong> générées</span>
                </li>
                <li className="flex items-start text-sm">
                  <IconCheck className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>Analyses complètes</strong> SWOT + score</span>
                </li>
                <li className="flex items-start text-sm">
                  <IconCheck className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>Blueprint MVP</strong> complet</span>
                </li>
                <li className="flex items-start text-sm">
                  <IconCheck className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>Le Chantier</strong> (Kanban guidé)</span>
                </li>
                <li className="flex items-start text-sm">
                  <IconCheck className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>Code production-ready</strong> illimité</span>
                </li>
                <li className="flex items-start text-sm">
                  <IconCheck className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span><strong>Votre co-fondateur technique</strong></span>
                </li>
              </ul>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-white hover:bg-[#FAF8F5] text-[#8B3A62] rounded-xl font-bold text-sm transition-all shadow-lg"
              >
                S'abonner
              </button>
              <p className="text-xs text-white/70 mt-4 text-center">
                Annulable à tout moment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight mb-4 text-[#2D2A26] font-serif">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Qu'est-ce que Bildr ?",
                a: "Une plateforme qui vous guide de l'idée au micro-SaaS lancé. Génération d'idées, validation marché, plan technique et code production-ready. Tout le parcours de A à Z."
              },
              {
                q: "Je ne sais pas coder, c'est pour moi ?",
                a: "Absolument. Bildr est conçu pour les non-développeurs. Chaque étape est expliquée clairement, le code est prêt à copier-coller, et vous avez un guide technique qui vous débloque quand vous êtes coincé."
              },
              {
                q: "Différence avec ChatGPT ?",
                a: "Bildr structure tout le parcours : idées validées, analyse marché approfondie, plan technique personnalisé, tâches concrètes et code prêt à l'emploi. Workflow guidé de bout en bout, pas besoin de savoir quoi demander."
              },
              {
                q: "Combien de temps pour un MVP ?",
                a: "La plupart des fondateurs atteignent un MVP testable en 3-4 semaines avec la roadmap générée. Bildr réduit drastiquement le temps passé à chercher quoi faire, dans quel ordre et avec quels outils."
              },
              {
                q: "Je peux annuler quand je veux ?",
                a: "Oui, annulation en un clic à tout moment. Vous gardez l'accès complet à tous vos projets, idées enregistrées et Blueprints déjà générés."
              }
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl transition-all border border-[#E8E3DD] hover:border-[#8B3A62]"
              >
                <summary className="flex items-center justify-between w-full px-8 py-6 cursor-pointer list-none">
                  <span className="font-bold text-[#2D2A26] text-left pr-6">
                    {faq.q}
                  </span>
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FAF8F5] text-[#6B6560] group-open:bg-[#8B3A62] group-open:text-white transition-all flex-shrink-0 border border-[#E8E3DD]">
                    <IconPlus className="w-5 h-5 group-open:rotate-45 transition-transform duration-300" />
                  </div>
                </summary>
                <div className="px-8 pb-6 text-[#6B6560] leading-relaxed border-t border-[#E8E3DD] pt-6">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-[#2D2A26] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight font-serif">
            Prêt à lancer ?
          </h2>
          <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto">
            Rejoignez les fondateurs qui transforment leurs idées en SaaS rentables.
          </p>
          <button
            onClick={() => openAuth('REGISTER')}
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#8B3A62] hover:bg-[#6F2D4E] text-white rounded-xl font-black text-xl transition-all shadow-xl hover:shadow-2xl"
          >
            Commencer gratuitement
            <IconArrowRight className="w-6 h-6" />
          </button>
          <p className="text-white/60 text-sm mt-8 flex items-center justify-center gap-6">
            <span className="flex items-center gap-2">
              <IconCheck className="w-5 h-5" />
              Gratuit
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <IconCheck className="w-5 h-5" />
              Sans CB
            </span>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#FAF8F5] border-t border-[#E8E3DD]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#8B3A62] rounded-lg flex items-center justify-center">
                <span className="text-[#FAF8F5] font-black text-xl font-serif">B</span>
              </div>
              <span className="font-black text-xl text-[#2D2A26]">Bildr</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-[#6B6560]">
              <a href="#pricing" className="hover:text-[#2D2A26] font-medium transition-colors">Tarifs</a>
              <a href="#faq" className="hover:text-[#2D2A26] font-medium transition-colors">FAQ</a>
              <span>© 2025 Bildr</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
