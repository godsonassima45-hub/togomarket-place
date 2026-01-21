
import React, { useState } from 'react';
import { PaymentMethod } from '../types';
import { BotVerification } from './BotVerification';

interface WithdrawalModalProps {
  balance: number;
  onConfirm: (amount: number, method: PaymentMethod, destination: string) => void;
  onCancel: () => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ balance, onConfirm, onCancel }) => {
  const [amount, setAmount] = useState<number>(balance);
  const [method, setMethod] = useState<PaymentMethod>('TMoney');
  const [step, setStep] = useState<'amount' | 'details' | 'security' | 'processing' | 'success'>('amount');
  const [destination, setDestination] = useState('');

  const handleNext = () => {
    if (amount <= 0 || amount > balance) {
      alert("Montant invalide");
      return;
    }
    setStep('details');
  };

  const startProcessing = () => {
    setStep('processing');
    
    // Simulation du transfert vers Lumina Payout API
    setTimeout(() => {
      onConfirm(amount, method, destination);
      setStep('success');
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[4rem] shadow-3xl overflow-hidden animate-in zoom-in duration-500 border border-white/10 relative">
        
        {/* Header Style Bank */}
        <div className={`p-10 text-white transition-all duration-700 flex justify-between items-center ${
          step === 'processing' ? 'bg-indigo-900' :
          step === 'success' ? 'bg-togo-green' : 'bg-slate-900'
        }`}>
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter leading-tight">
              {step === 'amount' ? 'Retrait' : step === 'details' ? 'Destination' : step === 'security' ? 'Sécurité' : step === 'processing' ? 'Transfert' : 'Terminé'}
            </h3>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Lumina Payout Node #882</p>
          </div>
          {step !== 'processing' && step !== 'success' && (
            <button onClick={onCancel} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:rotate-90 transition-transform">&times;</button>
          )}
        </div>

        <div className="p-10">
          {step === 'amount' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Solde Disponible</p>
                <p className="text-5xl font-black text-togo-green">{balance.toLocaleString()} F</p>
              </div>

              <div className="relative">
                <input 
                  type="number"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 rounded-[2rem] p-10 text-5xl font-black text-center outline-none focus:ring-4 focus:ring-indigo-500/20 border-2 border-transparent focus:border-indigo-500 transition-all"
                  placeholder="0"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xl">FCFA</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[0.25, 0.5, 1].map(percent => (
                  <button 
                    key={percent}
                    onClick={() => setAmount(Math.floor(balance * percent))}
                    className="py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    {percent === 1 ? 'TOUT' : `${percent * 100}%`}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleNext}
                className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                Continuer →
              </button>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-8 animate-in slide-in-from-right-8">
               <div className="grid grid-cols-3 gap-4">
                  {(['TMoney', 'Flooz', 'Card'] as const).map(m => (
                    <button 
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center gap-3 ${
                        method === m ? 'border-togo-green bg-togo-green/5' : 'border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <span className="text-2xl">{m === 'Card' ? '🏦' : m === 'TMoney' ? '🔴' : '🔵'}</span>
                      <span className="text-[9px] font-black uppercase tracking-tighter">{m}</span>
                    </button>
                  ))}
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                    {method === 'Card' ? 'IBAN / RIB' : 'Numéro Mobile (+228)'}
                  </label>
                  <input 
                    required
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder={method === 'Card' ? 'TG00...' : '90 00 00 00'}
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-[2rem] p-6 text-xl font-black outline-none border-2 border-transparent focus:border-togo-green transition-all"
                  />
               </div>

               <button 
                 onClick={() => setStep('security')}
                 disabled={!destination}
                 className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 transition-all disabled:opacity-30"
               >
                 Vérification de sécurité →
               </button>
            </div>
          )}

          {step === 'security' && (
            <div className="space-y-10 py-6 animate-in zoom-in">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-2xl">🛡️</div>
                <h4 className="text-xl font-black uppercase tracking-tighter">Validation Humaine</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">Pour protéger votre solde contre les accès non autorisés, veuillez confirmer l'action ci-dessous.</p>
              </div>
              
              <BotVerification onVerified={startProcessing} title="Scanner Anti-Bot Lumina" />
              
              <button 
                onClick={() => setStep('details')}
                className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                Retour aux détails
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-20 text-center space-y-12 animate-in zoom-in">
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-4 border-indigo-300 border-b-transparent rounded-full animate-spin [animation-duration:2s]"></div>
                <div className="absolute inset-0 flex items-center justify-center text-3xl">🏦</div>
              </div>
              <h4 className="font-black text-2xl uppercase tracking-tighter">Transfert sortant...</h4>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 text-center space-y-8 animate-in slide-in-from-bottom-8">
               <div className="w-24 h-24 bg-togo-green text-white rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-togo-green/40">✓</div>
               <h4 className="text-3xl font-black tracking-tighter">Retrait Réussi !</h4>
               <button onClick={onCancel} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs">Terminer</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
