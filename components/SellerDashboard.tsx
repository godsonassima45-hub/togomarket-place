
import React, { useState } from 'react';
import { Order, Seller, Product, WorkflowConfig } from '../types';
import { WorkflowManager } from './WorkflowManager';
import { MASTER_ADMIN_EMAIL } from '../services/database';

interface SellerDashboardProps {
  orders: Order[];
  seller: Seller;
  products: Product[];
  workflowConfig?: WorkflowConfig;
  onAdvanceStatus: (id: string) => void;
  onOpenChat: (userId: string, name: string, avatar: string) => void;
  onCreateProduct: () => void;
  onPayForVerification: () => void;
  onPayForWorkflow: () => void;
  onSaveWorkflow: (config: WorkflowConfig) => void;
  userEmail?: string;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ 
  orders, seller, products, workflowConfig, onAdvanceStatus, onOpenChat, onCreateProduct, onPayForVerification, onPayForWorkflow, onSaveWorkflow, userEmail
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'workflow'>('inventory');
  const sellerProducts = products.filter(p => p.sellerId === seller.id);
  const isWorkflowActive = workflowConfig?.isActive;
  
  const isOwner = userEmail?.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* Header Vendeur */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl shadow-inner">
            {seller.logo ? <img src={seller.logo} className="w-full h-full object-cover rounded-2xl" /> : '🏪'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tighter uppercase">{seller.name}</h2>
              {seller.isVerified ? (
                <span className="bg-togo-green/10 text-togo-green px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-togo-green/20">Vérifié ✓</span>
              ) : (
                <button 
                  onClick={onPayForVerification}
                  className="bg-togo-yellow text-togo-green px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                >
                  {isOwner ? 'Activer Certification (Gratuit Maître)' : 'Devenir Vérifié (9 LT)'}
                </button>
              )}
            </div>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Catégorie: {seller.category}</p>
          </div>
        </div>
        
        <div className="flex gap-8 text-center">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ventes Totales</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{seller.totalSales}</p>
          </div>
          <div className="h-10 w-px bg-slate-100 dark:bg-slate-800"></div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Score Réputation</p>
            <p className="text-xl font-black text-togo-green">★ {seller.rating}</p>
          </div>
        </div>
      </div>

      {/* Navigation Dashboard */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
        <button onClick={() => setActiveTab('inventory')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-white dark:bg-slate-700 text-togo-green shadow-sm' : 'text-slate-400'}`}>Inventaire</button>
        <button onClick={() => setActiveTab('orders')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white dark:bg-slate-700 text-togo-green shadow-sm' : 'text-slate-400'}`}>Commandes</button>
        <button onClick={() => setActiveTab('workflow')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'workflow' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Workflows Pro ⚙️</button>
      </div>

      {activeTab === 'workflow' && (
        <div className="space-y-10">
          {!isWorkflowActive ? (
            <div className="p-12 rounded-[4rem] bg-gradient-to-br from-indigo-950 to-slate-900 text-white shadow-3xl relative overflow-hidden border border-white/10 max-w-4xl mx-auto">
               <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-5xl border border-white/10 shadow-2xl animate-pulse">⚙️</div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black uppercase tracking-tighter">Workflow Automation Premium</h3>
                    <p className="text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
                      {isOwner ? "Accès Propriétaire Détecté. Déployez l'IA Lumina sans aucune restriction financière." : "Optimisez votre rentabilité. Activez l'acceptation automatique des commandes et le négociateur IA."}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-togo-yellow font-black text-xs mb-1 uppercase">Ventes 24/7</p>
                      <p className="text-[10px] text-slate-400">Réponse automatique aux clients.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-indigo-400 font-black text-xs mb-1 uppercase">IA Négociateur</p>
                      <p className="text-[10px] text-slate-400">Gère les remises intelligentes.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-emerald-400 font-black text-xs mb-1 uppercase">Stock Intelligent</p>
                      <p className="text-[10px] text-slate-400">Alerte de rupture prédictive.</p>
                    </div>
                  </div>

                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 w-full flex flex-col md:flex-row items-center justify-between gap-8">
                     <div className="text-left">
                        <p className="text-[10px] font-black uppercase text-indigo-300 tracking-[0.3em] mb-2">Facturation</p>
                        <div className="flex items-baseline gap-3">
                          <p className="text-4xl font-black">{isOwner ? 'GRATUIT ADMIN' : '13 Jetons'}</p>
                        </div>
                        <p className="text-sm font-bold text-slate-400 mt-1">{isOwner ? 'Accès illimité Propriétaire' : '6 500 XOF (Paiement unique)'}</p>
                     </div>
                     <button 
                       onClick={onPayForWorkflow}
                       className="bg-togo-yellow text-togo-green px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all hover:bg-white"
                     >
                       {isOwner ? 'Activer Immédiatement 🚀' : 'Activer mon Workflow'}
                     </button>
                  </div>
               </div>
            </div>
          ) : (
            <WorkflowManager config={workflowConfig!} onSave={onSaveWorkflow} />
          )}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sellerProducts.map(p => (
            <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border flex items-center gap-4">
              <img src={p.image} className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <h4 className="font-black text-sm uppercase">{p.name}</h4>
                <p className="text-xs font-bold text-togo-green">{p.price.toLocaleString()} F</p>
              </div>
            </div>
          ))}
          <button onClick={onCreateProduct} className="border-4 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all opacity-40">
             <span className="text-3xl">+</span>
             <span className="text-[10px] font-black uppercase">Ajouter un produit</span>
          </button>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 text-[10px] font-black uppercase">
              <tr><th className="p-6">Client</th><th className="p-6">Total</th><th className="p-6">Statut</th></tr>
            </thead>
            <tbody className="divide-y">
              {orders.map(o => (
                <tr key={o.id}><td className="p-6 font-bold">{o.customerName}</td><td className="p-6">{o.total.toLocaleString()} F</td><td className="p-6">{o.status}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
