import React from 'react';
import { AppView } from '../types';
import {
  IconChart,
  IconIdea,
  IconWrench,
  IconKanban,
  IconSettings,
  IconLogout,
  IconAnalytics
} from './Icons';

interface BildrSidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  isGuestMode: boolean;
  onLogout: () => void;
  userName: string;
}

const BildrSidebar: React.FC<BildrSidebarProps> = ({
  currentView,
  onViewChange,
  isGuestMode,
  onLogout,
  userName,
}) => {
  const menuItems = [
    {
      view: AppView.DASHBOARD,
      icon: <IconChart className="w-5 h-5" />,
      label: 'Dashboard',
      available: true
    },
    {
      view: AppView.GENERATOR,
      icon: <IconIdea className="w-5 h-5" />,
      label: 'Générer une idée',
      available: true
    },
    {
      view: AppView.ANALYZER,
      icon: <IconAnalytics className="w-5 h-5" />,
      label: 'Analyse de marché',
      available: true
    },
    {
      view: AppView.MVP_BUILDER,
      icon: <IconWrench className="w-5 h-5" />,
      label: 'Plan technique',
      available: true
    },
    {
      view: AppView.LE_CHANTIER,
      icon: <IconKanban className="w-5 h-5" />,
      label: 'Le chantier',
      available: true
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex flex-col items-center justify-center gap-0.5 p-1.5">
            <div className="w-6 h-1.5 bg-white rounded-sm"></div>
            <div className="w-5 h-1.5 bg-white/80 rounded-sm"></div>
            <div className="w-4 h-1.5 bg-white/60 rounded-sm"></div>
          </div>
          <div>
            <div className="font-bold text-xl text-gray-900">Bildr</div>
            {isGuestMode && (
              <div className="text-xs text-amber-600 font-semibold">Mode Démo</div>
            )}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">{userName}</div>
            <div className="text-xs text-gray-500">
              {isGuestMode ? 'Visiteur' : 'Membre'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.view}
              onClick={() => item.available && onViewChange(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                currentView === item.view
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${!item.available && 'opacity-50 cursor-not-allowed'}`}
              disabled={!item.available}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={() => onViewChange(AppView.SETTINGS)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <IconSettings className="w-5 h-5" />
          <span>Paramètres</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <IconLogout className="w-5 h-5" />
          <span>{isGuestMode ? 'Quitter la démo' : 'Se déconnecter'}</span>
        </button>
      </div>
    </div>
  );
};

export default BildrSidebar;
