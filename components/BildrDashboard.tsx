import React from 'react';
import { SavedIdea, AppView } from '../types';
import { IconIdea } from './Icons';
import ImpactMetrics from './dashboard/ImpactMetrics';
import ProjectShowcase from './dashboard/ProjectShowcase';
import ProjectCard from './dashboard/ProjectCard';

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
  // Find showcase project (most complete one)
  const showcaseProject = savedIdeas.find(idea =>
    idea.analysis && idea.blueprint && idea.kanbanBoard
  ) || savedIdeas.find(idea => idea.analysis) || null;

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
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
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

        {/* Impact Metrics */}
        <ImpactMetrics />

        {/* Hero Project - Projet Vitrine */}
        {showcaseProject && (
          <ProjectShowcase
            project={showcaseProject}
            onNavigate={onNavigate}
          />
        )}

        {/* Other Projects - Gallery */}
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
                  <ProjectCard
                    key={idea.id}
                    idea={idea}
                    onAnalyze={onAnalyze}
                    onNavigate={onNavigate}
                    onDelete={onDelete}
                  />
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
