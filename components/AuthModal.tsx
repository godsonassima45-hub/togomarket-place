
import React, { useState } from 'react';
import { DatabaseService, MASTER_ADMIN_EMAIL } from '../services/database';
import { UserProfile } from '../types';

interface AuthModalProps {
  onAuthSuccess: (user: UserProfile, isNewUser: boolean) => void;
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
        const lowEmail = email.toLowerCase();
        
        if (isLogin) {
          // Master Admin Check
          const success = DatabaseService.preLogin(lowEmail, password);
          if (!success) {
            throw new Error("Identifiants incorrects. Veuillez vérifier votre email et mot de passe.");
          }
          const user = DatabaseService.login(lowEmail);
          onAuthSuccess(user, false);
        } else {
          if (password !== confirmPassword) throw new Error("Les mots de passe ne correspondent pas.");
          if (DatabaseService.getUserByEmail(lowEmail)) throw new Error("Cet email possède déjà un compte.");
          
          const code = DatabaseService.generateVerificationCode(lowEmail);
          (window as any).notify?.(`CODE SÉCURITÉ : ${code}`, 'info');
          setView('VERIFY');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }, 1200);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (DatabaseService.verifyCode(email, vCode)) {
        try {
          const user = DatabaseService.register(name, email, password, role);
          onAuthSuccess(user, true);
        } catch (err: any) {
          setError(err.message);
          setIsLoading(false);
        }
      } else {
        setError("Code erroné. Réessayez.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-3xl">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-3xl border border-white/10 overflow-hidden animate-in zoom-in duration-500">
        <div className="p-10 bg-gradient-to-br from-togo-green to-emerald-950 text-white text-center">
          <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">
            {view === 'VERIFY' ? 'Sécurité' : isLogin ? 'Connexion' : 'Propriétaire'}
          </h3>
          <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Lumina Network 🇹🇬</p>
        </div>

        <div className="p-10 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase border border-red-100 animate-pulse">
              ⚠️ {error}
            </div>
          )}

          {view === 'AUTH' ? (
            <form onSubmit={handleInitialSubmit} className="space-y-4">
              {!isLogin && (
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="Nom complet" className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-sm font-bold border-2 border-transparent focus:border-togo-green outline-none" />
              )}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Master</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="godsonassima45@gmail.com" className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-sm font-bold border-2 border-transparent focus:border-togo-green outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Clé d'accès</label>
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-sm font-bold border-2 border-transparent focus:border-togo-green outline-none" />
              </div>
              {!isLogin && (
                <input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirmer mot de passe" className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-sm font-bold outline-none" />
              )}
              
              {!isLogin && (
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl">
                  <button type="button" onClick={() => setRole('buyer')} className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all ${role === 'buyer' ? 'bg-white text-togo-green shadow-md' : 'text-slate-400'}`}>Acheteur 🛍️</button>
                  <button type="button" onClick={() => setRole('seller')} className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all ${role === 'seller' ? 'bg-white text-togo-green shadow-md' : 'text-slate-400'}`}>Vendeur 🏪</button>
                </div>
              )}

              <button disabled={isLoading} className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all mt-4">
                {isLoading ? 'Identification...' : 'Continuer →'}
              </button>
              
              <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-togo-green mt-2">
                {isLogin ? 'Pas encore membre ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-8 text-center">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500">Un code a été généré pour :</p>
                <p className="text-sm font-black text-indigo-600">{email}</p>
              </div>
              <input required maxLength={6} value={vCode} onChange={e => setVCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" className="w-full bg-slate-50 dark:bg-slate-800 rounded-[2rem] p-6 text-3xl font-black text-center tracking-[0.5em] outline-none border-2 border-indigo-500/20" />
              <button disabled={isLoading} className="w-full bg-togo-green text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95">
                Valider ✓
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
