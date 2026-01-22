
import React, { useState, useEffect } from 'react';
import { Order, UserProfile, SiteRule, Transaction } from '../types';
import { DatabaseService } from '../services/database';

interface AdminDashboardProps {
  orders: Order[];
  allUsers: UserProfile[];
  onBanUser: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  orders, allUsers, onBanUser
}) => {
  const [activeTab, setActiveTab] = useState<'pulse' | 'finance' | 'database' | 'rules'>('pulse');
  const [pendingDeposits, setPendingDeposits] = useState<Transaction[]>([]);
  const [siteRules, setSiteRules] = useState<SiteRule[]>([]);
  
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [newRule, setNewRule] = useState<Omit<SiteRule, 'id' | 'lastUpdated'>>({
    key: '', title: '', description: '', value: '', type: 'text', category: 'finance'
  });

  useEffect(() => {
    setPendingDeposits(DatabaseService.getPendingTransactions());
    setSiteRules(DatabaseService.getRules());
  }, [activeTab]);

  const handleApprove = (id: string) => {
    DatabaseService.validateDeposit(id);
    setPendingDeposits(DatabaseService.getPendingTransactions());
    (window as any).notify?.("Dépôt approuvé !", "success");
  };

  const handleReject = (id: string) => {
    DatabaseService.rejectDeposit(id);
    setPendingDeposits(DatabaseService.getPendingTransactions());
    (window as any).notify?.("Rejeté.", "error");
  };

  const handleUpdateRuleValue = (id: string, val: any) => {
    DatabaseService.updateRule(id, val);
    setSiteRules(DatabaseService.getRules());
    (window as any).notify?.("Règle mise à jour.");
  };

  const handleDeleteRule = (id: string) => {
    if (window.confirm("Supprimer cette règle ?")) {
        DatabaseService.deleteRule(id);
        setSiteRules(DatabaseService.getRules());
    }
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    DatabaseService.addRule(newRule);
    setSiteRules(DatabaseService.getRules());
    setShowRuleForm(false);
    (window as any).notify?.("Règle ajoutée.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Master Engine v7.0</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Command <span className="text-indigo-600">Center</span> 🛡️
          </h2>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border dark:border-slate-700 overflow-x-auto no-scrollbar">
          {(['pulse', 'finance', 'database', 'rules'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-white dark:bg-slate-700 shadow-xl text-indigo-600' : 'text-slate-400'
              }`}
            >
              {tab === 'pulse' ? '📡 Pulse' : tab === 'finance' ? '💰 Finance' : tab === 'database' ? '📂 Usagers' : '📜 Règles'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'rules' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter">Charte du Marketplace</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1">Gérez l'économie de la plateforme.</p>
                </div>
                <button 
                    onClick={() => setShowRuleForm(true)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase shadow-lg hover:scale-105 transition-all"
                >
                    + Nouvelle Règle
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {siteRules.map(rule => (
                    <div key={rule.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border dark:border-slate-800 shadow-sm relative group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-slate-100 dark:bg-slate-800 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg text-slate-500">{rule.category}</span>
                            <button onClick={() => handleDeleteRule(rule.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>
                        </div>
                        <h4 className="font-black text-lg mb-1">{rule.title}</h4>
                        <div className="flex items-center gap-4">
                            <input 
                                type={rule.type === 'percent' || rule.type === 'amount' ? 'number' : 'text'}
                                className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-black outline-none"
                                value={rule.value}
                                onChange={(e) => handleUpdateRuleValue(rule.id, e.target.value)}
                            />
                            <div className="text-xs font-black text-indigo-600 uppercase">{rule.type === 'percent' ? '%' : 'Val'}</div>
                        </div>
                    </div>
                ))}
            </div>

            {showRuleForm && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
                    <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-3xl border border-white/10 overflow-hidden">
                        <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
                            <h3 className="text-xl font-black uppercase">Nouvelle Règle</h3>
                            <button onClick={() => setShowRuleForm(false)} className="text-2xl">&times;</button>
                        </div>
                        <form onSubmit={handleAddRule} className="p-8 space-y-4">
                            <input required placeholder="Clé (ex: commission)" className="w-full bg-slate-50 p-4 rounded-xl text-sm" value={newRule.key} onChange={e => setNewRule({...newRule, key: e.target.value})} />
                            <input required placeholder="Titre" className="w-full bg-slate-50 p-4 rounded-xl text-sm" value={newRule.title} onChange={e => setNewRule({...newRule, title: e.target.value})} />
                            <div className="grid grid-cols-2 gap-2">
                                <select className="bg-slate-50 p-3 rounded-xl text-[10px]" value={newRule.type} onChange={e => setNewRule({...newRule, type: e.target.value as any})}>
                                    <option value="percent">Pourcentage</option>
                                    <option value="amount">Montant</option>
                                </select>
                                <input required placeholder="Valeur" className="bg-slate-50 p-3 rounded-xl text-sm" value={newRule.value} onChange={e => setNewRule({...newRule, value: e.target.value})} />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-xs mt-4">Enregistrer ✓</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border dark:border-slate-800">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Profit Plateforme</p>
               <p className="text-3xl font-black text-indigo-600">
                 {orders.reduce((s, o) => s + o.commissionLumina, 0).toFixed(1)} LT
               </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border dark:border-slate-800">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Alertes Dépôts</p>
               <p className="text-3xl font-black text-togo-yellow">{pendingDeposits.length}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border shadow-2xl overflow-hidden">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50">
               <h3 className="font-black text-xl uppercase tracking-tighter">Validation Dépôts Mobile Money</h3>
            </div>

            {pendingDeposits.length > 0 ? (
              <table className="w-full text-left">
                <thead className="text-[10px] font-black text-slate-400 uppercase bg-slate-50">
                  <tr><th className="p-6">Client</th><th className="p-6">Réf</th><th className="p-6">Montant</th><th className="p-6">Actions</th></tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {pendingDeposits.map(tx => (
                    <tr key={tx.id}>
                      <td className="p-6 font-bold">{tx.userName}</td>
                      <td className="p-6 font-mono text-xs">{tx.reference}</td>
                      <td className="p-6 font-black text-indigo-600">+{tx.amountTokens} LT</td>
                      <td className="p-6 flex gap-2">
                        <button onClick={() => handleApprove(tx.id)} className="bg-togo-green text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase">Valider</button>
                        <button onClick={() => handleReject(tx.id)} className="bg-red-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase">Rejeter</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-20 text-center text-slate-400 font-black uppercase text-[10px]">Aucun dépôt en attente.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border shadow-2xl overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase">
                <tr><th className="p-6">Utilisateur</th><th className="p-6">Rôle</th><th className="p-6">Solde</th><th className="p-6">Actions</th></tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {allUsers.map(user => (
                  <tr key={user.id}>
                    <td className="p-6 font-bold">{user.name}</td>
                    <td className="p-6 uppercase text-[10px] font-black text-indigo-600">{user.role}</td>
                    <td className="p-6 font-black text-togo-green">{user.tokenBalance.toLocaleString()} LT</td>
                    <td className="p-6">
                      <button onClick={() => onBanUser(user.id)} className="text-[9px] font-black uppercase text-red-500">Suspendre</button>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};
