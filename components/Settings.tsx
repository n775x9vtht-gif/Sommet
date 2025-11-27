import React, { useState, useEffect } from 'react';
import { 
  IconUser, 
  IconMail, 
  IconLock, 
  IconCheck, 
  IconX, 
  IconDiamond, 
  IconRocket, 
  IconTrash 
} from './Icons';

type PlanType = 'camp_de_base' | 'explorateur' | 'batisseur';

interface SettingsProps {
  userEmail: string;
  firstName: string;
  lastName: string;
  onUpdateProfile: (firstName: string, lastName: string, email: string) => void;
  onOpenPricing: () => void;
  onDeleteAccount: () => void;

  // Infos d’abonnement
  plan: PlanType;
  subscriptionStatus?: string | null;
  cancelAt?: string | null;
  cancelAtPeriodEnd?: boolean | null;

  // Handler pour ouvrir le portail Stripe (factures + résiliation)
  onManageBilling?: () => void;
}

// Format de date lisible
function formatDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// Label du plan
function getPlanLabel(plan: PlanType): string {
  switch (plan) {
    case 'camp_de_base':
      return 'Camp de Base (gratuit)';
    case 'explorateur':
      return "Explorateur (pack)";
    case 'batisseur':
      return 'Bâtisseur (abonnement)';
    default:
      return 'Inconnu';
  }
}

// Classe du badge plan
function getPlanBadgeClass(plan: PlanType): string {
  switch (plan) {
    case 'camp_de_base':
      return 'bg-slate-900/70 border border-slate-700/80 text-slate-100/90 backdrop-blur-md';
    case 'explorateur':
      return 'bg-brand-900/40 border border-brand-500/60 text-brand-50 backdrop-blur-md';
    case 'batisseur':
      return 'bg-amber-500/15 border border-amber-400/70 text-amber-50 backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.25)]';
    default:
      return 'bg-slate-900/70 border border-slate-700/80 text-slate-100/90 backdrop-blur-md';
  }
}

