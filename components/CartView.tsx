
import React, { useState } from 'react';
import { CartItem } from '../types';
import { BotVerification } from './BotVerification';

interface CartViewProps {
  items: CartItem[];
  updateQty: (id: string, d: number) => void;
  onCheckout: (totalTokens: number) => void;
  onBack: () => void;
  userTokenBalance: number;
}

export const CartView: React.FC<CartViewProps> = ({ items, updateQty, onCheckout, onBack, userTokenBalance }) => {
  const [shieldVerified, setShieldVerified] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const subtotalFcfa = items.reduce((s, i) => s + (i.price * i.quantity), 0);
  
  // Règle : 1 Jeton (LT) = 500 FCFA
  const totalTokens = Math.ceil(subtotalFcfa / 500);
  const hasEnoughTokens = userTokenBalance >= totalTokens;

  const handleFinalConfirm = () => {
    setShowConfirmModal(false);
    onCheckout(totalTokens);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <button onClick={onBack} className="text-sm font-black text-togo-green mb-6 flex items-center gap-2 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Retour au marché
      </button>

      <h2 className="text-3xl font-black mb-8 text-slate-900 dark:text-white tracking-tighter uppercase">Mon Panier Lumina</h2>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-inner">
          <div className="text-6xl mb-4 opacity-20">🛒</div>
          <h3 className="text-xl font-bold mb-2 uppercase tracking-tighter text-slate-400">Votre panier est vide</h3>
          <p className="text-sm text-slate-400 mb-8">Ajoutez des articles pour commencer votre shopping.</p>
          <button onClick={onBack} className="bg-slate-900 dark:bg-indigo-600 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
            Explorer les produits
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const itemTokenPrice = Math.ceil(item.price / 500);
              return (
                <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl flex gap-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                  <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-sm uppercase tracking-tighter text-slate-900 dark:text-white line-clamp-1">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1 mb-4">
                      <div className="w-4 h-4 bg-togo-yellow rounded-full flex items-center justify-center text-togo-green text-[7px] font-black">LT</div>
                      <span className="font-black text-togo-green dark:text-togo-yellow text-xs">{itemTokenPrice.toLocaleString()} LT <span className="text-[10px] text-slate-400 opacity-60">/ unité</span></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border dark:border-slate-700">
                        <button onClick={() => updateQty(item.id, -1)} className="px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-black text-slate-600 dark:text-slate-400">-</button>
                        <span className="px-4 font-black text-sm text-slate-900 dark:text-white">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-black text-slate-600 dark:text-slate-400">+</button>
                      </div>
                      <p className="font-black text-slate-900 dark:text-white">{(itemTokenPrice * item.quantity).toLocaleString()} LT</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl h-fit sticky top-32">
            <h3 className="font-black text-xl mb-6 tracking-tighter border-b dark:border-slate-800 pb-4">Résumé de l'ordre</h3>
            
            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between font-bold text-slate-400">
                <span className="uppercase tracking-widest text-[9px]">Total Valeur</span>
                <span>{subtotalFcfa.toLocaleString()} F</span>
              </div>
              
              <div className="pt-6 border-t border-dashed dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 text-center">Total en Jetons à payer</p>
                <div className="flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800/50 py-6 rounded-2xl border-2 border-indigo-500/10">
                   <div className="w-12 h-12 bg-togo-yellow rounded-full flex items-center justify-center text-togo-green text-sm font-black shadow-xl animate-pulse">LT</div>
                   <span className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">{totalTokens.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl mb-6 border-2 transition-all ${hasEnoughTokens ? 'bg-togo-green/5 border-togo-green/20' : 'bg-red-50 dark:bg-red-900/10 border-red-500/20'}`}>
              <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                <span className="text-slate-400">Votre Solde Actuel</span>
                <span className={hasEnoughTokens ? 'text-togo-green' : 'text-red-600 font-black'}>{userTokenBalance.toLocaleString()} LT</span>
              </div>
              {!hasEnoughTokens && (
                <div className="mt-3 p-3 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase animate-bounce text-center">
                  ⚠️ ACCÈS REFUSÉ : SOLDE INSUFFISANT
                </div>
              )}
            </div>

            {hasEnoughTokens && (
              <div className="mb-8">
                <BotVerification onVerified={() => setShieldVerified(true)} title="Sécurité Anti-Bot" />
              </div>
            )}

            <button 
              onClick={() => shieldVerified && setShowConfirmModal(true)}
              disabled={!hasEnoughTokens || !shieldVerified}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95 ${
                hasEnoughTokens && shieldVerified
                ? 'bg-slate-900 dark:bg-indigo-600 text-white hover:scale-[1.02]' 
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              {!hasEnoughTokens ? 'SOLDE INSUFFISANT' : !shieldVerified ? 'VÉRIFICATION REQUISE' : 'CONFIRMER LE PAIEMENT 🚀'}
            </button>
            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4 opacity-50">Protection par Lumina Shield Technology</p>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMATION DE RETRAIT */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3rem] shadow-3xl border border-white/10 overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-togo-yellow text-togo-green text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg animate-pulse">💰</div>
              <h3 className="text-xl font-black uppercase tracking-tighter">Confirmation de Retrait</h3>
            </div>
            <div className="p-8 space-y-6 text-center">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                Voulez-vous vraiment que nous retirions <span className="text-slate-900 dark:text-white font-black text-lg">{totalTokens.toLocaleString()} LT</span> de votre compte pour valider cet achat ?
              </p>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Action Irréversible</p>
                <p className="text-xs font-bold text-togo-green">Le transfert est immédiat et sécurisé.</p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleFinalConfirm}
                  className="w-full bg-togo-green text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-emerald-600 transition-all"
                >
                  Oui, retirer les jetons ✅
                </button>
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                >
                  Annuler l'achat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
