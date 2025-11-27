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
            Réponses courtes, preuves concrètes et appels à l’action pour choisir le plan payant qui fait passer votre SaaS de l’idée au revenu.
          </p>
        </div>

        <div className="space-y-8">
          {/* Q1 */}
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 md:p-7 space-y-4 md:space-y-5">
            <h2 className="text-white font-semibold text-lg">Sommet, c’est quoi concrètement ?</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed md:leading-loose">
              Sommet est votre <strong>copilote IA de bout en bout</strong> : génération d’idées alignées sur votre profil,
              validation marché, blueprint technique détaillé, Kanban prêt à exécuter et Sherpa de code pour débloquer les tâches difficiles.
            </p>
            <div className="bg-dark-800/60 border border-dark-700 rounded-xl p-4 text-sm text-slate-300 space-y-3">
              <p className="font-semibold text-white">Ce que vous gagnez immédiatement :</p>
              <ul className="space-y-2">
                <li className="flex gap-2 items-start">
                  <IconCheck className="w-4 h-4 text-gold-500 mt-1" />
                  <span>Un plan d’action exploitable dès la première session.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <IconCheck className="w-4 h-4 text-gold-500 mt-1" />
                  <span>Des snippets de code copiables pour livrer plus vite.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <IconCheck className="w-4 h-4 text-gold-500 mt-1" />
                  <span>Un suivi Kanban qui transforme vos idées en features livrées.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Q2 */}
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 md:p-7 space-y-4 md:space-y-5">
            <h2 className="text-white font-semibold text-lg">Pourquoi passer sur un plan payant ?</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed md:leading-loose">
              Les plans payants débloquent les blocs qui font gagner de l’argent :
            </p>
            <ul className="space-y-2 text-slate-400 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-brand-500 mt-1 flex-shrink-0" />
                <span><strong>Analyses illimitées</strong> pour tester plusieurs niches et trouver celle qui convertit.</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-brand-500 mt-1 flex-shrink-0" />
                <span><strong>Blueprints techniques complets</strong> avec estimations d’effort et stack recommandée.</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-brand-500 mt-1 flex-shrink-0" />
                <span><strong>Chantier + Sherpa</strong> : accompagnement continu, code sur mesure et historique des échanges.</span>
              </li>
            </ul>
            <p className="text-slate-500 text-xs md:text-sm">
              Résultat : moins de temps perdu en hésitation, plus de temps passé à shipper et à encaisser vos premiers clients.
            </p>
          </div>

          {/* Q3 */}
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 md:p-7 space-y-4 md:space-y-5">
            <h2 className="text-white font-semibold text-lg">Combien ça coûte et quel plan choisir ?</h2>
            <div className="space-y-4 text-slate-400 text-sm md:text-base">
              <p className="leading-relaxed md:leading-loose">
                Nous avons volontairement simplifié les offres pour que la décision soit rapide :
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-slate-500 mt-1" />
                  <span><strong>Camp de Base</strong> (gratuit) : pour tester l’interface et générer vos premières idées.</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-brand-500 mt-1" />
                  <span><strong>Explorateur</strong> : validation marché + 1 blueprint complet pour sécuriser votre MVP.</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck className="w-4 h-4 text-gold-500 mt-1" />
                  <span><strong>Bâtisseur</strong> (recommandé) : analyses illimitées, Chantier, Sherpa, historique et support prioritaire.</span>
                </li>
              </ul>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                La plupart des fondateurs passent sur <strong>Bâtisseur</strong> dès qu’ils ont une idée validée pour garder la vitesse et livrer.
              </p>
            </div>
          </div>

          {/* Q4 */}
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 md:p-7 space-y-4 md:space-y-5">
            <h2 className="text-white font-semibold text-lg">Et si je ne suis pas technique ?</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed md:leading-loose">
              Sommet est pensé pour les non-tech : chaque tâche arrive avec contexte, explications pédagogiques et, sur les plans payants,
              du code prêt à coller dans votre repo. Vous pouvez donc avancer seul ou avec votre développeur freelance.
            </p>
            <div className="flex flex-col md:flex-row gap-3 text-sm">
              <div className="flex-1 bg-dark-800/70 border border-dark-700 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">Guides pas à pas</p>
                <p className="text-slate-400">Chaque bloc du Kanban inclut les étapes concrètes, les dépendances et les risques à surveiller.</p>
              </div>
              <div className="flex-1 bg-dark-800/70 border border-dark-700 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">Sherpa à la demande</p>
                <p className="text-slate-400">Posez une question, obtenez une réponse contextualisée + code. Copiez en un clic.</p>
              </div>
            </div>
          </div>

          {/* Q5 */}
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 md:p-7 space-y-4 md:space-y-5">
            <h2 className="text-white font-semibold text-lg">Qu’est-ce qui se passe si j’arrête mon abonnement ?</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed md:leading-loose">
              Vous restez propriétaire de vos projets et de votre historique. Si vous arrêtez, les fonctionnalités premium se bloquent mais rien n’est perdu.
            </p>
            <ul className="space-y-2 text-slate-400 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                <span>Annulation en quelques clics, sans engagement.</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                <span>Vos tâches, idées et historiques Sherpa restent consultables.</span>
              </li>
              <li className="flex items-start gap-2">
                <IconX className="w-4 h-4 text-slate-600 mt-1 flex-shrink-0" />
                <span>Plus de génération illimitée ni de code sur mesure tant que l’abonnement est coupé.</span>
              </li>
            </ul>
          </div>

          {/* Q6 */}
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 md:p-7 space-y-4 md:space-y-5">
            <h2 className="text-white font-semibold text-lg">Comment Sommet me fait gagner du temps… et de l’argent ?</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed md:leading-loose">
              La plateforme est optimisée pour raccourcir le temps entre l’idée et les premiers revenus :
            </p>
            <ul className="space-y-2 text-slate-400 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                <span>Validation rapide : évitez des semaines sur une mauvaise niche.</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                <span>Blueprint précis : moins d’itérations, plus de shipping.</span>
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="w-4 h-4 text-gold-500 mt-1 flex-shrink-0" />
                <span>Sherpa : code prêt à l’emploi pour débloquer chaque sprint.</span>
              </li>
            </ul>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
              En moyenne, les fondateurs gagnent plusieurs semaines de R&D et peuvent facturer plus vite leurs premiers clients.
            </p>
          </div>

          {/* Q7 */}
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 md:p-7 space-y-4 md:space-y-5">
            <h2 className="text-white font-semibold text-lg">Qui peut m’accompagner si je bloque ?</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed md:leading-loose">
              Sur les plans payants, vous bénéficiez d’un support prioritaire et d’un historique Sherpa conservé par chantier.
              Vous pouvez rouvrir un échange, demander une variante de code ou un pas-à-pas plus détaillé sans repartir de zéro.
            </p>
            <div className="bg-dark-800/60 border border-dark-700 rounded-xl p-4 text-sm text-slate-300 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-white font-semibold">Envie de passer sur Bâtisseur ?</p>
                <p className="text-slate-400">Déverrouillez l’historique complet, le support prioritaire et les générations illimitées.</p>
              </div>
              <a
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-brand-600 text-white font-semibold shadow-lg shadow-brand-900/30 hover:bg-brand-500 transition-colors"
              >
                Choisir le plan Bâtisseur
              </a>
            </div>
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