const Settings: React.FC<SettingsProps> = ({
  userEmail,
  firstName,
  lastName,
  onUpdateProfile,
  onOpenPricing,
  onDeleteAccount,
  plan,
  subscriptionStatus,
  cancelAt,
  cancelAtPeriodEnd,
  onManageBilling,
}) => {
  const [localFirstName, setLocalFirstName] = useState(firstName);
  const [localLastName, setLocalLastName] = useState(lastName);
  const [email, setEmail] = useState(userEmail);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setLocalFirstName(firstName);
    setLocalLastName(lastName);
    setEmail(userEmail);
  }, [firstName, lastName, userEmail]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    
    setTimeout(() => {
      onUpdateProfile(localFirstName, localLastName, email);
      setIsSavingProfile(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }, 500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      setPasswordSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSaved(false), 3000);
    }, 800);
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues.")) {
      if (window.confirm("Vraiment sûr ? Tapez OK pour confirmer.")) {
        onDeleteAccount();
      }
    }
  };

  // Texte contextuel abonnement
  const formattedCancelAt = formatDate(cancelAt);
  let subscriptionInfoLine = '';
  let showManageBillingButton = false;

  if (plan === 'camp_de_base') {
    subscriptionInfoLine = "Vous êtes actuellement sur le plan gratuit Camp de Base.";
    showManageBillingButton = false;
  } else if (plan === 'explorateur') {
    subscriptionInfoLine =
      "Vous avez un pack Explorateur (one-shot). Il n'y a pas d'abonnement récurrent à gérer.";
    showManageBillingButton = !!onManageBilling;
  } else if (plan === 'batisseur') {
    showManageBillingButton = !!onManageBilling;

    if (subscriptionStatus === 'canceled') {
      subscriptionInfoLine =
        "Votre abonnement Bâtisseur est terminé. Vous pouvez le reprendre à tout moment depuis la page Tarifs.";
    } else if (subscriptionStatus === 'active' && cancelAtPeriodEnd && formattedCancelAt) {
      subscriptionInfoLine = `Votre abonnement Bâtisseur reste actif jusqu'au ${formattedCancelAt}. Il ne sera pas renouvelé après cette date.`;
    } else if (subscriptionStatus === 'active') {
      subscriptionInfoLine =
        "Votre abonnement Bâtisseur est actif avec renouvellement automatique.";
    } else {
      subscriptionInfoLine =
        "Statut de l'abonnement Bâtisseur : " + (subscriptionStatus ?? 'inconnu');
    }
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Paramètres du Compte</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Gérez vos informations personnelles, votre sécurité et votre abonnement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* 1. Profil */}
        <div className="bg-dark-800 border border-dark-700 rounded-[2rem] p-8 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-dark-700 rounded-lg">
              <IconUser className="w-5 h-5 text-brand-500" />
            </div>
            Mon Profil
          </h2>
          
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Prénom
                </label>
                <div className="relative">
                  <IconUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="text" 
                    value={localFirstName}
                    onChange={(e) => setLocalFirstName(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-600 text-white rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                    placeholder="Rémi"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Nom
                </label>
                <input 
                  type="text" 
                  value={localLastName}
                  onChange={(e) => setLocalLastName(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                  placeholder="Moreira"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Email
              </label>
              <div className="relative">
                <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-600 text-white rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSavingProfile}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSavingProfile ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : profileSaved ? (
                  <>
                    <IconCheck className="w-5 h-5" /> Enregistré
                  </>
                ) : (
                  "Mettre à jour le profil"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 2. Sécurité */}
        <div className="bg-dark-800 border border-dark-700 rounded-[2rem] p-8 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-dark-700 rounded-lg">
              <IconLock className="w-5 h-5 text-gold-500" />
            </div>
            Sécurité
          </h2>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Mot de passe actuel
              </label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Nouveau
                </label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Confirmer
                </label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                />
              </div>
            </div>

            {passwordError && (
              <p className="text-red-400 text-xs font-medium flex items-center gap-1">
                <IconX className="w-3 h-3" /> {passwordError}
              </p>
            )}
            
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSavingPassword}
                className="w-full bg-dark-700 hover:bg-dark-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-dark-600"
              >
                {isSavingPassword ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : passwordSaved ? (
                  <>
                    <IconCheck className="w-5 h-5 text-green-500" /> Modifié
                  </>
                ) : (
                  "Changer le mot de passe"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 3. Abonnement */}
        <div className="lg:col-span-2 bg-gradient-to-r from-dark-800 to-dark-900 border border-dark-700 rounded-[2rem] p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-2">
                <div className="p-2 bg-dark-700 rounded-lg">
                  <IconDiamond className="w-5 h-5 text-white" />
                </div>
                Votre Abonnement
              </h2>
              <p className="text-slate-400 text-sm">
                {subscriptionInfoLine}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-dark-950/60 px-3 py-2 rounded-full border border-dark-700/80 backdrop-blur-md">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                Plan actuel
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${getPlanBadgeClass(plan)}`}>
                {getPlanLabel(plan)}
              </span>
            </div>
          </div>

          <div className="bg-dark-950/50 rounded-xl border border-dark-700 p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-900/20 rounded-xl flex items-center justify-center border border-brand-500/20">
                <IconRocket className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                {plan === 'camp_de_base' ? (
                  <>
                    <h3 className="font-bold text-white">Passez à la vitesse supérieure</h3>
                    <p className="text-sm text-slate-400">
                      Débloquez le Chantier, le Sherpa et les exports illimités.
                    </p>
                  </>
                ) : plan === 'explorateur' ? (
                  <>
                    <h3 className="font-bold text-white">Pack Explorateur</h3>
                    <p className="text-sm text-slate-400">
                      Vous pouvez racheter un pack ou passer à l’abonnement Bâtisseur.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-white">Abonnement Bâtisseur</h3>
                    <p className="text-sm text-slate-400">
                      Gérez votre facturation, vos moyens de paiement et la résiliation depuis le portail sécurisé Stripe.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              {plan === 'camp_de_base' && (
                <button 
                  onClick={onOpenPricing}
                  className="w-full px-6 py-3 bg-white hover:bg-slate-100 text-dark-900 font-bold rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-white/10 whitespace-nowrap"
                >
                  Voir les offres
                </button>
              )}

              {plan !== 'camp_de_base' && onManageBilling && (
                <button
                  onClick={onManageBilling}
                  className="w-full px-6 py-3 bg-dark-800 hover:bg-dark-700 text-slate-100 font-bold rounded-xl border border-dark-600 transition-all hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Gérer mon abonnement &amp; mes factures
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4. Danger Zone */}
        <div className="lg:col-span-2 border border-red-500/20 bg-red-500/5 rounded-[2rem] p-8">
          <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-3">
            <IconTrash className="w-5 h-5" />
            Zone de Danger
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-red-400/70 text-sm">
              La suppression de votre compte est définitive. Toutes vos idées, analyses et plans seront effacés de nos serveurs.
            </p>
            <button 
              onClick={handleDelete}
              className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold rounded-xl transition-colors whitespace-nowrap"
            >
              Supprimer mon compte
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;