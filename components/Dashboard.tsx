
import React from 'react';
import { SavedIdea, AppView } from '../types';
import { generateProjectReport } from '../services/pdfService';
import { IconTrash, IconChart, IconMountain, IconArrowRight, IconTrophy, IconSparkles, IconTools, IconDownload, IconLock, IconBlueprint } from './Icons';

interface DashboardProps {
  savedIdeas: SavedIdea[];
  onDelete: (id: string) => void;
  onAnalyze: (idea: SavedIdea) => void;
  onNavigate: (view: AppView, idea?: SavedIdea) => void;
  isGuestMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ savedIdeas, onDelete, onAnalyze, onNavigate, isGuestMode = false }) => {
  // Calculate stats
  const totalIdeas = savedIdeas.length;
  const analyzedIdeas = savedIdeas.filter(i => i.analysis);
  const averageScore = analyzedIdeas.length > 0 
    ? Math.round(analyzedIdeas.reduce((acc, curr) => acc + (curr.analysis?.score || 0), 0) / analyzedIdeas.length) 
    : 0;
  const topIdea = analyzedIdeas.length > 0 
    ? analyzedIdeas.reduce((prev, current) => (prev.analysis!.score > current.analysis!.score) ? prev : current)
    : null;

  if (savedIdeas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in relative">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="w-24 h-24 bg-dark-800 rounded-3xl flex items-center justify-center mb-8 border border-dark-700 shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500">
          <IconMountain className="w-12 h-12 text-slate-600" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
          Votre coffre est vide
        </h2>
        <p className="text-slate-400 max-w-md mb-10 text-lg leading-relaxed">
          Le sommet ne va pas se gravir tout seul. Commencez par générer votre première idée de licorne.
        </p>
        <button
          onClick={() => onNavigate(AppView.GENERATOR)}
          className="group px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-brand-900/50 flex items-center hover:-translate-y-1"
        >
          <IconSparkles className="w-5 h-5 mr-2" />
          Dénicher une idée
          <IconArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20 max-w-7xl mx-auto">
      {/* Header Stats */}
      <div className="flex flex-col xl:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <h1 className="text-4xl font-black text-white tracking-tight">Tableau de Bord</h1>
             {isGuestMode && (
                 <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-500 text-xs font-bold uppercase tracking-wide animate-pulse">
                     Mode Démo
                 </span>
             )}
          </div>
          <p className="text-slate-400 text-lg">Gérez votre portefeuille de projets et suivez leur potentiel.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full xl:w-auto">
            <div className="bg-dark-800 border border-dark-700 p-4 rounded-2xl shadow-lg flex flex-col justify-center">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Projets</div>
                <div className="text-3xl font-black text-white">{totalIdeas}</div>
            </div>
            <div className="bg-dark-800 border border-dark-700 p-4 rounded-2xl shadow-lg flex flex-col justify-center">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Score Moyen</div>
                <div className={`text-3xl font-black ${averageScore > 0 ? 'text-brand-400' : 'text-slate-600'}`}>
                    {averageScore > 0 ? averageScore : '-'}
                </div>
            </div>
            <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-gold-900/20 to-dark-800 border border-gold-500/20 p-4 rounded-2xl shadow-lg flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold-500/10 blur-xl -mr-6 -mt-6 group-hover:bg-gold-500/20 transition-all"></div>
                <div className="text-xs font-bold text-gold-500 uppercase tracking-wider mb-1 flex items-center">
                    <IconTrophy className="w-3 h-3 mr-1" /> Top Potentiel
                </div>
                <div className="text-3xl font-black text-gold-400 truncate">
                    {topIdea?.analysis ? topIdea.analysis.score : '-'}
                </div>
            </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {savedIdeas.map((idea) => (
          <div key={idea.id} className="group relative bg-dark-800 border border-dark-700 rounded-[2rem] p-1 shadow-2xl hover:border-brand-500/30 transition-all duration-500 hover:-translate-y-1 flex flex-col h-full">
            
            {/* Card Content Container */}
            <div className="bg-dark-800 rounded-[1.9rem] p-6 h-full flex flex-col relative overflow-hidden">
                {/* Ambient gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Header: Tags & Delete */}
                <div className="flex justify-between items-start mb-5 relative z-10">
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-lg bg-dark-900/50 text-slate-300 text-xs font-medium border border-dark-700">
                            {idea.category}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border bg-opacity-10 ${
                            idea.difficulty === 'Faible' ? 'bg-green-500 text-green-400 border-green-500/20' :
                            idea.difficulty === 'Moyenne' ? 'bg-yellow-500 text-yellow-400 border-yellow-500/20' :
                            'bg-red-500 text-red-400 border-red-500/20'
                        }`}>
                            {idea.difficulty}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {idea.blueprint && (
                            <button
                                onClick={(e) => { e.stopPropagation(); generateProjectReport(idea); }}
                                className="text-slate-600 hover:text-gold-400 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="Télécharger le PDF"
                            >
                                <IconDownload className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(idea.id); }}
                            className={`text-slate-600 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${isGuestMode ? 'cursor-not-allowed opacity-50 hover:text-slate-600' : 'hover:text-red-400 hover:bg-red-400/10'}`}
                            title={isGuestMode ? "Suppression désactivée en démo" : "Supprimer ce projet"}
                        >
                            {isGuestMode ? <IconLock className="w-4 h-4" /> : <IconTrash className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                
                {/* Body */}
                <div className="relative z-10 flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-brand-100 transition-colors">
                        {idea.title}
                    </h3>
                    <p className="text-sm text-gold-500 font-medium italic mb-5">
                        "{idea.tagline}"
                    </p>
                    <div className="pl-4 border-l-2 border-dark-600 mb-6 group-hover:border-brand-500/30 transition-colors">
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {idea.description}
                        </p>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="relative z-10 mt-auto pt-5 border-t border-dark-700/50">
                    {/* Analysis Status */}
                    <div className="flex items-center justify-between mb-4">
                        {idea.analysis ? (
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                     idea.analysis.score >= 80 ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 
                                     idea.analysis.score >= 60 ? 'bg-gold-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]' : 
                                     'bg-red-500'
                                }`}></span>
                                <span className="text-xs font-bold text-white">Score: {idea.analysis.score}</span>
                            </div>
                        ) : (
                             <button onClick={() => onAnalyze(idea)} className="text-xs font-bold text-brand-400 hover:underline">
                                Analyser maintenant
                             </button>
                        )}
                        
                        {idea.blueprint ? (
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center">
                                <IconBlueprint className="w-3 h-3 mr-1" /> Plan prêt
                            </span>
                        ) : null}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => onAnalyze(idea)}
                            className="px-3 py-2.5 bg-dark-700 hover:bg-dark-600 text-slate-200 text-xs font-bold rounded-xl transition-colors border border-dark-600 hover:border-slate-500 flex items-center justify-center gap-2"
                        >
                            <IconChart className="w-3.5 h-3.5" /> Validateur
                        </button>
                        <button 
                            onClick={() => onNavigate(AppView.BLUEPRINT, idea)}
                            className="px-3 py-2.5 bg-gradient-to-r from-brand-600/20 to-brand-500/20 hover:from-brand-600/30 hover:to-brand-500/30 text-brand-300 text-xs font-bold rounded-xl transition-colors border border-brand-500/20 flex items-center justify-center gap-2 group/btn"
                        >
                            <IconBlueprint className="w-3.5 h-3.5 group-hover/btn:text-white transition-colors" /> 
                            <span className="group-hover/btn:text-white transition-colors">Plan MVP</span>
                        </button>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
