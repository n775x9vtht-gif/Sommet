import React from 'react';
import { SavedIdea, AppView } from '../../types';
import { IconTrash } from '../Icons';

interface ProjectCardProps {
  idea: SavedIdea;
  onAnalyze: (idea: SavedIdea) => void;
  onNavigate: (view: AppView, idea: SavedIdea) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  idea,
  onAnalyze,
  onNavigate,
  onDelete
}) => {
  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    return 'bg-amber-100 text-amber-800';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-900 transition-all bg-white group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{idea.title}</h3>
            {idea.analysis && (
              <span className={`px-2 py-0.5 text-xs font-bold rounded ${getScoreBadgeColor(idea.analysis.score)}`}>
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
  );
};

export default ProjectCard;
