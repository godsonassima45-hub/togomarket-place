
import React, { useState } from 'react';
import { PaymentMethod } from '../types';

interface PaymentModalProps {
  total: number;
  onConfirm: (identifier: string, method: PaymentMethod) => void;
  onCancel: () => void;
  initialMethod?: PaymentMethod;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ total, onConfirm, onCancel, initialMethod }) => {
  const [method, setMethod] = useState<PaymentMethod>(initialMethod || 'TMoney');
  const [step, setStep] = useState<'selection' | 'details' | 'processing'>('selection');
  const [phone, setPhone] = useState('');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const handleNext = () => {
    setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    setTimeout(() => {
      const identifier = method === 'Card' ? `CARD-${cardData.number.slice(-4)}` : phone;
      onConfirm(identifier, method);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/10">
        
        <div className={`p-8 text-white transition-all duration-500 ${
          step === 'processing' ? 'bg-slate-800' :
          method === 'TMoney' ? 'bg-[#ee1c25]' : 
          method === 'Flooz' ? 'bg-[#005da4]' : 
          'bg-togo-green'
        } flex justify-between items-center`}>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">
              Paiement Togo
            </h3>
            <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mt-1">Lumina Secure Node 228</p>
          </div>
          <button onClick={onCancel} className="text-3xl hover:rotate-90 transition-transform">&times;</button>
        </div>

        <div className="p-8">
          {step === 'selection' && (
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-6">Moyen de paiement mobile au Togo</p>
              
              <button onClick={() => { setMethod('TMoney'); handleNext(); }} className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent hover:border-[#ee1c25] transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#ee1c25] text-white rounded-xl flex items-center justify-center font-black text-[10px] shadow-lg">TMoney</div>
                  <div className="text-left">
                    <p className="font-black text-sm">TMoney (Togocom)</p>
                    <p className="text-[9px] text-slate-400 font-bold">Paiement Mobile National</p>
                  </div>
                </div>
                <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button onClick={() => { setMethod('Flooz'); handleNext(); }} className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent hover:border-[#005da4] transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#005da4] text-white rounded-xl flex items-center justify-center font-black text-[10px] shadow-lg">Flooz</div>
                  <div className="text-left">
                    <p className="font-black text-sm">Flooz (Moov Africa)</p>
                    <p className="text-[9px] text-slate-400 font-bold">Paiement Mobile National</p>
                  </div>
                </div>
                <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button onClick={() => { setMethod('Card'); handleNext(); }} className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent hover:border-togo-green transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-togo-green text-white rounded-xl flex items-center justify-center text-xl shadow-lg">💳</div>
                  <div className="text-left">
                    <p className="font-black text-sm">Carte Bancaire / VISA</p>
                    <p className="text-[9px] text-slate-400 font-bold">Transactions Internationales</p>
                  </div>
                </div>
                <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4">
              <div className="text-center mb-6">
                <p className="text-3xl font-black text-slate-900 dark:text-white">{total.toLocaleString()} FCFA</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total à débiter</p>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Numéro Togo (+228)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">+228</span>
                  <input 
                    required
                    type="tel"
                    placeholder="90 00 00 00"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 pl-16 text-lg font-black tracking-[0.2em] outline-none border-2 border-transparent focus:border-togo-green"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  />
                </div>
              </div>

              <button type="submit" className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-white shadow-2xl transition-all active:scale-95 ${method === 'TMoney' ? 'bg-[#ee1c25]' : method === 'Flooz' ? 'bg-[#005da4]' : 'bg-togo-green'}`}>
                Confirmer l'achat ⚡
              </button>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center space-y-8 animate-in fade-in zoom-in">
              <div className="w-20 h-20 border-4 border-togo-green border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h4 className="font-black text-xl">Lancement Passerelle...</h4>
              <p className="text-xs text-slate-500 px-8">Validation via les serveurs de {method} en cours.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
