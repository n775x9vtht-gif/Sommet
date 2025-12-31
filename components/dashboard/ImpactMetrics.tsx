import React from 'react';

const ImpactMetrics: React.FC = () => {
  const metrics = [
    {
      value: '14 jours',
      label: 'De l\'idée au lancement',
      subtitle: 'vs 6 mois en moyenne'
    },
    {
      value: '50 000€',
      label: 'Économies de développement',
      subtitle: 'Coût moyen d\'un MVP'
    },
    {
      value: '0 ligne',
      label: 'De code à écrire',
      subtitle: '100% automatisé par l\'IA'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 lg:p-8 mb-10">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
        Impact de Bildr
      </h2>
      <div className="grid grid-cols-3 gap-4 lg:gap-8">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-gray-600">{metric.label}</div>
            <div className="text-xs text-gray-500 mt-1">{metric.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactMetrics;
