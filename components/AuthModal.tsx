
import React, { useState } from 'react';
import { DatabaseService, MASTER_ADMIN_EMAIL } from '../services/database';
import { UserProfile } from '../types';

interface AuthModalProps {
  onAuthSuccess: (user: UserProfile) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onAuthSuccess, onClose }) => {
  const [view, setView] = useState<'AUTH' | 'VERIFY'>('AUTH');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [vCode, setVCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      try {
        if (isLogin) {
          const requiresVerification = DatabaseService.preLogin(email, password);
          
          if (!requiresVerification) {
            // C'est le Master Admin (Godson), connexion directe !
            const user = DatabaseService.login(email);
            onAuthSuccess(user);
            return;
          }
        } else {
          if (password !== confirmPassword) throw new Error("Les mots de passe ne correspondent pas.");
          DatabaseService.preRegister(name, email, password);
        }

        // Pour les autres utilisateurs, envoi du code de sécurité
        const code = DatabaseService.generateVerificationCode(email);
        (window as any).notify?.(`CODE DE SÉCURITÉ : ${code}`, 'info');
        console.log(`[LUMINA EMAIL SIMULATOR] To: ${email} | Code: ${code}`);
        
        setView('VERIFY');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }, 1200);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (DatabaseService.verifyCode(email, vCode)) {
        try {
          let user;
          if (isLogin) {
            user = DatabaseService.login(email);
          } else {
            user = DatabaseService.register(name, email, password, role);
            user = DatabaseService.login(email);
          }
          onAuthSuccess(user);
        } catch (err: any) {
          setError(err.message);
          setIsLoading(false);
        }
      } else {
        setError("Code de vérification invalide. Vérifiez vos emails.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-3xl border border-white/10 overflow-hidden animate-in zoom-in duration-300">
        
        <div className="p-10 bg-gradient-to-br from-togo-green to-emerald-900 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">
              {view === 'VERIFY' ? 'Vérification' : isLogin ? 'Connexion' : 'Bienvenue'}
            </h3>
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">
              Lumina ID • Protection 2FA Active
            </p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="p-10 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-2xl text-[10px] font-black uppercase border border-red-100 dark:border-red-900/50 flex items-center gap-3 animate-in shake duration-500">
              <span className="text-lg">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {view === 'AUTH' ? (
            <form onSubmit={handleInitialSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom Complet</label>
                  <input 
                    required value={name} onChange={e => setName(e.target.value)}
                    placeholder="Ex: Koffi Mensah"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-togo-green rounded-2xl p-4 text-sm font-bold outline-none transition-all"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input 
                  required type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.tg"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-togo-green rounded-2xl p-4 text-sm font-bold outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
                <input 
                  required type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-togo-green rounded-2xl p-4 text-sm font-bold outline-none transition-all"
                />
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer</label>
                    <input 
                      required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-togo-green rounded-2xl p-4 text-sm font-bold outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl">
                    <button type="button" onClick={() => setRole('buyer')} className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all ${role === 'buyer' ? 'bg-white dark:bg-slate-700 text-togo-green shadow-sm' : 'text-slate-400'}`}>Acheter 🛍️</button>
                    <button type="button" onClick={() => setRole('seller')} className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all ${role === 'seller' ? 'bg-white dark:bg-slate-700 text-togo-green shadow-sm' : 'text-slate-400'}`}>Vendre 🏪</button>
                  </div>
                </>
              )}

              <button disabled={isLoading} className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (email.toLowerCase().trim() === MASTER_ADMIN_EMAIL.toLowerCase() ? 'Connexion Propriétaire 🔐' : 'Continuer →')}
              </button>

              <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-togo-green transition-colors">
                {isLogin ? 'Nouveau ? S\'inscrire' : 'Déjà membre ? Se connecter'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6 animate-in slide-in-from-right-8">
              <div className="text-center">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">Un code de sécurité a été envoyé à :</p>
                <p className="text-xs font-black text-togo-green">{email}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center block">Code de Vérification (6 chiffres)</label>
                <input 
                  required maxLength={6} value={vCode} onChange={e => setVCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-togo-green rounded-2xl p-6 text-3xl font-black text-center tracking-[0.5em] outline-none transition-all"
                />
              </div>

              <button disabled={isLoading} className="w-full bg-togo-green text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Vérifier & Accéder ✓'}
              </button>

              <button type="button" onClick={() => setView('AUTH')} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                Modifier mes informations
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
