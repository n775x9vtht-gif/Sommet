import React from 'react';
import { SavedIdea, AppView } from '../types';
import {
  IconTrash,
  IconArrowRight,
  IconCheckCircle,
  IconIdea,
  IconKanban,
  IconWrench,
  IconSparkle,
  IconAnalytics,
  IconRocketFlat,
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
  const ideasWithBlueprint = savedIdeas.filter(i => i.blueprint);
  const completedSteps = analyzedIdeas.length + ideasWithBlueprint.length;

  // Find current project (first one with analysis but incomplete)
  const currentProject = savedIdeas.find(idea => idea.analysis) || null;

  // Calculate progress for current project
  const getProjectProgress = (idea: SavedIdea) => {
    let progress = 0;
    if (idea.analysis) progress += 50;
    if (idea.blueprint) progress += 30;
    if (idea.kanbanBoard) progress += 20;
    return progress;
  };

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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          {isGuestMode && (
            <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-700 text-xs font-bold uppercase tracking-wide">
              Mode Démo
            </span>
          )}
        </div>
        <p className="text-gray-600 text-lg">Tes projets SaaS</p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border-2 border-emerald-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <IconCheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">Complété</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{completedSteps}</div>
          <div className="text-xs text-gray-500">étapes finies</div>
        </div>
        <div className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <IconKanban className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700">En cours</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{currentProject ? 1 : 0}</div>
          <div className="text-xs text-gray-500">projet actif</div>
        </div>
        <div className="bg-white rounded-xl p-4 border-2 border-purple-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <IconIdea className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-semibold text-purple-700">Idées</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalIdeas}</div>
          <div className="text-xs text-gray-500">générées</div>
        </div>
      </div>

      {/* Projet principal en cours */}
      {currentProject && (
        <div className="bg-white rounded-2xl p-6 mb-8 border-2 border-indigo-200 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                  EN COURS
                </span>
                {currentProject.analysis && (
                  <span className="text-xs text-gray-500">Score : {currentProject.analysis.score}/100</span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {currentProject.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {currentProject.tagline}
              </p>
            </div>
            <button
              onClick={() => onNavigate(currentProject.blueprint ? AppView.LE_CHANTIER : AppView.MVP_BUILDER, currentProject)}
              className="ml-4 flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Continuer
              <IconArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Barre de progression */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">Progression générale</span>
              <span className="text-xs font-bold text-indigo-600">{getProjectProgress(currentProject)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${getProjectProgress(currentProject)}%` }}
              ></div>
            </div>
          </div>

          {/* Étapes */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-lg p-3 flex items-center gap-2 border-2 ${
              currentProject.analysis
                ? 'bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-300'
                : 'bg-gray-100 border-gray-300 opacity-60'
            }`}>
              <IconCheckCircle className={`w-5 h-5 flex-shrink-0 ${currentProject.analysis ? 'text-emerald-600' : 'text-gray-400'}`} />
              <div>
                <div className="text-xs font-bold text-gray-900">Idée validée</div>
                {currentProject.analysis && (
                  <div className="text-xs text-emerald-700">Score : {currentProject.analysis.score}/100</div>
                )}
              </div>
            </div>

            <div className={`rounded-lg p-3 flex items-center gap-2 border-2 ${
              currentProject.blueprint
                ? 'bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-300'
                : currentProject.analysis
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-400'
                  : 'bg-gray-100 border-gray-300 opacity-60'
            }`}>
              {currentProject.blueprint ? (
                <IconCheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
              ) : currentProject.analysis ? (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              ) : (
                <IconWrench className="w-5 h-5 flex-shrink-0 text-gray-400" />
              )}
              <div>
                <div className="text-xs font-bold text-gray-900">Plan technique</div>
                <div className="text-xs text-gray-600">
                  {currentProject.blueprint ? 'Terminé' : currentProject.analysis ? 'En cours...' : 'À venir'}
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-3 flex items-center gap-2 border-2 ${
              currentProject.kanbanBoard
                ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-400'
                : 'bg-gray-100 border-gray-300 opacity-60'
            }`}>
              <IconKanban className={`w-5 h-5 flex-shrink-0 ${currentProject.kanbanBoard ? 'text-blue-600' : 'text-gray-400'}`} />
              <div>
                <div className="text-xs font-bold text-gray-900">Développement</div>
                <div className="text-xs text-gray-600">
                  {currentProject.kanbanBoard ? 'En cours' : 'À venir'}
                </div>
              </div>
            </div>

            <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-3 flex items-center gap-2 opacity-60">
              <IconRocketFlat className="w-5 h-5 flex-shrink-0 text-gray-400" />
              <div>
                <div className="text-xs font-bold text-gray-700">Déploiement</div>
                <div className="text-xs text-gray-600">À venir</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prochaine action recommandée */}
      {currentProject && !currentProject.blueprint && currentProject.analysis && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <IconRocketFlat className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-amber-900 mb-1">Prochaine action</div>
              <p className="text-sm text-amber-800 leading-relaxed mb-2">
                Votre idée a été validée avec un score de {currentProject.analysis.score}/100 ! Créez maintenant le plan technique complet pour démarrer le développement.
              </p>
              <button
                onClick={() => onNavigate(AppView.MVP_BUILDER, currentProject)}
                className="text-sm font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
              >
                Créer le plan technique
                <IconArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Autres idées */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold text-gray-900">
            {currentProject ? 'Autres idées explorées' : 'Toutes vos idées'}
          </h4>
          <button
            onClick={() => onNavigate(AppView.GENERATOR)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <IconSparkle className="w-4 h-4" />
            Nouvelle idée
          </button>
        </div>
        <div className="space-y-3">
          {savedIdeas.filter(idea => idea !== currentProject).map((idea) => (
            <div
              key={idea.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  idea.analysis
                    ? 'bg-gradient-to-br from-indigo-400 to-purple-500'
                    : 'bg-gradient-to-br from-gray-300 to-gray-400'
                }`}>
                  {idea.analysis ? (
                    <span className="text-white font-bold text-sm">{idea.analysis.score}</span>
                  ) : (
                    <IconIdea className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{idea.title}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{idea.category}</span>
                    {idea.analysis && <span>• Analysée</span>}
                    {idea.blueprint && <span>• Plan créé</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {!idea.analysis && (
                  <button
                    onClick={() => onAnalyze(idea)}
                    className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Analyser
                  </button>
                )}
                {idea.analysis && !idea.blueprint && (
                  <button
                    onClick={() => onNavigate(AppView.MVP_BUILDER, idea)}
                    className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Plan technique
                  </button>
                )}
                {idea.blueprint && (
                  <button
                    onClick={() => onNavigate(AppView.LE_CHANTIER, idea)}
                    className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Ouvrir
                  </button>
                )}
                <button
                  onClick={() => onDelete(idea.id)}
                  className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BildrDashboard;
