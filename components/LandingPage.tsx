import React, { useState } from 'react';
import {
  IconCheck,
  IconArrowRight,
  IconX,
  IconPlus,
  IconIdea,
  IconRocketFlat,
  IconTarget,
  IconAnalytics,
  IconTerminal,
  IconCheckCircle,
  IconWarning,
  IconLightning,
  IconMoney,
  IconWrench,
  IconShield,
  IconPackage,
  IconQuestion,
  IconBuilding,
  IconKanban,
  IconSparkle,
  IconCross,
  IconPerson
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
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Logo Bildr */}
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex flex-col items-center justify-center gap-0.5 p-1">
              <div className="w-5 h-1.5 bg-white rounded-sm"></div>
              <div className="w-4 h-1.5 bg-white/80 rounded-sm"></div>
              <div className="w-3 h-1.5 bg-white/60 rounded-sm"></div>
            </div>
            <span className="font-bold text-xl text-gray-900">Bildr</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#tarifs" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Tarifs</a>
            <button
              onClick={() => openAuth('LOGIN')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Connexion
            </button>
            <button
              onClick={() => openAuth('REGISTER')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Essayer gratuitement
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
            Tu as une idée de SaaS,<br/>
            mais zéro compétence technique ?
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed">
            Bildr transforme ton idée en produit lancé. Sans coder.
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            De la validation de l'idée au déploiement en ligne. Feuille de route technique, architecture, et extraits de code prêts à l'emploi. Le tout en français, étape par étape.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <button
              onClick={() => openAuth('REGISTER')}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Commencer gratuitement
              <IconArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onEnterDemo}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-semibold border border-gray-300 transition-colors"
            >
              Voir la démo
            </button>
          </div>

          <p className="text-sm text-gray-500">
            ✓ Gratuit à vie · ✓ Sans carte bancaire · ✓ 30 secondes pour démarrer
          </p>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <IconLightning className="w-10 h-10" /> 4 semaines
              </div>
              <div className="text-gray-600">De l'idée au produit en ligne (au lieu de 6+ mois)</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <IconMoney className="w-10 h-10" /> 15 000€+
              </div>
              <div className="text-gray-600">Économisés par rapport à un développeur</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <IconTarget className="w-10 h-10" /> 3 étapes
              </div>
              <div className="text-gray-600">Au lieu de 100 tutoriels YouTube</div>
            </div>
          </div>
        </div>
      </section>

      {/* Proposition de valeur */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Génère des idées, valide-les, construis et lance — le tout guidé étape par étape
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bildr est la plateforme complète pour les fondateurs sans compétences techniques. Génération d'idées qui identifie les opportunités de marché, validation qui fonctionne, plans d'action détaillés, et extraits de code prêts à déployer.
          </p>
        </div>
      </section>

      {/* Grille de fonctionnalités */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4 flex items-center gap-2">
              <IconBuilding className="w-4 h-4" /> Plateforme tout-en-un
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tout ce qu'il faut pour lancer ton produit
            </h2>
            <p className="text-lg text-gray-600">
              De la validation d'idée jusqu'au déploiement en ligne
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <IconIdea className="w-8 h-8" />,
                title: "Génération d'idées",
                description: "Idées de produits adaptées à tes compétences et validées par le marché"
              },
              {
                icon: <IconAnalytics className="w-8 h-8" />,
                title: "Analyse de viabilité",
                description: "Note sur 100, concurrence, taille du marché estimée"
              },
              {
                icon: <IconTarget className="w-8 h-8" />,
                title: "Validation intelligente",
                description: "Sache si ça vaut le coup avant d'investir du temps"
              },
              {
                icon: <IconWrench className="w-8 h-8" />,
                title: "Plan technique",
                description: "Technologies recommandées, architecture et plan sur 4 semaines"
              },
              {
                icon: <IconKanban className="w-8 h-8" />,
                title: "Organisation visuelle",
                description: "Ton plan transformé en tâches hebdomadaires concrètes"
              },
              {
                icon: <IconTerminal className="w-8 h-8" />,
                title: "Extraits de code",
                description: "Code prêt à copier-coller qui fonctionne vraiment"
              },
              {
                icon: <IconShield className="w-8 h-8" />,
                title: "Authentification & paiements",
                description: "Intégration Stripe, gestion utilisateurs, sécurité"
              },
              {
                icon: <IconPackage className="w-8 h-8" />,
                title: "Guides de mise en ligne",
                description: "Déploiement pas à pas sur Vercel ou Railway"
              }
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalité 1 : Génération d'idées (mockup ultra-réaliste) */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              Étape 1
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tu ne sais pas quoi construire ?
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Indique tes centres d'intérêt et compétences. Reçois des idées de micro-SaaS personnalisées, avec une demande réelle identifiée sur le marché. Fini les suppositions.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Idées adaptées à ton profil et expérience</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Créneaux validés avec demande documentée</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Analyse des concurrents existants</span>
              </li>
            </ul>
          </div>

          {/* Mockup ultra-réaliste */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header de l'app */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <IconIdea className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Générateur d'idées</div>
                  <div className="text-indigo-200 text-xs">Bildr Intelligence</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">TM</div>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6 bg-gray-50">
              {/* Carte principale */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-500 mb-1">Idée recommandée</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Plateforme de retours visuels pour designers
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Permet aux équipes design de recueillir et organiser les retours clients directement sur des maquettes via captures d'écran annotées.
                    </p>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="text-xs font-semibold text-emerald-700 mb-0.5">Marché</div>
                    <div className="text-lg font-bold text-gray-900">2,4M€</div>
                    <div className="text-xs text-emerald-600">TAM annuel</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="text-xs font-semibold text-amber-700 mb-0.5">Concurrence</div>
                    <div className="text-lg font-bold text-gray-900">Moyenne</div>
                    <div className="text-xs text-amber-600">4 acteurs</div>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                    <div className="text-xs font-semibold text-indigo-700 mb-0.5">Score</div>
                    <div className="text-lg font-bold text-gray-900">87<span className="text-sm">/100</span></div>
                    <div className="text-xs text-indigo-600">Excellent</div>
                  </div>
                </div>

                {/* Status */}
                <div className="mt-4 flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <IconCheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold text-emerald-800">Très fort potentiel</span>
                  </div>
                  <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    Analyser <IconArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Historique */}
              <div className="text-xs font-medium text-gray-500 mb-2">Générées récemment</div>
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Assistant email IA pour freelances</div>
                    <div className="text-xs text-gray-500">Score : 72/100</div>
                  </div>
                  <span className="text-xs text-gray-400">Il y a 2j</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Outil de facturation pour coachs</div>
                    <div className="text-xs text-gray-500">Score : 81/100</div>
                  </div>
                  <span className="text-xs text-gray-400">Il y a 5j</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalité 2 : Validation (mockup ultra-réaliste) */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Mockup ultra-réaliste */}
          <div className="order-2 md:order-1 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <IconAnalytics className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Analyse de viabilité</div>
                  <div className="text-cyan-200 text-xs">Rapport détaillé</div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white text-xs font-bold">87/100</span>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6 bg-gray-50">
              {/* Section Forces */}
              <div className="bg-white rounded-xl p-4 mb-3 border-l-4 border-emerald-500 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <IconCheckCircle className="w-5 h-5" />
                  <h4 className="font-bold text-emerald-900">Forces principales</h4>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-600 font-bold mt-0.5">•</span>
                    <div>
                      <div className="font-medium text-gray-900">Faible concurrence</div>
                      <div className="text-xs text-gray-600">Seulement 4 acteurs identifiés dans cette niche</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-600 font-bold mt-0.5">•</span>
                    <div>
                      <div className="font-medium text-gray-900">Revenus récurrents</div>
                      <div className="text-xs text-gray-600">Abonnement mensuel moyen : 29€ par utilisateur</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-600 font-bold mt-0.5">•</span>
                    <div>
                      <div className="font-medium text-gray-900">Intégration simple</div>
                      <div className="text-xs text-gray-600">API disponibles pour les outils design populaires</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Section Faiblesses */}
              <div className="bg-white rounded-xl p-4 mb-3 border-l-4 border-amber-500 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <IconWarning className="w-5 h-5" />
                  <h4 className="font-bold text-amber-900">Points d'attention</h4>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <div>
                      <div className="font-medium text-gray-900">Dépendance aux outils tiers</div>
                      <div className="text-xs text-gray-600">Nécessite connexion avec Figma, Sketch, etc.</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <div>
                      <div className="font-medium text-gray-900">Effet réseau limité</div>
                      <div className="text-xs text-gray-600">Valeur croît lentement avec le nombre d'utilisateurs</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Section Opportunités */}
              <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <IconRocketFlat className="w-5 h-5" />
                  <h4 className="font-bold text-blue-900">Opportunités de croissance</h4>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <div>
                      <div className="font-medium text-gray-900">Marché en expansion</div>
                      <div className="text-xs text-gray-600">+23% de croissance annuelle du design à distance</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <div>
                      <div className="font-medium text-gray-900">Extensions possibles</div>
                      <div className="text-xs text-gray-600">Intégrations Slack, Teams, outils de gestion projet</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              Étape 2
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Est-ce que ça vaut vraiment le coup ?
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Obtiens une note de viabilité sur 100, une analyse complète forces/faiblesses/opportunités, et le paysage concurrentiel détaillé. Décide en connaissance de cause avant d'investir du temps.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Note de viabilité avec explication détaillée</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Analyse concurrents et positionnement recommandé</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Estimation de la taille du marché accessible</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Fonctionnalité 3 : Plan technique (mockup ultra-réaliste) */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              Étape 3
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quelles technologies utiliser ? Par où commencer ?
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Reçois un plan technique complet. Technologies recommandées pour ton projet, feuille de route sur 4 semaines, et schémas d'architecture. Tout ce qu'un développeur facturerait 5 000€ à concevoir.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Choix des technologies adapté à ton projet</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Feuille de route semaine par semaine</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Schéma de base de données et architecture réseau</span>
              </li>
            </ul>
          </div>

          {/* Mockup ultra-réaliste */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <IconWrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Plan technique</div>
                  <div className="text-purple-200 text-xs">Technologies recommandées</div>
                </div>
              </div>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold">4 semaines</span>
            </div>

            {/* Contenu */}
            <div className="p-6 bg-gray-50">
              {/* Stack technique */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 mb-3 uppercase">Architecture proposée</div>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 border border-blue-200 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">⚛️</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-900">Interface utilisateur</div>
                      <div className="text-xs text-gray-600">React 18 + Tailwind CSS + TypeScript</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-green-200 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🗄️</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-900">Base de données & Auth</div>
                      <div className="text-xs text-gray-600">Supabase (PostgreSQL + authentification intégrée)</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-purple-200 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">💳</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-900">Paiements</div>
                      <div className="text-xs text-gray-600">Stripe Checkout + abonnements</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-indigo-200 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🚀</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-900">Hébergement</div>
                      <div className="text-xs text-gray-600">Vercel (déploiement automatique)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coût estimé */}
              <div className="bg-gradient-to-br from-slate-50 to-gray-100 border-2 border-gray-300 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Coût mensuel total estimé :</span>
                  <span className="text-2xl font-bold text-gray-900">25€</span>
                </div>
                <div className="text-xs text-gray-600">
                  Détail : Supabase (0€), Vercel (0€), Stripe (0€ + commission), Domaine (8€), Services (17€)
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-4">
                <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">Feuille de route</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-16 font-semibold text-gray-700">Sem. 1</div>
                    <div className="flex-1 bg-indigo-100 rounded px-2 py-1 text-indigo-800">Authentification & design</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-16 font-semibold text-gray-700">Sem. 2</div>
                    <div className="flex-1 bg-blue-100 rounded px-2 py-1 text-blue-800">Fonctionnalité principale</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-16 font-semibold text-gray-700">Sem. 3</div>
                    <div className="flex-1 bg-purple-100 rounded px-2 py-1 text-purple-800">Paiements & abonnements</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-16 font-semibold text-gray-700">Sem. 4</div>
                    <div className="flex-1 bg-green-100 rounded px-2 py-1 text-green-800">Tests & mise en ligne</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalité 4 : Code (mockup ultra-réaliste) */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Mockup ultra-réaliste */}
          <div className="order-2 md:order-1">
            <div className="bg-gray-900 rounded-2xl shadow-2xl border-4 border-gray-800 overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs font-mono">lib/auth.ts</span>
                  <div className="bg-gray-700 px-2 py-0.5 rounded text-xs text-gray-300 font-mono">TypeScript</div>
                </div>
              </div>

              {/* Code */}
              <div className="p-5 font-mono text-sm overflow-x-auto">
                <div className="text-gray-500 text-xs mb-3">
                  <span className="text-gray-600">1</span>   <span className="text-gray-500">// Configuration de l'authentification Supabase</span>
                </div>
                <div className="mb-3">
                  <span className="text-gray-600 text-xs">2</span>   <span className="text-purple-400">import</span> {'{'} <span className="text-blue-400">createClient</span> {'}'} <span className="text-purple-400">from</span> <span className="text-green-400">'@supabase/supabase-js'</span><span className="text-gray-500">;</span>
                </div>
                <div className="mb-3">
                  <span className="text-gray-600 text-xs">3</span>
                </div>
                <div className="mb-3">
                  <span className="text-gray-600 text-xs">4</span>   <span className="text-gray-500">// Initialisation du client Supabase</span>
                </div>
                <div className="mb-3">
                  <span className="text-gray-600 text-xs">5</span>   <span className="text-purple-400">const</span> <span className="text-blue-400">supabase</span> <span className="text-gray-500">=</span> <span className="text-yellow-400">createClient</span><span className="text-gray-500">(</span>
                </div>
                <div className="ml-6 mb-3">
                  <span className="text-gray-600 text-xs">6</span>     <span className="text-cyan-400">process.env.NEXT_PUBLIC_SUPABASE_URL</span><span className="text-gray-500">,</span>
                </div>
                <div className="ml-6 mb-3">
                  <span className="text-gray-600 text-xs">7</span>     <span className="text-cyan-400">process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                </div>
                <div className="mb-3">
                  <span className="text-gray-600 text-xs">8</span>   <span className="text-gray-500">);</span>
                </div>
                <div className="mb-3">
                  <span className="text-gray-600 text-xs">9</span>
                </div>
                <div className="mb-3">
                  <span className="text-gray-600 text-xs">10</span>  <span className="text-gray-500">// ✅ Fonction de connexion - Prête à utiliser</span>
                </div>
                <div className="mb-3">
                  <span className="text-gray-600 text-xs">11</span>  <span className="text-purple-400">export</span> <span className="text-purple-400">async</span> <span className="text-purple-400">function</span> <span className="text-yellow-400">signIn</span><span className="text-gray-500">(</span><span className="text-blue-400">email</span><span className="text-gray-500">:</span> <span className="text-cyan-400">string</span><span className="text-gray-500">,</span> <span className="text-blue-400">password</span><span className="text-gray-500">:</span> <span className="text-cyan-400">string</span><span className="text-gray-500">) {'{'}</span>
                </div>
                <div className="ml-6 mb-3">
                  <span className="text-gray-600 text-xs">12</span>    <span className="text-purple-400">const</span> {'{'} <span className="text-blue-400">data</span><span className="text-gray-500">,</span> <span className="text-blue-400">error</span> {'}'} <span className="text-gray-500">=</span> <span className="text-purple-400">await</span> <span className="text-blue-400">supabase</span><span className="text-gray-500">.</span><span className="text-yellow-400">auth</span><span className="text-gray-500">.</span><span className="text-yellow-400">signInWithPassword</span><span className="text-gray-500">({'{'}</span>
                </div>
                <div className="ml-12 mb-3">
                  <span className="text-gray-600 text-xs">13</span>      <span className="text-blue-400">email</span><span className="text-gray-500">,</span> <span className="text-blue-400">password</span>
                </div>
                <div className="ml-6 mb-3">
                  <span className="text-gray-600 text-xs">14</span>    <span className="text-gray-500">{'}'});</span>
                </div>
                <div className="ml-6 mb-3">
                  <span className="text-gray-600 text-xs">15</span>    <span className="text-purple-400">return</span> {'{'} <span className="text-blue-400">data</span><span className="text-gray-500">,</span> <span className="text-blue-400">error</span> {'}'}<span className="text-gray-500">;</span>
                </div>
                <div className="mb-3">
                  <span className="text-gray-600 text-xs">16</span>  <span className="text-gray-500">{'}'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              Étape 4
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bloqué ? Obtiens le code exact dont tu as besoin
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Extraits de code prêts pour la production à chaque étape. Authentification, paiements, requêtes base de données—tout est prêt à copier-coller. Comme avoir un développeur expert à disposition.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Code qui fonctionne réellement (testé en production)</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Explications en français, ligne par ligne</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Demandes de code illimitées</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tableau de comparaison */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 flex items-center justify-center gap-3">
            Comment Bildr se compare ? <IconQuestion className="w-10 h-10" />
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            On a construit Bildr parce qu'on en avait marre d'assembler des solutions qui ne communiquent pas entre elles.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-xl shadow-sm overflow-hidden">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 text-gray-900 font-semibold">Fonctionnalité</th>
                  <th className="text-center py-4 px-6 text-gray-900 font-semibold">Bildr</th>
                  <th className="text-center py-4 px-6 text-gray-600">ChatGPT</th>
                  <th className="text-center py-4 px-6 text-gray-600">Développeur</th>
                  <th className="text-center py-4 px-6 text-gray-600">Outils sans code</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Génération d'idées validées</td>
                  <td className="text-center py-4 px-6"><IconCheckCircle className="w-6 h-6 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconCheckCircle className="w-6 h-6 mx-auto opacity-30" /></td>
                  <td className="text-center py-4 px-6"><IconCross className="w-6 h-6 mx-auto opacity-30" /></td>
                  <td className="text-center py-4 px-6"><IconCross className="w-6 h-6 mx-auto opacity-30" /></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Validation du marché</td>
                  <td className="text-center py-4 px-6"><IconCheckCircle className="w-6 h-6 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconCross className="w-6 h-6 mx-auto opacity-30" /></td>
                  <td className="text-center py-4 px-6"><IconCross className="w-6 h-6 mx-auto opacity-30" /></td>
                  <td className="text-center py-4 px-6"><IconCross className="w-6 h-6 mx-auto opacity-30" /></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Plan technique complet</td>
                  <td className="text-center py-4 px-6"><IconCheckCircle className="w-6 h-6 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><span className="text-gray-400 text-sm">Partiel</span></td>
                  <td className="text-center py-4 px-6"><IconCheckCircle className="w-6 h-6 mx-auto opacity-30" /></td>
                  <td className="text-center py-4 px-6"><IconCross className="w-6 h-6 mx-auto opacity-30" /></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Code prêt pour la production</td>
                  <td className="text-center py-4 px-6"><IconCheckCircle className="w-6 h-6 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><span className="text-gray-400 text-sm">Souvent buggé</span></td>
                  <td className="text-center py-4 px-6"><IconCheckCircle className="w-6 h-6 mx-auto opacity-30" /></td>
                  <td className="text-center py-4 px-6"><span className="text-gray-400 text-sm">Limité</span></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Guidage étape par étape</td>
                  <td className="text-center py-4 px-6"><IconCheckCircle className="w-6 h-6 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconCross className="w-6 h-6 mx-auto opacity-30" /></td>
                  <td className="text-center py-4 px-6"><IconCross className="w-6 h-6 mx-auto opacity-30" /></td>
                  <td className="text-center py-4 px-6"><IconCross className="w-6 h-6 mx-auto opacity-30" /></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 text-gray-900 font-semibold">Coût</td>
                  <td className="text-center py-4 px-6 text-indigo-600 font-semibold">19€/mois</td>
                  <td className="text-center py-4 px-6 text-gray-600">20€/mois</td>
                  <td className="text-center py-4 px-6 text-gray-600">15 000€+</td>
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
          <p className="text-lg text-indigo-900 font-medium flex items-center justify-center gap-2 flex-wrap">
            "Construit par des fondateurs indépendants <IconPerson className="w-5 h-5 inline" /> pour des fondateurs qui ne savent pas coder <IconCross className="w-5 h-5 inline opacity-60" /> mais qui ont des idées à un million <IconIdea className="w-5 h-5 inline" />"
          </p>
          <p className="text-indigo-700 mt-2 flex items-center justify-center gap-2 flex-wrap">
            Pas de levée de fonds <IconMoney className="w-5 h-5 inline opacity-60" /> — Autofinancés <IconWrench className="w-5 h-5 inline" /> — On comprend tes galères.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6" id="tarifs">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              Tarifs simples et transparents <IconMoney className="w-10 h-10" />
            </h2>
            <p className="text-lg text-gray-600">
              Commence gratuitement. Passe à la version payante quand tu es prêt à construire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Gratuit */}
            <div className="border-2 border-gray-200 rounded-xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Découverte</h3>
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
                  <span>Plan technique</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <IconX className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Extraits de code</span>
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
            <div className="border-2 border-indigo-600 rounded-xl p-8 bg-white relative shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full">
                Le plus populaire
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lancement</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-bold text-gray-900">19€</span>
                  <span className="text-gray-600">/mois</span>
                </div>
                <p className="text-gray-600">
                  Tout pour lancer ton produit
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Idées illimitées</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Validations complètes</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Plans techniques détaillés</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Code prêt pour la production</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Demandes de code illimitées</span>
                </li>
              </ul>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
              >
                Commencer maintenant
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                Résilie à tout moment. Sans poser de questions.
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
                a: "Non. Bildr est conçu pour les personnes sans compétences techniques. On te fournit du code prêt à copier-coller, avec des explications en français simple. Si tu sais suivre une recette de cuisine, tu peux utiliser Bildr."
              },
              {
                q: "En quoi c'est différent de ChatGPT ?",
                a: "ChatGPT est génial, mais pas structuré. Tu dois savoir quoi demander, quand le demander, et comment tout assembler. Bildr te guide à travers tout le processus : idée → validation → plan → code. C'est un parcours complet, pas juste des réponses éparpillées."
              },
              {
                q: "Je peux vraiment construire un produit en 4 semaines ?",
                a: "Oui—si tu suis la feuille de route et que tu investis 10-15 heures par semaine. On découpe tout en jalons hebdomadaires réalisables. Semaine 1 : Authentification. Semaine 2 : Fonctionnalité principale. Semaine 3 : Paiements. Semaine 4 : Mise en ligne."
              },
              {
                q: "Et si je suis bloqué ?",
                a: "C'est exactement pour ça qu'il y a le générateur d'extraits de code. Décris où tu es coincé, et tu reçois le code exact dont tu as besoin pour avancer. C'est comme avoir un développeur expert disponible en permanence."
              },
              {
                q: "Je peux annuler à tout moment ?",
                a: "Oui. Un clic, aucune question posée. Tu gardes l'accès à tout ce que tu as déjà généré."
              },
              {
                q: "Le plan gratuit est vraiment gratuit à vie ?",
                a: "Oui. Pas de carte bancaire demandée. Tu obtiens 1 génération d'idée complète avec validation. Assez pour voir si Bildr te convient."
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-3">
            Prêt à construire ton produit ? <IconRocketFlat className="w-12 h-12" />
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Rejoins les fondateurs indépendants qui lancent leurs idées au lieu d'attendre "un jour".
          </p>
          <button
            onClick={() => openAuth('REGISTER')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-indigo-600 rounded-lg font-bold text-lg transition-colors"
          >
            Commencer gratuitement
            <IconArrowRight className="w-5 h-5" />
          </button>
          <p className="text-indigo-200 text-sm mt-6">
            Gratuit à vie · Sans carte bancaire · 30 secondes pour démarrer
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
              <a href="#tarifs" className="hover:text-gray-900 transition-colors">Tarifs</a>
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
