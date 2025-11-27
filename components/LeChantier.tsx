import React, { useEffect, useState } from 'react';
import { SavedIdea, KanbanBoard } from '../types';
import { IconConstruction } from './Icons';

interface LeChantierProps {
  savedIdeas: SavedIdea[];
  initialIdea: SavedIdea | null;
  onSaveKanban: (ideaId: string, kanban: KanbanBoard) => void;
  isGuestMode: boolean;
  onTriggerAuth: () => void;
  onOpenPricing: () => void;
}

// On ne s'embête pas avec le type exact ici : on veut juste un Kanban lisible
type ColumnKey = 'backlog' | 'in_progress' | 'done';

const DEFAULT_BOARD: any = {
  columns: {
    backlog: {
      title: 'Backlog',
      items: [] as string[],
    },
    in_progress: {
      title: 'En cours',
      items: [] as string[],
    },
    done: {
      title: 'Terminé',
      items: [] as string[],
    },
  },
};

const LeChantier: React.FC<LeChantierProps> = ({
  savedIdeas,
  initialIdea,
  onSaveKanban,
  isGuestMode,
  onTriggerAuth,
  onOpenPricing,
}) => {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [kanbanBoard, setKanbanBoard] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sélection initiale d’idée
  useEffect(() => {
    if (initialIdea && initialIdea.id) {
      setSelectedIdeaId(initialIdea.id);
    } else if (savedIdeas.length > 0 && !selectedIdeaId) {
      setSelectedIdeaId(savedIdeas[0].id);
    }
  }, [initialIdea, savedIdeas, selectedIdeaId]);

  // Charge le board lorsqu’on change d’idée
  useEffect(() => {
    if (!selectedIdeaId) return;
    const idea = savedIdeas.find((i) => i.id === selectedIdeaId);
    if (!idea) return;

    // Si l’idée a déjà un Kanban sauvegardé, on le réutilise
    if (idea.kanbanBoard) {
      setKanbanBoard((idea.kanbanBoard as any) || DEFAULT_BOARD);
    } else {
      setKanbanBoard(DEFAULT_BOARD);
    }
  }, [selectedIdeaId, savedIdeas]);

  const selectedIdea =
    savedIdeas.find((i) => i.id === selectedIdeaId) || null;

  const getColumnItems = (col: ColumnKey): string[] => {
    if (!kanbanBoard || !kanbanBoard.columns) return [];
    const column = kanbanBoard.columns[col];
    if (!column) return [];
    return Array.isArray(column.items) ? column.items : [];
  };

  const handleColumnChange = (col: ColumnKey, text: string) => {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    setKanbanBoard((prev: any) => {
      const base = prev && prev.columns ? prev : DEFAULT_BOARD;
      return {
        ...base,
        columns: {
          ...base.columns,
          [col]: {
            ...base.columns[col],
            items: lines,
          },
        },
      };
    });
  };

  const handleSave = async () => {
    if (!selectedIdea || !selectedIdea.id) return;

    if (isGuestMode) {
      onTriggerAuth();
      return;
    }

    setSaving(true);
    try {
      // On cast en KanbanBoard pour respecter la signature de la prop
      await onSaveKanban(selectedIdea.id, kanbanBoard as KanbanBoard);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  // Cas : aucune idée enregistrée
  if (!savedIdeas || savedIdeas.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold text-white mb-3">
          Aucun projet dans le Chantier
        </h1>
        <p className="text-slate-400 mb-6">
          Commence par générer et enregistrer un projet dans le Générateur,
          puis reviens ici pour le transformer en plan d&apos;exécution.
        </p>
        <button
          onClick={onOpenPricing}
          className="px-6 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-400 transition-colors"
        >
          Voir les offres Sommet
        </button>
      </div>
    );
  }

  // Cas : pas encore de board chargé
  if (!kanbanBoard) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-slate-400">
        Chargement de votre espace Sommet...
      </div>
    );
  }

  const columnOrder: ColumnKey[] = ['backlog', 'in_progress', 'done'];

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
          <IconConstruction className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Le Chantier</h1>
          <p className="text-slate-400 text-sm">
            Organise ton exécution en 3 colonnes claires : Backlog, En cours, Terminé.
          </p>
        </div>
      </div>

      {/* Sélecteur d’idée */}
      <div className="mb-6 max-w-md">
        <label className="block text-xs font-semibold text-slate-400 mb-2">
          Projet à planifier
        </label>
        <select
          value={selectedIdeaId || ''}
          onChange={(e) => setSelectedIdeaId(e.target.value || null)}
          className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        >
          {savedIdeas.map((idea) => (
            <option key={idea.id} value={idea.id}>
              {idea.title || 'Projet sans titre'}
            </option>
          ))}
        </select>
      </div>

      {selectedIdea && (
        <p className="text-xs text-slate-500 mb-4">
          Chantier pour :{' '}
          <span className="text-slate-200 font-medium">
            {selectedIdea.title || 'Projet sans titre'}
          </span>
        </p>
      )}

      {/* Colonnes */}
      <div className="grid gap-4 md:grid-cols-3">
        {columnOrder.map((colKey) => {
          const col = (kanbanBoard.columns as any)[colKey];
          const label = col?.title ?? colKey;
          const items = getColumnItems(colKey);
          const value = items.join('\n');

          return (
            <div
              key={colKey}
              className="bg-dark-800 border border-dark-700 rounded-2xl p-4 flex flex-col min-h-[220px]"
            >
              <h2 className="text-sm font-semibold text-white mb-2">
                {label}
              </h2>
              <p className="text-[11px] text-slate-500 mb-2">
                Une tâche par ligne. Tu peux ajuster ton plan au fur et à mesure.
              </p>
              <textarea
                className="flex-1 w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40 resize-none"
                value={value}
                onChange={(e) => handleColumnChange(colKey, e.target.value)}
                placeholder={
                  colKey === 'backlog'
                    ? 'Lister ici toutes les tâches à faire…'
                    : colKey === 'in_progress'
                    ? 'Ce sur quoi tu travailles cette semaine…'
                    : 'Les éléments déjà réalisés…'
                }
              />
            </div>
          );
        })}
      </div>

      {/* CTA sauvegarde */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !selectedIdea}
          className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:bg-brand-500/50 text-white font-bold text-sm flex items-center gap-2"
        >
          {saving
            ? 'Sauvegarde…'
            : saved
            ? 'Chantier sauvegardé ✔'
            : 'Sauvegarder le Chantier'}
        </button>
      </div>
    </div>
  );
};

export default LeChantier;