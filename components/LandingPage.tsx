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

    const startCheckout = async (priceId: string) => {
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url; // redirection Stripe Checkout
      } else {
        alert("Impossible de démarrer le paiement Stripe.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la redirection vers Stripe.");
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-50 font-sans overflow-x-hidden selection:bg-gold-500/30 selection:text-white">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        initialMode={authMode} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={onEnterApp}
      />

            {/* Navbar */}
<nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center animate-fade-in sticky top-0 z-40 bg-dark-950/80 backdrop-blur-md border-b border-white/5">
  <div className="flex items-center gap-3">
    {/* Logo */}
    <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-900/20">
      <IconMountain className="w-6 h-6 text-white" />
    </div>
    <span className="font-extrabold text-2xl text-white tracking-tight">Sommet</span>
  </div>

  <div className="flex items-center gap-4 md:gap-6">

    {/* Lien FAQ */}
    <a
      href="#faq"
      className="text-slate-400 hover:text-white font-medium transition-colors text-sm hidden sm:block"
    >
      FAQ
    </a>

    {/* Lien Tarifs */}
    <a
      href="#pricing"
      className="text-slate-400 hover:text-white font-medium transition-colors text-sm hidden sm:block"
    >
      Tarifs
    </a>

    {/* Connexion */}
    <button 
      onClick={() => openAuth('LOGIN')} 
      className="text-slate-400 hover:text-white font-medium transition-colors text-sm hidden sm:block"
    >
      Connexion
    </button>

    {/* CTA Accès */}
    <button 
      onClick={() => openAuth('REGISTER')}
      className="bg-white text-dark-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all hover:translate-y-[-1px] shadow-lg"
    >
      Accéder à la plateforme
    </button>
  </div>
</nav>

      {/* Hero Section */}
      <header className="relative pt-24 pb-32 px-6 overflow-hidden text-center">
        {/* Background Effects - Softened */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-900/10 rounded-full blur-[100px] -z-10"></div>
        
        <div className="max-w-5xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900 border border-dark-700 text-gold-400 text-xs font-bold mb-8 tracking-widest uppercase shadow-sm">
            <IconTrophy className="w-3.5 h-3.5" />
            <span>De l'idée à la Licorne</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1] text-white">
            Gravissez le
            <br />
            {/* Title Fix: Clean gradient, soft shadow, no harsh halo */}
            <span className="relative inline-block mt-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-300 to-gold-500 drop-shadow-xl text-6xl md:text-8xl tracking-tighter">
                SOMMET
                </span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            La première plateforme IA qui <span className="text-white font-medium">génère</span> vos idées, <span className="text-white font-medium">analyse</span> leur potentiel et <span className="text-white font-medium">trace</span> votre route vers le succès.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button 
              onClick={() => openAuth('REGISTER')}
              className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-brand-900/30 flex items-center justify-center group hover:-translate-y-1"
            >
              <IconRocket className="w-5 h-5 mr-2" />
              Lancer mon projet
            </button>
            <button 
              onClick={onEnterDemo}
              className="w-full sm:w-auto px-8 py-4 bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white rounded-2xl font-medium text-lg border border-dark-600 hover:border-slate-500 transition-all flex items-center justify-center"
            >
              Voir la démo
            </button>
          </div>
        </div>
      </header>
      
      {/* DAILY NEWS SECTION */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 mb-32 relative z-20 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="bg-dark-900 border border-dark-700 rounded-[2.5rem] p-1.5 shadow-2xl overflow-hidden">
            <div className="bg-dark-900 rounded-[2.2rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
               
               {/* Subtle ambient light */}
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-900/10 rounded-full blur-[100px] pointer-events-none"></div>

               {/* Text Content */}
               <div className="flex-1 space-y-8 relative z-10 text-left">
                  <div className="inline-flex items-center gap-2 text-gold-400 font-bold text-xs uppercase tracking-widest border-b border-gold-500/20 pb-2">
                     <IconClock className="w-4 h-4" />
                     <span>Tous les jours à 06h00</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                     Ne manquez jamais <br/>
                     <span className="text-gold-300">la prochaine vague.</span>
                  </h2>
                  
                  <p className="text-slate-400 text-lg leading-relaxed">
                     Pendant que vos concurrents dorment, notre IA scanne le web pour dénicher <strong>une opportunité business vérifiée</strong>.
                     <br/><br/>
                     <span className="text-white font-medium">Le Daily Sommet</span> : Un audit technologique de 3 minutes, livré chaque matin.
                  </p>
                  
                  <div className="pt-4">
                      <button onClick={() => openAuth('REGISTER')} className="group flex items-center gap-3 text-white font-bold text-lg hover:text-gold-300 transition-colors">
                         Lire l'édition d'aujourd'hui 
                         <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                  </div>
               </div>

               {/* Newspaper Card (STRAIGHT) */}
               <div className="flex-1 w-full relative flex justify-center md:justify-end">
                  <div className="relative w-full max-w-md bg-[#FDFBF7] text-dark-900 p-10 rounded-xl shadow-2xl border border-slate-200 cursor-pointer transition-transform hover:-translate-y-2 duration-300" onClick={() => openAuth('REGISTER')}>
                      {/* Paper Header */}
                      <div className="border-b-2 border-dark-900/10 pb-6 mb-6 flex justify-between items-end">
                          <div>
                              <span className="block font-display font-black text-4xl tracking-tight text-dark-900 mb-1">Sommet</span>
                              <span className="font-serif italic text-slate-500 text-base">Daily Brief</span>
                          </div>
                          <div className="text-right">
                              <div className="flex items-center justify-end gap-2 text-gold-600 mb-1">
                                  <div className="w-2 h-2 bg-gold-500 rounded-full animate-pulse"></div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
                              </div>
                              <span className="text-xs font-bold text-slate-400">N° 142</span>
                          </div>
                      </div>
                      
                      {/* Paper Body */}
                      <div className="space-y-4">
                          <div className="inline-block bg-dark-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wide">Audit Tech</div>
                          <h3 className="font-display font-bold text-2xl leading-tight text-dark-900">
                              L'IA Agentique : Pourquoi c'est maintenant ou jamais.
                          </h3>
                          <p className="font-news text-slate-600 text-base leading-relaxed line-clamp-3">
                              Une analyse croisée de Google Trends et des derniers dépôts de brevets montre une opportunité massive...
                          </p>
                      </div>

                      {/* Paper Footer */}
                      <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
                          <span className="font-sans text-[10px] font-bold text-slate-400 uppercase">Google Grounding</span>
                          <span className="font-sans text-xs font-bold text-brand-700 flex items-center gap-1">
                              Lire <IconArrowRight className="w-3.5 h-3.5" />
                          </span>
                      </div>
                  </div>
               </div>
            </div>
          </div>
      </section>

      {/* VISUAL DEMO SECTION (Straight & Clean Grid) */}
      <section className="py-12 px-6 max-w-7xl mx-auto space-y-40">
        
        {/* Step 1: Generation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-1">
                <div className="w-14 h-14 bg-dark-800 rounded-2xl flex items-center justify-center border border-dark-700 shadow-lg">
                    <IconBulb className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                    Ne cherchez plus l'idée du siècle. <br/>
                    <span className="text-slate-500">Générez-la.</span>
                </h2>
                <p className="text-slate-400 text-xl leading-relaxed font-light">
                    Entrez simplement vos domaines d'intérêt. Notre IA analyse les tendances pour vous proposer des micro-SaaS réalisables.
                </p>
                <ul className="space-y-4 pt-2">
                    <li className="flex items-center text-slate-300 text-base"><IconCheck className="w-5 h-5 text-brand-500 mr-4" /> 100% adapté à vos compétences</li>
                    <li className="flex items-center text-slate-300 text-base"><IconCheck className="w-5 h-5 text-brand-500 mr-4" /> Niches peu concurrentielles</li>
                </ul>
            </div>
            
            {/* Mock UI Card - Generation */}
            <div className="order-2 relative">
                <div className="bg-dark-800 border border-dark-700 rounded-[2rem] p-8 shadow-2xl relative z-10 hover:border-brand-500/30 transition-colors duration-500">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-2">
                            <span className="px-3 py-1.5 rounded-lg bg-dark-900/50 text-slate-300 text-xs font-bold border border-dark-700 uppercase">Immobilier</span>
                            <span className="px-3 py-1.5 rounded-lg bg-dark-900/50 text-slate-300 text-xs font-bold border border-dark-700 uppercase">SaaS</span>
                        </div>
                        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">Diff: Faible</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Proprio-Zen AI</h3>
                    <p className="text-gold-500 text-sm mb-6 italic font-medium">"Automatisez la gestion locative pour les particuliers."</p>
                    <div className="pl-5 border-l-2 border-dark-600 mb-8">
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Une plateforme qui scanne les documents des locataires, vérifie la solvabilité via OpenBanking et génère les baux automatiquement.
                        </p>
                    </div>
                    <div className="w-full py-4 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-sm hover:bg-brand-500 transition-colors cursor-pointer shadow-lg shadow-brand-900/20">
                        Sauvegarder cette pépite
                    </div>
                </div>
                {/* Underlayer card for depth */}
                <div className="absolute top-6 left-6 w-full h-full bg-dark-900 rounded-[2.5rem] border border-dark-700 -z-10 opacity-60"></div>
            </div>
        </div>

        {/* Step 2: Validation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Mock UI Card - Analysis */}
            <div className="order-2 md:order-1 relative">
                 <div className="bg-dark-800 border border-dark-700 rounded-[2rem] overflow-hidden shadow-2xl relative z-10 hover:border-gold-500/30 transition-colors duration-500">
                    <div className="bg-dark-900/50 p-6 border-b border-dark-700 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <IconMountain className="w-5 h-5 text-gold-500" />
                            <span className="font-bold text-white text-lg">Rapport d'analyse</span>
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Généré à l'instant</div>
                    </div>
                    <div className="p-10 flex flex-col items-center text-center">
                        <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                             <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-dark-900" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                                <path className="text-green-500" strokeDasharray="94, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-4xl font-black text-white tracking-tight">94</span>
                            </div>
                        </div>
                        <div className="text-green-400 text-xs font-bold mb-8 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 uppercase tracking-wide">
                            Potentiel Élevé
                        </div>
                        <div className="w-full grid grid-cols-2 gap-4 text-left">
                            <div className="bg-dark-900 p-4 rounded-xl border border-dark-700">
                                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1.5">Forces</div>
                                <div className="text-sm text-slate-300 font-medium">Marché en demande</div>
                            </div>
                            <div className="bg-dark-900 p-4 rounded-xl border border-dark-700">
                                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1.5">Concurrents</div>
                                <div className="text-sm text-slate-300 font-medium">Faible intensité</div>
                            </div>
                        </div>
                    </div>
                 </div>
                 <div className="absolute top-6 right-6 w-full h-full bg-dark-900 rounded-[2.5rem] border border-dark-700 -z-10 opacity-60"></div>
            </div>

            <div className="space-y-8 order-1 md:order-2">
                <div className="w-14 h-14 bg-dark-800 rounded-2xl flex items-center justify-center border border-dark-700 shadow-lg">
                    <IconChart className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                    Évitez l'échec. <br/>
                    <span className="text-gold-500">Validez avant de coder.</span>
                </h2>
                <p className="text-slate-400 text-xl leading-relaxed font-light">
                    Obtenez un audit impitoyable de votre idée. SWOT, concurrents cachés, barrières à l'entrée. Ne lancez que ce qui peut gagner.
                </p>
                 <ul className="space-y-4 pt-2">
                    <li className="flex items-center text-slate-300 text-base"><IconCheck className="w-5 h-5 text-gold-500 mr-4" /> Score de viabilité sur 100</li>
                    <li className="flex items-center text-slate-300 text-base"><IconCheck className="w-5 h-5 text-gold-500 mr-4" /> Analyse des menaces</li>
                </ul>
            </div>
        </div>

         {/* Step 3: Strategy (Blueprint) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-1">
                <div className="w-14 h-14 bg-dark-800 rounded-2xl flex items-center justify-center border border-dark-700 shadow-lg">
                    <IconBlueprint className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                    Passez à l'action. <br/>
                    <span className="text-brand-500">Plan d'attaque inclus.</span>
                </h2>
                <p className="text-slate-400 text-xl leading-relaxed font-light">
                    Ne restez pas bloqué au stade de l'idée. Sommet génère votre stratégie technique et votre roadmap sur mesure.
                </p>
                 <ul className="space-y-4 pt-2">
                    <li className="flex items-center text-slate-300 text-base"><IconCheck className="w-5 h-5 text-brand-500 mr-4" /> Stack Technique (Outils)</li>
                    <li className="flex items-center text-slate-300 text-base"><IconCheck className="w-5 h-5 text-brand-500 mr-4" /> Roadmap sur 4 semaines</li>
                </ul>
            </div>
            
            {/* Mock UI Card - Blueprint */}
            <div className="order-2 relative">
                <div className="bg-dark-800 border border-dark-700 rounded-[2rem] p-8 shadow-2xl relative z-10 hover:border-brand-500/30 transition-colors duration-500">
                     <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 bg-dark-900 rounded-lg flex items-center justify-center border border-dark-600">
                            <IconList className="w-5 h-5 text-brand-500" /> 
                        </div>
                        Roadmap MVP
                     </h3>
                     
                     <div className="space-y-8 relative border-l-2 border-dark-600 ml-5 py-2">
                        <div className="relative pl-8">
                             <div className="absolute -left-[1px] -translate-x-1/2 top-1.5 w-4 h-4 rounded-full bg-dark-900 border-2 border-brand-500 z-10"></div>
                             <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest bg-brand-900/20 px-2 py-1 rounded border border-brand-500/20 mb-2 inline-block">Semaine 1</span>
                             <p className="text-white font-bold text-lg mb-1">Fondations & Design</p>
                             <p className="text-sm text-slate-400">Landing page, Maquettes Figma, Setup Next.js.</p>
                        </div>
                        
                        <div className="relative opacity-60 pl-8">
                             <div className="absolute -left-[1px] -translate-x-1/2 top-1.5 w-4 h-4 rounded-full bg-dark-900 border-2 border-dark-500 z-10"></div>
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-dark-900 px-2 py-1 rounded border border-dark-700 mb-2 inline-block">Semaine 2</span>
                             <p className="text-white font-bold text-lg mb-1">Développement Core</p>
                             <p className="text-sm text-slate-400">Base de données, Auth, Feature principale.</p>
                        </div>
                     </div>
                </div>
                <div className="absolute top-6 left-6 w-full h-full bg-dark-900 rounded-[2.5rem] border border-dark-700 -z-10 opacity-60"></div>
            </div>
        </div>

        {/* Step 4: Execution (Le Chantier) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Mock UI Card - Execution */}
            <div className="order-2 md:order-1 relative">
                 <div className="bg-dark-800 border border-dark-700 rounded-[2rem] p-8 shadow-2xl relative z-10 hover:border-gold-500/30 transition-colors duration-500">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                           <div className="w-10 h-10 bg-dark-900 rounded-lg flex items-center justify-center border border-dark-600">
                                <IconConstruction className="w-5 h-5 text-gold-500" />
                           </div>
                           Le Chantier
                        </h3>
                        <span className="text-[10px] bg-green-500/10 text-green-400 px-3 py-1 rounded-lg font-bold border border-green-500/20 uppercase tracking-wide">
                            Actif
                        </span>
                    </div>

                    {/* Kanban Card */}
                    <div className="bg-dark-900 p-5 rounded-2xl border border-dark-600 mb-6 shadow-lg">
                        <div className="flex justify-between mb-3">
                            <span className="text-[10px] font-bold uppercase bg-brand-900/20 text-brand-400 px-2 py-1 rounded border border-brand-500/20">Semaine 1</span>
                        </div>
                        <p className="text-slate-200 text-sm font-medium mb-4">Configurer l'authentification Supabase</p>
                        <div className="w-full py-2 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-500 text-xs font-bold flex items-center justify-center gap-2">
                            <IconSherpa className="w-3.5 h-3.5" /> SOS Sherpa
                        </div>
                    </div>

                    {/* Sherpa Overlay */}
                    <div className="relative bg-dark-950 border border-gold-500/30 p-5 rounded-2xl shadow-2xl">
                         <div className="flex items-center gap-3 mb-3 border-b border-dark-800 pb-3">
                             <div className="w-8 h-8 bg-gold-500/10 rounded-lg flex items-center justify-center border border-gold-500/20">
                                 <IconSherpa className="w-4 h-4 text-gold-500" />
                             </div>
                             <span className="text-sm font-bold text-white">Le Sherpa</span>
                         </div>
                         <div className="bg-dark-900 p-3 rounded-xl border border-dark-800 font-mono text-[10px] text-green-400 mb-3 leading-relaxed">
                             supabase.auth.signUp(&#123;<br/>&nbsp;&nbsp;email: 'user@example.com',<br/>&nbsp;&nbsp;password: 'secret'<br/>&#125;)
                         </div>
                         <button className="w-full py-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 text-slate-300 text-[10px] font-bold rounded-lg flex items-center justify-center gap-2 transition-colors">
                               <IconCodeBlockCopy className="w-3 h-3" /> Copier le code
                         </button>
                    </div>
                 </div>
                 <div className="absolute top-6 right-6 w-full h-full bg-dark-900 rounded-[2.5rem] border border-dark-700 -z-10 opacity-60"></div>
            </div>

            <div className="space-y-8 order-1 md:order-2">
                <div className="w-14 h-14 bg-dark-800 rounded-2xl flex items-center justify-center border border-dark-700 shadow-lg">
                    <IconConstruction className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                    Construisez avec un <br/>
                    <span className="text-gold-500">CTO dans la poche.</span>
                </h2>
                <p className="text-slate-400 text-xl leading-relaxed font-light">
                    Fini le syndrome de la page blanche technique. Le Chantier transforme votre plan en tâches concrètes. Bloqué ? Le Sherpa vous donne la solution.
                </p>
                 <ul className="space-y-4 pt-2">
                    <li className="flex items-center text-slate-300 text-base"><IconCheck className="w-5 h-5 text-gold-500 mr-4" /> Kanban généré automatiquement</li>
                    <li className="flex items-center text-slate-300 text-base"><IconCheck className="w-5 h-5 text-gold-500 mr-4" /> Assistant de code IA intégré</li>
                </ul>
            </div>
        </div>

      </section>

                      {/* PRICING SECTION */}
<section className="py-32 px-6 max-w-7xl mx-auto" id="pricing">
  <div className="text-center mb-20">
    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
      Des tarifs adaptés à votre ambition
    </h2>
    <p className="text-slate-400 text-xl max-w-2xl mx-auto font-light">
      Commencez petit ou visez le sommet. Changez de plan à tout moment.
    </p>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto text-left items-stretch">
    {/* OPTION 0: FREE (Camp de Base) */}
    <div className="bg-dark-800/30 border border-dark-700 rounded-[2rem] p-8 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 bg-dark-800 rounded-2xl flex items-center justify-center border border-dark-700 shadow-lg">
          <IconMountain className="w-7 h-7 text-slate-400" />
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-dark-900/60 text-slate-400 border border-dark-600">
          Découverte
        </span>
      </div>

      {/* Titre + prix */}
      <h3 className="text-2xl font-bold text-white mb-2">Camp de Base</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-5xl font-black text-white">0€</span>
        <span className="text-slate-500 font-medium text-lg">/ vie</span>
      </div>

      {/* Contenu principal (prend l’espace dispo) */}
      <div className="flex-1 flex flex-col">
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Pour découvrir la puissance de l&apos;IA Sommet sans engagement ni
          carte bancaire.
        </p>

        <ul className="space-y-4 mb-8">
          <li className="flex items-start text-slate-300 text-sm">
            <IconCheck className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" />
            <span>
              <strong>3 Crédits</strong> de Génération
            </span>
          </li>
          <li className="flex items-start text-slate-300 text-sm">
            <IconCheck className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" />
            <span>
              <strong>1 Analyse</strong> simplifiée
            </span>
          </li>
          <li className="flex items-start text-slate-600 text-sm opacity-60">
            <IconX className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>Pas de Blueprint MVP</span>
          </li>
          <li className="flex items-start text-slate-600 text-sm opacity-60">
            <IconX className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>Pas d&apos;export PDF</span>
          </li>
          <li className="flex items-start text-slate-600 text-sm opacity-60">
            <IconX className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>Pas d&apos;accès au Chantier</span>
          </li>
        </ul>
      </div>

      {/* Footer (bouton aligné en bas) */}
      <div>
        <button
          onClick={() => openAuth('REGISTER')}
          className="w-full py-4 bg-dark-800 hover:bg-dark-700 text-white rounded-xl font-bold transition-colors border border-dark-700"
        >
          Commencer gratuitement
        </button>
      </div>
    </div>

    {/* OPTION 1: CREDITS (Explorateur) */}
    <div className="bg-gradient-to-b from-dark-800/80 via-dark-900 to-dark-900 border border-brand-900/50 rounded-[2rem] p-8 flex flex-col h-full shadow-xl shadow-brand-900/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 bg-brand-900/20 rounded-2xl flex items-center justify-center border border-brand-500/20 shadow-lg shadow-brand-900/20">
          <IconDiamond className="w-7 h-7 text-brand-400" />
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-brand-500/10 text-brand-300 border border-brand-500/30">
          Populaire
        </span>
      </div>

      {/* Titre + prix */}
      <h3 className="text-2xl font-bold text-white mb-2">L&apos;Explorateur</h3>
      <div className="flex items-baseline gap-1 mb-4">
        {/* Prix en bleu */}
        <span className="text-5xl font-black text-brand-400">4,99€</span>
        <span className="text-slate-500 font-medium text-lg">/ pack</span>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Idéal pour valider une idée précise, tester son potentiel et obtenir
          un plan d&apos;action exploitable.
        </p>

        <ul className="space-y-4 mb-8">
          <li className="flex items-start text-slate-300 text-sm">
            <IconCheck className="w-5 h-5 text-brand-500 mr-3 flex-shrink-0" />
            <span>
              <strong>20 Crédits</strong> de Génération
            </span>
          </li>
          <li className="flex items-start text-slate-300 text-sm">
            <IconCheck className="w-5 h-5 text-brand-500 mr-3 flex-shrink-0" />
            <span>
              <strong>1 Analyse de Marché</strong> complète
            </span>
          </li>
          <li className="flex items-start text-slate-300 text-sm">
            <IconCheck className="w-5 h-5 text-brand-500 mr-3 flex-shrink-0" />
            <span>
              <strong>1 Blueprint MVP</strong> détaillé
            </span>
          </li>
          <li className="flex items-start text-slate-300 text-sm">
            <IconCheck className="w-5 h-5 text-brand-500 mr-3 flex-shrink-0" />
            <span>Export PDF complet du projet</span>
          </li>
          <li className="flex items-start text-slate-600 text-sm opacity-60">
            <IconX className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>Pas d&apos;accès au Chantier (Kanban)</span>
          </li>
          <li className="flex items-start text-slate-600 text-sm opacity-60">
            <IconX className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>Pas d&apos;assistant Sherpa</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div>
        <button
          onClick={() => startCheckout('price_1SXR8gF1yiAtAmIj0NQNnVmH')}
          className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-brand-900/30 hover:-translate-y-1"
        >
          Acheter le pack
        </button>
      </div>
    </div>

    {/* OPTION 2: SUBSCRIPTION (Bâtisseur) */}
    <div className="bg-gradient-to-b from-[#1E1A10] via-dark-900 to-dark-900 border border-gold-500/30 rounded-[2rem] p-8 flex flex-col h-full shadow-2xl shadow-gold-500/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 bg-gold-500/10 rounded-2xl flex items-center justify-center border border-gold-500/20 shadow-lg shadow-gold-900/20">
          <IconRocket className="w-7 h-7 text-gold-500" />
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-gold-500/15 text-gold-200 border border-gold-500/40">
          Recommandé par les fondateurs
        </span>
      </div>

      {/* Titre + prix */}
      <h3 className="text-2xl font-bold text-white mb-2">Le Bâtisseur</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-5xl font-black text-gold-400">12,99€</span>
        <span className="text-slate-500 font-medium text-lg">/ mois</span>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        <p className="text-gold-100/80 text-sm mb-6 leading-relaxed">
          Pour celles et ceux qui passent à l&apos;action. Gérez vos idées,
          vos analyses et votre exécution au même endroit.
        </p>

        <ul className="space-y-4 mb-8">
          <li className="flex items-start text-slate-300 text-sm">
            <IconCheck className="w-5 h-5 text-gold-500 mr-3 flex-shrink-0" />
            <span>Générations &amp; analyses ILLIMITÉES</span>
          </li>
          <li className="flex items-start text-slate-300 text-sm">
            <IconCheck className="w-5 h-5 text-gold-500 mr-3 flex-shrink-0" />
            <span>
              <strong>Accès complet au Chantier</strong> (Kanban)
            </span>
          </li>
          <li className="flex items-start text-slate-300 text-sm">
            <IconCheck className="w-5 h-5 text-gold-500 mr-3 flex-shrink-0" />
            <span>
              <strong>Assistant Sherpa</strong> (aide au code)
            </span>
          </li>
          <li className="flex items-start text-slate-300 text-sm">
            <IconCheck className="w-5 h-5 text-gold-500 mr-3 flex-shrink-0" />
            <span>Blueprints &amp; exports PDF illimités</span>
          </li>
          <li className="flex items-start text-slate-300 text-sm">
            <IconCheck className="w-5 h-5 text-gold-500 mr-3 flex-shrink-0" />
            <span>Support prioritaire 24/7</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div>
        <button
          onClick={() => startCheckout('price_1SXR94F1yiAtAmIjmLg0JIkT')}
          className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-gold-500/20 hover:-translate-y-1"
        >
          S&apos;abonner maintenant
        </button>
        <p className="text-[10px] text-slate-500 mt-3 text-center font-medium">
          Annulable à tout moment en un clic.
        </p>
      </div>
    </div>
  </div>
</section>
      
               {/* FAQ SECTION */}
      <section id="faq" className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
            Questions fréquentes
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-light">
            Tout ce qu&apos;il faut savoir avant de lancer votre projet avec Sommet.
          </p>
        </div>

        {/* Accordéon */}
        <div className="space-y-4">
          {/* Item 1 */}
          <details className="group bg-dark-900 border border-dark-700 rounded-2xl">
            <summary className="flex items-center justify-between w-full px-5 py-4 cursor-pointer list-none">
              <span className="text-sm md:text-base font-semibold text-white text-left pr-4">
                Sommet, c&apos;est quoi exactement ?
              </span>
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-dark-800 border border-dark-700 text-slate-400 group-open:bg-gold-500/10 group-open:text-gold-400 group-open:border-gold-500/40 transition-colors">
                <IconPlus className="w-4 h-4 group-open:hidden" />
                <IconX className="w-4 h-4 hidden group-open:block" />
              </span>
            </summary>
            <div className="px-5 pb-5 pt-0 text-sm md:text-base text-slate-400 leading-relaxed border-t border-dark-800">
              Sommet est une plateforme IA pensée pour les fondateurs qui veulent passer de l&apos;idée
              au micro-SaaS lancé. Le Générateur trouve des concepts alignés à vos compétences, 
              le Valideur évalue le potentiel marché, le Blueprint prépare votre plan d&apos;attaque
              et le Chantier vous aide à exécuter, étape par étape.
            </div>
          </details>

          {/* Item 2 */}
          <details className="group bg-dark-900 border border-dark-700 rounded-2xl">
            <summary className="flex items-center justify-between w-full px-5 py-4 cursor-pointer list-none">
              <span className="text-sm md:text-base font-semibold text-white text-left pr-4">
                En quoi Sommet est différent d&apos;un simple ChatGPT ou d&apos;un outil no-code ?
              </span>
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-dark-800 border border-dark-700 text-slate-400 group-open:bg-gold-500/10 group-open:text-gold-400 group-open:border-gold-500/40 transition-colors">
                <IconPlus className="w-4 h-4 group-open:hidden" />
                <IconX className="w-4 h-4 hidden group-open:block" />
              </span>
            </summary>
            <div className="px-5 pb-5 pt-0 text-sm md:text-base text-slate-400 leading-relaxed border-t border-dark-800">
              Sommet ne se contente pas de “répondre à des prompts”. La plateforme est structurée 
              autour d&apos;un parcours fondateur complet : génération d&apos;idées actionnables, 
              analyse de marché, plan technique, tâches à exécuter et snippets de code prêts à l&apos;emploi. 
              Vous n&apos;avez pas à deviner quoi demander à l&apos;IA : le workflow est guidé de A à Z.
            </div>
          </details>

          {/* Item 3 */}
          <details className="group bg-dark-900 border border-dark-700 rounded-2xl">
            <summary className="flex items-center justify-between w-full px-5 py-4 cursor-pointer list-none">
              <span className="text-sm md:text-base font-semibold text-white text-left pr-4">
                Est-ce adapté si je ne suis pas développeur ?
              </span>
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-dark-800 border border-dark-700 text-slate-400 group-open:bg-gold-500/10 group-open:text-gold-400 group-open:border-gold-500/40 transition-colors">
                <IconPlus className="w-4 h-4 group-open:hidden" />
                <IconX className="w-4 h-4 hidden group-open:block" />
              </span>
            </summary>
            <div className="px-5 pb-5 pt-0 text-sm md:text-base text-slate-400 leading-relaxed border-t border-dark-800">
              Oui. Sommet est conçu pour les fondateurs non-tech : les tâches sont expliquées 
              clairement, le Sherpa vous propose du code à copier-coller, et chaque étape est 
              contextualisée (&quot;pourquoi on fait ça&quot;, &quot;ce que ça débloque ensuite&quot;). 
              Vous pouvez démarrer avec un niveau technique très bas et apprendre en avançant.
            </div>
          </details>

          {/* Item 4 */}
          <details className="group bg-dark-900 border border-dark-700 rounded-2xl">
            <summary className="flex items-center justify-between w-full px-5 py-4 cursor-pointer list-none">
              <span className="text-sm md:text-base font-semibold text-white text-left pr-4">
                Combien de temps faut-il pour passer d&apos;une idée à un premier MVP ?
              </span>
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-dark-800 border border-dark-700 text-slate-400 group-open:bg-gold-500/10 group-open:text-gold-400 group-open:border-gold-500/40 transition-colors">
                <IconPlus className="w-4 h-4 group-open:hidden" />
                <IconX className="w-4 h-4 hidden group-open:block" />
              </span>
            </summary>
            <div className="px-5 pb-5 pt-0 text-sm md:text-base text-slate-400 leading-relaxed border-t border-dark-800">
              La plupart des projets peuvent atteindre un MVP testable en quelques semaines si 
              vous suivez la roadmap générée par le Blueprint et le Chantier. Sommet ne promet 
              pas de tout faire à votre place, mais il réduit drastiquement le temps passé à 
              chercher quoi faire, dans quel ordre et avec quels outils.
            </div>
          </details>

          {/* Item 5 */}
          <details className="group bg-dark-900 border border-dark-700 rounded-2xl">
            <summary className="flex items-center justify-between w-full px-5 py-4 cursor-pointer list-none">
              <span className="text-sm md:text-base font-semibold text-white text-left pr-4">
                Comment fonctionnent les crédits et les différentes offres ?
              </span>
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-dark-800 border border-dark-700 text-slate-400 group-open:bg-gold-500/10 group-open:text-gold-400 group-open:border-gold-500/40 transition-colors">
                <IconPlus className="w-4 h-4 group-open:hidden" />
                <IconX className="w-4 h-4 hidden group-open:block" />
              </span>
            </summary>
            <div className="px-5 pb-5 pt-0 text-sm md:text-base text-slate-400 leading-relaxed border-t border-dark-800">
              Le Camp de Base vous permet de découvrir Sommet gratuitement avec quelques crédits 
              de génération et une analyse simplifiée. L&apos;Explorateur ajoute une analyse de marché 
              complète et un Blueprint pour un projet précis. Le Bâtisseur s&apos;adresse aux fondateurs 
              engagés : générations et analyses illimitées, accès complet au Chantier et au Sherpa.
            </div>
          </details>

          {/* Item 6 */}
          <details className="group bg-dark-900 border border-dark-700 rounded-2xl">
            <summary className="flex items-center justify-between w-full px-5 py-4 cursor-pointer list-none">
              <span className="text-sm md:text-base font-semibold text-white text-left pr-4">
                Puis-je annuler mon abonnement à tout moment ?
              </span>
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-dark-800 border border-dark-700 text-slate-400 group-open:bg-gold-500/10 group-open:text-gold-400 group-open:border-gold-500/40 transition-colors">
                <IconPlus className="w-4 h-4 group-open:hidden" />
                <IconX className="w-4 h-4 hidden group-open:block" />
              </span>
            </summary>
            <div className="px-5 pb-5 pt-0 text-sm md:text-base text-slate-400 leading-relaxed border-t border-dark-800">
              Oui. Le plan Bâtisseur est sans engagement : vous pouvez arrêter à tout moment 
              directement depuis votre espace. Vous gardez l&apos;accès à vos projets, à vos idées 
              enregistrées et à vos Blueprints déjà générés.
            </div>
          </details>

          {/* Item 7 */}
          <details className="group bg-dark-900 border border-dark-700 rounded-2xl">
            <summary className="flex items-center justify-between w-full px-5 py-4 cursor-pointer list-none">
              <span className="text-sm md:text-base font-semibold text-white text-left pr-4">
                Que se passe-t-il concrètement après mon inscription ?
              </span>
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-dark-800 border border-dark-700 text-slate-400 group-open:bg-gold-500/10 group-open:text-gold-400 group-open:border-gold-500/40 transition-colors">
                <IconPlus className="w-4 h-4 group-open:hidden" />
                <IconX className="w-4 h-4 hidden group-open:block" />
              </span>
            </summary>
            <div className="px-5 pb-5 pt-0 text-sm md:text-base text-slate-400 leading-relaxed border-t border-dark-800">
              Vous accédez immédiatement à votre espace Sommet : vous pouvez générer vos premières 
              idées, en sauvegarder dans votre coffre, lancer une analyse de marché puis demander 
              un Blueprint MVP. En quelques minutes, vous avez une vision claire de quoi lancer, 
              pour qui et comment le construire étape par étape.
            </div>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-600 text-sm border-t border-dark-800 bg-dark-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div className="w-6 h-6 bg-dark-800 rounded-lg flex items-center justify-center">
                    <IconMountain className="w-3 h-3 text-slate-400" />
                </div>
                <span className="font-bold text-slate-500">Sommet.tech</span>
            </div>
            <p>© 2025 Sommet.tech - Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
