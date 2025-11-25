import React, { useState, useEffect } from 'react';
import { IconUser, IconMail, IconLock, IconCheck, IconX, IconDiamond, IconRocket, IconMountain, IconTrash } from './Icons';

interface SettingsProps {
  userEmail: string;
  userName: string;
  onUpdateProfile: (name: string, email: string) => void;
  onOpenPricing: () => void;
  onDeleteAccount: () => void;
}

const Settings: React.FC<SettingsProps> = ({ userEmail, userName, onUpdateProfile, onOpenPricing, onDeleteAccount }) => {
  const [name, setName] = useState(userName);
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
    setName(userName);
    setEmail(userEmail);
  }, [userName, userEmail]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    
    // Simulate API call
    setTimeout(() => {
      onUpdateProfile(name, email);
      setIsSavingProfile(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }, 1000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setIsSavingPassword(true);
    // Simulate API call
    setTimeout(() => {
      setIsSavingPassword(false);
      setPasswordSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSaved(false), 3000);
    }, 1000);
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues.")) {
       // Double confirmation
       if (window.confirm("Vraiment sûr ? Tapez OK pour confirmer.")) {
          onDeleteAccount();
       }
    }
  };

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
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Prénom</label>
                <div className="relative">
                    <IconUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-600 text-white rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mot de passe actuel</label>
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
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nouveau</label>
                    <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-dark-900 border border-dark-600 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirmer</label>
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

        {/* 3. Abonnement (Full Width) */}
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
                    <p className="text-slate-400 text-sm">Gérez votre plan et vos factures.</p>
                </div>
                <div className="flex items-center gap-3 bg-dark-950/50 p-2 rounded-xl border border-dark-700">
                    <span className="text-xs font-bold text-slate-500 uppercase px-2">Plan Actuel :</span>
                    <span className="px-3 py-1 bg-slate-700 text-white text-xs font-bold rounded-lg">Gratuit</span>
                </div>
            </div>

            <div className="bg-dark-950/50 rounded-xl border border-dark-700 p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-900/20 rounded-xl flex items-center justify-center border border-brand-500/20">
                        <IconRocket className="w-6 h-6 text-brand-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Passez à la vitesse supérieure</h3>
                        <p className="text-sm text-slate-400">Débloquez le Chantier, le Sherpa et les exports illimités.</p>
                    </div>
                </div>
                <button 
                    onClick={onOpenPricing}
                    className="px-6 py-3 bg-white hover:bg-slate-100 text-dark-900 font-bold rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-white/10 whitespace-nowrap"
                >
                    Voir les offres
                </button>
            </div>
        </div>

        {/* 4. Danger Zone (Full Width) */}
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