// components/LeChantier.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { SavedIdea, KanbanBoard, KanbanTask } from '../types';
import {
  IconConstruction,
  IconArrowRight,
  IconCheck,
  IconPlus,
  IconSherpa,
  IconTrash,
} from './Icons';
import { askSherpa } from '../services/geminiService';

interface LeChantierProps {
  savedIdeas: SavedIdea[];
  initialIdea?: SavedIdea | null;
  onSaveKanban: (ideaId: string, board: KanbanBoard) => void;
  isGuestMode: boolean;
  onTriggerAuth: () => void;
  onOpenPricing: () => void;
}

type ColumnId = KanbanTask['columnId'];

const COLUMN_IDS: ColumnId[] = ['todo', 'in-progress', 'done'];

const COLUMN_META: Record<
  ColumnId,
  { title: string; subtitle: string }
> = {
  todo: { title: 'Backlog', subtitle: 'À faire' },
  'in-progress': { title: 'En cours', subtitle: 'En construction' },
  done: { title: 'Terminé', subtitle: 'Livré / validé' },
};

// Couleurs par semaine (1 → 4)
const WEEK_BADGE_CLASSES: Record<number, string> = {
  1: 'bg-sky-500/15 text-sky-200 border-sky-500/40',
  2: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40',
  3: 'bg-amber-500/15 text-amber-100 border-amber-400/60',
  4: 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-500/40',
};

