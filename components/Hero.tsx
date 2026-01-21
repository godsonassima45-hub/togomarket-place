
import React from 'react';

interface HeroProps {
  onSellClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSellClick }) => {
  return (
    <div className="relative h-[450px] md:h-[650px] rounded-[3.5rem] md:rounded-[4.5rem] overflow-hidden mb-12 md:mb-20 group shadow-3xl border-4 border-white dark:border-slate-800">
      <img 
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600" 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
        alt="TogoMarket Hero"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent md:bg-gradient-to-r md:from-slate-950/90 md:to-transparent flex items-end md:items-center pb-12 md:pb-0">
        <div className="max-w-2xl px-8 md:px-20 space-y-6 md:space-y-10 animate-in slide-in-from-left-8 duration-1000">
          
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-togo-yellow px-4 py-2 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-togo-green shadow-xl animate-bounce">
              <span className="w-2 h-2 bg-togo-green rounded-full animate-pulse"></span>
              En Direct de Lomé 🇹🇬
            </div>
            <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-[9px] font-bold text-white uppercase tracking-widest">
              🔥 124 Ventes ce matin
            </div>
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] md:leading-[0.85]">
            Le Futur du<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-togo-yellow to-yellow-200">Commerce.</span>
          </h1>
          
          <p className="text-white/70 text-sm md:text-xl font-medium max-w-md leading-relaxed">
            Paiements locaux sécurisés, essayage virtuel par IA et livraison express dans tout le Togo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="relative overflow-hidden bg-white text-togo-green px-10 py-4 md:px-14 md:py-6 rounded-3xl text-[11px] md:text-xs font-black uppercase tracking-widest hover:bg-togo-yellow transition-all shadow-2xl btn-press group">
              <span className="relative z-10">Explorer le Marché</span>
              <div className="absolute inset-0 bg-togo-yellow translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            <button 
              onClick={onSellClick}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white px-10 py-4 md:px-14 md:py-6 rounded-3xl text-[11px] md:text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all btn-press"
            >
              Vendre Mes Produits
            </button>
          </div>
        </div>
      </div>

      {/* Floating Design Elements */}
      <div className="absolute bottom-10 right-10 hidden lg:block animate-in zoom-in duration-1000 delay-500">
         <div className="bg-white/10 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-togo-green rounded-full flex items-center justify-center text-2xl shadow-lg">🛡️</div>
            <div>
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Sécurité Lumina</p>
               <p className="text-xs font-black text-white">Transactions Chiffrées</p>
            </div>
         </div>
      </div>
    </div>
  );
};
