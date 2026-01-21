
import React from 'react';
import { AppView, Theme, UserRole } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  currentView: AppView;
  setView: (v: AppView) => void;
  cartCount: number;
  theme: Theme;
  toggleTheme: () => void;
  role: UserRole;
  onRoleChange: (r: UserRole) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  userAvatar?: string;
  tokenBalance: number;
  onRechargeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, setView, cartCount, theme, toggleTheme, role, onRoleChange, searchQuery, setSearchQuery, userAvatar, tokenBalance, onRechargeClick
}) => {
  const isAdmin = role === 'admin';

  return (
    <header className="sticky top-0 z-[100] glass-header border-b border-white/20 dark:border-slate-800/50 shadow-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 md:h-20 flex items-center justify-between gap-4">
          
          <div className="cursor-pointer shrink-0 transition-all hover:opacity-80 active:scale-90" onClick={() => setView(AppView.STORE)}>
            <Logo size="sm" showText={true} />
          </div>

          <nav className="hidden lg:flex items-center bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-full border border-white/10 nav-pill-shadow relative min-w-[600px]">
            <div 
              className="absolute h-[calc(100%-8px)] bg-white dark:bg-slate-700 rounded-full shadow-md transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{
                width: isAdmin ? '20%' : '25%',
                left: currentView === AppView.STORE ? '0%' : 
                      currentView === AppView.VIRTUAL_CABIN ? (isAdmin ? '20%' : '25%') :
                      currentView === AppView.SELLER_DASHBOARD ? (isAdmin ? '40%' : '50%') :
                      currentView === AppView.CONTACT ? (isAdmin ? '60%' : '75%') :
                      currentView === AppView.ADMIN_DASHBOARD ? '80%' : '0%',
                opacity: 1
              }}
            />
            
            <button onClick={() => setView(AppView.STORE)} className={`relative z-10 flex-1 px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${currentView === AppView.STORE ? 'text-togo-green dark:text-togo-yellow' : 'text-slate-500'}`}>
              Accueil
            </button>
            <button onClick={() => setView(AppView.VIRTUAL_CABIN)} className={`relative z-10 flex-1 px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${currentView === AppView.VIRTUAL_CABIN ? 'text-togo-green dark:text-togo-yellow' : 'text-slate-500'}`}>
              Cabine ✨
            </button>
            <button onClick={() => { onRoleChange('seller'); setView(AppView.SELLER_DASHBOARD); }} className={`relative z-10 flex-1 px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${currentView === AppView.SELLER_DASHBOARD ? 'text-togo-green dark:text-togo-yellow' : 'text-slate-500'}`}>
              Vendre
            </button>
            <button onClick={() => setView(AppView.CONTACT)} className={`relative z-10 flex-1 px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${currentView === AppView.CONTACT ? 'text-togo-green dark:text-togo-yellow' : 'text-slate-500'}`}>
              Aide
            </button>
            {isAdmin && (
              <button onClick={() => setView(AppView.ADMIN_DASHBOARD)} className={`relative z-10 flex-1 px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${currentView === AppView.ADMIN_DASHBOARD ? 'text-indigo-600' : 'text-slate-500'}`}>
                Admin 🛡️
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={onRechargeClick} className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white pl-1 pr-4 py-1.5 rounded-full border border-white/5 shadow-lg active:scale-95 transition-all">
              <div className="w-8 h-8 bg-togo-yellow rounded-full flex items-center justify-center text-togo-green text-[10px] font-black coin-spin">LT</div>
              <div className="hidden sm:block text-left">
                <p className="text-[7px] font-black opacity-50 uppercase tracking-tighter mb-0.5">Solde</p>
                <p className="text-xs font-black">{tokenBalance.toLocaleString()}</p>
              </div>
            </button>

            <button onClick={toggleTheme} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-white transition-all">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <button onClick={() => setView(AppView.CART)} className="relative p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <span className="text-xl">🛒</span>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-togo-red text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-bounce">{cartCount}</span>}
            </button>

            <button onClick={() => setView(AppView.PROFILE)} className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white bg-slate-200 dark:bg-slate-800 hover:border-togo-green transition-all shadow-md flex items-center justify-center">
              {userAvatar ? (
                <img src={userAvatar} className="w-full h-full object-cover" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-slate-400 dark:text-slate-500" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