const LeChantier: React.FC<LeChantierProps> = ({
  savedIdeas,
  initialIdea,
  onSaveKanban,
  isGuestMode,
  onTriggerAuth,
  onOpenPricing,
}) => {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('');
  const [board, setBoard] = useState<KanbanBoard | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [sherpaPrompt, setSherpaPrompt] = useState('');
  const [sherpaAnswer, setSherpaAnswer] = useState<string | null>(null);
  const [sherpaError, setSherpaError] = useState<string | null>(null);
  const [isSherpaLoading, setIsSherpaLoading] = useState(false);

  // ---------- Sélection de l'idée ----------

  useEffect(() => {
    if (initialIdea) {
      setSelectedIdeaId(initialIdea.id);
    } else if (savedIdeas.length > 0 && !selectedIdeaId) {
      setSelectedIdeaId(savedIdeas[0].id);
    }
  }, [initialIdea, savedIdeas, selectedIdeaId]);

  const selectedIdea = useMemo(
    () => savedIdeas.find((i) => i.id === selectedIdeaId) || null,
    [savedIdeas, selectedIdeaId]
  );

  // ---------- Chargement du KanbanBoard associé au projet ----------

  useEffect(() => {
    if (!selectedIdea) {
      setBoard(null);
      return;
    }

    if (selectedIdea.kanbanBoard) {
      setBoard(selectedIdea.kanbanBoard);
    } else {
      setBoard(null);
    }
  }, [selectedIdea]);

  // ---------- Helpers ----------

  const persistBoard = (newBoard: KanbanBoard) => {
    if (!selectedIdea) return;
    setBoard(newBoard);
    onSaveKanban(selectedIdea.id, newBoard);
  };

  const buildBoardFromBlueprint = (idea: SavedIdea): KanbanBoard | null => {
    if (!idea.blueprint) return null;

    const tasks: KanbanTask[] = [];
    idea.blueprint.roadmap.forEach((step) => {
      step.tasks.forEach((taskText, idx) => {
        tasks.push({
          id: `${idea.id}-w${step.week}-${idx}-${Date.now()}`,
          content: taskText,
          columnId: 'todo',
          week: step.week,
          phase: step.phase,
        });
      });
    });

    return {
      lastUpdated: Date.now(),
      tasks,
    };
  };

  const handleImportFromBlueprint = () => {
    if (!selectedIdea) return;
    const newBoard = buildBoardFromBlueprint(selectedIdea);
    if (!newBoard) {
      alert(
        "Ce projet n'a pas encore de Blueprint. Générez d'abord le plan MVP dans l'onglet \"L'Architecte MVP\"."
      );
      return;
    }
    persistBoard(newBoard);
  };

  const tasks: KanbanTask[] = board?.tasks ?? [];

  const getTasksForColumn = (columnId: ColumnId) =>
    tasks.filter((t) => t.columnId === columnId);

  const projectContext = useMemo(() => {
    if (!selectedIdea) return '';

    const base = (
      [
        `Projet : ${selectedIdea.title}`,
        selectedIdea.tagline ? `Tagline : ${selectedIdea.tagline}` : null,
        selectedIdea.description
          ? `Description : ${selectedIdea.description}`
          : null,
      ] as (string | null)[]
    ).filter(Boolean) as string[];

    const blueprintLines =
      selectedIdea.blueprint?.roadmap.map(
        (step) =>
          `Semaine ${step.week} (${step.phase}) → ${step.tasks
            .slice(0, 3)
            .join(' ; ')}`
      ) ?? [];

    const kanbanLines = board?.tasks
      .slice(0, 6)
      .map(
        (task) =>
          `${task.columnId.toUpperCase()} · S${task.week} · ${task.phase} · ${task.content}`
      ) ?? [];

    const lines = [...base];
    if (blueprintLines.length > 0) {
      lines.push('--- Blueprint / Roadmap ---', ...blueprintLines);
    }
    if (kanbanLines.length > 0) {
      lines.push('--- Kanban ---', ...kanbanLines);
    }

    return lines.join('\n');
  }, [board, selectedIdea]);

  // ---------- Drag & Drop ----------

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDropOnColumn = (columnId: ColumnId) => {
    if (!draggedTaskId || !board) return;

    const existing = board.tasks.find((t) => t.id === draggedTaskId);
    if (!existing) return;

    const remaining = board.tasks.filter((t) => t.id !== draggedTaskId);
    const moved: KanbanTask = { ...existing, columnId };

    const newBoard: KanbanBoard = {
      lastUpdated: Date.now(),
      tasks: [...remaining, moved],
    };

    setDraggedTaskId(null);
    persistBoard(newBoard);
  };

  const handleDropOnTask = (targetTaskId: string, targetColumnId: ColumnId) => {
    if (!draggedTaskId || !board || draggedTaskId === targetTaskId) return;

    const dragged = board.tasks.find((t) => t.id === draggedTaskId);
    if (!dragged) return;

    const remaining = board.tasks.filter((t) => t.id !== draggedTaskId);
    const targetIndex = remaining.findIndex((t) => t.id === targetTaskId);

    const moved: KanbanTask = { ...dragged, columnId: targetColumnId };

    const newTasks = [...remaining];
    if (targetIndex === -1) {
      newTasks.push(moved);
    } else {
      newTasks.splice(targetIndex, 0, moved);
    }

    const newBoard: KanbanBoard = {
      lastUpdated: Date.now(),
      tasks: newTasks,
    };

    setDraggedTaskId(null);
    persistBoard(newBoard);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // ---------- CRUD tâches ----------

  const handleDeleteTask = (taskId: string) => {
    if (!board) return;
    const newTasks = board.tasks.filter((t) => t.id !== taskId);
    const newBoard: KanbanBoard = {
      lastUpdated: Date.now(),
      tasks: newTasks,
    };
    persistBoard(newBoard);
  };

  const handleAskSherpa = async () => {
    if (!sherpaPrompt.trim()) {
      setSherpaError('Décris une tâche ou un blocage pour solliciter le Sherpa.');
      return;
    }

    if (!projectContext) {
      setSherpaError('Ajoute d’abord un projet ou un Blueprint pour donner du contexte au Sherpa.');
      return;
    }

    setSherpaError(null);
    setIsSherpaLoading(true);

    try {
      const response = await askSherpa(sherpaPrompt.trim(), projectContext);
      setSherpaAnswer(response);
    } catch (error) {
      setSherpaError("Impossible de joindre le Sherpa. Vérifie la clé API Gemini ou réessaie.");
    } finally {
      setIsSherpaLoading(false);
    }
  };

  const handleAddTask = (columnId: ColumnId) => {
    if (!board && !selectedIdea) return;

    const label = window.prompt(
      "Décris rapidement la tâche à ajouter dans ce chantier :"
    );
    if (!label || !label.trim()) return;

    const weekString = window.prompt(
      "Associer à quelle semaine ? (1, 2, 3 ou 4) – par défaut : 1"
    );
    const week =
      weekString && !isNaN(Number(weekString))
        ? Math.min(4, Math.max(1, Number(weekString)))
        : 1;

    const phase = `Semaine ${week}`;

    const baseBoard: KanbanBoard = board ?? {
      lastUpdated: Date.now(),
      tasks: [],
    };

    const newTask: KanbanTask = {
      id: `custom-${Date.now()}`,
      content: label.trim(),
      columnId,
      week,
      phase,
    };

    const newBoard: KanbanBoard = {
      lastUpdated: Date.now(),
      tasks: [...baseBoard.tasks, newTask],
    };

    persistBoard(newBoard);
  };

  // ---------- UI invited / empty ----------

  if (isGuestMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="w-24 h-24 bg-dark-800 rounded-3xl flex items-center justify-center mb-8 border border-dark-700 shadow-2xl">
          <IconConstruction className="w-10 h-10 text-gold-500" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
          Le Chantier est réservé aux Bâtisseurs
        </h2>
        <p className="text-slate-400 max-w-md mb-8 text-lg leading-relaxed">
          Crée un compte Sommet et passe sur le plan Bâtisseur pour débloquer ton
          espace de travail actionnable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onTriggerAuth}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5"
          >
            Créer mon compte
          </button>
          <button
            onClick={onOpenPricing}
            className="px-6 py-3 rounded-xl bg-dark-800 border border-dark-600 hover:bg-dark-700 text-slate-100 font-bold transition-all"
          >
            Voir les offres
          </button>
        </div>
      </div>
    );
  }

  if (savedIdeas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="w-24 h-24 bg-dark-800 rounded-3xl flex items-center justify-center mb-8 border border-dark-700 shadow-2xl rotate-3">
          <IconConstruction className="w-12 h-12 text-slate-600" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
          Aucun projet disponible
        </h2>
        <p className="text-slate-400 max-w-md mb-10 text-lg leading-relaxed">
          Commence par générer et sauvegarder une idée, puis construis ton chantier
          à partir de son Blueprint.
        </p>
      </div>
    );
  }

  if (!selectedIdea) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
        Chargement de votre espace Sommet...
      </div>
    );
  }

  const hasBlueprint = !!selectedIdea.blueprint;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-24">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-dark-800 rounded-2xl mb-6 border border-dark-700 shadow-lg">
          <IconConstruction className="w-8 h-8 text-brand-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Le Chantier <span className="text-brand-500">Actionnable</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Transforme le Blueprint MVP en tâches concrètes, réparties sur 4 semaines.
          Bouge les cartes, supprime ce qui ne sert pas, et reste focus sur
          l’essentiel.
        </p>
      </div>

      {/* Barre de sélection projet + CTA import Blueprint */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12 bg-dark-800/60 p-4 rounded-2xl border border-dark-700 backdrop-blur-sm max-w-3xl mx-auto shadow-xl">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Projet actuel :
        </span>
        <select
          value={selectedIdeaId}
          onChange={(e) => setSelectedIdeaId(e.target.value)}
          className="bg-dark-900 text-white border border-dark-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500 min-w-[260px] font-bold shadow-inner"
        >
          {savedIdeas.map((idea) => (
            <option key={idea.id} value={idea.id}>
              {idea.title}
            </option>
          ))}
        </select>

        {hasBlueprint && !board && (
          <button
            onClick={handleImportFromBlueprint}
            className="ml-0 md:ml-4 bg-brand-600 hover:bg-brand-500 text-white font-bold px-5 py-3 rounded-xl flex items-center transition-all shadow-lg shadow-brand-500/30 hover:-translate-y-0.5 text-sm"
          >
            Construire le chantier depuis le Blueprint
            <IconArrowRight className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>

      {/* SOS Sherpa */}
      <div className="bg-dark-800/70 border border-dark-700 rounded-2xl p-5 md:p-6 mb-10 shadow-xl max-w-5xl mx-auto">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-dark-900 border border-dark-700">
              <IconSherpa className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gold-300/80">SOS Sherpa</p>
              <h3 className="text-lg font-bold text-white">Bloqué sur une tâche ? Le Sherpa te débloque en quelques secondes.</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 items-start">
            <div className="flex flex-col gap-3">
              <textarea
                value={sherpaPrompt}
                onChange={(e) => setSherpaPrompt(e.target.value)}
                placeholder="Décris la tâche du Kanban qui bloque (ex: connecter Stripe, sécuriser une API, requête Supabase, automatiser un script)..."
                className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[120px]"
              />
              <div className="flex items-center justify-between text-[12px] text-slate-500">
                <span>Le Sherpa reçoit le contexte du projet (Blueprint + tâches actuelles).</span>
                {sherpaError && <span className="text-red-400 font-semibold">{sherpaError}</span>}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAskSherpa}
                disabled={isSherpaLoading}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gold-500/90 hover:bg-gold-400 text-dark-900 font-bold shadow-lg shadow-gold-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSherpaLoading ? 'Le Sherpa réfléchit...' : 'Obtenir la solution du Sherpa'}
              </button>
              {sherpaAnswer && (
                <div className="bg-dark-900 border border-dark-700 rounded-xl p-3 text-sm text-slate-100 whitespace-pre-wrap leading-relaxed shadow-inner">
                  {sherpaAnswer}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Si pas encore de kanban et pas de blueprint */}
      {!board && !hasBlueprint && (
        <div className="bg-dark-800 border border-dark-700 rounded-[2rem] p-10 md:p-12 text-center max-w-4xl mx-auto shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-3">
            Aucun chantier défini pour ce projet
          </h3>
          <p className="text-slate-400 mb-6">
            Générez d’abord un Blueprint MVP dans l’onglet&nbsp;
            <span className="font-semibold text-slate-200">
              L&apos;Architecte MVP
            </span>{' '}
            puis revenez ici pour le transformer en tâches actionnables.
          </p>
        </div>
      )}

      {/* Kanban uniquement si un board existe */}
      {board && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {COLUMN_IDS.map((colId) => {
            const colTasks = getTasksForColumn(colId);
            const meta = COLUMN_META[colId];

            return (
              <div
                key={colId}
                className="bg-dark-800/80 border border-dark-700 rounded-[1.75rem] p-4 md:p-5 flex flex-col min-h-[260px] shadow-xl"
                onDragOver={handleDragOver}
                onDrop={() => handleDropOnColumn(colId)}
              >
                {/* Header colonne */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      {meta.title}
                      <span className="text-[10px] px-2 py-1 rounded-full bg-dark-900 border border-dark-600 text-slate-400">
                        {meta.subtitle}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {colTasks.length} tâche
                      {colTasks.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddTask(colId)}
                    className="p-1.5 rounded-lg bg-dark-900 border border-dark-600 text-slate-300 hover:bg-dark-700 hover:text-white transition-colors"
                    title="Ajouter une tâche"
                  >
                    <IconPlus className="w-4 h-4" />
                  </button>
                </div>

                {/* Liste de tâches */}
                <div className="space-y-3 flex-1">
                  {colTasks.length === 0 && (
                    <div className="text-[11px] text-slate-500 border border-dashed border-dark-600 rounded-xl px-3 py-5 text-center">
                      Glisse des tâches ici ou crée-en une nouvelle.
                    </div>
                  )}

                  {colTasks.map((task) => {
                    const weekClass =
                      WEEK_BADGE_CLASSES[task.week] ||
                      'bg-slate-700/40 text-slate-100 border border-slate-500/40';

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => {
                          e.stopPropagation();
                          handleDropOnTask(task.id, colId);
                        }}
                        className="group bg-dark-900 border border-dark-600 rounded-xl px-3 py-3 text-sm text-slate-100 flex flex-col gap-2 shadow-sm hover:border-brand-500/30 hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${weekClass}`}
                          >
                            Semaine {task.week}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                            {task.phase}
                          </span>
                        </div>
                        <p className="text-[13px] leading-relaxed">
                          {task.content}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          {colId !== 'done' ? (
                            <button
                              type="button"
                              onClick={() => {
                                // Passer directement en "Terminé"
                                handleDropOnTask(task.id, 'done');
                              }}
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
                            >
                              <IconCheck className="w-3.5 h-3.5" />
                              Marquer comme fait
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-400 inline-flex items-center gap-1">
                              <IconCheck className="w-3.5 h-3.5" />
                              Terminé
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1.5 rounded-lg text-[11px] text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Supprimer cette tâche"
                          >
                            <IconTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeChantier;