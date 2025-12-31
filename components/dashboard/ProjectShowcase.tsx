import React, { useState } from 'react';
import { SavedIdea, AppView } from '../../types';
import { IconArrowRight, IconCheckCircle } from '../Icons';

interface ProjectShowcaseProps {
  project: SavedIdea;
  onNavigate: (view: AppView, idea: SavedIdea) => void;
}

const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ project, onNavigate }) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const getProgress = () => {
    let completed = 0;
    if (project.analysis) completed++;
    if (project.blueprint) completed++;
    if (project.kanbanBoard) completed++;
    return Math.round((completed / 3) * 100);
  };

  const steps = [
    {
      id: 'analysis',
      title: 'Validation de l\'idée',
      completed: !!project.analysis,
      color: 'emerald',
      details: project.analysis && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-600">Market fit:</span> <span className="ml-2 font-semibold text-gray-900">Excellent</span></div>
          <div><span className="text-gray-600">Compétition:</span> <span className="ml-2 font-semibold text-gray-900">Modérée</span></div>
          <div><span className="text-gray-600">Monétisation:</span> <span className="ml-2 font-semibold text-gray-900">Validée</span></div>
          <div><span className="text-gray-600">Faisabilité:</span> <span className="ml-2 font-semibold text-gray-900">Haute</span></div>
        </div>
      ),
      subtitle: project.analysis ? `Score : ${project.analysis.score}/100 • Potentiel confirmé` : null
    },
    {
      id: 'blueprint',
      title: 'Plan technique',
      completed: !!project.blueprint,
      color: 'blue',
      details: project.blueprint && (
        <div className="space-y-2 text-sm">
          {['Frontend : React + TypeScript', 'Backend : Supabase (PostgreSQL + API)', 'Paiement : Stripe intégré', 'Hébergement : Vercel (scalable)'].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <IconCheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-gray-900">{item}</span>
            </div>
          ))}
        </div>
      ),
      subtitle: project.blueprint ? 'Architecture complète • Stack définie' : null
    },
    {
      id: 'dev',
      title: 'Développement',
      completed: !!project.kanbanBoard,
      color: 'purple',
      details: project.kanbanBoard && (
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
      ),
      subtitle: project.kanbanBoard ? 'Code généré • Prêt à déployer' : null
    }
  ];

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Projet en vedette</h2>
        <span className="text-sm text-gray-600">Exemple complet de A à Z</span>
      </div>

      <div className="border-2 border-gray-900 rounded-xl overflow-hidden bg-white">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  ✓ PROJET COMPLET
                </span>
                {project.analysis && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                    Score : {project.analysis.score}/100
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-gray-600 text-lg mb-4">{project.tagline}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Prêt à être lancé
              </div>
            </div>
            <button
              onClick={() => onNavigate(AppView.LE_CHANTIER, project)}
              className="ml-6 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Explorer le projet
              <IconArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="p-8 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Progression globale</span>
            <span className="text-lg font-bold text-gray-900">{getProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
            <div
              className="bg-gray-900 h-3 rounded-full transition-all"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`border rounded-lg transition-all ${
                  step.completed
                    ? `border-${step.color}-500 bg-${step.color}-50`
                    : 'border-gray-300 bg-white'
                }`}
              >
                <button
                  onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? `bg-${step.color}-500` : 'bg-gray-300'
                    }`}>
                      {step.completed ? (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-white font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{step.title}</div>
                      {step.subtitle && (
                        <div className="text-sm text-gray-600">{step.subtitle}</div>
                      )}
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedStep === step.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedStep === step.id && step.details && (
                  <div className={`px-5 pb-5 pt-2 border-t border-${step.color}-200`}>
                    {step.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcase;
