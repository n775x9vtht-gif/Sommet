// components/LeChantier.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { ChatMessage, SavedIdea, KanbanBoard, KanbanTask } from '../types';
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
  const [isSherpaModalOpen, setIsSherpaModalOpen] = useState(false);
  const [codeCopyState, setCodeCopyState] = useState<Record<string, 'idle' | 'copied' | 'error'>>({});
  const [sherpaHistory, setSherpaHistory] = useState<ChatMessage[]>([]);
  const [activeSherpaEntry, setActiveSherpaEntry] = useState<{ prompt: string; answer: string } | null>(null);
  const [followUpPrompt, setFollowUpPrompt] = useState('');

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

  const historyStorageKey = useMemo(
    () => (selectedIdea ? `sherpa-history-${selectedIdea.id}` : null),
    [selectedIdea]
  );

  useEffect(() => {
    if (!historyStorageKey || typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(historyStorageKey);
      if (raw) {
        const parsed: ChatMessage[] = JSON.parse(raw);
        setSherpaHistory(parsed);
      } else {
        setSherpaHistory([]);
      }
    } catch (error) {
      console.error('Impossible de charger l’historique Sherpa', error);
      setSherpaHistory([]);
    }
  }, [historyStorageKey]);

  useEffect(() => {
    if (sherpaHistory.length >= 2) {
      const last = sherpaHistory[sherpaHistory.length - 1];
      const prev = sherpaHistory[sherpaHistory.length - 2];
      if (last.role === 'sherpa' && prev.role === 'user') {
        setSherpaAnswer(last.content);
        setActiveSherpaEntry({ prompt: prev.content, answer: last.content });
        return;
      }
    }
    setSherpaAnswer(null);
    setActiveSherpaEntry(null);
  }, [sherpaHistory, selectedIdeaId]);

  const persistSherpaHistory = (messages: ChatMessage[]) => {
    setSherpaHistory(messages);
    if (!historyStorageKey || typeof window === 'undefined') return;
    try {
      localStorage.setItem(historyStorageKey, JSON.stringify(messages));
    } catch (error) {
      console.error('Impossible de sauvegarder l’historique Sherpa', error);
    }
  };

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

  const handleAskSherpa = async (customPrompt?: string) => {
    const promptToSend = (customPrompt ?? sherpaPrompt).trim();

    if (!promptToSend) {
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
      const response = await askSherpa(promptToSend, projectContext);
      const newHistory: ChatMessage[] = [
        ...sherpaHistory,
        { role: 'user', content: promptToSend, timestamp: Date.now() },
        { role: 'sherpa', content: response, timestamp: Date.now() },
      ];

      persistSherpaHistory(newHistory);
      setSherpaAnswer(response);
      setActiveSherpaEntry({ prompt: promptToSend, answer: response });
      setIsSherpaModalOpen(true);
      setFollowUpPrompt('');
    } catch (error) {
      setSherpaError("Impossible de joindre le Sherpa. Vérifie la clé API Gemini ou réessaie.");
    } finally {
      setIsSherpaLoading(false);
    }
  };

  const handleAskSherpaFromTask = (task: KanbanTask) => {
    const taskPrompt = `Aide-moi à débloquer cette tâche du Kanban: "${task.content}" (colonne: ${task.columnId}, semaine ${task.week}, phase ${task.phase}). Donne-moi un plan d'action clair, des snippets de code et des vérifications à effectuer.`;
    setSherpaPrompt(taskPrompt);
    setFollowUpPrompt('');
    void handleAskSherpa(taskPrompt);
  };

  const handleCopySherpaCode = async (code: string, key: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCodeCopyState((prev) => ({ ...prev, [key]: 'copied' }));
      setTimeout(() => {
        setCodeCopyState((prev) => ({ ...prev, [key]: 'idle' }));
      }, 2000);
    } catch (error) {
      setCodeCopyState((prev) => ({ ...prev, [key]: 'error' }));
      setTimeout(() => {
        setCodeCopyState((prev) => ({ ...prev, [key]: 'idle' }));
      }, 2000);
    }
  };

  const extractCodeBlocks = (content: string) => {
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks: { language: string; code: string; id: string }[] = [];
    let match;
    let index = 0;
    while ((match = regex.exec(content))) {
      const language = match[1] || 'code';
      const code = match[2].trim();
      blocks.push({ language, code, id: `${language}-${index}` });
      index += 1;
    }
    return blocks;
  };

  const renderSherpaContent = (content: string) => {
    const blocks = extractCodeBlocks(content);
    if (blocks.length === 0) {
      return (
        <div className="prose prose-invert max-w-none text-slate-100 text-sm whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      );
    }

    const segments = content.split(/```\w*\n[\s\S]*?```/g);

    return (
      <div className="flex flex-col gap-4 max-h-[68vh] overflow-y-auto pr-1">
        {segments.map((segment, idx) => (
          <React.Fragment key={`segment-${idx}`}>
            {segment && (
              <div className="prose prose-invert max-w-none text-slate-100 text-sm whitespace-pre-wrap leading-relaxed">
                {segment.trim()}
              </div>
            )}
            {blocks[idx] && (
              <div className="relative bg-dark-800 border border-dark-600 rounded-xl overflow-hidden shadow-inner">
                <div className="flex items-center justify-between px-3 py-2 border-b border-dark-700 text-[12px] text-slate-300">
                  <span className="font-semibold">Snippet {blocks[idx].language}</span>
                  <button
                    type="button"
                    onClick={() => handleCopySherpaCode(blocks[idx].code, blocks[idx].id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-700 border border-dark-600 hover:border-emerald-400/60 hover:text-emerald-100 transition-colors"
                  >
                    {codeCopyState[blocks[idx].id] === 'copied'
                      ? 'Copié'
                      : codeCopyState[blocks[idx].id] === 'error'
                      ? 'Erreur copie'
                      : 'Copier le code'}
                  </button>
                </div>
                <pre className="text-[12px] leading-relaxed text-slate-100 overflow-auto p-3 bg-dark-900/70">{blocks[idx].code}</pre>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const sherpaSessions = useMemo(() => {
    const sessions: { prompt: ChatMessage; answer: ChatMessage }[] = [];
    for (let i = 0; i < sherpaHistory.length; i += 2) {
      const userMsg = sherpaHistory[i];
      const sherpaMsg = sherpaHistory[i + 1];
      if (userMsg?.role === 'user' && sherpaMsg?.role === 'sherpa') {
        sessions.unshift({ prompt: userMsg, answer: sherpaMsg });
      }
    }
    return sessions;
  }, [sherpaHistory]);

  const activeContent = activeSherpaEntry ?? (sherpaAnswer ? { prompt: sherpaPrompt, answer: sherpaAnswer } : null);

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
                <div className="bg-dark-900 border border-dark-700 rounded-xl p-3 text-sm text-slate-100 leading-relaxed shadow-inner flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-slate-300 font-semibold">Réponse prête</span>
                    <div className="flex items-center gap-2 text-[12px] text-slate-400">
                      <button
                        type="button"
                        onClick={() => setIsSherpaModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700 hover:border-gold-400/50 hover:text-gold-100 transition-colors"
                      >
                        Ouvrir en pop-up
                      </button>
                      {extractCodeBlocks(sherpaAnswer).length > 0 ? (
                        <button
                          type="button"
                          onClick={() => {
                            const [first] = extractCodeBlocks(sherpaAnswer);
                            if (first) handleCopySherpaCode(first.code, 'inline');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700 hover:border-emerald-400/60 hover:text-emerald-100 transition-colors"
                        >
                          {codeCopyState.inline === 'copied'
                            ? 'Code copié'
                            : codeCopyState.inline === 'error'
                            ? 'Copie impossible'
                            : 'Copier le code'}
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700 text-slate-500">Aucun code à copier</span>
                      )}
                    </div>
                  </div>
                  <p className="text-[12px] text-slate-400">
                    La réponse complète s'affiche dans une fenêtre pour éviter de pousser le Kanban vers le bas.
                  </p>
                </div>
              )}
            </div>
            <div className="bg-dark-900/60 border border-dark-700 rounded-xl p-4 text-sm text-slate-200 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Historique Sherpa</p>
                  <p className="text-xs text-slate-400">Retrouve tes derniers échanges et les codes générés.</p>
                </div>
                {sherpaSessions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsSherpaModalOpen(true)}
                    className="text-[12px] px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700 hover:border-gold-400/50 hover:text-gold-100 transition-colors"
                  >
                    Ouvrir le dernier échange
                  </button>
                )}
              </div>

              {sherpaSessions.length === 0 ? (
                <p className="text-slate-500 text-sm">Pas encore d'échange enregistré pour ce chantier.</p>
              ) : (
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {sherpaSessions.map((session, idx) => {
                    const codeBlocks = extractCodeBlocks(session.answer.content);
                    const preview = session.answer.content.split('\n').slice(0, 2).join(' ');
                    return (
                      <div
                        key={`${session.prompt.timestamp}-${idx}`}
                        className="rounded-lg border border-dark-700 bg-dark-800/70 p-3 flex flex-col gap-2 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[12px] text-slate-400">
                            {new Date(session.prompt.timestamp).toLocaleString('fr-FR')}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            {codeBlocks.length > 0 && (
                              <span className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                                {codeBlocks.length} code{codeBlocks.length > 1 ? 's' : ''}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSherpaEntry({ prompt: session.prompt.content, answer: session.answer.content });
                                setIsSherpaModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-dark-700 border border-dark-600 hover:border-gold-400/60 hover:text-gold-100 transition-colors"
                            >
                              Consulter
                            </button>
                          </div>
                        </div>
                        <p className="text-[13px] text-slate-200 line-clamp-2">{session.prompt.content}</p>
                        <p className="text-[12px] text-slate-400 line-clamp-2">{preview}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeContent && isSherpaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSherpaModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-6xl bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="flex items-start justify-between px-6 py-4 border-b border-dark-700 bg-dark-800/95 gap-3">
              <div className="flex flex-col gap-1 text-white">
                <div className="flex items-center gap-2 text-lg font-bold">
                  <IconSherpa className="w-5 h-5 text-gold-400" />
                  Réponse du Sherpa
                </div>
                <p className="text-sm text-slate-400 leading-snug line-clamp-2">
                  {activeContent.prompt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {extractCodeBlocks(activeContent.answer).length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const [first] = extractCodeBlocks(activeContent.answer);
                      if (first) handleCopySherpaCode(first.code, 'modal');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-dark-700 border border-dark-600 text-slate-200 hover:border-emerald-400/60 hover:text-emerald-100 transition-colors text-sm"
                  >
                    {codeCopyState.modal === 'copied'
                      ? 'Code copié'
                      : codeCopyState.modal === 'error'
                      ? 'Copie impossible'
                      : 'Copier le code'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsSherpaModalOpen(false)}
                  className="p-2 rounded-lg bg-dark-700 border border-dark-600 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
            <div className="max-h-[78vh] overflow-hidden grid grid-cols-1 lg:grid-cols-[3fr_1fr]">
              <div className="p-6 border-r border-dark-800 max-h-[78vh] overflow-y-auto flex flex-col gap-4">
                {renderSherpaContent(activeContent.answer)}

                <div className="mt-2 bg-dark-900/60 border border-dark-800 rounded-xl p-4 shadow-inner">
                  <p className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <IconSherpa className="w-4 h-4 text-gold-400" />
                    Continuer la discussion
                  </p>
                  <p className="text-[12px] text-slate-400 mb-3">
                    Pose une question complémentaire ou demande un code plus précis sur cette tâche.
                  </p>
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={followUpPrompt}
                      onChange={(e) => setFollowUpPrompt(e.target.value)}
                      placeholder="Ex: propose un test unitaire pour ce code, ou détaille le déploiement."
                      className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[90px]"
                    />
                    <div className="flex items-center justify-between">
                      {sherpaError && (
                        <span className="text-[12px] text-red-400 font-semibold">{sherpaError}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleAskSherpa(followUpPrompt)}
                        disabled={isSherpaLoading}
                        className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500/90 hover:bg-gold-400 text-dark-900 font-semibold shadow-lg shadow-gold-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSherpaLoading ? 'Le Sherpa réfléchit...' : 'Envoyer'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-dark-900/60 p-4 flex flex-col gap-3 max-h-[78vh] overflow-y-auto">
                <div className="flex items-center justify-between text-slate-200">
                  <p className="font-semibold text-sm">Historique</p>
                  {sherpaSessions.length > 0 && (
                    <span className="text-[12px] text-slate-500">{sherpaSessions.length} échange(s)</span>
                  )}
                </div>
                {sherpaSessions.length === 0 ? (
                  <p className="text-slate-500 text-sm">Aucun échange enregistré pour ce projet.</p>
                ) : (
                  <div className="space-y-2">
                    {sherpaSessions.map((session, idx) => (
                      <button
                        key={`modal-session-${session.prompt.timestamp}-${idx}`}
                        type="button"
                        onClick={() => {
                          setActiveSherpaEntry({ prompt: session.prompt.content, answer: session.answer.content });
                        }}
                        className={`w-full text-left rounded-lg border px-3 py-2 transition-colors ${
                          activeContent.answer === session.answer.content
                            ? 'border-gold-400/60 bg-gold-500/5 text-slate-100'
                            : 'border-dark-700 bg-dark-800/70 text-slate-300 hover:border-gold-400/40'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[12px] text-slate-400 mb-1">
                          <span>{new Date(session.prompt.timestamp).toLocaleString('fr-FR')}</span>
                          {extractCodeBlocks(session.answer.content).length > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                              Code
                            </span>
                          )}
                        </div>
                        <p className="text-[13px] text-slate-100 line-clamp-2">{session.prompt.content}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
                        <div className="flex items-center justify-between pt-1 gap-2">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleAskSherpaFromTask(task)}
                              className="inline-flex items-center gap-1 text-[11px] text-gold-300 hover:text-gold-100"
                            >
                              <IconSherpa className="w-3.5 h-3.5" />
                              SOS Sherpa
                            </button>
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
                          </div>
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