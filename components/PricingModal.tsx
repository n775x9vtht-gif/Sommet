
import React from 'react';
import { IconX, IconDiamond, IconCheck, IconRocket, IconMountain } from './Icons';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark-950/90 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl bg-dark-900 border border-dark-700 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Decorative Header */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-slate-600 via-brand-500 to-gold-500"></div>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-2 z-10"
        >
          <IconX className="w-6 h-6" />
        </button>

        <div className="p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
            Choisissez votre équipement
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12">
            Commencez petit ou visez le sommet. Changez de plan à tout moment.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            
            {/* OPTION 0: FREE (Camp de Base) */}
            <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6 flex flex-col relative hover:border-dark-500 transition-all group">
              <div className="w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center mb-4 border border-dark-600">
                <IconMountain className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Camp de Base</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black text-white">0€</span>
                <span className="text-slate-500 font-medium text-sm">/ vie</span>
              </div>
              <p className="text-slate-500 text-xs mb-6 min-h-[32px]">
                Pour découvrir la puissance de l'IA Sommet sans engagement.
              </p>
              
              <ul className="space-y-3 flex-1 mb-8">
                <li className="flex items-start text-slate-300 text-xs">
                  <IconCheck className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />
                  <span><strong>3 Crédits</strong> de Génération</span>
                </li>
                <li className="flex items-start text-slate-300 text-xs">
                  <IconCheck className="w-4 h-4 text-slate-500 mr-2 flex-shrink-0" />
                  <span><strong>1 Analyse</strong> (Simplifiée)</span>
                </li>
                <li className="flex items-start text-slate-600 text-xs opacity-60">
                  <IconX className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Pas de Blueprint MVP</span>
                </li>
                <li className="flex items-start text-slate-600 text-xs opacity-60">
                  <IconX className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Pas d'export PDF</span>
                </li>
                <li className="flex items-start text-slate-600 text-xs opacity-60">
                  <IconX className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Pas d'accès au Chantier</span>
                </li>
              </ul>

              <button className="w-full py-2.5 bg-dark-700 hover:bg-dark-600 text-white rounded-lg font-bold text-sm transition-colors border border-dark-600">
                Commencer Gratuitement
              </button>
            </div>

            {/* OPTION 1: CREDITS (Explorer) */}
            <div className="bg-dark-800 border border-brand-900/50 rounded-2xl p-6 flex flex-col relative hover:border-brand-500/50 transition-all group shadow-lg shadow-brand-900/10">
              <div className="absolute top-0 right-0 bg-brand-900/30 text-brand-400 px-3 py-1 rounded-bl-xl rounded-tr-xl text-[10px] font-bold uppercase tracking-wide border-b border-l border-brand-500/20">
                Populaire
              </div>
              <div className="w-12 h-12 bg-brand-900/20 rounded-xl flex items-center justify-center mb-4 border border-brand-500/20">
                <IconDiamond className="w-6 h-6 text-brand-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">L'Explorateur</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black text-white">4,99€</span>
                <span className="text-slate-500 font-medium text-sm">/ pack</span>
              </div>
              <p className="text-slate-400 text-xs mb-6 min-h-[32px]">
                Idéal pour valider une idée précise et obtenir son plan d'action complet.
              </p>
              
              <ul className="space-y-3 flex-1 mb-8">
                <li className="flex items-start text-slate-300 text-xs">
                  <IconCheck className="w-4 h-4 text-brand-500 mr-2 flex-shrink-0" />
                  <span><strong>50 Crédits</strong> de Génération</span>
                </li>
                <li className="flex items-start text-slate-300 text-xs">
                  <IconCheck className="w-4 h-4 text-brand-500 mr-2 flex-shrink-0" />
                  <span><strong>1 Analyse de Marché</strong> complète</span>
                </li>
                <li className="flex items-start text-slate-300 text-xs">
                  <IconCheck className="w-4 h-4 text-brand-500 mr-2 flex-shrink-0" />
                  <span><strong>1 Blueprint MVP</strong> (Plan d'action)</span>
                </li>
                <li className="flex items-start text-slate-300 text-xs">
                  <IconCheck className="w-4 h-4 text-brand-500 mr-2 flex-shrink-0" />
                  <span>Export PDF complet du projet</span>
                </li>
                <li className="flex items-start text-slate-600 text-xs opacity-60">
                  <IconX className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Pas d'accès au Chantier (Kanban)</span>
                </li>
                <li className="flex items-start text-slate-600 text-xs opacity-60">
                  <IconX className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Pas d'assistant Sherpa</span>
                </li>
              </ul>

              <button className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold text-sm transition-colors shadow-lg shadow-brand-900/30">
                Acheter le Pack
              </button>
            </div>

            {/* OPTION 2: SUBSCRIPTION (Builder) */}
            <div className="bg-gradient-to-b from-dark-800 to-dark-900 border border-gold-500/30 rounded-2xl p-6 flex flex-col relative transform lg:scale-105 shadow-2xl shadow-gold-500/10 z-10">
              <div className="absolute top-0 right-0 left-0 bg-gold-500 text-dark-900 py-1 text-center text-[10px] font-bold uppercase tracking-wide">
                Recommandé par les fondateurs
              </div>
              <div className="mt-4 w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center mb-4 border border-gold-500/20">
                <IconRocket className="w-6 h-6 text-gold-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Le Bâtisseur</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black text-gold-400">12,99€</span>
                <span className="text-slate-500 font-medium text-sm">/ mois</span>
              </div>
              <p className="text-gold-100/80 text-xs mb-6 min-h-[32px]">
                Pour ceux qui passent à l'action. Construisez avec une IA illimitée.
              </p>
              
              <ul className="space-y-3 flex-1 mb-8">
                <li className="flex items-start text-slate-300 text-xs">
                  <IconCheck className="w-4 h-4 text-gold-500 mr-2 flex-shrink-0" />
                  <span><strong>Génération & Analyses ILLIMITÉES</strong></span>
                </li>
                <li className="flex items-start text-slate-300 text-xs">
                  <IconCheck className="w-4 h-4 text-gold-500 mr-2 flex-shrink-0" />
                  <span><strong>Accès complet au Chantier</strong> (Kanban)</span>
                </li>
                <li className="flex items-start text-slate-300 text-xs">
                  <IconCheck className="w-4 h-4 text-gold-500 mr-2 flex-shrink-0" />
                  <span><strong>Assistant Sherpa</strong> (Aide au code)</span>
                </li>
                <li className="flex items-start text-slate-300 text-xs">
                  <IconCheck className="w-4 h-4 text-gold-500 mr-2 flex-shrink-0" />
                  <span>Blueprints & Exports PDF illimités</span>
                </li>
                <li className="flex items-start text-slate-300 text-xs">
                  <IconCheck className="w-4 h-4 text-gold-500 mr-2 flex-shrink-0" />
                  <span>Support Prioritaire 24/7</span>
                </li>
              </ul>

              <button className="w-full py-2.5 bg-gold-500 hover:bg-gold-400 text-dark-900 rounded-lg font-bold text-sm transition-all shadow-lg shadow-gold-500/20 hover:-translate-y-0.5">
                S'abonner maintenant
              </button>
              <p className="text-[10px] text-slate-500 mt-2 text-center">Annulable à tout moment.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
