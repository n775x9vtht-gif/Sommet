import React from 'react';
import { AppView } from '../types';
import {
  IconChart,
  IconIdea,
  IconWrench,
  IconKanban,
  IconAnalytics,
  IconLogout
} from './Icons';

interface BildrNavbarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isGuestMode: boolean;
  onLogout: () => void;
  userName: string;
}

const BildrNavbar: React.FC<BildrNavbarProps> = ({
  currentView,
  onViewChange,
  isGuestMode,
  onLogout,
  userName,
}) => {
  const menuItems = [
    {
      view: AppView.DASHBOARD,
      icon: <IconChart className="w-4 h-4" />,
      label: 'Dashboard'
    },
    {
      view: AppView.GENERATOR,
      icon: <IconIdea className="w-4 h-4" />,
      label: 'Générer une idée'
    },
    {
      view: AppView.ANALYZER,
      icon: <IconAnalytics className="w-4 h-4" />,
      label: 'Analyse'
    },
    {
      view: AppView.MVP_BUILDER,
      icon: <IconWrench className="w-4 h-4" />,
      label: 'Plan technique'
    },
    {
      view: AppView.LE_CHANTIER,
      icon: <IconKanban className="w-4 h-4" />,
      label: 'Le chantier'
    }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex flex-col items-center justify-center gap-0.5 p-1">
              <div className="w-5 h-1.5 bg-white rounded-sm"></div>
              <div className="w-4 h-1.5 bg-white/80 rounded-sm"></div>
              <div className="w-3 h-1.5 bg-white/60 rounded-sm"></div>
            </div>
            <div>
              <div className="font-bold text-lg text-gray-900">Bildr</div>
            </div>
            {isGuestMode && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-700 text-xs font-bold uppercase tracking-wide">
                Démo
              </span>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onViewChange(item.view)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  currentView === item.view
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </div>

          {/* User & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-gray-900">{userName}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              title={isGuestMode ? 'Quitter la démo' : 'Se déconnecter'}
            >
              <IconLogout className="w-4 h-4" />
              <span className="hidden sm:inline">{isGuestMode ? 'Quitter' : 'Déconnexion'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BildrNavbar;
