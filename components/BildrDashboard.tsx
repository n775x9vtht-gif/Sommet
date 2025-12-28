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

  // Find current project (most recent analyzed)
  const currentProject = savedIdeas.find(idea => idea.analysis) || null;

  // Calculate progress
  const getProjectProgress = (idea: SavedIdea) => {
    let completed = 0;
    if (idea.analysis) completed++;
    if (idea.blueprint) completed++;
    if (idea.kanbanBoard) completed++;
    return Math.round((completed / 3) * 100);
  };

  // Empty state
  if (savedIdeas.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mb-6 mx-auto">
            <IconIdea className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Aucun projet
          </h2>
          <p className="text-gray-600 mb-8">
            Commencez par créer votre première idée de SaaS
          </p>
          <button
            onClick={() => onNavigate(AppView.GENERATOR)}
            className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Créer un projet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-1">Dashboard</h1>
              <p className="text-gray-600">Vue d'ensemble de vos projets</p>
            </div>
            {isGuestMode && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                Mode démo
              </span>
            )}
          </div>
        </div>

        {/* Stats - Style Stripe sobre */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="text-sm text-gray-600 mb-2">Total</div>
            <div className="text-3xl font-semibold text-gray-900">{totalIdeas}</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="text-sm text-gray-600 mb-2">Analysés</div>
            <div className="text-3xl font-semibold text-gray-900">{analyzedIdeas.length}</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="text-sm text-gray-600 mb-2">Planifiés</div>
            <div className="text-3xl font-semibold text-gray-900">{ideasWithBlueprint.length}</div>
          </div>
        </div>

        {/* Current Project */}
        {currentProject && (
          <div className="border-2 border-gray-900 rounded-lg p-8 mb-12 bg-white">
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2.5 py-0.5 bg-gray-900 text-white text-xs font-medium rounded uppercase tracking-wide">
                    En cours
                  </span>
                  {currentProject.analysis && (
                    <span className="text-sm text-gray-600">
                      Score : {currentProject.analysis.score}/100
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {currentProject.title}
                </h2>
                <p className="text-gray-600">
                  {currentProject.tagline}
                </p>
              </div>
              <button
                onClick={() => onNavigate(currentProject.blueprint ? AppView.LE_CHANTIER : AppView.MVP_BUILDER, currentProject)}
                className="ml-6 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-2"
              >
                Continuer
                <IconArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar - Simple */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progression</span>
                <span className="text-sm font-medium text-gray-900">{getProjectProgress(currentProject)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-gray-900 h-2 rounded-full transition-all"
                  style={{ width: `${getProjectProgress(currentProject)}%` }}
                />
              </div>
            </div>

            {/* Steps - Minimaliste */}
            <div className="grid grid-cols-3 gap-6">
              <div className={`border rounded-lg p-5 ${
                currentProject.analysis ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {currentProject.analysis ? (
                    <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="font-medium text-gray-900">Idée</span>
                </div>
                {currentProject.analysis && (
                  <div className="text-sm text-gray-600 mt-1">
                    Validée ({currentProject.analysis.score}/100)
                  </div>
                )}
              </div>

              <div className={`border rounded-lg p-5 ${
                currentProject.blueprint ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {currentProject.blueprint ? (
                    <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="font-medium text-gray-900">Plan</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {currentProject.blueprint ? 'Créé' : 'À faire'}
                </div>
              </div>

              <div className={`border rounded-lg p-5 ${
                currentProject.kanbanBoard ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {currentProject.kanbanBoard ? (
                    <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="font-medium text-gray-900">Dev</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {currentProject.kanbanBoard ? 'En cours' : 'À venir'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Projects */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Projets</h2>
            <button
              onClick={() => onNavigate(AppView.GENERATOR)}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              + Nouveau
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {savedIdeas.map((idea) => (
              <div
                key={idea.id}
                className="px-6 py-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{idea.title}</h3>
                      {idea.analysis && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          {idea.analysis.score}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{idea.category}</span>
                      {idea.analysis && <span>• Analysé</span>}
                      {idea.blueprint && <span>• Planifié</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
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
                        Planifier
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
    </div>
  );
};

export default BildrDashboard;
