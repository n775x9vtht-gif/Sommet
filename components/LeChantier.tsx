import React, { useState, useEffect, useRef } from 'react';
import { SavedIdea, KanbanBoard, KanbanTask, ChatMessage } from '../types';
import { askSherpa } from '../services/geminiService';
import { getCurrentUserProfile } from '../services/profileService';
import {
  IconSherpa,
  IconX,
  IconLock,
  IconCopy,
  IconCheck,
  IconPlus,
  IconTrash,
  IconConstruction,
  IconDiamond,
} from './Icons';

interface LeChantierProps {
  savedIdeas: SavedIdea[];
  initialIdea?: SavedIdea | null;
  onSaveKanban: (ideaId: string, kanban: KanbanBoard) => void;
  isGuestMode?: boolean;
  onTriggerAuth?: () => void;
  onOpenPricing?: () => void; // ✅ pour le CTA "Voir les offres"
}

// --- Internal Component: CodeBlock ---
const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-dark-700 bg-dark-950 shadow-lg group/code">
      <div className="flex items-center justify-between px-4 py-2 bg-dark-800 border-b border-dark-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
          </div>
          <span className="ml-2 text-[10px] font-mono text-slate-500 lowercase font-bold">
            {language || 'terminal'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-white transition-colors bg-dark-700 hover:bg-dark-600 px-2 py-1 rounded border border-dark-600"
        >
          {copied ? (
            <>
              <IconCheck className="w-3 h-3 text-green-500" />
              <span className="text-green-500">Copié !</span>
            </>
          ) : (
            <>
              <IconCopy className="w-3 h-3" />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto custom-scrollbar relative">
        <pre className="font-mono text-xs md:text-sm text-brand-100 leading-relaxed whitespace-pre-wrap break-words">
          <code>{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
};

const LeChantier: React.FC<LeChantierProps> = ({
  savedIdeas,
  initialIdea,
  onSaveKanban,
  isGuestMode = false,
  onTriggerAuth,
  onOpenPricing,
}) => {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('');
  const [localBoard, setLocalBoard] = useState<KanbanBoard | null>(null);

  // 🔑 Gestion du plan utilisateur
  const [plan, setPlan] = useState<'camp_de_base' | 'explorateur' | 'batisseur' | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Drag and Drop State
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null); // Can be a column ID or a task ID for insertion

  // Manual Task Add State
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [newTaskWeek, setNewTaskWeek] = useState<number>(0); // 0 = Manual/Perso, 1-4 = Weeks

  // Sherpa Chat State
  const [sherpaModalOpen, setSherpaModalOpen] = useState(false);
  const [currentTaskContext, setCurrentTaskContext] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔁 Charger le plan utilisateur
  useEffect(() => {
    (async () => {
      if (isGuestMode) {
        // En mode démo, on considère l'utilisateur comme Camp de Base pour le gating
        setPlan('camp_de_base');
        setProfileLoading(false);
        return;
      }

      const profile = await getCurrentUserProfile();
      const userPlan =
        (profile?.plan as 'camp_de_base' | 'explorateur' | 'batisseur' | undefined) ||
        'camp_de_base';
      setPlan(userPlan);
      setProfileLoading(false);
    })();
  }, [isGuestMode]);

  useEffect(() => {
    if (initialIdea) {
      setSelectedIdeaId(initialIdea.id);
    } else if (savedIdeas.length > 0 && !selectedIdeaId) {
      setSelectedIdeaId(savedIdeas[0].id);
    }
  }, [initialIdea, savedIdeas]);

  const selectedIdea = savedIdeas.find((i) => i.id === selectedIdeaId);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (sherpaModalOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, sherpaModalOpen, isTyping]);

  // Load or Initialize Board
  useEffect(() => {
    if (!selectedIdea) return;

    if (selectedIdea.kanbanBoard) {
      setLocalBoard(selectedIdea.kanbanBoard);
    } else if (selectedIdea.blueprint) {
      // Auto-initialize from Blueprint
      const newTasks: KanbanTask[] = [];
      selectedIdea.blueprint.roadmap.forEach((step) => {
        step.tasks.forEach((taskContent, idx) => {
          newTasks.push({
            id: `t-${step.week}-${idx}-${crypto.randomUUID().slice(0, 4)}`,
            content: taskContent,
            columnId: 'todo', // Default all to Todo
            week: step.week,
            phase: step.phase,
          });
        });
      });
      const newBoard: KanbanBoard = {
        lastUpdated: Date.now(),
        tasks: newTasks,
      };
      setLocalBoard(newBoard);

      if (!isGuestMode) {
        onSaveKanban(selectedIdea.id, newBoard);
      }
    } else {
      setLocalBoard(null);
    }
  }, [selectedIdeaId, savedIdeas]);

  const handleMoveTask = (taskId: string, targetCol: 'todo' | 'in-progress' | 'done') => {
    if (!localBoard || !selectedIdea) return;

    const updatedTasks = localBoard.tasks.map((t) =>
      t.id === taskId ? { ...t, columnId: targetCol } : t
    );

    const updatedBoard = { ...localBoard, tasks: updatedTasks, lastUpdated: Date.now() };
    setLocalBoard(updatedBoard);

    // Save changes unless in guest mode (where changes are local only for the session)
    if (!isGuestMode) {
      onSaveKanban(selectedIdea.id, updatedBoard);
    }
  };

  // --- DELETE TASK ---
  const handleDeleteTask = (taskId: string) => {
    if (!localBoard || !selectedIdea) return;

    if (window.confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      const updatedTasks = localBoard.tasks.filter((t) => t.id !== taskId);
      const updatedBoard = { ...localBoard, tasks: updatedTasks, lastUpdated: Date.now() };
      setLocalBoard(updatedBoard);

      if (!isGuestMode) {
        onSaveKanban(selectedIdea.id, updatedBoard);
      }
    }
  };

  // --- MANUAL TASK ADDITION ---
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localBoard || !selectedIdea || !newTaskContent.trim()) return;

    const newTask: KanbanTask = {
      id: `manual-${Date.now()}`,
      content: newTaskContent,
      columnId: 'todo',
      week: newTaskWeek,
      phase: newTaskWeek === 0 ? 'Tâche Manuelle' : `Ajout Manuel (Semaine ${newTaskWeek})`,
    };

    const updatedBoard = {
      ...localBoard,
      tasks: [newTask, ...localBoard.tasks],
      lastUpdated: Date.now(),
    };

    setLocalBoard(updatedBoard);
    setNewTaskContent('');
    setNewTaskWeek(0); // Reset to Perso
    setIsAddingTask(false);

    if (!isGuestMode) {
      onSaveKanban(selectedIdea.id, updatedBoard);
    }
  };

  // --- DRAG AND DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault(); // Necessary to allow dropping
    e.stopPropagation();
    if (activeDropZone !== zoneId) {
      setActiveDropZone(zoneId);
    }
  };

  const handleDragLeave = () => {
    setActiveDropZone(null);
  };

  const handleColumnDrop = (e: React.DragEvent, colId: 'todo' | 'in-progress' | 'done') => {
    e.preventDefault();
    e.stopPropagation();
    const taskId = e.dataTransfer.getData('taskId');

    // If dropped on the column directly, assume appending to the end
    if (taskId) {
      handleMoveTask(taskId, colId);
    }

    setDraggingTaskId(null);
    setActiveDropZone(null);
  };

  // --- REORDERING LOGIC ---
  const handleTaskDrop = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();
    e.stopPropagation(); // Critical: Don't bubble to column drop handler

    const sourceTaskId = e.dataTransfer.getData('taskId');

    if (!sourceTaskId || sourceTaskId === targetTaskId || !localBoard || !selectedIdea) {
      setDraggingTaskId(null);
      setActiveDropZone(null);
      return;
    }

    // Determine Drop Position (Top or Bottom half)
    const targetElement = e.currentTarget as HTMLElement;
    const rect = targetElement.getBoundingClientRect();
    const offset = e.clientY - rect.top;
    const isBottomHalf = offset > rect.height / 2;

    const tasksCopy = [...localBoard.tasks];
    const sourceTask = tasksCopy.find((t) => t.id === sourceTaskId);
    const targetTask = tasksCopy.find((t) => t.id === targetTaskId);

    if (!sourceTask || !targetTask) return;

    // Remove source task
    const filteredTasks = tasksCopy.filter((t) => t.id !== sourceTaskId);

    // Find index of target in the filtered array
    const targetIndex = filteredTasks.findIndex((t) => t.id === targetTaskId);

    // Insert index: if bottom half, insert AFTER target, else BEFORE
    const insertIndex = isBottomHalf ? targetIndex + 1 : targetIndex;

    // Update source task column to match target
    const updatedSourceTask = { ...sourceTask, columnId: targetTask.columnId };

    // Insert source task
    filteredTasks.splice(insertIndex, 0, updatedSourceTask);

    const updatedBoard = { ...localBoard, tasks: filteredTasks, lastUpdated: Date.now() };
    setLocalBoard(updatedBoard);

    if (!isGuestMode) {
      onSaveKanban(selectedIdea.id, updatedBoard);
    }

    setDraggingTaskId(null);
    setActiveDropZone(null);
  };

  // 1. Initial SOS Request (Allowed in Demo)
  const handleAskSherpa = async (taskContent: string) => {
    setCurrentTaskContext(taskContent);
    setSherpaModalOpen(true);
    setChatMessages([]); // Reset chat
    setIsTyping(true);

    try {
      const context = `Projet: ${selectedIdea?.title}. Stack: ${selectedIdea?.blueprint?.techStack
        .map((t) => t.toolName)
        .join(', ')}. Feature: ${selectedIdea?.blueprint?.coreFeature.name}`;
      const response = await askSherpa(taskContent, context);

      const initialMessage: ChatMessage = {
        role: 'sherpa',
        content: response,
        timestamp: Date.now(),
      };
      setChatMessages([initialMessage]);
    } catch (e) {
      const errorMessage: ChatMessage = {
        role: 'sherpa',
        content: 'Le Sherpa est indisponible pour le moment. Veuillez réessayer.',
        timestamp: Date.now(),
      };
      setChatMessages([errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // 2. Follow-up Conversation (Locked in Demo)
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    if (isGuestMode) {
      if (onTriggerAuth) onTriggerAuth();
      return;
    }

    const userMsg: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const context = `Projet: ${selectedIdea?.title}. Tâche initiale: ${currentTaskContext}. Stack: ${selectedIdea?.blueprint?.techStack
        .map((t) => t.toolName)
        .join(', ')}.`;
      const continueSherpaConversation = (await import('../services/geminiService'))
        .continueSherpaConversation;
      const response = await continueSherpaConversation(chatMessages, userMsg.content, context);

      const sherpaMsg: ChatMessage = {
        role: 'sherpa',
        content: response,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, sherpaMsg]);
    } catch (e) {
      // Handle error
    } finally {
      setIsTyping(false);
    }
  };

  // Filter tasks by column
  const getTasks = (colId: string) => localBoard?.tasks.filter((t) => t.columnId === colId) || [];

  // IMPROVED MARKDOWN RENDERER
  const renderMarkdown = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w+)?\s*([\s\S]*?)```/);
        if (match) {
          const language = match[1] || '';
          const code = match[2];
          return <CodeBlock key={index} language={language} code={code} />;
        }
      }

      return (
        <div key={index} className="space-y-3 my-2">
          {part.split('\n').map((line, lineIdx) => {
            const key = `${index}-${lineIdx}`;
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;

            if (
              trimmedLine.startsWith('**') &&
              trimmedLine.endsWith('**') &&
              trimmedLine.length > 4
            ) {
              return (
                <h3
                  key={key}
                  className="font-bold text-lg text-gold-400 mt-5 mb-2"
                >
                  {trimmedLine.slice(2, -2)}
                </h3>
              );
            }

            if (trimmedLine.startsWith('### ')) {
              return (
                <h3
                  key={key}
                  className="font-bold text-lg text-gold-400 mt-4 mb-2 border-b border-dark-700 pb-1"
                >
                  {trimmedLine.replace('### ', '')}
                </h3>
              );
            }
            if (trimmedLine.startsWith('## ')) {
              return (
                <h3
                  key={key}
                  className="font-bold text-xl text-white mt-5 mb-2"
                >
                  {trimmedLine.replace('## ', '')}
                </h3>
              );
            }

            if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
              const content = trimmedLine.replace(/^[-*] /, '');
              return (
                <div key={key} className="flex items-start gap-3 ml-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 shrink-0 shadow-[0_0_5px_rgba(212,175,55,0.5)]"></div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {content.split(/(\*\*.*?\*\*)/g).map((p, i) => {
                      if (p.startsWith('**') && p.endsWith('**')) {
                        return (
                          <strong key={i} className="text-white font-bold">
                            {p.slice(2, -2)}
                          </strong>
                        );
                      }
                      return p;
                    })}
                  </p>
                </div>
              );
            }

            if (/^\d+\.\s/.test(trimmedLine)) {
              const content = trimmedLine.replace(/^\d+\.\s/, '');
              return (
                <div key={key} className="flex items-start gap-3 ml-1">
                  <span className="text-gold-500 font-bold text-xs mt-0.5 min-w-[1.2rem]">
                    {trimmedLine.match(/^\d+\./)?.[0]}
                  </span>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {content.split(/(\*\*.*?\*\*)/g).map((p, i) => {
                      if (p.startsWith('**') && p.endsWith('**')) {
                        return (
                          <strong key={i} className="text-white font-bold">
                            {p.slice(2, -2)}
                          </strong>
                        );
                      }
                      return p;
                    })}
                  </p>
                </div>
              );
            }

            const innerParts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
            return (
              <p key={key} className="text-slate-300 leading-relaxed">
                {innerParts.map((p, i) => {
                  if (p.startsWith('**') && p.endsWith('**')) {
                    return (
                      <strong key={i} className="text-white font-semibold">
                        {p.slice(2, -2)}
                      </strong>
                    );
                  }
                  if (p.startsWith('`') && p.endsWith('`')) {
                    return (
                      <code
                        key={i}
                        className="bg-dark-950 border border-dark-700 text-brand-300 px-1.5 py-0.5 rounded text-xs font-mono"
                      >
                        {p.slice(1, -1)}
                      </code>
                    );
                  }
                  return p;
                })}
              </p>
            );
          })}
        </div>
      );
    });
  };

  // 🔄 Chargement du profil
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <svg
            className="animate-spin h-6 w-6 text-brand-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-sm">Chargement de votre espace Sommet...</p>
        </div>
      </div>
    );
  }

  // 🔒 Chantier réservé aux Bâtisseurs (écran cohérent avec Blueprint)
  if (!isGuestMode && plan !== 'batisseur') {
    const isExplorer = plan === 'explorateur';

    return (
      <div className="max-w-3xl mx-auto min-h-[70vh] flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mb-6 shadow-xl">
          <IconLock className="w-8 h-8 text-gold-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
          Le Chantier est réservé aux Bâtisseurs
        </h1>

        <p className="text-slate-400 mb-6 text-lg leading-relaxed max-w-xl">
          Le tableau de bord d&apos;exécution (Kanban détaillé + assistant Sherpa) est
          disponible uniquement avec l&apos;offre{' '}
          <span className="text-gold-400 font-semibold">Le Bâtisseur</span>.
        </p>

        <div className="bg-dark-800 border border-gold-500/30 rounded-2xl px-6 py-4 flex items-center gap-3 mb-8 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
          <IconDiamond className="w-5 h-5 text-gold-400" />
          <div className="text-left text-sm text-slate-300">
            <p className="mb-1 font-semibold text-slate-100">
              Avec votre offre actuelle, vous pouvez :
            </p>
            <p>
              • Générer des idées avec le Générateur
              <br />
              • Valider votre marché avec le Validateur
              {isExplorer && (
                <>
                  <br />
                  • Générer un Blueprint MVP complet
                </>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenPricing?.()}
          className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-dark-900 rounded-2xl font-bold shadow-lg shadow-gold-500/20 hover:-translate-y-1 transition-all text-sm uppercase tracking-wide"
        >
          Voir les offres
        </button>

        <p className="text-xs text-slate-500 mt-4 max-w-sm">
          Astuce : validez d&apos;abord votre idée puis votre Blueprint. Passez ensuite à
          l&apos;offre Bâtisseur pour transformer le plan en exécution guidée, colonne
          par colonne, avec Le Chantier et le Sherpa.
        </p>
      </div>
    );
  }

  if (savedIdeas.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <IconConstruction className="w-16 h-16 text-dark-700 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Aucun chantier en cours</h2>
        <p className="text-slate-400">
          Générez une idée et un plan pour accéder au chantier.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-20 h-[calc(100vh-100px)] flex flex-col">
      {/* Header Standardisé */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center justify-center p-2.5 bg-dark-800 rounded-xl border border-dark-700 shadow-lg">
            <IconConstruction className="w-6 h-6 text-gold-500" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Le Chantier</h1>
            <p className="text-slate-400 text-sm">
              Exécutez votre plan, tâche après tâche.
            </p>
          </div>
        </div>

        <div className="flex items-center bg-dark-800 p-2 rounded-2xl border border-dark-700 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase mr-3 ml-2">
            Projet :
          </span>
          <select
            value={selectedIdeaId}
            onChange={(e) => setSelectedIdeaId(e.target.value)}
            className="bg-dark-900 text-white border border-dark-600 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 font-bold"
          >
            {savedIdeas.map((idea) => (
              <option key={idea.id} value={idea.id}>
                {idea.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!localBoard ? (
        <div className="flex-1 flex items-center justify-center bg-dark-800/30 rounded-[2rem] border border-dark-700 border-dashed">
          <div className="text-center max-w-md p-8">
            <h3 className="text-xl font-bold text-white mb-2">Pas de Plan détecté</h3>
            <p className="text-slate-400 mb-6">
              Pour ouvrir le chantier, vous devez d&apos;abord générer un Blueprint MVP
              pour ce projet.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-6 h-full min-w-[900px]">
            {/* TODO COLUMN */}
            <div
              className={`flex-1 flex flex-col rounded-3xl border h-full transition-colors overflow-hidden shadow-xl ${
                activeDropZone === 'todo'
                  ? 'bg-dark-800 border-brand-500/50 shadow-[0_0_25px_rgba(59,130,246,0.1)]'
                  : 'bg-dark-800/50 border-dark-700/50'
              }`}
              onDragOver={(e) => handleDragOver(e, 'todo')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleColumnDrop(e, 'todo')}
            >
              <div className="p-5 border-b border-dark-700/50 flex justify-between items-center bg-dark-800/80 backdrop-blur-sm">
                <h3 className="font-bold text-slate-300 uppercase tracking-wider text-xs flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div>
                  À faire ({getTasks('todo').length})
                </h3>
                <button
                  onClick={() => setIsAddingTask(!isAddingTask)}
                  className="p-1.5 hover:bg-dark-700 rounded-lg transition-colors text-slate-400 hover:text-white border border-transparent hover:border-dark-600"
                  title="Ajouter une tâche manuellement"
                >
                  <IconPlus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {isAddingTask && (
                  <form onSubmit={handleAddTask} className="mb-4 animate-fade-in">
                    <div className="bg-dark-900 p-4 rounded-2xl border border-brand-500 shadow-lg">
                      <input
                        autoFocus
                        type="text"
                        value={newTaskContent}
                        onChange={(e) => setNewTaskContent(e.target.value)}
                        placeholder="Nouvelle tâche..."
                        className="w-full bg-transparent border-none text-white text-sm placeholder-slate-600 focus:ring-0 p-0 mb-4 font-medium"
                      />
                      <select
                        value={newTaskWeek}
                        onChange={(e) => setNewTaskWeek(Number(e.target.value))}
                        className="w-full bg-dark-800 text-slate-300 text-xs border border-dark-700 rounded-lg p-2 mb-4 outline-none font-bold"
                      >
                        <option value={0}>Tâche Perso (Sans semaine)</option>
                        <option value={1}>Semaine 1</option>
                        <option value={2}>Semaine 2</option>
                        <option value={3}>Semaine 3 (Orange)</option>
                        <option value={4}>Semaine 4 (Rose)</option>
                      </select>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingTask(false)}
                          className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded hover:bg-dark-800 transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={!newTaskContent.trim()}
                          className="text-xs bg-brand-600 hover:bg-brand-500 text-white px-4 py-1.5 rounded-lg font-bold disabled:opacity-50 transition-colors"
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {getTasks('todo').map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onMove={(to) => handleMoveTask(task.id, to)}
                    onSherpa={() => handleAskSherpa(task.content)}
                    onDelete={() => handleDeleteTask(task.id)}
                    isGuestMode={isGuestMode}
                    onDragStart={handleDragStart}
                    onDrop={handleTaskDrop}
                    onDragOver={handleDragOver}
                    isDragging={draggingTaskId === task.id}
                    isDragOver={activeDropZone === task.id}
                  />
                ))}
              </div>
            </div>

            {/* IN PROGRESS COLUMN */}
            <div
              className={`flex-1 flex flex-col rounded-3xl border h-full relative transition-colors overflow-hidden shadow-xl ${
                activeDropZone === 'in-progress'
                  ? 'bg-dark-800 border-brand-500/50 shadow-[0_0_25px_rgba(59,130,246,0.1)]'
                  : 'bg-dark-800/50 border-brand-900/30'
              }`}
              onDragOver={(e) => handleDragOver(e, 'in-progress')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleColumnDrop(e, 'in-progress')}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-500/50"></div>
              <div className="p-5 border-b border-brand-900/30 flex justify-between items-center bg-dark-800/80 backdrop-blur-sm">
                <h3 className="font-bold text-brand-400 uppercase tracking-wider text-xs flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse"></div>
                  En cours ({getTasks('in-progress').length})
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {getTasks('in-progress').map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onMove={(to) => handleMoveTask(task.id, to)}
                    onSherpa={() => handleAskSherpa(task.content)}
                    onDelete={() => handleDeleteTask(task.id)}
                    isGuestMode={isGuestMode}
                    onDragStart={handleDragStart}
                    onDrop={handleTaskDrop}
                    onDragOver={handleDragOver}
                    isDragging={draggingTaskId === task.id}
                    isDragOver={activeDropZone === task.id}
                  />
                ))}
              </div>
            </div>

            {/* DONE COLUMN */}
            <div
              className={`flex-1 flex flex-col rounded-3xl border h-full transition-colors overflow-hidden shadow-xl ${
                activeDropZone === 'done'
                  ? 'bg-dark-800 border-green-500/50 shadow-[0_0_25px_rgba(34,197,94,0.1)]'
                  : 'bg-dark-800/50 border-dark-700/50'
              }`}
              onDragOver={(e) => handleDragOver(e, 'done')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleColumnDrop(e, 'done')}
            >
              <div className="p-5 border-b border-dark-700/50 flex justify-between items-center bg-dark-800/80 backdrop-blur-sm">
                <h3 className="font-bold text-green-500 uppercase tracking-wider text-xs flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  Terminé ({getTasks('done').length})
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {getTasks('done').map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onMove={(to) => handleMoveTask(task.id, to)}
                    onSherpa={() => handleAskSherpa(task.content)}
                    onDelete={() => handleDeleteTask(task.id)}
                    isGuestMode={isGuestMode}
                    onDragStart={handleDragStart}
                    onDrop={handleTaskDrop}
                    onDragOver={handleDragOver}
                    isDragging={draggingTaskId === task.id}
                    isDragOver={activeDropZone === task.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHERPA CHAT MODAL */}
      {sherpaModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
            onClick={() => setSherpaModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-2xl bg-dark-900 border border-gold-500/30 rounded-[2rem] shadow-2xl flex flex-col h-[85vh] max-h-[800px] animate-fade-in-up overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-800 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center border border-gold-500/20 shadow-lg">
                  <IconSherpa className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Le Sherpa</h3>
                  <p className="text-xs text-gold-500 font-bold uppercase tracking-wide">
                    Assistant Technique Senior
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSherpaModalOpen(false)}
                className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-dark-700 rounded-lg"
              >
                <IconX className="w-6 h-6" />
              </button>
            </div>

            {/* Task Context Banner */}
            <div className="bg-dark-800/50 border-b border-dark-700 p-3 shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-400 px-2">
                <span className="font-bold uppercase text-slate-500">
                  Contexte :
                </span>
                <span className="truncate max-w-[300px] md:max-w-[500px]">
                  {currentTaskContext}
                </span>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 bg-dark-900">
              {chatMessages.length === 0 && isTyping && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-gold-500 animate-pulse font-medium">
                    Le Sherpa analyse la situation...
                  </p>
                </div>
              )}

              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[90%] md:max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed shadow-lg ${
                      msg.role === 'user'
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : 'bg-dark-800 border border-dark-700 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.role === 'sherpa' ? (
                      <div className="w-full">{renderMarkdown(msg.content)}</div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {isTyping && chatMessages.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-dark-800 border border-dark-700 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-dark-700 bg-dark-800 shrink-0">
              {isGuestMode && chatMessages.length > 0 ? (
                // LOCKED STATE FOR GUEST MODE
                <div
                  onClick={onTriggerAuth}
                  className="cursor-pointer group relative overflow-hidden rounded-2xl border border-gold-500/30 bg-dark-900 p-6 text-center transition-all hover:border-gold-500/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-3 bg-gold-500/10 rounded-full mb-1">
                      <IconLock className="w-6 h-6 text-gold-500" />
                    </div>
                    <p className="text-base font-bold text-white">
                      Mode Conversationnel Verrouillé
                    </p>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto">
                      Créez un compte gratuit pour discuter avec Le Sherpa et
                      résoudre vos blocages.
                    </p>
                    <span className="mt-3 inline-block text-xs font-bold text-dark-900 bg-gold-500 px-4 py-2 rounded-lg uppercase tracking-wide group-hover:bg-gold-400 transition-colors">
                      Débloquer maintenant
                    </span>
                  </div>
                </div>
              ) : (
                // UNLOCKED / INITIAL STATE
                <form onSubmit={handleSendMessage} className="flex gap-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isTyping}
                    placeholder={
                      chatMessages.length === 0
                        ? 'Posez votre question...'
                        : 'Répondre au Sherpa...'
                    }
                    className="flex-1 bg-dark-900 border border-dark-600 rounded-xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-brand-500 outline-none placeholder-slate-600 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-brand-600 hover:bg-brand-500 disabled:bg-dark-700 disabled:text-slate-500 text-white px-6 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-900/30"
                  >
                    Envoyer
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for Tasks
const TaskCard = ({
  task,
  onMove,
  onSherpa,
  onDelete,
  isGuestMode,
  onDragStart,
  onDrop,
  onDragOver,
  isDragging,
  isDragOver,
}: {
  task: KanbanTask;
  onMove: (to: any) => void;
  onSherpa: () => void;
  onDelete: () => void;
  isGuestMode: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  isDragging: boolean;
  isDragOver: boolean;
}) => {
  const isManual = task.week === 0;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDrop={(e) => onDrop(e, task.id)}
      onDragOver={(e) => onDragOver(e, task.id)}
      className={`bg-dark-900 p-5 rounded-2xl border border-dark-700 shadow-md hover:border-brand-500/30 group transition-all flex flex-col cursor-grab active:cursor-grabbing relative ${
        isDragging ? 'opacity-40 scale-95 border-brand-500 border-dashed' : ''
      }`}
    >
      {/* Drop Indicator */}
      {isDragOver && !isDragging && (
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-500 rounded-t-xl z-10 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
      )}

      <div className="flex justify-between items-start mb-4">
        <span
          className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg border ${
            isManual
              ? 'bg-gold-900/20 text-gold-400 border-gold-500/20'
              : task.week === 1
              ? 'bg-brand-900/20 text-brand-400 border-brand-500/20'
              : task.week === 2
              ? 'bg-purple-900/20 text-purple-400 border-purple-500/20'
              : task.week === 3
              ? 'bg-orange-900/20 text-orange-400 border-orange-500/20'
              : task.week === 4
              ? 'bg-pink-900/20 text-pink-400 border-pink-500/20'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {isManual ? 'PERSO' : `Semaine ${task.week}`}
        </span>

        {/* Delete Button */}
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 p-1.5 rounded-lg"
          title="Supprimer cette tâche"
        >
          <IconTrash className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-slate-200 leading-relaxed mb-6 font-medium">
        {task.content}
      </p>

      {/* Large SOS Sherpa Button */}
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={onSherpa}
        className="w-full mb-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500/10 to-gold-600/10 hover:from-gold-500/20 hover:to-gold-600/20 border border-gold-500/30 text-gold-500 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-gold-500/10 group/sherpa cursor-pointer"
      >
        <IconSherpa className="w-4 h-4 group-hover/sherpa:rotate-12 transition-transform" />
        SOS Sherpa
      </button>

      {/* Actions */}
      <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity mt-auto pt-2 border-t border-dark-800">
        {task.columnId !== 'todo' && (
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onMove('todo')}
            className="text-[10px] font-bold bg-dark-800 text-slate-400 px-3 py-1.5 rounded-lg hover:bg-dark-700 border border-dark-700 cursor-pointer transition-colors"
          >
            To Do
          </button>
        )}
        {task.columnId !== 'in-progress' && (
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onMove('in-progress')}
            className="text-[10px] font-bold bg-brand-900/20 text-brand-400 px-3 py-1.5 rounded-lg hover:bg-brand-900/30 border border-brand-500/20 cursor-pointer transition-colors"
          >
            En Cours
          </button>
        )}
        {task.columnId !== 'done' && (
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onMove('done')}
            className="text-[10px] font-bold bg-green-900/20 text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-900/30 border border-green-500/20 cursor-pointer transition-colors"
          >
            Fait
          </button>
        )}
      </div>
    </div>
  );
};

export default LeChantier;
