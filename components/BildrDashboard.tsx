import React from 'react';
import { SavedIdea, AppView } from '../types';
import {
  IconTrash,
  IconChart,
  IconArrowRight,
  IconCheckCircle,
  IconIdea,
  IconKanban,
  IconWrench,
  IconSparkle,
  IconAnalytics,
  IconTarget
} from './Icons';

interface BildrDashboardProps {
  savedIdeas: SavedIdea[];
  onDelete: (id: string) => void;
  onAnalyze: (idea: SavedIdea) => void;
  onNavigate: (view: AppView, idea?: SavedIdea) => void;
  isGuestMode?: boolean;
}

const BildrDashboard: React.FC<BildrDashboardProps> = ({
  savedIdeas,
  onDelete,
  onAnalyze,
  onNavigate,
  isGuestMode = false
}) => {
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
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in px-6">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mb-8 border-2 border-indigo-200 shadow-xl">
          <IconIdea className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Aucune idée pour le moment
        </h2>
        <p className="text-gray-600 max-w-md mb-10 text-lg leading-relaxed">
          Commencez par générer votre première idée de SaaS. Bildr va vous guider étape par étape.
        </p>
        <button
          onClick={() => onNavigate(AppView.GENERATOR)}
          className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg flex items-center gap-2 hover:shadow-xl"
        >
          <IconSparkle className="w-5 h-5" />
          Générer une idée
          <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20 max-w-7xl mx-auto px-6">
      {/* Header Stats */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            {isGuestMode && (
              <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-700 text-xs font-bold uppercase tracking-wide">
                Mode Démo
              </span>
            )}
          </div>
          <p className="text-gray-600 text-lg">Gérez vos projets SaaS et suivez leur progression</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full xl:w-auto">
          <div className="bg-white border-2 border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Projets</div>
            <div className="text-3xl font-bold text-gray-900">{totalIdeas}</div>
          </div>
          <div className="bg-white border-2 border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Score Moyen</div>
            <div className={`text-3xl font-bold ${averageScore > 0 ? 'text-indigo-600' : 'text-gray-400'}`}>
              {averageScore > 0 ? averageScore : '-'}
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <IconCheckCircle className="w-3 h-3" /> Top Score
            </div>
            <div className="text-3xl font-bold text-amber-600">
              {topIdea?.analysis ? topIdea.analysis.score : '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {savedIdeas.map((idea) => (
          <div
            key={idea.id}
            className="group bg-white border-2 border-gray-200 hover:border-indigo-300 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
          >
            {/* Score Badge */}
            {idea.analysis && (
              <div className="absolute -top-3 -right-3 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <span className="text-white font-bold text-sm">{idea.analysis.score}</span>
              </div>
            )}

            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900 leading-tight flex-1">
                  {idea.title}
                </h3>
              </div>
              <p className="text-sm text-indigo-600 font-semibold">{idea.tagline}</p>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
              {idea.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                {idea.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                idea.difficulty === 'Faible' ? 'bg-green-100 text-green-700' :
                idea.difficulty === 'Moyenne' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {idea.difficulty}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              {!idea.analysis && (
                <button
                  onClick={() => onAnalyze(idea)}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <IconAnalytics className="w-4 h-4" />
                  Analyser
                </button>
              )}
              {idea.analysis && !idea.blueprint && (
                <button
                  onClick={() => onNavigate(AppView.MVP_BUILDER, idea)}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <IconWrench className="w-4 h-4" />
                  Plan technique
                </button>
              )}
              {idea.blueprint && (
                <button
                  onClick={() => onNavigate(AppView.LE_CHANTIER, idea)}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <IconKanban className="w-4 h-4" />
                  Ouvrir
                </button>
              )}
              <button
                onClick={() => onDelete(idea.id)}
                className="px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-lg font-semibold text-sm transition-colors"
                title="Supprimer"
              >
                <IconTrash className="w-4 h-4" />
              </button>
            </div>

            {/* Analysis Preview */}
            {idea.analysis && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <IconTarget className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-gray-700">Verdict</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{idea.analysis.verdict}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BildrDashboard;
