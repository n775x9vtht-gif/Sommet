import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IdeaGenerator from './components/IdeaGenerator';
import MarketAnalyzer from './components/MarketAnalyzer';
import LandingPage from './components/LandingPage';
import DailyNews from './components/DailyNews';
import MVPBuilder from './components/MVPBuilder';
import LeChantier from './components/LeChantier';
import Settings from './components/Settings';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import PricingModal from './components/PricingModal';
import { AppView, SavedIdea, MVPBlueprint, MarketAnalysis, KanbanBoard } from './types';
import { IconMountain } from './components/Icons';
import { DEMO_DATA } from './services/demoData';
import { supabase } from './services/supabaseClient';
import { fetchUserIdeas, createIdea, updateIdea, deleteIdea as deleteIdeaService } from './services/ideaService';

const App: React.FC = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [ideaToAnalyze, setIdeaToAnalyze] = useState<SavedIdea | null>(null);
  const [ideaToBlueprint, setIdeaToBlueprint] = useState<SavedIdea | null>(null);
  const [ideaToChantier, setIdeaToChantier] = useState<SavedIdea | null>(null);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // Listener global pour ouvrir la PricingModal
  useEffect(() => {
    const handler = () => setIsPricingModalOpen(true);
    window.addEventListener('sommet:open_pricing', handler);
    return () => window.removeEventListener('sommet:open_pricing', handler);
  }, []);

  // Load initial state
  useEffect(() => {
    const guestMode = localStorage.getItem('sommet_guest_mode');
    
    if (guestMode === 'true') {
      setIsGuestMode(true);
      setHasAccess(true);
      setSavedIdeas(DEMO_DATA);
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setHasAccess(true);
          fetchUserIdeas().then(ideas => {
            setSavedIdeas(ideas);
          });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setHasAccess(true);
          fetchUserIdeas().then(ideas => {
            setSavedIdeas(ideas);
          });
        } else if (!localStorage.getItem('sommet_guest_mode')) {
          setHasAccess(false);
          setSavedIdeas([]);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // --- DATA PERSISTENCE LOGIC ---

  const handleEnterApp = async () => {
    setHasAccess(true);
    setIsGuestMode(false);
    localStorage.removeItem('sommet_guest_mode');
    
    const ideas = await fetchUserIdeas();
    setSavedIdeas(ideas);
    
    window.scrollTo(0, 0);
  };

  const handleEnterDemo = () => {
    setHasAccess(true);
    setIsGuestMode(true);
    setSavedIdeas(DEMO_DATA);
    localStorage.setItem('sommet_guest_mode', 'true');
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    if (!isGuestMode) {
      await supabase.auth.signOut();
    }
    setHasAccess(false);
    setIsGuestMode(false);
    setSavedIdeas([]);
    localStorage.removeItem('sommet_guest_mode');
    setCurrentView(AppView.DASHBOARD);
    window.scrollTo(0, 0);
  };

  const handleAuthTrigger = () => {
    setIsAuthModalOpen(true);
  };

  const showToastMessage = (message: string) => {
    setToast({ message, show: true });
  };

  const handleUpdateProfile = (name: string, email: string) => {
    localStorage.setItem('sommet_user_name', name);
    showToastMessage('Profil mis à jour avec succès');
    window.dispatchEvent(new Event('storage'));
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Êtes-vous sûr ?')) {
      await handleLogout();
      alert('Votre compte a été supprimé.');
    }
  };

  const handleSaveIdea = async (idea: SavedIdea) => {
    if (isGuestMode) {
      handleAuthTrigger();
      return;
    }
    
    if (savedIdeas.some((saved) => saved.id === idea.id)) return;
    const newIdeas = [idea, ...savedIdeas];
    setSavedIdeas(newIdeas);
    
    await createIdea(idea);
    
    showToastMessage('Pépite enregistrée avec succès !');
  };

  const handleDeleteIdea = async (id: string) => {
    if (isGuestMode) {
      handleAuthTrigger();
      return;
    }
    
    const newIdeas = savedIdeas.filter(idea => idea.id !== id);
    setSavedIdeas(newIdeas);
    
    await deleteIdeaService(id);
    
    showToastMessage('Projet supprimé.');
  };

  const handleAnalyzeRequest = (idea: SavedIdea) => {
    setIdeaToAnalyze(idea);
    setCurrentView(AppView.VALIDATOR);
  };

  const handleSaveAnalysis = async (ideaId: string, analysis: MarketAnalysis) => {
    if (isGuestMode) return;
    
    const updatedIdeas = savedIdeas.map(idea => {
      if (idea.id === ideaId) {
        return { ...idea, analysis };
      }
      return idea;
    });
    setSavedIdeas(updatedIdeas);

    const ideaToUpdate = updatedIdeas.find(i => i.id === ideaId);
    if (ideaToUpdate) await updateIdea(ideaToUpdate);
  };

  const handleNavigateFromDashboard = (view: AppView, idea?: SavedIdea) => {
    if (view === AppView.BLUEPRINT && idea) {
      setIdeaToBlueprint(idea);
    }
    if (view === AppView.CHANTIER && idea) {
      setIdeaToChantier(idea);
    }
    setCurrentView(view);
  };

  const handleSaveBlueprint = async (ideaId: string, blueprint: MVPBlueprint) => {
    if (isGuestMode) return;

    const updatedIdeas = savedIdeas.map(idea => {
      if (idea.id === ideaId) {
        return { ...idea, blueprint };
      }
      return idea;
    });
    setSavedIdeas(updatedIdeas);

    const ideaToUpdate = updatedIdeas.find(i => i.id === ideaId);
    if (ideaToUpdate) await updateIdea(ideaToUpdate);

    showToastMessage('Plan MVP généré et sauvegardé !');
  };
  
  const handleSaveKanban = async (ideaId: string, kanban: KanbanBoard) => {
    if (isGuestMode) return;
    
    const updatedIdeas = savedIdeas.map(idea => {
      if (idea.id === ideaId) {
        return { ...idea, kanbanBoard: kanban };
      }
      return idea;
    });
    setSavedIdeas(updatedIdeas);

    const ideaToUpdate = updatedIdeas.find(i => i.id === ideaId);
    if (ideaToUpdate) await updateIdea(ideaToUpdate);
  };

  if (!hasAccess) {
    return <LandingPage onEnterApp={handleEnterApp} onEnterDemo={handleEnterDemo} />;
  }

  return (
    <div className="flex min-h-screen bg-dark-900 font-sans text-slate-50 selection:bg-brand-500 selection:text-white animate-fade-in">
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        initialMode="REGISTER" 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          handleEnterApp();
        }}
      />

      <PricingModal 
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />

      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isGuestMode={isGuestMode}
        onTriggerAuth={handleAuthTrigger}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 lg:ml-64 p-6 lg:p-10 overflow-x-hidden">
        <header className="lg:hidden flex items-center justify-between mb-8">
          <div className="font-extrabold text-xl flex items-center gap-2">
            <IconMountain className="w-6 h-6 text-brand-500" />
            Sommet
          </div>
        </header>

        {currentView === AppView.DASHBOARD && (
          <Dashboard 
            savedIdeas={savedIdeas} 
            onDelete={handleDeleteIdea} 
            onAnalyze={handleAnalyzeRequest}
            onNavigate={handleNavigateFromDashboard}
            isGuestMode={isGuestMode}
          />
        )}

        {currentView === AppView.GENERATOR && (
          <IdeaGenerator 
            onSave={handleSaveIdea} 
            savedIdeaIds={savedIdeas.map(idea => idea.id)}
            isGuestMode={isGuestMode}
            onTriggerAuth={handleAuthTrigger}
            onOpenPricing={() => setIsPricingModalOpen(true)}
          />
        )}

        {currentView === AppView.VALIDATOR && (
          <MarketAnalyzer 
            initialIdea={ideaToAnalyze} 
            onSave={handleSaveAnalysis}
            isGuestMode={isGuestMode}
            onTriggerAuth={handleAuthTrigger}
            onOpenPricing={() => setIsPricingModalOpen(true)}
          />
        )}

        {currentView === AppView.BLUEPRINT && (
          <MVPBuilder 
            savedIdeas={savedIdeas}
            initialIdea={ideaToBlueprint}
            onSaveBlueprint={handleSaveBlueprint}
            onOpenPricing={() => setIsPricingModalOpen(true)}
          />
        )}
        
        {currentView === AppView.CHANTIER && (
          <LeChantier
            savedIdeas={savedIdeas}
            initialIdea={ideaToChantier}
            onSaveKanban={handleSaveKanban}
            isGuestMode={isGuestMode}
            onTriggerAuth={handleAuthTrigger}
            onOpenPricing={() => setIsPricingModalOpen(true)}
          />
        )}

        {currentView === AppView.DAILY && (
          <DailyNews onNavigateToGenerator={() => setCurrentView(AppView.GENERATOR)} />
        )}

        {currentView === AppView.SETTINGS && (
          <Settings
            userEmail="utilisateur@exemple.com" 
            userName={localStorage.getItem('sommet_user_name') || 'Entrepreneur'}
            onUpdateProfile={handleUpdateProfile}
            onOpenPricing={() => setIsPricingModalOpen(true)}
            onDeleteAccount={handleDeleteAccount}
          />
        )}
      </main>

      {toast.show && (
        <Toast 
          message={toast.message} 
          onClose={() => setToast(prev => ({ ...prev, show: false }))} 
        />
      )}
    </div>
  );
};

export default App;
