import React from 'react';
import { SavedIdea, AppView } from '../types';
import {
  IconTrash,
  IconArrowRight,
  IconCheckCircle,
  IconIdea,
  IconAnalytics,
  IconWrench
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

  // Find current project
  const currentProject = savedIdeas.find(idea => idea.analysis) || null;

  // Calculate progress
  const getProjectProgress = (idea: SavedIdea) => {
    let steps = 0;
    let completed = 0;

    if (idea.analysis) { steps++; completed++; }
    if (idea.blueprint) { steps++; completed++; }
    if (idea.kanbanBoard) { steps++; completed++; }

    return steps > 0 ? Math.round((completed / 3) * 100) : 0;
  };

  if (savedIdeas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <IconIdea className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Aucun projet pour le moment
        </h2>
        <p className="text-gray-600 max-w-md mb-8">
          Commencez par générer votre première idée de SaaS.
        </p>
        <button
          onClick={() => onNavigate(AppView.GENERATOR)}
          className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Générer une idée
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          {isGuestMode && (
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
              Mode démo
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm">Gérez vos projets SaaS</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-1">Total projets</div>
          <div className="text-3xl font-semibold text-gray-900">{totalIdeas}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-1">Analysés</div>
          <div className="text-3xl font-semibold text-gray-900">{analyzedIdeas.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-1">Plans créés</div>
          <div className="text-3xl font-semibold text-gray-900">{ideasWithBlueprint.length}</div>
        </div>
      </div>

      {/* Current Project */}
      {currentProject && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-gray-900 text-white text-xs font-medium rounded">
                  EN COURS
                </span>
                {currentProject.analysis && (
                  <span className="text-sm text-gray-600">
                    Score {currentProject.analysis.score}/100
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentProject.title}
              </h3>
              <p className="text-gray-600">
                {currentProject.tagline}
              </p>
            </div>
            <button
              onClick={() => onNavigate(currentProject.blueprint ? AppView.LE_CHANTIER : AppView.MVP_BUILDER, currentProject)}
              className="ml-6 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              Continuer
              <IconArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progression</span>
              <span className="text-sm font-medium text-gray-900">{getProjectProgress(currentProject)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-gray-900 h-2 rounded-full transition-all"
                style={{ width: `${getProjectProgress(currentProject)}%` }}
              ></div>
            </div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`border rounded-lg p-4 ${
              currentProject.analysis ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {currentProject.analysis ? (
                  <IconCheckCircle className="w-5 h-5 text-gray-900" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
                <span className="font-medium text-gray-900">Idée validée</span>
              </div>
              {currentProject.analysis && (
                <p className="text-sm text-gray-600">Score : {currentProject.analysis.score}/100</p>
              )}
            </div>

            <div className={`border rounded-lg p-4 ${
              currentProject.blueprint ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {currentProject.blueprint ? (
                  <IconCheckCircle className="w-5 h-5 text-gray-900" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
                <span className="font-medium text-gray-900">Plan technique</span>
              </div>
              <p className="text-sm text-gray-600">
                {currentProject.blueprint ? 'Terminé' : 'À faire'}
              </p>
            </div>

            <div className={`border rounded-lg p-4 ${
              currentProject.kanbanBoard ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {currentProject.kanbanBoard ? (
                  <IconCheckCircle className="w-5 h-5 text-gray-900" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
                <span className="font-medium text-gray-900">Développement</span>
              </div>
              <p className="text-sm text-gray-600">
                {currentProject.kanbanBoard ? 'En cours' : 'À venir'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* All Projects */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Tous les projets</h2>
          <button
            onClick={() => onNavigate(AppView.GENERATOR)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            + Nouveau projet
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {savedIdeas.map((idea) => (
            <div
              key={idea.id}
              className="px-8 py-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900">{idea.title}</h3>
                    {idea.analysis && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        Score {idea.analysis.score}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{idea.category}</span>
                    {idea.analysis && <span>• Analysé</span>}
                    {idea.blueprint && <span>• Plan créé</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-6">
                  {!idea.analysis && (
                    <button
                      onClick={() => onAnalyze(idea)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
                    >
                      Analyser
                    </button>
                  )}
                  {idea.analysis && !idea.blueprint && (
                    <button
                      onClick={() => onNavigate(AppView.MVP_BUILDER, idea)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
                    >
                      Créer le plan
                    </button>
                  )}
                  {idea.blueprint && (
                    <button
                      onClick={() => onNavigate(AppView.LE_CHANTIER, idea)}
                      className="px-3 py-1.5 text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
                    >
                      Ouvrir
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(idea.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BildrDashboard;
