
import React, { useState } from 'react';
import { PaymentMethod, Transaction } from '../types';
import { DatabaseService } from '../services/database';

interface RechargeModalProps {
  userEmail: string;
  onSuccess: (tx: Transaction) => void;
  onCancel: () => void;
}

type RechargeStep = 'AMOUNT' | 'METHOD' | 'INSTRUCTIONS' | 'PENDING';

export const RechargeModal: React.FC<RechargeModalProps> = ({ userEmail, onSuccess, onCancel }) => {
  const [step, setStep] = useState<RechargeStep>('AMOUNT');
  const [amountXof, setAmountXof] = useState<number>(5000);
  const [method, setMethod] = useState<PaymentMethod>('TMoney');
  const [pendingTx, setPendingTx] = useState<Transaction | null>(null);

  const tokens = Math.floor(amountXof / 500);

  const handleCreatePending = () => {
    try {
      const tx = DatabaseService.createPendingDeposit(userEmail, amountXof, tokens, method);
      setPendingTx(tx);
      setStep('INSTRUCTIONS');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleConfirmSent = () => {
    if (pendingTx) {
      onSuccess(pendingTx);
      setStep('PENDING');
    }
  };

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] shadow-3xl overflow-hidden animate-in zoom-in duration-300 border border-white/10">
        
        {/* Header SÉRIEUX */}
        <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl">🏦</div>
             <div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Lumina Wallet</h3>
                <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">Système de recharge sécurisé</p>
             </div>
          </div>
          {step !== 'PENDING' && (
            <button onClick={onCancel} className="text-2xl hover:rotate-90 transition-transform">&times;</button>
          )}
        </div>

        <div className="p-8">
          {step === 'AMOUNT' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Combien souhaitez-vous déposer ?</p>
                <div className="relative inline-block w-full">
                  <input 
                    type="number" 
                    value={amountXof} 
                    onChange={e => setAmountXof(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 text-4xl font-black text-center outline-none border-2 border-transparent focus:border-indigo-500 transition-all"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300">XOF</span>
                </div>
                <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-between border border-indigo-100 dark:border-indigo-800">
                   <p className="text-xs font-bold text-slate-500">Crédit estimé :</p>
                   <p className="text-xl font-black text-indigo-600">{tokens} Jetons</p>
                </div>
              </div>
              <button onClick={() => setStep('METHOD')} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Suivant</button>
            </div>
          )}

          {step === 'METHOD' && (
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-6">Moyen de paiement mobile</p>
              <button onClick={() => { setMethod('TMoney'); handleCreatePending(); }} className="w-full flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent hover:border-[#ee1c25] transition-all">
                <div className="w-12 h-12 bg-[#ee1c25] text-white rounded-xl flex items-center justify-center font-black text-[10px] shadow-lg">TMoney</div>
                <div className="text-left"><p className="font-black text-sm">Togocom TMoney</p><p className="text-[9px] text-slate-400 font-bold uppercase">Préfixe : 90, 91, 92, 93</p></div>
              </button>
              <button onClick={() => { setMethod('Flooz'); handleCreatePending(); }} className="w-full flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent hover:border-[#005da4] transition-all">
                <div className="w-12 h-12 bg-[#005da4] text-white rounded-xl flex items-center justify-center font-black text-[10px] shadow-lg">Flooz</div>
                <div className="text-left"><p className="font-black text-sm">Moov Africa Flooz</p><p className="text-[9px] text-slate-400 font-bold uppercase">Préfixe : 96, 97, 98, 99</p></div>
              </button>
            </div>
          )}

          {step === 'INSTRUCTIONS' && pendingTx && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-slate-900 rounded-[2rem] p-6 text-white space-y-4">
                 <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <p className="text-[10px] font-black text-white/50 uppercase">Référence à inclure</p>
                    <p className="font-black text-indigo-400">{pendingTx.reference}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-white/50 uppercase">Instruction USSD</p>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 font-mono text-center text-lg font-black tracking-widest">
                       {method === 'TMoney' ? '*145*2*8000*Montant*1#' : '*155*4*1*8000*Montant#'}
                    </div>
                 </div>
                 <p className="text-[10px] font-medium text-white/40 leading-relaxed text-center italic">
                   Effectuez le transfert sur le numéro marchand puis cliquez sur le bouton ci-dessous.
                 </p>
              </div>

              <button onClick={handleConfirmSent} className="w-full bg-togo-green text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-togo-green/20">J'ai effectué le paiement ✅</button>
            </div>
          )}

          {step === 'PENDING' && (
            <div className="py-12 text-center space-y-8 animate-in zoom-in">
              <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto shadow-xl animate-pulse">⏳</div>
              <div>
                 <h4 className="text-2xl font-black tracking-tighter uppercase">Vérification en cours</h4>
                 <p className="text-xs text-slate-500 font-medium px-8 mt-2">
                   Nos agents financiers vérifient votre transaction. Vos jetons seront crédités automatiquement après confirmation.
                 </p>
              </div>
              <button onClick={onCancel} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest">Retour au Marché</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
