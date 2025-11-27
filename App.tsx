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
import SuccessPage from './components/SuccessPage';

import { AppView, SavedIdea, MVPBlueprint, MarketAnalysis, KanbanBoard } from './types';
import { IconMountain } from './components/Icons';
import { DEMO_DATA } from './services/demoData';
import { supabase } from './services/supabaseClient';
import { fetchUserIdeas, createIdea, updateIdea, deleteIdea as deleteIdeaService } from './services/ideaService';

// Plan Sommet côté front
type PlanType = 'camp_de_base' | 'explorateur' | 'batisseur';

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

  // 🆕 Infos compte / abonnement
  const [userEmail, setUserEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('Entrepreneur');
  const [lastName, setLastName] = useState<string>('');
  const [profilePlan, setProfilePlan] = useState<PlanType>('camp_de_base');
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [cancelAt, setCancelAt] = useState<string | null>(null);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState<boolean | null>(null);

  // --- Utils ---

  const showToastMessage = (message: string) => {
    setToast({ message, show: true });
  };

  // 🧠 Calcule prénom / nom à partir du full_name / metadata / email
  function computeNames(opts: {
    profileFullName?: string | null;
    meta?: any;
    email?: string | null;
  }): { first: string; last: string } {
    const { profileFullName, meta, email } = opts;

    const cap = (s: string) =>
      s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

    // 1. Priorité au full_name en base (profiles.full_name)
    if (profileFullName && profileFullName.trim().length > 0) {
      const parts = profileFullName.trim().split(/\s+/);
      const first = parts[0];
      const last = parts.slice(1).join(' ');
      return {
        first: cap(first),
        last: cap(last),
      };
    }

    // 2. Sinon, metadata (par ex. first_name / last_name)
    const metaFirst =
      meta?.first_name ??
      meta?.prenom ??
      '';
    const metaLast =
      meta?.last_name ??
      meta?.nom ??
      '';

    if (metaFirst || metaLast) {
      return {
        first: cap(metaFirst || 'Entrepreneur'),
        last: cap(metaLast || ''),
      };
    }

    // 3. Sinon, on dérive du mail (avant le @)
    if (email && email.includes('@')) {
      const local = email.split('@')[0];
      return {
        first: cap(local || 'Entrepreneur'),
        last: '',
      };
    }

    // 4. Fallback
    return {
      first: 'Entrepreneur',
      last: '',
    };
  }

  // 🆕 Charge les données utilisateur (profil + abonnement) une fois connecté
  const loadUserData = async (session: any) => {
    setHasAccess(true);
    setIsGuestMode(false);
    localStorage.removeItem('sommet_guest_mode');

    const email = session?.user?.email ?? '';
    if (email) {
      setUserEmail(email);
    }

    const userId = session.user?.id as string | undefined;
    const userMeta = session.user?.user_metadata ?? {};

    let profileFullName: string | null = null;

    if (userId) {
      // Profil (plan + full_name)
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('plan, full_name')
        .eq('id', userId)
        .single();

      if (!profileErr && profile) {
        if (profile.plan) {
          setProfilePlan(profile.plan as PlanType);
        } else {
          setProfilePlan('camp_de_base');
        }
        profileFullName = profile.full_name ?? null;
      } else {
        setProfilePlan('camp_de_base');
      }

      // Dernière subscription Stripe
      const { data: subRows, error: subErr } = await supabase
        .from('stripe_subscriptions')
        .select('status, cancel_at, cancel_at_period_end')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!subErr && subRows && subRows.length > 0) {
        const s = subRows[0] as any;
        setSubscriptionStatus(s.status ?? null);
        setCancelAt(s.cancel_at ?? null);
        setCancelAtPeriodEnd(
          typeof s.cancel_at_period_end === 'boolean' ? s.cancel_at_period_end : null
        );
      } else {
        setSubscriptionStatus(null);
        setCancelAt(null);
        setCancelAtPeriodEnd(null);
      }
    } else {
      setProfilePlan('camp_de_base');
      setSubscriptionStatus(null);
      setCancelAt(null);
      setCancelAtPeriodEnd(null);
    }

    // Prénom / Nom pour Settings + Sidebar
    const names = computeNames({
      profileFullName,
      meta: userMeta,
      email,
    });

    setFirstName(names.first || 'Entrepreneur');
    setLastName(names.last || '');
    localStorage.setItem('sommet_user_name', names.first || 'Entrepreneur');

    // Idées
    const ideas = await fetchUserIdeas();
    setSavedIdeas(ideas);
  };

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
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session) {
          await loadUserData(session);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session) {
            await loadUserData(session);
          } else if (!localStorage.getItem('sommet_guest_mode')) {
            setHasAccess(false);
            setIsGuestMode(false);
            setSavedIdeas([]);
            setUserEmail('');
            setFirstName('Entrepreneur');
            setLastName('');
            setProfilePlan('camp_de_base');
            setSubscriptionStatus(null);
            setCancelAt(null);
            setCancelAtPeriodEnd(null);
          }
        }
      );

      return () => subscription.unsubscribe();
    }
  }, []);

  // --- DATA PERSISTENCE LOGIC ---

  const handleEnterApp = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      await loadUserData(session);
    } else {
      setHasAccess(true);
      setIsGuestMode(false);
      localStorage.removeItem('sommet_guest_mode');
      const ideas = await fetchUserIdeas();
      setSavedIdeas(ideas);
    }
    
    window.scrollTo(0, 0);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('checkout');
      url.searchParams.delete('plan');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url.toString());
    }
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
    setUserEmail('');
    setFirstName('Entrepreneur');
    setLastName('');
    setProfilePlan('camp_de_base');
    setSubscriptionStatus(null);
    setCancelAt(null);
    setCancelAtPeriodEnd(null);
    localStorage.removeItem('sommet_guest_mode');
    setCurrentView(AppView.DASHBOARD);
    window.scrollTo(0, 0);
  };

  const handleAuthTrigger = () => {
    setIsAuthModalOpen(true);
  };

  // 🆕 Mise à jour profil (Prénom / Nom / Email + Supabase)
  const handleUpdateProfile = async (newFirstName: string, newLastName: string, email: string) => {
    const cap = (s: string) =>
      s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

    const f = cap(newFirstName.trim() || 'Entrepreneur');
    const l = cap(newLastName.trim());

    setFirstName(f);
    setLastName(l);
    if (email) {
      setUserEmail(email);
    }

    // Pour la Sidebar (fallback)
    localStorage.setItem('sommet_user_name', f);

    // Mise à jour Supabase (full_name)
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        await supabase
          .from('profiles')
          .update({
            full_name: l ? `${f} ${l}` : f,
          })
          .eq('id', user.id);
      }
    } catch (e) {
      console.error('Erreur mise à jour full_name Supabase:', e);
    }

    // Optionnel : notifier la Sidebar qu’elle peut rafraîchir
    window.dispatchEvent(new Event('sommetProfileShouldRefresh'));

    showToastMessage('Profil mis à jour avec succès');
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

  // 🆕 Gérer l’accès au portail Stripe (factures + résiliation)
  const handleManageBilling = async () => {
    try {
      const resp = await fetch('/api/create-billing-portal-session', {
        method: 'POST',
      });

      if (!resp.ok) {
        console.error('❌ Erreur create-billing-portal-session:', await resp.text());
        showToastMessage("Impossible d'ouvrir la page de facturation.");
        return;
      }

      const data = await resp.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        showToastMessage("Réponse inattendue de la page de facturation.");
      }
    } catch (err) {
      console.error('❌ Erreur handleManageBilling:', err);
      showToastMessage("Erreur lors de l'ouverture de la page de facturation.");
    }
  };

  // 🔥 ROUTAGE PAR QUERY PARAMS : page de succès Stripe
  let checkoutStatus: string | null = null;
  let planFromUrl: 'explorateur' | 'batisseur' | null = null;

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    checkoutStatus = params.get('checkout');
    const planRaw = params.get('plan');
    if (planRaw === 'explorateur' || planRaw === 'batisseur') {
      planFromUrl = planRaw;
    }
  }

  if (checkoutStatus === 'success') {
    return (
      <SuccessPage
        onEnterApp={handleEnterApp}
        plan={planFromUrl || undefined}
      />
    );
  }

  // Si pas encore accès à l'app → Landing
  if (!hasAccess) {
    return <LandingPage onEnterApp={handleEnterApp} onEnterDemo={handleEnterDemo} />;
  }

  // Sinon, l'app principale
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
        // ✅ On n’envoie que le prénom à la Sidebar
        userName={firstName}
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
            userEmail={userEmail || 'utilisateur@exemple.com'}
            firstName={firstName}
            lastName={lastName}
            onUpdateProfile={handleUpdateProfile}
            onOpenPricing={() => setIsPricingModalOpen(true)}
            onDeleteAccount={handleDeleteAccount}
            plan={profilePlan}
            subscriptionStatus={subscriptionStatus}
            cancelAt={cancelAt}
            cancelAtPeriodEnd={cancelAtPeriodEnd}
            onManageBilling={handleManageBilling}
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