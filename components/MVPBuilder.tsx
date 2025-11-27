import React, { useState, useEffect } from 'react';
import { SavedIdea, MVPBlueprint } from '../types';
import { IconBlueprint } from './Icons';

interface MVPBuilderProps {
  savedIdeas: SavedIdea[];
  initialIdea: SavedIdea | null;
  onSaveBlueprint: (ideaId: string, blueprint: MVPBlueprint) => void;
  onOpenPricing: () => void;
}

const MVPBuilder: React.FC<MVPBuilderProps> = ({
  savedIdeas,
  initialIdea,
  onSaveBlueprint,
  onOpenPricing,
}) => {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [valueProp, setValueProp] = useState('');
  const [coreFeatures, setCoreFeatures] = useState('');
  const [successMetrics, setSuccessMetrics] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sélection initiale si on vient du Dashboard avec une idée
  useEffect(() => {
    if (initialIdea && initialIdea.id) {
      setSelectedIdeaId(initialIdea.id);
    } else if (savedIdeas.length > 0 && !selectedIdeaId) {
      setSelectedIdeaId(savedIdeas[0].id);
    }
  }, [initialIdea, savedIdeas, selectedIdeaId]);

  const selectedIdea = savedIdeas.find((i) => i.id === selectedIdeaId) || null;

  const handleSave = async () => {
    if (!selectedIdea || !selectedIdea.id) return;

    // 🔧 On cast en MVPBlueprint pour laisser ton type existant tranquille
    const blueprint = {
      valueProposition: valueProp,
      coreFeatures: coreFeatures
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      successMetrics: successMetrics
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
    } as unknown as MVPBlueprint;

    setSaving(true);
    try {
      await onSaveBlueprint(selectedIdea.id, blueprint);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (!savedIdeas || savedIdeas.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold text-white mb-3">
          Aucune idée à transformer en MVP
        </h1>
        <p className="text-slate-400 mb-6">
          Commence par générer une pépite dans le Générateur, puis reviens ici
          pour la transformer en plan d&apos;attaque.
        </p>
        <button
          onClick={onOpenPricing}
          className="px-6 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-400 transition-colors"
        >
          Voir les offres Sommet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
          <IconBlueprint className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Le Blueprint</h1>
          <p className="text-slate-400 text-sm">
            Structure ton MVP en quelques blocs clairs : promesse, fonctionnalités cœur, indicateurs.
          </p>
        </div>
      </div>

      {/* Sélecteur d'idée */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-400 mb-2">
          Choisis le projet à blueprint-er
        </label>
        <select
          value={selectedIdeaId || ''}
          onChange={(e) => setSelectedIdeaId(e.target.value || null)}
          className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        >
          {savedIdeas.map((idea) => (
            <option key={idea.id} value={idea.id}>
              {idea.title || 'Projet sans titre'}
            </option>
          ))}
        </select>
      </div>

      {selectedIdea && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Proposition de valeur */}
          <div className="md:col-span-1 bg-dark-800 border border-dark-700 rounded-2xl p-4">
            <h2 className="text-sm font-semibold text-white mb-2">
              Proposition de valeur
            </h2>
            <p className="text-[11px] text-slate-400 mb-2">
              En une phrase claire : pour qui, quel problème et quel résultat.
            </p>
            <textarea
              value={valueProp}
              onChange={(e) => setValueProp(e.target.value)}
              placeholder="Ex : Aider les solopreneurs à tester des idées en 48h sans coder."
              className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-sm text-slate-100 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>

          {/* Fonctionnalités cœur */}
          <div className="md:col-span-1 bg-dark-800 border border-dark-700 rounded-2xl p-4">
            <h2 className="text-sm font-semibold text-white mb-2">
              Fonctionnalités cœur
            </h2>
            <p className="text-[11px] text-slate-400 mb-2">
              Liste les 3–7 briques indispensables pour tester ton idée.
            </p>
            <textarea
              value={coreFeatures}
              onChange={(e) => setCoreFeatures(e.target.value)}
              placeholder={'• Landing page simple\n• Formulaire d\'inscription\n• Dashboard minimal'}
              className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-sm text-slate-100 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>

          {/* Indicateurs de succès */}
          <div className="md:col-span-1 bg-dark-800 border border-dark-700 rounded-2xl p-4">
            <h2 className="text-sm font-semibold text-white mb-2">
              Indicateurs de succès
            </h2>
            <p className="text-[11px] text-slate-400 mb-2">
              Comment sauras-tu que ton test est concluant ?
            </p>
            <textarea
              value={successMetrics}
              onChange={(e) => setSuccessMetrics(e.target.value)}
              placeholder={'• 50 inscrits en 14 jours\n• 10% des inscrits réservent un call'}
              className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-sm text-slate-100 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>
        </div>
      )}

      {/* CTA sauvegarde */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !selectedIdea}
          className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:bg-brand-500/50 text-white font-bold text-sm flex items-center gap-2"
        >
          {saving ? 'Sauvegarde...' : saved ? 'Blueprint sauvegardé ✔' : 'Sauvegarder le Blueprint'}
        </button>
      </div>
    </div>
  );
};

export default MVPBuilder;