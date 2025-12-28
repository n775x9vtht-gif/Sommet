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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center mb-6 mx-auto shadow-xl">
            <IconIdea className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Bienvenue sur Bildr
          </h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Commencez votre aventure entrepreneuriale en générant votre première idée de SaaS. Notre IA vous accompagne de l'idée au produit final.
          </p>
          <button
            onClick={() => onNavigate(AppView.GENERATOR)}
            className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white text-base font-semibold rounded-xl transition-all hover:scale-105 shadow-lg inline-flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Générer ma première idée
          </button>
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-gray-900 mb-1">1</div>
              <div className="text-sm text-gray-600">Générer</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-gray-900 mb-1">2</div>
              <div className="text-sm text-gray-600">Analyser</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
              <div className="text-sm text-gray-600">Construire</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Gérez et pilotez vos projets SaaS</p>
            </div>
            {isGuestMode && (
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                Mode démo
              </span>
            )}
          </div>
        </div>

        {/* Stats Cards - Plus visuelles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Total projets</div>
                <div className="text-4xl font-bold text-gray-900">{totalIdeas}</div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <IconIdea className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Analysés</div>
                <div className="text-4xl font-bold text-gray-900">{analyzedIdeas.length}</div>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <IconAnalytics className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Plans créés</div>
                <div className="text-4xl font-bold text-gray-900">{ideasWithBlueprint.length}</div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <IconWrench className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

      {/* Current Project - Carte mise en avant */}
      {currentProject && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  EN COURS
                </span>
                {currentProject.analysis && (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Score {currentProject.analysis.score}/100
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {currentProject.title}
              </h3>
              <p className="text-gray-300 text-base">
                {currentProject.tagline}
              </p>
            </div>
            <button
              onClick={() => onNavigate(currentProject.blueprint ? AppView.LE_CHANTIER : AppView.MVP_BUILDER, currentProject)}
              className="ml-6 px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-900 text-sm font-semibold rounded-xl transition-all hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              Continuer
              <IconArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">Progression du projet</span>
              <span className="text-lg font-bold">{getProjectProgress(currentProject)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${getProjectProgress(currentProject)}%` }}
              ></div>
            </div>
          </div>

          {/* Steps - Plus visuelles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`border-2 rounded-xl p-5 transition-all ${
              currentProject.analysis
                ? 'border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
                : 'border-white/20 bg-white/5'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {currentProject.analysis ? (
                  <div className="w-7 h-7 bg-emerald-400 rounded-full flex items-center justify-center">
                    <IconCheckCircle className="w-5 h-5 text-gray-900" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border-2 border-white/40" />
                )}
                <span className="font-semibold text-base">Idée validée</span>
              </div>
              {currentProject.analysis && (
                <p className="text-sm text-emerald-300 font-medium">Score : {currentProject.analysis.score}/100</p>
              )}
            </div>

            <div className={`border-2 rounded-xl p-5 transition-all ${
              currentProject.blueprint
                ? 'border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                : 'border-white/20 bg-white/5'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {currentProject.blueprint ? (
                  <div className="w-7 h-7 bg-blue-400 rounded-full flex items-center justify-center">
                    <IconCheckCircle className="w-5 h-5 text-gray-900" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border-2 border-white/40" />
                )}
                <span className="font-semibold text-base">Plan technique</span>
              </div>
              <p className="text-sm text-gray-300 font-medium">
                {currentProject.blueprint ? 'Terminé' : 'À faire'}
              </p>
            </div>

            <div className={`border-2 rounded-xl p-5 transition-all ${
              currentProject.kanbanBoard
                ? 'border-purple-400 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                : 'border-white/20 bg-white/5'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {currentProject.kanbanBoard ? (
                  <div className="w-7 h-7 bg-purple-400 rounded-full flex items-center justify-center">
                    <IconCheckCircle className="w-5 h-5 text-gray-900" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border-2 border-white/40" />
                )}
                <span className="font-semibold text-base">Développement</span>
              </div>
              <p className="text-sm text-gray-300 font-medium">
                {currentProject.kanbanBoard ? 'En cours' : 'À venir'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* All Projects - Liste améliorée */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Tous les projets</h2>
            <p className="text-sm text-gray-600 mt-0.5">Gérez l'ensemble de votre portfolio</p>
          </div>
          <button
            onClick={() => onNavigate(AppView.GENERATOR)}
            className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all hover:scale-105 flex items-center gap-2 shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau projet
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {savedIdeas.map((idea, index) => (
            <div
              key={idea.id}
              className="px-6 py-5 hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-lg font-bold text-gray-700">{index + 1}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-base">{idea.title}</h3>
                    </div>
                    {idea.analysis && (
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        idea.analysis.score >= 80
                          ? 'bg-emerald-100 text-emerald-700'
                          : idea.analysis.score >= 60
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        Score {idea.analysis.score}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-600">{idea.category}</span>
                    {idea.analysis && (
                      <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Analysé
                      </span>
                    )}
                    {idea.blueprint && (
                      <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Plan créé
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-6">
                  {!idea.analysis && (
                    <button
                      onClick={() => onAnalyze(idea)}
                      className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-900 rounded-xl transition-all hover:scale-105"
                    >
                      Analyser
                    </button>
                  )}
                  {idea.analysis && !idea.blueprint && (
                    <button
                      onClick={() => onNavigate(AppView.MVP_BUILDER, idea)}
                      className="px-4 py-2 text-sm font-semibold text-blue-700 hover:text-blue-900 border-2 border-blue-300 hover:border-blue-600 bg-blue-50 rounded-xl transition-all hover:scale-105"
                    >
                      Créer le plan
                    </button>
                  )}
                  {idea.blueprint && (
                    <button
                      onClick={() => onNavigate(AppView.LE_CHANTIER, idea)}
                      className="px-4 py-2 text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all hover:scale-105 shadow-md"
                    >
                      Ouvrir
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(idea.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Supprimer"
                  >
                    <IconTrash className="w-5 h-5" />
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
