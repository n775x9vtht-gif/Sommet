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
  IconPlus,
  Emoji
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
    const priceId = 'price_1SXR94F1yiAtAmIjmLg0JIkT';
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
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={onEnterApp}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Logo Bildr - Stacked blocks */}
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex flex-col items-center justify-center gap-0.5 p-1">
              <div className="w-5 h-1.5 bg-white rounded-sm"></div>
              <div className="w-4 h-1.5 bg-white/80 rounded-sm"></div>
              <div className="w-3 h-1.5 bg-white/60 rounded-sm"></div>
            </div>
            <span className="font-bold text-xl text-gray-900">Bildr</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Tarifs</a>
            <button
              onClick={() => openAuth('LOGIN')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Se connecter
            </button>
            <button
              onClick={() => openAuth('REGISTER')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Commencer gratuitement
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
            Tu as une idée de SaaS <Emoji>💡</Emoji><br/>
            Aucune compétence en code <Emoji>👨‍💻</Emoji><br />
            Aucune idée par où commencer <Emoji>🤷‍♂️</Emoji>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed">
            Ça te parle ?
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            Bildr te donne tout ce qu'il faut pour passer de l'idée au MVP lancé. Idées validées, roadmap technique et code prêt à l'emploi. Pas besoin de développeur.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <button
              onClick={() => openAuth('REGISTER')}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Commencer à construire gratuitement
              <IconArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onEnterDemo}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-semibold border border-gray-300 transition-colors"
            >
              Voir comment ça marche
            </button>
          </div>

          <p className="text-sm text-gray-500">
            ✓ Gratuit à vie · ✓ Pas de carte bancaire · ✓ 30 secondes pour commencer
          </p>
        </div>
      </section>

      {/* Bénéfices quantifiés */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                <Emoji>⚡</Emoji> 4 semaines
              </div>
              <div className="text-gray-600">De l'idée au MVP lancé (pas 6+ mois)</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                <Emoji>💰</Emoji> 15K€+
              </div>
              <div className="text-gray-600">Économisés vs embaucher un dev</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                <Emoji>🎯</Emoji> 3 étapes
              </div>
              <div className="text-gray-600">Pas 100 tutos YouTube éparpillés</div>
            </div>
          </div>
        </div>
      </section>

      {/* Proposition de valeur principale */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Génère des idées <Emoji>💡</Emoji> valide instantanément <Emoji>✅</Emoji> construis avec du code production <Emoji>🚀</Emoji> et lance en quelques semaines <Emoji>⚡</Emoji>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bildr est la plateforme complète pour les fondateurs non-techniques. Génération d'idées qui trouve les gaps du marché, validation qui fonctionne vraiment, blueprints qui te guident pas à pas, et code prêt à déployer.
          </p>
        </div>
      </section>

      {/* Grille de fonctionnalités (style UserJot) */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              <Emoji>💼</Emoji> Plateforme complète pour SaaS
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tout ce qu'il te faut pour lancer
            </h2>
            <p className="text-lg text-gray-600">
              De la validation d'idée au déploiement en production
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                emoji: "💡",
                color: "bg-yellow-100",
                title: "Génération d'idées",
                description: "Idées de SaaS validées par le marché basées sur tes compétences"
              },
              {
                emoji: "📊",
                color: "bg-blue-100",
                title: "Analyse SWOT",
                description: "Score de viabilité, analyse concurrence, taille du marché"
              },
              {
                emoji: "🎯",
                color: "bg-purple-100",
                title: "Validation intelligente",
                description: "Sache si ça vaut le coup de construire avant de coder"
              },
              {
                emoji: "📋",
                color: "bg-green-100",
                title: "Blueprint technique",
                description: "Stack complet, architecture et plan sur 4 semaines"
              },
              {
                emoji: "⚙️",
                color: "bg-red-100",
                title: "Workflow Kanban",
                description: "Transforme ton plan en tâches hebdomadaires actionnables"
              },
              {
                emoji: "💻",
                color: "bg-indigo-100",
                title: "Code production",
                description: "Snippets copier-coller prêts à l'emploi qui marchent"
              },
              {
                emoji: "🔐",
                color: "bg-cyan-100",
                title: "Auth & paiements",
                description: "Intégration Stripe, gestion utilisateurs, tout"
              },
              {
                emoji: "📦",
                color: "bg-pink-100",
                title: "Guides de déploiement",
                description: "Déploiement pas à pas sur Vercel/Railway"
              }
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4`}>
                  <Emoji>{feature.emoji}</Emoji>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalité 1 : Génération d'idées (mockup amélioré) */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              Étape 1
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Aucune idée de quoi construire ? <Emoji>🤔</Emoji>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Entre tes intérêts et compétences. Reçois des idées de micro-SaaS personnalisées avec une vraie demande sur le marché. Plus besoin de deviner ce qui pourrait marcher.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Idées basées sur ton profil</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Niches validées avec demande réelle</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Analyse de la concurrence incluse</span>
              </li>
            </ul>
          </div>

          {/* Mockup professionnel */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-gray-200 shadow-xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header du mockup */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center text-2xl">
                  <Emoji>💡</Emoji>
                </div>
                <div>
                  <div className="font-bold text-white">Générateur d'idées</div>
                  <div className="text-xs text-indigo-100">Bildr Intelligence</div>
                </div>
              </div>

              {/* Contenu du mockup */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">Idée générée :</div>
                  <div className="text-lg font-bold text-gray-900 mb-4">
                    Outil de feedback par screenshot pour designers
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-3 text-center">
                    <div className="text-xs font-semibold text-green-700 mb-1">Taille marché</div>
                    <div className="text-xl font-bold text-gray-900">2,4M€</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-3 text-center">
                    <div className="text-xs font-semibold text-orange-700 mb-1">Concurrence</div>
                    <div className="text-xl font-bold text-gray-900">Moyenne</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-3 text-center">
                    <div className="text-xs font-semibold text-indigo-700 mb-1">Viabilité</div>
                    <div className="text-xl font-bold text-gray-900">87/100</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-green-800">
                    <Emoji>✨</Emoji> Très bon potentiel
                  </span>
                  <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                    Voir le détail →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalité 2 : Validation (mockup amélioré) */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Mockup professionnel */}
          <div className="order-2 md:order-1 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-gray-200 shadow-xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center text-2xl">
                  <Emoji>📊</Emoji>
                </div>
                <div>
                  <div className="font-bold text-white">Analyse SWOT</div>
                  <div className="text-xs text-blue-100">Validation du marché</div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 space-y-3">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="font-bold text-green-800 mb-2 flex items-center gap-2">
                    <Emoji>✅</Emoji> Forces
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      Concurrence faible dans la niche
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      Modèle de revenus récurrents
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      Facile à intégrer
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4">
                  <div className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                    <Emoji>⚠️</Emoji> Faiblesses
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 font-bold">•</span>
                      Nécessite intégration outils design
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 font-bold">•</span>
                      Effets de réseau limités
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <Emoji>🚀</Emoji> Opportunités
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      Marché du design à distance en croissance
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      Intégrations API possibles
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              Étape 2
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Est-ce que ça vaut vraiment le coup de construire ? <Emoji>🎯</Emoji>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Reçois un score de viabilité sur 100, une analyse SWOT complète et le paysage concurrentiel. Sache si ton idée tient la route avant d'écrire une seule ligne de code.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Score de viabilité avec breakdown détaillé</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Analyse concurrentielle et positionnement</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Estimation de la taille du marché</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Fonctionnalité 3 : Blueprint (mockup amélioré) */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              Étape 3
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quelle stack tech ? Quelles features d'abord ? <Emoji>🛠️</Emoji>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Reçois un blueprint technique complet. Stack recommandée, roadmap sur 4 semaines et diagrammes d'architecture. Tout ce qu'un développeur facturerait 5K€ pour planifier.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Recommandation de stack tech personnalisée</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Roadmap de développement semaine par semaine</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Schéma de base de données et design d'API</span>
              </li>
            </ul>
          </div>

          {/* Mockup professionnel */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-gray-200 shadow-xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center text-2xl">
                  <Emoji>🏗️</Emoji>
                </div>
                <div>
                  <div className="font-bold text-white">Stack recommandée</div>
                  <div className="text-xs text-purple-100">Blueprint technique</div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                    <Emoji>⚛️</Emoji>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900">Frontend</div>
                    <div className="text-xs text-gray-600">React + Tailwind CSS</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">
                    <Emoji>🗄️</Emoji>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900">Backend</div>
                    <div className="text-xs text-gray-600">Supabase (auth + BDD)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
                    <Emoji>💳</Emoji>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900">Paiements</div>
                    <div className="text-xs text-gray-600">Stripe</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-xl">
                    <Emoji>🚀</Emoji>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900">Hébergement</div>
                    <div className="text-xs text-gray-600">Vercel</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Coût mensuel estimé :</span>
                    <span className="text-lg font-bold text-gray-900">25€/mois</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalité 4 : Code (mockup amélioré) */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Mockup professionnel */}
          <div className="order-2 md:order-1">
            <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl border-4 border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-gray-400 text-xs ml-2 font-mono">auth.ts</span>
              </div>
              <div className="font-mono text-sm">
                <div className="text-gray-500 mb-2">// <Emoji>🔐</Emoji> Configuration authentification</div>
                <div className="mt-3">
                  <span className="text-purple-400">const</span>{' '}
                  <span className="text-blue-400">supabase</span> ={' '}
                  <span className="text-yellow-400">createClient</span>(
                </div>
                <div className="ml-4 text-cyan-400">
                  process.env.SUPABASE_URL,
                </div>
                <div className="ml-4 text-cyan-400">
                  process.env.SUPABASE_KEY
                </div>
                <div className="text-green-400">);</div>
                <div className="mt-4 text-gray-500">// <Emoji>✅</Emoji> Prêt à copier-coller</div>
                <div className="mt-3">
                  <span className="text-purple-400">export</span>{' '}
                  <span className="text-purple-400">async</span>{' '}
                  <span className="text-purple-400">function</span>{' '}
                  <span className="text-yellow-400">signIn</span>() {'{'}
                </div>
                <div className="ml-4 text-gray-500">// Logique d'auth...</div>
                <div className="text-green-400">{'}'}</div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              Étape 4
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bloqué ? Reçois le code exact dont tu as besoin <Emoji>💻</Emoji>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Snippets de code prêts pour la production à chaque étape. Authentification, paiements, requêtes BDD—tout prêt à copier-coller. Ton co-fondateur technique, à la demande.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Code qui marche vraiment (testé)</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Expliqué en français simple</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Requêtes de code illimitées</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tableau de comparaison */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Comment Bildr se compare ? <Emoji>🤔</Emoji>
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            On a construit Bildr parce qu'on en avait marre de bricoler des solutions qui ne se parlent pas entre elles.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl shadow-sm overflow-hidden">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 text-gray-900 font-semibold">Fonctionnalité</th>
                  <th className="text-center py-4 px-6 text-gray-900 font-semibold">Bildr</th>
                  <th className="text-center py-4 px-6 text-gray-600">ChatGPT</th>
                  <th className="text-center py-4 px-6 text-gray-600">Embaucher un dev</th>
                  <th className="text-center py-4 px-6 text-gray-600">Outils no-code</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Génération d'idées</td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-indigo-600 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Validation du marché</td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-indigo-600 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Blueprint technique</td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-indigo-600 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><span className="text-gray-400 text-sm">Partiel</span></td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Code production</td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-indigo-600 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><span className="text-gray-400 text-sm">Buggé</span></td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><span className="text-gray-400 text-sm">Limité</span></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Workflow guidé</td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-indigo-600 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 text-gray-900 font-semibold">Coût</td>
                  <td className="text-center py-4 px-6 text-indigo-600 font-semibold">19€/mois</td>
                  <td className="text-center py-4 px-6 text-gray-600">20€/mois</td>
                  <td className="text-center py-4 px-6 text-gray-600">15K€+</td>
                  <td className="text-center py-4 px-6 text-gray-600">30-100€/mois</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Signal de confiance */}
      <section className="py-16 px-6 bg-indigo-50 border-y border-indigo-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-indigo-900 font-medium">
            "Construit par des fondateurs indie <Emoji>👨‍💻</Emoji> pour des fondateurs indie qui ne savent pas coder <Emoji>🚫💻</Emoji> mais qui ont des idées à un million <Emoji>💡</Emoji>"
          </p>
          <p className="text-indigo-700 mt-2">
            On n'est pas financés par des VCs <Emoji>🚫💰</Emoji> On est bootstrappés <Emoji>🛠️</Emoji> On comprend.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tarifs simples et honnêtes <Emoji>💸</Emoji>
            </h2>
            <p className="text-lg text-gray-600">
              Commence gratuitement. Passe à la vitesse supérieure quand tu es prêt à construire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Gratuit */}
            <div className="border-2 border-gray-200 rounded-lg p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-bold text-gray-900">0€</span>
                  <span className="text-gray-600">/à vie</span>
                </div>
                <p className="text-gray-600">
                  Teste Bildr. Génère ta première idée.
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">1 idée complète générée</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Analyse de viabilité</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <IconX className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Blueprint technique</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <IconX className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Code production</span>
                </li>
              </ul>

              <button
                onClick={() => openAuth('REGISTER')}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors"
              >
                Commencer gratuitement
              </button>
            </div>

            {/* Launch */}
            <div className="border-2 border-indigo-600 rounded-lg p-8 bg-white relative shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full">
                Le plus populaire
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Launch</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-bold text-gray-900">19€</span>
                  <span className="text-gray-600">/mois</span>
                </div>
                <p className="text-gray-600">
                  Tout pour lancer ton SaaS
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Idées illimitées générées</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Validations complètes</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Blueprints techniques</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Code prêt pour la production</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Requêtes de code illimitées</span>
                </li>
              </ul>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
              >
                Commencer
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                Annule à tout moment. Sans question.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Questions fréquentes
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "J'ai besoin de savoir coder ?",
                a: "Non. Bildr est fait pour les non-développeurs. On te donne du code prêt à copier-coller, avec des explications en français simple. Si tu sais suivre une recette de cuisine, tu peux utiliser Bildr."
              },
              {
                q: "En quoi c'est différent de ChatGPT ?",
                a: "ChatGPT est génial, mais pas structuré. Il faut savoir quoi demander, quand le demander, et comment assembler le tout. Bildr te guide à travers tout le process : idée → validation → plan → code. C'est le workflow complet, pas juste des réponses éparpillées."
              },
              {
                q: "Je peux vraiment construire un SaaS en 4 semaines ?",
                a: "Oui—si tu suis la roadmap et que tu mets 10-15 heures par semaine. On découpe en jalons hebdomadaires faisables. Semaine 1 : Auth. Semaine 2 : Feature principale. Semaine 3 : Paiements. Semaine 4 : Lancement."
              },
              {
                q: "Et si je suis bloqué ?",
                a: "C'est exactement pour ça qu'il y a le générateur de code. Décris où tu es bloqué, et tu reçois le code exact dont tu as besoin pour avancer. C'est comme avoir un dev senior en speed dial."
              },
              {
                q: "Je peux annuler à tout moment ?",
                a: "Oui. Un clic, pas de questions. Tu gardes l'accès à tout ce que tu as déjà généré."
              },
              {
                q: "Le plan gratuit est vraiment gratuit à vie ?",
                a: "Oui. Pas de carte bancaire demandée. Tu reçois 1 génération d'idée complète et sa validation. Assez pour voir si Bildr te convient."
              }
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <summary className="flex items-center justify-between w-full px-6 py-5 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900 text-left pr-6">
                    {faq.q}
                  </span>
                  <IconPlus className="w-5 h-5 text-gray-400 group-open:rotate-45 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à construire ton SaaS ? <Emoji>🚀</Emoji>
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Rejoins les fondateurs indie qui lancent leurs idées au lieu d'attendre "un jour".
          </p>
          <button
            onClick={() => openAuth('REGISTER')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-indigo-600 rounded-lg font-bold text-lg transition-colors"
          >
            Commencer à construire gratuitement
            <IconArrowRight className="w-5 h-5" />
          </button>
          <p className="text-indigo-200 text-sm mt-6">
            Gratuit à vie · Pas de carte bancaire · 30 secondes pour commencer
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex flex-col items-center justify-center gap-0.5 p-1">
                <div className="w-5 h-1.5 bg-white rounded-sm"></div>
                <div className="w-4 h-1.5 bg-white/80 rounded-sm"></div>
                <div className="w-3 h-1.5 bg-white/60 rounded-sm"></div>
              </div>
              <span className="font-bold text-xl text-gray-900">Bildr</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="#pricing" className="hover:text-gray-900 transition-colors">Tarifs</a>
              <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
              <span>© 2025 Bildr</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
