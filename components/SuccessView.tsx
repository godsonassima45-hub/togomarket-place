
import React, { useEffect, useState } from 'react';

interface SuccessViewProps {
  orderId: string;
  onContinue: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ orderId, onContinue }) => {
  const [confetti, setConfetti] = useState<number[]>([]);

  useEffect(() => {
    // Generate 50 confetti pieces
    setConfetti(Array.from({ length: 50 }, (_, i) => i));
  }, []);

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center py-20 px-6 text-center animate-in zoom-in duration-700 overflow-hidden">
      
      {/* Confetti Elements */}
      {confetti.map(i => (
        <div 
          key={i} 
          className="confetti" 
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `-20px`,
            backgroundColor: ['#006a4e', '#ffce00', '#d21034', '#6366f1'][Math.floor(Math.random() * 4)],
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }} 
        />
      ))}

      <div className="relative">
        <div className="w-32 h-32 bg-togo-green text-white rounded-[3rem] flex items-center justify-center text-5xl mb-10 shadow-3xl shadow-togo-green/40 mx-auto animate-bounce border-8 border-white dark:border-slate-900">
          ✓
        </div>
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-togo-yellow rounded-full flex items-center justify-center text-2xl animate-pulse">🎉</div>
      </div>

      <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-none uppercase">
        C'est dans la poche !
      </h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 text-lg font-medium leading-relaxed">
        Votre commande <span className="font-black text-togo-green dark:text-togo-yellow">#{orderId}</span> est validée. Préparez-vous à recevoir vos trésors !
      </p>
      
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] w-full max-w-sm mb-12 border-2 border-slate-100 dark:border-slate-800 shadow-2xl scale-100 hover:scale-105 transition-transform">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-center">Pipeline de Livraison</p>
        <div className="space-y-5 text-left">
          <div className="flex gap-4 items-center">
             <div className="w-8 h-8 rounded-full bg-togo-green/10 text-togo-green flex items-center justify-center text-xs font-black">1</div>
             <p className="text-sm font-bold">Vendeur prévenu immédiatement 📲</p>
          </div>
          <div className="flex gap-4 items-center">
             <div className="w-8 h-8 rounded-full bg-togo-green/10 text-togo-green flex items-center justify-center text-xs font-black">2</div>
             <p className="text-sm font-bold">Collecte par Lumina Courier 🛵</p>
          </div>
          <div className="flex gap-4 items-center">
             <div className="w-8 h-8 rounded-full bg-togo-green/10 text-togo-green flex items-center justify-center text-xs font-black">3</div>
             <p className="text-sm font-bold">Arrivée chez vous (2h - 24h) 🏠</p>
          </div>
        </div>
      </div>

      <button 
        onClick={onContinue}
        className="bg-slate-900 dark:bg-indigo-600 text-white px-16 py-6 rounded-3xl font-black uppercase tracking-widest text-xs shadow-3xl hover:shadow-indigo-500/40 transition-all hover:-translate-y-1 active:scale-95 pulse-btn"
      >
        Continuer mon shopping 🚀
      </button>
    </div>
  );
};
