// components/AuthModal.tsx
import React, { useMemo, useState } from 'react';
import { IconMountain, IconX, IconMail, IconLock, IconUser, IconGoogle } from './Icons';
import { getSupabaseClient } from '../services/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'LOGIN' | 'REGISTER';
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const supabase = useMemo(() => {
    try {
      return getSupabaseClient();
    } catch (error) {
      console.error('Supabase non configuré :', error);
      return null;
    }
  }, []);

  // Sync mode if prop changes
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!isOpen) return null;

  const ensureSupabaseReady = () => {
    if (!supabase) {
      alert(
        "Supabase n'est pas configuré (variables d'environnement manquantes). Vérifie VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sur Vercel."
      );
      return null;
    }
    return supabase;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabaseClient = ensureSupabaseReady();
      if (!supabaseClient) return;

      if (mode === 'REGISTER') {
        // Inscription Supabase
        const { data, error } = await supabaseClient.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            },
          },
        });

        if (error) {
          console.error('Erreur inscription:', error);
          alert(error.message);
          return;
        }

        if (formData.name) {
          localStorage.setItem('sommet_user_name', formData.name);
        }

        console.log('✅ Utilisateur inscrit:', data);
        onSuccess();
      } else {
        // Connexion Supabase
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error('Erreur connexion:', error);
          alert(error.message);
          return;
        }

        if (!localStorage.getItem('sommet_user_name')) {
          localStorage.setItem('sommet_user_name', 'Entrepreneur');
        }

        console.log('✅ Utilisateur connecté:', data);
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabaseClient = ensureSupabaseReady();
    if (!supabaseClient) return;

    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error('Erreur OAuth Google:', error);
        alert(error.message);
      }
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de la connexion avec Google.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-gold-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-2"
        >
          <IconX className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-dark-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-dark-700 shadow-lg">
              <IconMountain className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {mode === 'LOGIN' ? 'Bon retour au Sommet' : "Commencez l'ascension"}
            </h2>
            <p className="text-slate-400 text-sm">
              {mode === 'LOGIN'
                ? 'Connectez-vous pour accéder à vos projets.'
                : 'Créez votre compte gratuit pour générer des idées.'}
            </p>
          </div>

          {/* Social Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-slate-100 text-dark-900 font-bold py-2.5 rounded-xl flex items-center justify-center gap-3 transition-all mb-6"
          >
            <IconGoogle className="w-5 h-5" />
            <span className="text-sm">Continuer avec Google</span>
          </button>

          <div className="relative flex items-center py-2 mb-6">
            <div className="flex-grow border-t border-dark-700"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-slate-500 uppercase font-bold">
              Ou par email
            </span>
            <div className="flex-grow border-t border-dark-700"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'REGISTER' && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IconUser className="h-5 w-5 text-slate-500 group-focus-within:text-brand-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Votre prénom"
                  className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconMail className="h-5 w-5 text-slate-500 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="Adresse email"
                className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconLock className="h-5 w-5 text-slate-500 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <input
                type="password"
                placeholder="Mot de passe"
                className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-dark-900 transition-all shadow-lg mt-2 flex items-center justify-center ${
                loading
                  ? 'bg-slate-600 cursor-not-allowed'
                  : 'bg-gold-500 hover:bg-gold-400 hover:-translate-y-0.5 shadow-gold-500/20'
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-dark-900"
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
              ) : mode === 'LOGIN' ? (
                'Se connecter'
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              {mode === 'LOGIN' ? 'Pas encore de compte ?' : 'Déjà inscrit ?'}{' '}
              <button
                onClick={() =>
                  setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN')
                }
                className="text-brand-400 hover:text-brand-300 font-bold transition-colors"
              >
                {mode === 'LOGIN' ? 'Créer un compte' : 'Se connecter'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
