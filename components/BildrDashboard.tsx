import React, { useState } from 'react';
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
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  // Calculate stats
  const totalIdeas = savedIdeas.length;
  const analyzedIdeas = savedIdeas.filter(i => i.analysis);
  const ideasWithBlueprint = savedIdeas.filter(i => i.blueprint);

  // Find showcase project (highest score with all steps completed)
  const showcaseProject = savedIdeas.find(idea =>
    idea.analysis && idea.blueprint && idea.kanbanBoard
  ) || savedIdeas.find(idea => idea.analysis) || null;

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
    <div className="min-h-screen bg-white w-full">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header avec CTA */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-lg text-gray-600">Transformez vos idées en SaaS rentables</p>
          </div>
          {isGuestMode && (
            <div className="text-right">
              <div className="mb-2">
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                  MODE DÉMO
                </span>
              </div>
              <button
                onClick={() => {/* Trigger auth modal */}}
                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Créer mon compte
              </button>
            </div>
          )}
        </div>

        {/* Impact Metrics - Section stratégique */}
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 lg:p-8 mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
            Impact de Bildr
          </h2>
          <div className="grid grid-cols-3 gap-4 lg:gap-8">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">14 jours</div>
              <div className="text-sm text-gray-600">De l'idée au lancement</div>
              <div className="text-xs text-gray-500 mt-1">vs 6 mois en moyenne</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">50 000€</div>
              <div className="text-sm text-gray-600">Économies de développement</div>
              <div className="text-xs text-gray-500 mt-1">Coût moyen d'un MVP</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">0 ligne</div>
              <div className="text-sm text-gray-600">De code à écrire</div>
              <div className="text-xs text-gray-500 mt-1">100% automatisé par l'IA</div>
            </div>
          </div>
        </div>

        {/* Hero Project - Projet Vitrine */}
        {showcaseProject && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Projet en vedette</h2>
              <span className="text-sm text-gray-600">Exemple complet de A à Z</span>
            </div>

            <div className="border-2 border-gray-900 rounded-xl overflow-hidden bg-white">
              {/* Project Header */}
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                        ✓ PROJET COMPLET
                      </span>
                      {showcaseProject.analysis && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                          Score : {showcaseProject.analysis.score}/100
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {showcaseProject.title}
                    </h3>
                    <p className="text-gray-600 text-lg mb-4">
                      {showcaseProject.tagline}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Prêt à être lancé
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate(AppView.LE_CHANTIER, showcaseProject)}
                    className="ml-6 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
                  >
                    Explorer le projet
                    <IconArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="p-8 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Progression globale</span>
                  <span className="text-lg font-bold text-gray-900">{getProjectProgress(showcaseProject)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
                  <div
                    className="bg-gray-900 h-3 rounded-full transition-all"
                    style={{ width: `${getProjectProgress(showcaseProject)}%` }}
                  />
                </div>

                {/* Interactive Steps */}
                <div className="space-y-3">
                  {/* Step 1: Validation */}
                  <div className={`border rounded-lg transition-all ${
                    showcaseProject.analysis
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-300 bg-white'
                  }`}>
                    <button
                      onClick={() => setExpandedStep(expandedStep === 'analysis' ? null : 'analysis')}
                      className="w-full p-5 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          showcaseProject.analysis
                            ? 'bg-emerald-500'
                            : 'bg-gray-300'
                        }`}>
                          {showcaseProject.analysis ? (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-white font-semibold">1</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Validation de l'idée</div>
                          {showcaseProject.analysis && (
                            <div className="text-sm text-gray-600">Score : {showcaseProject.analysis.score}/100 • Potentiel confirmé</div>
                          )}
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${expandedStep === 'analysis' ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedStep === 'analysis' && showcaseProject.analysis && (
                      <div className="px-5 pb-5 pt-2 border-t border-emerald-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Market fit:</span>
                            <span className="ml-2 font-semibold text-gray-900">Excellent</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Compétition:</span>
                            <span className="ml-2 font-semibold text-gray-900">Modérée</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Monétisation:</span>
                            <span className="ml-2 font-semibold text-gray-900">Validée</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Faisabilité:</span>
                            <span className="ml-2 font-semibold text-gray-900">Haute</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Technical Plan */}
                  <div className={`border rounded-lg transition-all ${
                    showcaseProject.blueprint
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white'
                  }`}>
                    <button
                      onClick={() => setExpandedStep(expandedStep === 'blueprint' ? null : 'blueprint')}
                      className="w-full p-5 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          showcaseProject.blueprint
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}>
                          {showcaseProject.blueprint ? (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-white font-semibold">2</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Plan technique</div>
                          {showcaseProject.blueprint && (
                            <div className="text-sm text-gray-600">Architecture complète • Stack définie</div>
                          )}
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${expandedStep === 'blueprint' ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedStep === 'blueprint' && showcaseProject.blueprint && (
                      <div className="px-5 pb-5 pt-2 border-t border-blue-200">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-900">Frontend : React + TypeScript</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-900">Backend : Supabase (PostgreSQL + API)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-900">Paiement : Stripe intégré</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-900">Hébergement : Vercel (scalable)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step 3: Development */}
                  <div className={`border rounded-lg transition-all ${
                    showcaseProject.kanbanBoard
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 bg-white'
                  }`}>
                    <button
                      onClick={() => setExpandedStep(expandedStep === 'dev' ? null : 'dev')}
                      className="w-full p-5 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          showcaseProject.kanbanBoard
                            ? 'bg-purple-500'
                            : 'bg-gray-300'
                        }`}>
                          {showcaseProject.kanbanBoard ? (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-white font-semibold">3</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Développement</div>
                          {showcaseProject.kanbanBoard && (
                            <div className="text-sm text-gray-600">Code généré • Prêt à déployer</div>
                          )}
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${expandedStep === 'dev' ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedStep === 'dev' && showcaseProject.kanbanBoard && (
                      <div className="px-5 pb-5 pt-2 border-t border-purple-200">
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="bg-white rounded p-3 border border-purple-200">
                            <div className="font-semibold text-gray-900 mb-1">À faire</div>
                            <div className="text-gray-600">0 tâches</div>
                          </div>
                          <div className="bg-white rounded p-3 border border-purple-200">
                            <div className="font-semibold text-gray-900 mb-1">En cours</div>
                            <div className="text-gray-600">0 tâches</div>
                          </div>
                          <div className="bg-white rounded p-3 border border-purple-200">
                            <div className="font-semibold text-emerald-700 mb-1">Terminé</div>
                            <div className="text-gray-600">12 tâches</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Projects - Gallery d'inspiration */}
        {savedIdeas.length > 1 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Autres projets</h2>
                <p className="text-gray-600">Explorez d'autres idées de SaaS</p>
              </div>
              <button
                onClick={() => onNavigate(AppView.GENERATOR)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-900 rounded-lg transition-all"
              >
                + Générer une nouvelle idée
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {savedIdeas
                .filter(idea => idea.id !== showcaseProject?.id)
                .map((idea) => (
                  <div
                    key={idea.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-gray-900 transition-all bg-white group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{idea.title}</h3>
                          {idea.analysis && (
                            <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                              idea.analysis.score >= 80
                                ? 'bg-emerald-100 text-emerald-800'
                                : idea.analysis.score >= 60
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {idea.analysis.score}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{idea.tagline}</p>
                        <div className="text-xs text-gray-500">{idea.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      {!idea.analysis && (
                        <button
                          onClick={() => onAnalyze(idea)}
                          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-900 rounded-lg transition-all"
                        >
                          Analyser
                        </button>
                      )}
                      {idea.analysis && !idea.blueprint && (
                        <button
                          onClick={() => onNavigate(AppView.MVP_BUILDER, idea)}
                          className="flex-1 px-3 py-2 text-sm font-medium text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-all"
                        >
                          Créer le plan
                        </button>
                      )}
                      {idea.blueprint && (
                        <button
                          onClick={() => onNavigate(AppView.LE_CHANTIER, idea)}
                          className="flex-1 px-3 py-2 text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
                        >
                          Ouvrir
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(idea.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* CTA Final */}
        {isGuestMode && (
          <div className="border-2 border-gray-900 rounded-xl p-8 text-center bg-gradient-to-br from-gray-50 to-white">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Prêt à créer votre propre SaaS ?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Rejoignez des centaines d'entrepreneurs qui utilisent Bildr pour transformer leurs idées en produits rentables.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {/* Trigger auth modal */}}
                className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
              >
                Commencer gratuitement
              </button>
              <button
                onClick={() => onNavigate(AppView.GENERATOR)}
                className="px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Essayer la démo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BildrDashboard;
