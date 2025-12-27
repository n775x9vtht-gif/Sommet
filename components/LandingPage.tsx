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
  IconEuro,
  IconCalendar,
  IconSteps,
  IconWrench,
  IconShield,
  IconPackage,
  IconQuestion,
  IconBuilding,
  IconKanban,
  IconSparkle,
  IconCross,
  IconPerson,
  IconReact,
  IconDatabase,
  IconPayment,
  IconCloud
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
            Tu as une idée de SaaS,<br/>
            mais tu ne sais pas coder ?
          </h1>
          <p className="text-xl text-gray-600 mb-4 leading-relaxed">
            Bildr transforme ton idée en vrai SaaS. Sans écrire une ligne de code.
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto mb-10">
            De la validation de ton idée jusqu'à la mise en ligne. Plan technique détaillé, code prêt à utiliser, et guide pas à pas en français. Tout ce qu'il faut pour créer ton produit.
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
            Gratuit pour toujours · Sans carte bancaire · Prêt en 30 secondes
          </p>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <IconCalendar className="w-9 h-9" /> 4 semaines
              </div>
              <div className="text-gray-600">Pour créer ton SaaS (au lieu de 6 mois)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <IconEuro className="w-9 h-9" /> 15 000 €
              </div>
              <div className="text-gray-600">Économisés en évitant un développeur</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <IconSteps className="w-9 h-9" /> 3 étapes
              </div>
              <div className="text-gray-600">Au lieu de chercher dans 100 tutoriels</div>
            </div>
          </div>
        </div>
      </section>

      {/* Proposition de valeur */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Trouve une idée, vérifie qu'elle vaut le coup, construis et mets en ligne
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Bildr est fait pour ceux qui ne savent pas coder. Tu obtiens des idées de SaaS adaptées à ton profil, une analyse pour savoir si ça peut marcher, un plan technique complet, et du code prêt à copier-coller.
          </p>
        </div>
      </section>

      {/* Grille de fonctionnalités */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4 flex items-center gap-2">
              <IconBuilding className="w-4 h-4" /> Tout ce dont tu as besoin
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              De l'idée au SaaS en ligne
            </h2>
            <p className="text-base text-gray-600">
              Chaque étape est guidée et expliquée simplement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <IconIdea className="w-8 h-8" />,
                title: "Idées de SaaS",
                description: "Des idées adaptées à ce que tu sais faire, avec une vraie demande"
              },
              {
                icon: <IconAnalytics className="w-8 h-8" />,
                title: "Vérification du marché",
                description: "Un score sur 100, la concurrence, la taille du marché"
              },
              {
                icon: <IconTarget className="w-8 h-8" />,
                title: "Analyse détaillée",
                description: "Tu sais si ton idée vaut le coup avant de te lancer"
              },
              {
                icon: <IconWrench className="w-8 h-8" />,
                title: "Plan de construction",
                description: "Quelles technologies utiliser et comment les assembler"
              },
              {
                icon: <IconKanban className="w-8 h-8" />,
                title: "Planning semaine par semaine",
                description: "Ton projet découpé en tâches claires et réalisables"
              },
              {
                icon: <IconTerminal className="w-8 h-8" />,
                title: "Code prêt à l'emploi",
                description: "Du code qui marche vraiment, à copier-coller directement"
              },
              {
                icon: <IconShield className="w-8 h-8" />,
                title: "Connexion et paiements",
                description: "Tout pour gérer tes utilisateurs et accepter des paiements"
              },
              {
                icon: <IconPackage className="w-8 h-8" />,
                title: "Mise en ligne",
                description: "Comment mettre ton SaaS sur Internet, étape par étape"
              }
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">{feature.title}</h3>
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Tu ne sais pas quel SaaS créer ?
            </h2>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              Dis-nous ce qui t'intéresse et ce que tu sais déjà faire. On te propose des idées de SaaS simples, avec des gens qui cherchent vraiment ce genre de service. Plus besoin de deviner si ton idée va plaire.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Des idées qui correspondent à ce que tu connais</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Des marchés où les gens cherchent vraiment une solution</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">La liste des SaaS qui existent déjà dans ce domaine</span>
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Comment savoir si ça peut marcher ?
            </h2>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              Tu reçois une note sur 100 qui te dit si ton idée est bonne. On analyse les points forts, les risques, et les opportunités. Tu vois aussi qui fait déjà la même chose. Comme ça, tu décides si ça vaut le coup de te lancer.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Une note claire avec les raisons qui l'expliquent</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">La liste de tes concurrents et comment te différencier</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Combien de personnes pourraient être intéressées</span>
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Quels outils utiliser ? Par où commencer ?
            </h2>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              On te donne un plan complet pour construire ton SaaS. Les outils à utiliser, un planning sur 4 semaines, et les schémas pour comprendre comment tout s'assemble. Normalement, un développeur te ferait payer 5 000 € juste pour faire ce plan.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Les bons outils pour ton type de SaaS</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Un planning détaillé, semaine après semaine</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Des schémas pour comprendre comment ça marche</span>
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
                      <IconReact className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-900">Interface utilisateur</div>
                      <div className="text-xs text-gray-600">React 18 + Tailwind CSS + TypeScript</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-green-200 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconDatabase className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-900">Base de données et connexion</div>
                      <div className="text-xs text-gray-600">Supabase (PostgreSQL + authentification intégrée)</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-purple-200 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconPayment className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-900">Paiements</div>
                      <div className="text-xs text-gray-600">Stripe Checkout et abonnements</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-indigo-200 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconCloud className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-900">Mise en ligne</div>
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Et si je bloque ? Je fais comment ?
            </h2>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              À chaque étape, tu reçois du code prêt à utiliser. Connexion des utilisateurs, accepter des paiements, récupérer des données... tout est déjà écrit. Tu copies, tu colles, ça marche. C'est comme avoir un développeur professionnel disponible en permanence.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Du code qui marche vraiment (testé sur de vrais SaaS)</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Des explications en français pour chaque ligne</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Autant de code que tu veux, quand tu veux</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Comparaison */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            En quoi Bildr est différent
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            On a créé Bildr parce qu'on était fatigués de devoir assembler 10 outils différents qui ne parlent pas entre eux
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bildr */}
            <div className="bg-indigo-50 border-2 border-indigo-600 rounded-xl p-6">
              <div className="text-center mb-4">
                <div className="inline-block px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-bold mb-3">
                  Bildr
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">19 € / mois</div>
                <div className="text-xs text-gray-600">Tout inclus</div>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <IconCheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-gray-700">Idées validées</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-gray-700">Analyse marché</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-gray-700">Plan complet</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-gray-700">Code testé</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-gray-700">Guide complet</span>
                </li>
              </ul>
            </div>

            {/* ChatGPT */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="text-center mb-4">
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold mb-3">
                  ChatGPT
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">20 € / mois</div>
                <div className="text-xs text-gray-600">Pas structuré</div>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <IconCross className="w-5 h-5 flex-shrink-0 opacity-40" />
                  <span className="text-gray-500">Idées génériques</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCross className="w-5 h-5 flex-shrink-0 opacity-40" />
                  <span className="text-gray-500">Pas d'analyse</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCross className="w-5 h-5 flex-shrink-0 opacity-40" />
                  <span className="text-gray-500">Conseils partiels</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCross className="w-5 h-5 flex-shrink-0 opacity-40" />
                  <span className="text-gray-500">Code buggé</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCross className="w-5 h-5 flex-shrink-0 opacity-40" />
                  <span className="text-gray-500">Pas de structure</span>
                </li>
              </ul>
            </div>

            {/* Développeur */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="text-center mb-4">
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold mb-3">
                  Développeur
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">15 000 €</div>
                <div className="text-xs text-gray-600">Très cher</div>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <IconCross className="w-5 h-5 flex-shrink-0 opacity-40" />
                  <span className="text-gray-500">Pas son rôle</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCross className="w-5 h-5 flex-shrink-0 opacity-40" />
                  <span className="text-gray-500">Pas son rôle</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCheckCircle className="w-5 h-5 flex-shrink-0 opacity-40" />
                  <span className="text-gray-500">En supplément</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCheckCircle className="w-5 h-5 flex-shrink-0 opacity-40" />
                  <span className="text-gray-500">Sur mesure</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCross className="w-5 h-5 flex-shrink-0 opacity-40" />
                  <span className="text-gray-500">Tu gères seul</span>
                </li>
              </ul>
            </div>

            {/* No-code */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="text-center mb-4">
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold mb-3">
                  No-code
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">50 € / mois</div>
                <div className="text-xs text-gray-600">Très limité</div>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <IconCross className="w-5 h-5 flex-shrink-0 opacity-40" />
                  <span className="text-gray-500">Templates imposés</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCross className="w-5 h-5 flex-shrink-0 opacity-40" />
                  <span className="text-gray-500">Aucune</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCross className="w-5 h-5 flex-shrink-0 opacity-40" />
                  <span className="text-gray-500">Outils imposés</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCross className="w-5 h-5 flex-shrink-0 opacity-40" />
                  <span className="text-gray-500">Très limité</span>
                </li>
                <li className="flex items-center gap-2">
                  <IconCross className="w-5 h-5 flex-shrink-0 opacity-40" />
                  <span className="text-gray-500">Compliqué</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Signal de confiance */}
      <section className="py-16 px-6 bg-indigo-50 border-y border-indigo-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-indigo-900 font-medium">
            "Créé par des fondateurs pour des fondateurs qui ne savent pas coder"
          </p>
          <p className="text-indigo-700 mt-3">
            Pas de levée de fonds • Autofinancés • On comprend tes galères parce qu'on les a vécues
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6" id="tarifs">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prix simples et clairs
            </h2>
            <p className="text-base text-gray-600">
              Essaie gratuitement. Passe à la version complète quand tu es prêt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Gratuit */}
            <div className="border-2 border-gray-200 rounded-xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Découverte</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-bold text-gray-900">0 €</span>
                  <span className="text-gray-600">pour toujours</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Pour tester Bildr et voir comment ça marche
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">1 idée complète avec analyse</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Score de viabilité</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <IconX className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Plan de construction</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <IconX className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Code prêt à utiliser</span>
                </li>
              </ul>

              <button
                onClick={() => openAuth('REGISTER')}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors"
              >
                Essayer gratuitement
              </button>
            </div>

            {/* Launch */}
            <div className="border-2 border-indigo-600 rounded-xl p-8 bg-white relative shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full">
                Le plus populaire
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Version complète</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-bold text-gray-900">19 €</span>
                  <span className="text-gray-600">par mois</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Tout ce qu'il faut pour créer ton SaaS
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Autant d'idées que tu veux</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Analyses complètes</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Plans de construction détaillés</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Tout le code dont tu as besoin</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Aide illimitée si tu bloques</span>
                </li>
              </ul>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
              >
                Commencer maintenant
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                Tu peux annuler quand tu veux, sans justification
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
                q: "Je dois savoir coder ?",
                a: "Non, pas du tout. Bildr est fait pour ceux qui ne savent pas coder. On te donne du code tout prêt à copier-coller, avec des explications simples en français. Si tu peux suivre une recette de cuisine, tu peux utiliser Bildr."
              },
              {
                q: "C'est quoi la différence avec ChatGPT ?",
                a: "ChatGPT est super, mais il ne te guide pas. Tu dois savoir quoi lui demander et comment assembler ses réponses. Avec Bildr, tout est organisé : tu passes de l'idée au SaaS en ligne, étape par étape. C'est un vrai parcours, pas juste des réponses en vrac."
              },
              {
                q: "Je peux vraiment créer un SaaS en 4 semaines ?",
                a: "Oui, si tu suis le plan et que tu travailles 10 à 15 heures par semaine. On découpe tout en tâches simples. Semaine 1 : connexion des utilisateurs. Semaine 2 : fonction principale. Semaine 3 : paiements. Semaine 4 : mise en ligne."
              },
              {
                q: "Et si je bloque quelque part ?",
                a: "C'est pour ça qu'on te donne du code à chaque étape. Tu expliques où tu bloques, et tu reçois exactement le code qu'il te faut. C'est comme avoir un développeur pro toujours disponible."
              },
              {
                q: "Je peux arrêter quand je veux ?",
                a: "Oui, en un clic. Pas besoin de se justifier. Et tu gardes tout ce que tu as déjà généré."
              },
              {
                q: "Le gratuit, c'est vraiment pour toujours ?",
                a: "Oui, pour toujours. Pas besoin de carte bancaire. Tu peux tester avec 1 idée complète et son analyse. Comme ça tu vois si Bildr te convient."
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à créer ton SaaS ?
          </h2>
          <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto">
            Rejoins ceux qui se lancent au lieu d'attendre le bon moment
          </p>
          <button
            onClick={() => openAuth('REGISTER')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-indigo-600 rounded-lg font-bold text-lg transition-colors"
          >
            Essayer gratuitement
            <IconArrowRight className="w-5 h-5" />
          </button>
          <p className="text-indigo-200 text-sm mt-6">
            Gratuit pour toujours • Sans carte bancaire • Prêt en 30 secondes
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
