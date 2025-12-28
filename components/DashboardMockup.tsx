import React from 'react';
import {
  IconRocketFlat,
  IconAnalytics,
  IconCheckCircle,
  IconWrench,
  IconTerminal,
  IconIdea,
  IconTarget,
  IconKanban,
  IconCalendar,
  IconArrowRight
} from './Icons';

const DashboardMockup: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header du Dashboard */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex flex-col items-center justify-center gap-0.5 p-1.5">
            <div className="w-6 h-1.5 bg-indigo-600 rounded-sm"></div>
            <div className="w-5 h-1.5 bg-indigo-500 rounded-sm"></div>
            <div className="w-4 h-1.5 bg-indigo-400 rounded-sm"></div>
          </div>
          <div>
            <div className="text-white font-bold text-base">Dashboard</div>
            <div className="text-indigo-100 text-xs">Tes projets SaaS</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-colors">
            <IconIdea className="w-4 h-4 text-white" />
            <span className="text-white text-xs font-semibold">Nouvelle idée</span>
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
            TM
          </div>
        </div>
      </div>

      {/* Contenu du Dashboard */}
      <div className="p-5 bg-gradient-to-br from-gray-50 to-slate-100">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg p-3 border border-emerald-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <IconCheckCircle className="w-4 h-4" />
              <span className="text-xs font-semibold text-emerald-700">Complété</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">3</div>
            <div className="text-xs text-gray-500">étapes finies</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <IconKanban className="w-4 h-4" />
              <span className="text-xs font-semibold text-blue-700">En cours</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">1</div>
            <div className="text-xs text-gray-500">projet actif</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-purple-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <IconIdea className="w-4 h-4" />
              <span className="text-xs font-semibold text-purple-700">Idées</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-xs text-gray-500">générées</div>
          </div>
        </div>

        {/* Projet principal en cours */}
        <div className="bg-white rounded-xl p-4 mb-4 border-2 border-indigo-200 shadow-md">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                  EN COURS
                </span>
                <span className="text-xs text-gray-500">Semaine 2/4</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Plateforme de retours visuels pour designers
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Permet aux équipes design de recueillir les retours clients sur des maquettes
              </p>
            </div>
            <button className="ml-3 flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap">
              Continuer
              <IconArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Barre de progression */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">Progression générale</span>
              <span className="text-xs font-bold text-indigo-600">52%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all" style={{ width: '52%' }}></div>
            </div>
          </div>

          {/* Étapes */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-300 rounded-lg p-2 flex items-center gap-2">
              <IconCheckCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-emerald-900">Idée validée</div>
                <div className="text-xs text-emerald-700">Score : 87/100</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-300 rounded-lg p-2 flex items-center gap-2">
              <IconCheckCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-emerald-900">Plan technique</div>
                <div className="text-xs text-emerald-700">Terminé</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-400 rounded-lg p-2 flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <div className="text-xs font-bold text-blue-900">Code frontend</div>
                <div className="text-xs text-blue-700">En cours...</div>
              </div>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-2 flex items-center gap-2 opacity-60">
              <IconTerminal className="w-5 h-5 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-gray-700">Déploiement</div>
                <div className="text-xs text-gray-600">À venir</div>
              </div>
            </div>
          </div>
        </div>

        {/* Prochaine action recommandée */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <IconRocketFlat className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-amber-900 mb-1">Prochaine action</div>
              <p className="text-xs text-amber-800 leading-relaxed mb-2">
                Intègre le formulaire de connexion avec Supabase en suivant le guide étape par étape
              </p>
              <button className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1">
                Voir le guide
                <IconArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Autres idées */}
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-gray-900">Autres idées explorées</h4>
            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              Voir tout
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors cursor-pointer">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconAnalytics className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 truncate">Assistant email IA pour freelances</div>
                  <div className="text-xs text-gray-500">Score : 72/100</div>
                </div>
              </div>
              <span className="text-xs text-gray-400 ml-2">Il y a 2j</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors cursor-pointer">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconTarget className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 truncate">Outil de facturation pour coachs</div>
                  <div className="text-xs text-gray-500">Score : 81/100</div>
                </div>
              </div>
              <span className="text-xs text-gray-400 ml-2">Il y a 5j</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;
