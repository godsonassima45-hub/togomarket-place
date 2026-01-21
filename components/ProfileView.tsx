
import React, { useState } from 'react';
import { UserProfile, Order, Transaction } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onEditProfile: () => void;
  isAdminView?: boolean;
  isMe?: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, orders, onViewOrder, onEditProfile, isAdminView, isMe }) => {
  const [activeTab, setActiveTab] = useState<'journal' | 'transactions' | 'avis'>('journal');

  return (
    <div className="max-w-6xl mx-auto md:px-4 py-8 animate-in fade-in duration-500">
      
      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-[2.5rem] overflow-hidden mb-8 border border-slate-100 dark:border-slate-800">
        <div className="relative h-48 md:h-64 w-full bg-slate-200 dark:bg-slate-800">
          <img 
            src={user.coverImage || "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1600"} 
            className="w-full h-full object-cover" 
            alt="Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute -bottom-12 left-12">
            <div className="w-32 h-32 rounded-full border-[6px] border-white dark:border-slate-900 overflow-hidden shadow-2xl bg-slate-50">
              {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-200">👤</div>}
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-12 flex flex-col md:flex-row justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{user.name}</h1>
            <p className="text-slate-500 font-bold text-sm">{user.email}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Solde Actuel</p>
              <p className="text-2xl font-black text-togo-green">{user.tokenBalance.toLocaleString()} LT</p>
            </div>
          </div>
        </div>

        <div className="px-12 border-t dark:border-slate-800 flex gap-8">
           {(['journal', 'transactions', 'avis'] as const).map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`py-5 text-[10px] font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === tab ? 'border-togo-green text-togo-green' : 'border-transparent text-slate-400'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          {activeTab === 'transactions' && (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-xl overflow-hidden animate-in slide-in-from-bottom-8">
              <div className="p-8 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <h3 className="font-black text-xl">Historique du Portefeuille</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-800/20">
                    <tr>
                      <th className="p-6">Date</th>
                      <th className="p-6">Référence</th>
                      <th className="p-6">Type</th>
                      <th className="p-6">Montant (LT)</th>
                      <th className="p-6">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {user.transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <td className="p-6 text-xs font-bold text-slate-500">{tx.date}</td>
                        <td className="p-6"><span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{tx.reference}</span></td>
                        <td className="p-6 text-[10px] font-black uppercase tracking-tighter">
                          {tx.type === 'deposit' ? '📥 Dépôt' : tx.type === 'payment' ? '📤 Paiement' : '💸 Retrait'}
                        </td>
                        <td className={`p-6 font-black ${tx.type === 'deposit' ? 'text-togo-green' : 'text-red-500'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}{tx.amountTokens} LT
                        </td>
                        <td className="p-6">
                           <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                             tx.status === 'success' ? 'bg-togo-green/10 text-togo-green' : 
                             tx.status === 'pending' ? 'bg-togo-yellow/10 text-togo-yellow' : 'bg-red-500/10 text-red-500'
                           }`}>
                             {tx.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                    {user.transactions.length === 0 && (
                      <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-bold uppercase text-xs">Aucune transaction ☕</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'journal' && (
            <div className="space-y-6">
               {user.activityHistory.map(act => (
                 <div key={act.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{act.date}</p>
                       <span className="text-xl">✨</span>
                    </div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{act.label}</p>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
