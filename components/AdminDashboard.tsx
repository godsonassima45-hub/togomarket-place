
import React, { useState, useEffect } from 'react';
import { Order, Seller, UserProfile, SiteRule, SecurityLog, Transaction } from '../types';
import { DatabaseService } from '../services/database';

interface AdminDashboardProps {
  orders: Order[];
  sellers: Seller[];
  allUsers: UserProfile[];
  rules: SiteRule[];
  logs: SecurityLog[];
  onPromoteAdmin: (id: string) => void;
  onToggleVerifySeller: (id: string) => void;
  onViewProfile: (user: UserProfile) => void;
  onBanUser: (id: string) => void;
  onWithdrawRequest: () => void;
  onUpdateRule: (ruleId: string, newValue: any) => void;
  onAddRule: (rule: Omit<SiteRule, 'id' | 'lastUpdated'>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  orders, sellers, allUsers, rules, logs,
  onPromoteAdmin, onToggleVerifySeller, onViewProfile, onBanUser, onWithdrawRequest, onUpdateRule, onAddRule
}) => {
  const [activeTab, setActiveTab] = useState<'pulse' | 'finance' | 'database' | 'workflow'>('pulse');
  const [pendingDeposits, setPendingDeposits] = useState<Transaction[]>([]);

  useEffect(() => {
    setPendingDeposits(DatabaseService.getPendingTransactions());
  }, [activeTab]);

  const handleApprove = (id: string) => {
    try {
      DatabaseService.validateDeposit(id);
      setPendingDeposits(DatabaseService.getPendingTransactions());
      (window as any).notify?.("Dépôt approuvé ! Solde crédité.", "success");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleReject = (id: string) => {
    DatabaseService.rejectDeposit(id);
    setPendingDeposits(DatabaseService.getPendingTransactions());
    (window as any).notify?.("Transaction rejetée.", "error");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Command Center v5.1</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Lumina <span className="text-indigo-600">Admin</span> 🛡️
          </h2>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border dark:border-slate-700">
          {(['pulse', 'finance', 'database', 'workflow'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white dark:bg-slate-700 shadow-xl text-indigo-600' : 'text-slate-400'
              }`}
            >
              {tab === 'pulse' ? '📡 Pulse' : tab === 'finance' ? '💰 Finance' : tab === 'database' ? '📂 Réseau' : '⚙️ Workflows'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'finance' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border shadow-2xl overflow-hidden">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
               <div>
                  <h3 className="font-black text-xl">Dépôts en Attente ({pendingDeposits.length})</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Validation manuelle requise</p>
               </div>
               <button onClick={() => setPendingDeposits(DatabaseService.getPendingTransactions())} className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-xs">🔄</button>
            </div>

            {pendingDeposits.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-800/30">
                    <tr>
                      <th className="p-6">Utilisateur</th>
                      <th className="p-6">Référence</th>
                      <th className="p-6">Montant XOF</th>
                      <th className="p-6">Jetons (LT)</th>
                      <th className="p-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {pendingDeposits.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <td className="p-6">
                           <p className="font-black text-sm">{tx.userName}</p>
                           <p className="text-[9px] text-slate-400">{tx.userEmail}</p>
                        </td>
                        <td className="p-6">
                           <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg font-mono text-xs font-black">{tx.reference}</span>
                        </td>
                        <td className="p-6 font-bold text-sm">{tx.amountFcfa.toLocaleString()} F</td>
                        <td className="p-6">
                           <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-togo-yellow rounded-full flex items-center justify-center text-togo-green text-[8px] font-black">LT</div>
                              <span className="font-black text-indigo-600">+{tx.amountTokens}</span>
                           </div>
                        </td>
                        <td className="p-6">
                           <div className="flex gap-2">
                              <button onClick={() => handleApprove(tx.id)} className="bg-togo-green text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-105">Approuver</button>
                              <button onClick={() => handleReject(tx.id)} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Rejeter</button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 text-center">
                 <p className="text-sm font-black text-slate-300 uppercase tracking-widest">Aucune transaction en attente ☕</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reste des onglets inchangés (pulse, database, workflow) */}
    </div>
  );
};
