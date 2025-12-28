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
      label: 'Générer'
    },
    {
      view: AppView.ANALYZER,
      icon: <IconAnalytics className="w-4 h-4" />,
      label: 'Analyser'
    },
    {
      view: AppView.MVP_BUILDER,
      icon: <IconWrench className="w-4 h-4" />,
      label: 'Plan'
    },
    {
      view: AppView.LE_CHANTIER,
      icon: <IconKanban className="w-4 h-4" />,
      label: 'Chantier'
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gray-900 rounded flex flex-col items-center justify-center gap-0.5 p-1">
                <div className="w-4 h-1 bg-white rounded-sm"></div>
                <div className="w-3.5 h-1 bg-white/80 rounded-sm"></div>
                <div className="w-3 h-1 bg-white/60 rounded-sm"></div>
              </div>
              <span className="font-semibold text-gray-900 text-lg">Bildr</span>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => onViewChange(item.view)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentView === item.view
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {isGuestMode && (
              <span className="text-xs text-gray-500 font-medium">
                Mode démo
              </span>
            )}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {userName.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={onLogout}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {isGuestMode ? 'Quitter' : 'Déconnexion'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BildrNavbar;
