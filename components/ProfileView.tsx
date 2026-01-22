import React, { useState, useRef } from 'react';
import { UserProfile, Order, Transaction, UserRole } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onEditProfile: (updated: UserProfile) => void;
  isAdminView?: boolean;
  isMe?: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, orders, onViewOrder, onEditProfile, isAdminView, isMe }) => {
  const [activeTab, setActiveTab] = useState<'journal' | 'transactions' | 'avis'>('journal');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editForm, setEditForm] = useState({
    name: user.name,
    phone: user.phone,
    bio: user.bio || '',
    avatar: user.avatar,
    role: user.role
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(p => ({ ...p, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onEditProfile({ ...user, ...editForm });
    setIsEditing(false);
    (window as any).notify?.("Profil mis à jour avec succès.");
  };

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
          
          <div className="absolute -bottom-12 left-12 group">
            <div className="w-32 h-32 rounded-full border-[6px] border-white dark:border-slate-900 overflow-hidden shadow-2xl bg-slate-50 relative">
              <img src={isEditing ? editForm.avatar : user.avatar} className="w-full h-full object-cover" />
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Changer 📷
                </button>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <div className="pt-16 pb-8 px-12 flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="flex-1 w-full">
            {isEditing ? (
              <div className="space-y-4 w-full max-w-sm">
                <input 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-indigo-500 p-3 rounded-xl text-xl font-black outline-none" 
                  value={editForm.name} 
                  onChange={e => setEditForm(p => ({...p, name: e.target.value}))} 
                  placeholder="Votre nom"
                />
                <div className="flex gap-2">
                   <select 
                     className="flex-1 bg-slate-50 dark:bg-slate-800 border p-2 rounded-lg text-sm font-bold outline-none"
                     value={editForm.role}
                     onChange={e => setEditForm(p => ({...p, role: e.target.value as UserRole}))}
                   >
                     <option value="buyer">Acheteur 🛍️</option>
                     <option value="seller">Vendeur 🏪</option>
                   </select>
                   <input 
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border p-2 rounded-lg text-sm font-bold outline-none" 
                    value={editForm.phone} 
                    onChange={e => setEditForm(p => ({...p, phone: e.target.value}))} 
                    placeholder="Téléphone"
                  />
                </div>
                <textarea 
                  className="w-full bg-slate-50 dark:bg-slate-800 border p-2 rounded-lg text-sm h-20 outline-none" 
                  value={editForm.bio} 
                  onChange={e => setEditForm(p => ({...p, bio: e.target.value}))} 
                  placeholder="Petite bio..."
                />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{user.name}</h1>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-500">{user.role === 'admin' ? '🛡️ Admin' : user.role === 'seller' ? '🏪 Vendeur' : '🛍️ Acheteur'}</span>
                </div>
                <p className="text-slate-500 font-bold text-sm">{user.email}</p>
                <p className="text-xs text-slate-400 mt-2 italic max-w-md">{user.bio || 'Aucune description fournie.'}</p>
              </>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-4 shrink-0">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Solde Lumina Tokens</p>
              <p className="text-2xl font-black text-togo-green">{user.tokenBalance.toLocaleString()} LT</p>
            </div>
            {isMe && (
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${isEditing ? 'bg-togo-green text-white' : 'bg-slate-900 text-white hover:bg-togo-green'}`}
              >
                {isEditing ? 'Valider les changements ✓' : 'Éditer mon profil ✍️'}
              </button>
            )}
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
                <h3 className="font-black text-xl">Historique des Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-800/20">
                    <tr>
                      <th className="p-6">Date</th>
                      <th className="p-6">Réf</th>
                      <th className="p-6">Action</th>
                      <th className="p-6">Valeur LT</th>
                      <th className="p-6">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {user.transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <td className="p-6 text-[10px] font-bold text-slate-500">{tx.date}</td>
                        <td className="p-6"><span className="font-mono text-[9px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{tx.reference}</span></td>
                        <td className="p-6 text-[10px] font-black uppercase tracking-tighter">
                          {tx.type === 'deposit' ? '📥 Gain/Dépôt' : tx.type === 'payment' ? '📤 Achat' : tx.type === 'admin_revenue' ? '📈 Commission' : '💸 Retrait'}
                        </td>
                        <td className={`p-6 font-black ${tx.type === 'deposit' || tx.type === 'admin_revenue' ? 'text-togo-green' : 'text-red-500'}`}>
                          {tx.type === 'deposit' || tx.type === 'admin_revenue' ? '+' : '-'}{tx.amountTokens} LT
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
                      <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">Aucune transaction enregistrée.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'journal' && (
            <div className="space-y-6">
               {user.activityHistory.length > 0 ? [...user.activityHistory].reverse().map(act => (
                 <div key={act.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{act.date}</p>
                       <p className="font-bold text-slate-800 dark:text-slate-200">{act.label}</p>
                    </div>
                    <span className="text-2xl">{act.type === 'purchase' ? '🛒' : '⚡'}</span>
                 </div>
               )) : (
                <div className="text-center py-20 opacity-20 font-black uppercase tracking-widest">Journal vide</div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};