// components/FaqPage.tsx
import React from 'react';
import { IconMountain, IconCheck, IconX } from './Icons';

const FaqPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-950 text-slate-50 font-sans">
      {/* Header / Navbar light */}
      <header className="border-b border-dark-800 bg-dark-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-900/20">
              <IconMountain className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">Sommet</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-800 border border-dark-700 text-slate-400 uppercase font-semibold">
              FAQ
            </span>
          </div>
          <a
            href="/"
            className="text-xs md:text-sm text-slate-400 hover:text-white font-medium transition-colors"
          >
            ← Retour à la page d&apos;accueil
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-10 md:mb-16 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            FAQ Sommet
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-light">
            Les réponses aux questions que se posent les fondateurs avant de lancer leur projet avec Sommet.
          </p>
        </div>

        <div className="space-y-6">
          {/* Q1 */}
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 md:p-7">
            <h2 className="text-white font-semibold text-lg mb-2">
              Sommet, c’est quoi concrètement ?
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Sommet est une plateforme IA qui vous accompagne de <strong>l&apos;idée</strong> jusqu&apos;au
              <strong> lancement du produit</strong>. Elle génère des idées de micro-SaaS adaptées à votre profil,
              analyse leur viabilité, produit un blueprint technique, puis les traduit en tâches actionnables dans un Kanban
              – avec un assistant de code intégré (&quot;Le Sherpa&quot;).
            </p>
          </div>

          {/* Q2 */}
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 md:p-7">
            <h2 className="text-white font-semibold text-lg mb-2">
              Est-ce que Sommet remplace un développeur ou un CTO ?
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-3">
              Non. Sommet agit comme un <strong>co-pilote stratégique et technique</strong>. Il vous aide à :
            </p>
            <ul className="space-y-2 text-slate-400 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                <span>Structurer votre idée, comprendre votre marché et identifier les risques clés.</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                <span>Définir une roadmap claire et techniquement réaliste (MVP, sprints, stack).</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                <span>Vous proposer du code prêt à l’emploi pour débloquer les points techniques.</span>
              </li>
            </ul>
            <p className="text-slate-500 text-xs md:text-sm mt-3">
              Vous gardez la main sur les décisions, le produit et l&apos;exécution. Sommet accélère et sécurise le chemin.
            </p>
          </div>

          {/* Q3 */}
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 md:p-7">
            <h2 className="text-white font-semibold text-lg mb-2">
              J’ai peu de compétences techniques, est-ce que la plateforme est faite pour moi ?
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Oui. Sommet est pensé pour les <strong>fondateurs non-tech</strong> ou &quot;semi-tech&quot; :
              explications pas-à-pas, tâches découpées, exemples de code à copier-coller, et un langage le plus pédagogique possible.
              Vous pouvez commencer avec des bases très modestes et apprendre en construisant.
            </p>
          </div>

          {/* Q4 */}
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 md:p-7">
            <h2 className="text-white font-semibold text-lg mb-2">
              Comment fonctionnent les crédits de génération ?
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-3">
              Chaque génération d&apos;idées consomme un crédit. Les plans fonctionnent de la manière suivante :
            </p>
            <ul className="space-y-2 text-slate-400 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-slate-500 mt-1 flex-shrink-0" />
                <span><strong>Camp de Base</strong> : quelques crédits gratuits pour tester la plateforme.</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-brand-500 mt-1 flex-shrink-0" />
                <span><strong>L’Explorateur</strong> : pack de crédits + 1 analyse complète et 1 blueprint complet.</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                <span><strong>Le Bâtisseur</strong> : générations et analyses illimitées + accès complet au Chantier &amp; Sherpa.</span>
              </li>
            </ul>
          </div>

          {/* Q5 */}
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 md:p-7">
            <h2 className="text-white font-semibold text-lg mb-2">
              Puis-je arrêter mon abonnement à tout moment ?
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-3">
              Oui. L’abonnement <strong>&quot;Bâtisseur&quot;</strong> est sans engagement :
            </p>
            <ul className="space-y-2 text-slate-400 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                <span>Vous pouvez annuler quand vous voulez, en quelques clics.</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                <span>Vos projets restent dans votre compte, même après annulation.</span>
              </li>
              <li className="flex items-start gap-2">
                <IconX className="w-4 h-4 text-slate-600 mt-1 flex-shrink-0" />
                <span>Les fonctionnalités premium sont simplement désactivées à la fin de la période payée.</span>
              </li>
            </ul>
          </div>

          {/* Q6 bonus */}
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 md:p-7">
            <h2 className="text-white font-semibold text-lg mb-2">
              Est-ce que Sommet m’aide aussi après le lancement ?
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              L’orientation principale de Sommet aujourd’hui est la phase <strong>0 → 1</strong> :
              idée, validation, MVP, premier lancement.  
              À terme, de nouveaux modules arriveront pour vous aider sur la croissance
              (acquisition, pricing, expansion produit).
            </p>
          </div>
        </div>
      </main>

      {/* Footer simple */}
      <footer className="py-10 border-t border-dark-800 mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-dark-800 rounded-lg flex items-center justify-center">
              <IconMountain className="w-3 h-3 text-slate-400" />
            </div>
            <span className="font-semibold text-slate-500">Sommet.tech</span>
          </div>
          <p>© 2025 Sommet.tech — FAQ.</p>
        </div>
      </footer>
    </div>
  );
};

export default FaqPage;
