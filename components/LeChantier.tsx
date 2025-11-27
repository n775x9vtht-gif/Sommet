import React, { useEffect, useState } from 'react';
import { SavedIdea, KanbanBoard, KanbanTask } from '../types';
import { 
  IconConstruction, 
  IconArrowRight, 
  IconCheck, 
  IconPlus 
} from './Icons';

interface LeChantierProps {
  savedIdeas: SavedIdea[];
  initialIdea?: SavedIdea | null;
  onSaveKanban: (ideaId: string, board: KanbanBoard) => void;
  isGuestMode: boolean;
  onTriggerAuth: () => void;
  onOpenPricing: () => void;
}

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
  const [newTaskContent, setNewTaskContent] = useState<string>('');

  // --------- Sélection initiale du projet ----------
  useEffect(() => {
    if (initialIdea) {
      setSelectedIdeaId(initialIdea.id);
    } else if (savedIdeas.length > 0 && !selectedIdeaId) {
      setSelectedIdeaId(savedIdeas[0].id);
    }
  }, [initialIdea, savedIdeas]);

  const selectedIdea = savedIdeas.find((i) => i.id === selectedIdeaId) || null;

  // --------- Initialisation / chargement du Kanban ----------
  useEffect(() => {
    if (!selectedIdea) {
      setBoard(null);
      return;
    }

    // Si un board existe déjà en base pour cette idée → on le prend
    if (selectedIdea.kanbanBoard) {
      setBoard(selectedIdea.kanbanBoard);
      return;
    }

    // Sinon, on essaie de le générer à partir du blueprint (roadmap)
    if (selectedIdea.blueprint) {
      const tasksFromRoadmap: KanbanTask[] = selectedIdea.blueprint.roadmap.flatMap(
        (step, stepIdx) =>
          step.tasks.map((t, idx) => ({
            id: `${selectedIdea.id}-w${step.week}-${stepIdx}-${idx}`,
            content: t,
            columnId: 'todo' as const,
            week: step.week,
            phase: step.phase,
          }))
      );

      const initialBoard: KanbanBoard = {
        lastUpdated: Date.now(),
        tasks: tasksFromRoadmap,
      };

      setBoard(initialBoard);
      onSaveKanban(selectedIdea.id, initialBoard);
    } else {
      // Pas encore de blueprint → board vide
      const emptyBoard: KanbanBoard = {
        lastUpdated: Date.now(),
        tasks: [],
      };
      setBoard(emptyBoard);
      onSaveKanban(selectedIdea.id, emptyBoard);
    }
  }, [selectedIdea?.id]);

  // --------- Utils pour modifier et persister le board ----------
  const updateBoard = (updater: (prev: KanbanBoard) => KanbanBoard) => {
    if (!selectedIdea) return;
    setBoard((prev) => {
      const base: KanbanBoard = prev || { lastUpdated: Date.now(), tasks: [] };
      const next = updater(base);
      onSaveKanban(selectedIdea.id, next);
      return next;
    });
  };

  const handleMoveTask = (taskId: string, newColumnId: KanbanTask['columnId']) => {
    updateBoard((prev) => ({
      ...prev,
      lastUpdated: Date.now(),
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, columnId: newColumnId } : t
      ),
    }));
  };

  const handleAddTask = () => {
    if (!selectedIdea || !newTaskContent.trim()) return;

    const task: KanbanTask = {
      id: `${selectedIdea.id}-${Date.now()}`,
      content: newTaskContent.trim(),
      columnId: 'todo',
      week: 0,
      phase: 'Divers',
    };

    updateBoard((prev) => ({
      ...prev,
      lastUpdated: Date.now(),
      tasks: [...prev.tasks, task],
    }));

    setNewTaskContent('');
  };

  // --------- EMPTY STATE : pas d’idées ----------
  if (savedIdeas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="w-24 h-24 bg-dark-800 rounded-3xl flex items-center justify-center mb-8 border border-dark-700 shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500">
          <IconConstruction className="w-12 h-12 text-slate-600" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
          Aucun projet à construire
        </h2>
        <p className="text-slate-400 max-w-md mb-10 text-lg leading-relaxed">
          Commence par générer et sauvegarder une idée. Ensuite, tu pourras la transformer en chantier opérationnel.
        </p>
      </div>
    );
  }

  // Si on est en mode invité et que tu veux verrouiller Le Chantier
  if (isGuestMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -z-10"></div>
                <div className="w-24 h-24 bg-dark-800 rounded-3xl flex items-center justify-center mb-8 border border-dark-700 shadow-2xl">
          <IconConstruction className="w-10 h-10 text-gold-500" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
          Le Chantier est réservé aux membres
        </h2>
        <p className="text-slate-400 max-w-md mb-8 text-lg leading-relaxed">
          Crée un compte ou passe à un plan supérieur pour débloquer l’espace de pilotage de ton projet.
        </p>
        <button
          onClick={onTriggerAuth}
          className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold text-sm shadow-lg shadow-gold-500/30 transition-transform hover:-translate-y-0.5"
        >
          Créer mon compte
        </button>
      </div>
    );
  }

  if (!selectedIdea || !board) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400 text-sm">
        Chargement de votre espace Sommet...
      </div>
    );
  }

  const columns: { id: KanbanTask['columnId']; title: string; description: string }[] = [
    { id: 'todo',        title: 'Backlog',       description: 'Tâches à prioriser' },
    { id: 'in-progress', title: 'En cours',      description: 'Travail en cours' },
    { id: 'done',        title: 'Terminé',       description: 'Ce qui est livré' },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-32">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-dark-800 rounded-2xl mb-6 border border-dark-700 shadow-lg">
          <IconConstruction className="w-8 h-8 text-brand-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Le Chantier <span className="text-brand-500">Sommet</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Transforme ta roadmap en plan d’attaque concret. Visualise, organise et pilote ton exécution semaine après semaine.
        </p>
      </div>

      {/* Selection + actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-dark-800/60 p-4 rounded-2xl border border-dark-700 backdrop-blur-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Projet :
          </span>
          <select
            value={selectedIdeaId}
            onChange={(e) => setSelectedIdeaId(e.target.value)}
            className="bg-dark-900 text-white border border-dark-600 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-500 min-w-[240px] font-semibold"
          >
            {savedIdeas.map((idea) => (
              <option key={idea.id} value={idea.id}>
                {idea.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Ajouter une tâche rapide..."
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            className="flex-1 md:flex-none bg-dark-900 text-white border border-dark-600 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-500 placeholder-slate-600 text-sm"
          />
          <button
            onClick={handleAddTask}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-lg shadow-brand-600/20 transition-transform hover:-translate-y-0.5"
          >
            <IconPlus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const tasks = board.tasks.filter((t) => t.columnId === col.id);

          return (
            <div
              key={col.id}
              className="bg-dark-800 border border-dark-700 rounded-2xl p-4 flex flex-col min-h-[260px]"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {col.title}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-900 text-slate-400 border border-dark-600">
                      {tasks.length}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">{col.description}</p>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {tasks.length === 0 && (
                  <p className="text-[11px] text-slate-600 italic mt-2">
                    Aucune tâche pour le moment.
                  </p>
                )}

                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-dark-900 border border-dark-600 rounded-xl p-3 text-sm text-slate-200 shadow-sm hover:border-brand-500/40 transition-colors group"
                  >
                    <p className="mb-2">{task.content}</p>
                    {(task.week || task.phase) && (
                      <p className="text-[10px] text-slate-500 mb-2">
                        {task.week ? `Semaine ${task.week} · ` : ''}
                        {task.phase}
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-1">
                        {col.id !== 'todo' && (
                          <button
                            onClick={() => handleMoveTask(task.id, 'todo')}
                            className="text-[10px] px-2 py-1 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 border border-dark-600 transition-colors"
                          >
                            Backlog
                          </button>
                        )}
                        {col.id !== 'in-progress' && (
                          <button
                            onClick={() => handleMoveTask(task.id, 'in-progress')}
                            className="text-[10px] px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-100 border border-blue-500/40 transition-colors flex items-center gap-1"
                          >
                            <IconArrowRight className="w-3 h-3" />
                            En cours
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            onClick={() => handleMoveTask(task.id, 'done')}
                            className="text-[10px] px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-100 border border-emerald-500/40 transition-colors flex items-center gap-1"
                          >
                            <IconCheck className="w-3 h-3" />
                            Terminer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeChantier;