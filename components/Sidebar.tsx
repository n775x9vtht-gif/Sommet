import React, { useEffect, useState, useCallback } from 'react';
import { AppView } from '../types';
import {
  IconChart,
  IconDashboard,
  IconMountain,
  IconNewspaper,
  IconTools,
  IconUser,
  IconLock,
  IconLockOpen,
  IconSparkles,
  IconDiamond,
  IconBulb,
  IconBlueprint,
  IconConstruction,
  IconSettings,
  IconLogout,
} from './Icons';
import { getCurrentUserProfile } from '../services/profileService';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isGuestMode?: boolean;
  onTriggerAuth?: () => void;
  onOpenPricing?: () => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isGuestMode = false,
  onTriggerAuth,
  onOpenPricing,
  onLogout,
}) => {
  const [userName, setUserName] = useState('Entrepreneur');
  const [plan, setPlan] = useState<string | null>(null);
  const [generationCredits, setGenerationCredits] = useState<number | null>(
    null
  );
  const [maxGenerationCredits, setMaxGenerationCredits] = useState<
    number | null
  >(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // --------- Chargement du profil + crédits ----------
  const fetchProfile = useCallback(async () => {
    if (isGuestMode) {
      setUserName('Visiteur');
      setPlan(null);
      setGenerationCredits(null);
      setMaxGenerationCredits(null);
      setProfileLoading(false);
      return;
    }

    try {
      const profile = await getCurrentUserProfile();

      const userPlan = profile?.plan || 'camp_de_base';
      setPlan(userPlan);

      // nom : priorité au profil, sinon localStorage, sinon fallback
      if (profile?.full_name) {
        const name = profile.full_name.trim();
        setUserName(name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Entrepreneur');
      } else {
        const storedName = localStorage.getItem('sommet_user_name');
        if (storedName) {
          setUserName(
            storedName.charAt(0).toUpperCase() + storedName.slice(1)
          );
        } else {
          setUserName('Entrepreneur');
        }
      }

      // crédits de génération selon plan
      const gen = profile?.generation_credits ?? null;
      setGenerationCredits(gen);

      let maxGen: number | null = null;
      if (userPlan === 'camp_de_base') maxGen = 3;
      else if (userPlan === 'explorateur') maxGen = 20;
      else if (userPlan === 'batisseur') maxGen = null; // illimité

      setMaxGenerationCredits(maxGen);
    } catch (e) {
      console.error('Erreur lors du chargement du profil:', e);
    } finally {
      setProfileLoading(false);
    }
  }, [isGuestMode]);

  useEffect(() => {
    if (isGuestMode) {
      setUserName('Visiteur');
      setProfileLoading(false);
      return;
    }

    // 1) premier chargement
    fetchProfile();

    // 2) écoute des rafraîchissements demandés par le reste de l'app
    const handler = () => {
      fetchProfile();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('sommetProfileShouldRefresh', handler);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('sommetProfileShouldRefresh', handler);
      }
    };
  }, [isGuestMode, fetchProfile]);

  // --------- Navigation ----------
  const navItems = [
    { view: AppView.DASHBOARD, label: 'Tableau de bord', icon: IconDashboard },
    { view: AppView.GENERATOR, label: 'Générateur', icon: IconBulb },
    { view: AppView.VALIDATOR, label: 'Validateur', icon: IconChart },
    { view: AppView.BLUEPRINT, label: 'Le Blueprint', icon: IconBlueprint },
    { view: AppView.CHANTIER, label: 'Le Chantier', icon: IconConstruction },
    { view: AppView.DAILY, label: 'Le Daily', icon: IconNewspaper },
  ];

  type LockState = 'locked' | 'unlocked' | null;

  const getLockState = (view: AppView): LockState => {
    // En mode invité : on considère que tout ce qui est "avancé" est verrouillé visuellement
    if (isGuestMode) {
      if (view === AppView.BLUEPRINT || view === AppView.CHANTIER) {
        return 'locked';
      }
      return null;
    }

    if (!plan) return null;

    // Blueprint :
    // - camp_de_base : 🔒
    // - explorateur & bâtisseur : 🔓
    if (view === AppView.BLUEPRINT) {
      if (plan === 'camp_de_base') return 'locked';
      return 'unlocked';
    }

    // Chantier :
    // - camp_de_base & explorateur : 🔒
    // - bâtisseur : 🔓
    if (view === AppView.CHANTIER) {
      if (plan === 'batisseur') return 'unlocked';
      return 'locked';
    }

    return null;
  };

  // --------- Crédit bar ----------
  let creditsLabel = '';
  let creditsWidth = '0%';

  if (!isGuestMode) {
    if (plan === 'batisseur') {
      creditsLabel = 'Crédits illimités';
      creditsWidth = '100%';
    } else if (
      maxGenerationCredits !== null &&
      generationCredits !== null &&
      maxGenerationCredits > 0
    ) {
      creditsLabel = `${generationCredits} / ${maxGenerationCredits} crédits`;
      const ratio = Math.max(
        0,
        Math.min(1, generationCredits / maxGenerationCredits)
      );
      creditsWidth = `${ratio * 100}%`;
    } else {
      creditsLabel = '0 crédits de génération restants';
      creditsWidth = '0%';
    }
  }

  return (
    <aside className="w-20 lg:w-64 fixed left-0 top-0 h-screen bg-dark-800 border-r border-dark-700 flex flex-col z-50">
      {/* Logo Section */}
      <button
        onClick={onLogout}
        className="w-full p-6 flex items-center justify-center lg:justify-start border-b border-dark-700 cursor-pointer hover:bg-dark-700/50 transition-colors group/logo text-left focus:outline-none"
        title="Retour à l'accueil"
        type="button"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-900/20 flex-shrink-0 group-hover/logo:scale-105 transition-transform">
          <IconMountain className="w-5 h-5 text-white" />
        </div>
        <span className="ml-3 font-extrabold text-2xl hidden lg:block text-white tracking-tight group-hover/logo:text-brand-100 transition-colors">
          Sommet
        </span>
      </button>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          const lockState = getLockState(item.view);

          return (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-900/30 text-brand-500 shadow-sm border border-brand-500/20'
                  : 'text-slate-400 hover:bg-dark-700 hover:text-white'
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive ? 'text-brand-500' : 'text-slate-400 group-hover:text-white'
                }`}
              />
              <span
                className={`ml-3 font-medium hidden lg:flex items-center gap-1 ${
                  isActive ? 'text-brand-50' : ''
                }`}
              >
                {item.label}
                {lockState === 'locked' && (
                  <IconLock className="w-3.5 h-3.5 text-slate-500" />
                )}
                {lockState === 'unlocked' && (
                  <IconLockOpen className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bas de sidebar (profil + crédits) */}
      <div className="p-4 border-top border-dark-700 hidden lg:block space-y-4">
        {/* User Profile Snippet */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border flex-shrink-0 ${
                isGuestMode
                  ? 'bg-gold-500/10 border-gold-500/30'
                  : 'bg-dark-700 border-dark-600'
              }`}
            >
              {isGuestMode ? (
                <IconLock className="w-3.5 h-3.5 text-gold-500" />
              ) : (
                <IconUser className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate max-w-[80px]">
                {userName}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {isGuestMode
                  ? 'Mode Démo'
                  : plan === 'explorateur'
                  ? "Plan Explorateur"
                  : plan === 'batisseur'
                  ? 'Plan Bâtisseur'
                  : 'Plan Gratuit'}
              </p>
            </div>
          </div>

          {!isGuestMode ? (
            <div className="flex gap-1">
              <button
                onClick={() => onViewChange(AppView.SETTINGS)}
                className="p-1.5 text-slate-500 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                title="Paramètres"
              >
                <IconSettings className="w-4 h-4" />
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Déconnexion"
              >
                <IconLogout className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-500 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
              title="Quitter la démo"
            >
              <IconLogout className="w-4 h-4" />
            </button>
          )}
        </div>

        {isGuestMode ? (
          <button
            onClick={onTriggerAuth}
            className="w-full bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold py-2 rounded-lg text-xs transition-colors shadow-lg shadow-gold-500/20 animate-pulse"
          >
            Créer mon compte
          </button>
        ) : (
          <div
            onClick={onOpenPricing}
            className="bg-dark-900 rounded-lg p-3 border border-dark-700 relative overflow-hidden cursor-pointer group hover:border-gold-500/30 transition-colors"
          >
            <div className="absolute top-0 right-0 w-12 h-12 bg-gold-500/10 rounded-full blur-xl -mr-6 -mt-6 group-hover:bg-gold-500/20 transition-all"></div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                Vos Crédits
              </p>
              <IconDiamond className="w-3 h-3 text-gold-500" />
            </div>
            <div className="w-full bg-dark-700 rounded-full h-1 mb-2">
              <div
                className="bg-slate-500 h-1 rounded-full transition-all"
                style={{ width: creditsWidth }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-300 group-hover:text-white transition-colors">
              {creditsLabel}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
