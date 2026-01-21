
import React, { useState } from 'react';

interface RulesModalProps {
  userName: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ userName, onAccept, onDecline }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-2xl">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-3xl overflow-hidden animate-in zoom-in duration-500 border border-white/10 flex flex-col max-h-[90vh]">
        
        <div className="p-10 bg-gradient-to-br from-togo-green to-emerald-900 text-white shrink-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-togo-yellow rounded-2xl flex items-center justify-center text-togo-green text-3xl shadow-lg">📜</div>
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">Charte de Confiance</h3>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mt-2">Bienvenue, {userName} 🇹🇬</p>
            </div>
          </div>
        </div>

        <div className="p-10 overflow-y-auto no-scrollbar space-y-8 flex-1">
          <section className="space-y-4">
            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest">1. Éthique & Commerce</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              TogoMarket est un espace de confiance. Tout vendeur s'engage à proposer des produits authentiques et conformes aux photos publiées. Les tentatives de fraude ou de contrefaçon entraînent un <span className="text-red-500 font-black">bannissement définitif</span>.
            </p>
          </section>

          <section className="space-y-4">
            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest">2. Système de Paiement LT</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Pour garantir la sécurité de l'acheteur et du vendeur, toutes les transactions passent par les jetons <span className="font-bold text-togo-green">Lumina Tokens (LT)</span>. L'argent est séquestré par la plateforme et libéré au vendeur uniquement après confirmation de livraison.
            </p>
          </section>

          <section className="space-y-4">
            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest">3. Commissions & Frais</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              La plateforme prélève une commission de <span className="font-bold">10%</span> sur chaque vente pour assurer le fonctionnement technique, la sécurité IA et le support client.
            </p>
          </section>

          <section className="space-y-4">
            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest">4. Livraison Express</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Les vendeurs s'engagent à préparer les colis sous <span className="font-bold">24 heures</span>. Le non-respect répété des délais peut faire baisser votre score de réputation.
            </p>
          </section>
        </div>

        <div className="p-10 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <label className="flex items-start gap-4 mb-8 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-6 h-6 rounded-lg border-2 border-slate-300 text-togo-green focus:ring-togo-green"
            />
            <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
              Je certifie avoir lu et j'accepte sans réserve les règles de conduite de TogoMarket pour un commerce sain au Togo.
            </span>
          </label>

          <div className="flex gap-4">
            <button 
              onClick={onDecline}
              className="px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-red-500 transition-colors"
            >
              Refuser
            </button>
            <button 
              onClick={onAccept}
              disabled={!agreed}
              className={`flex-1 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all active:scale-95 ${
                agreed 
                ? 'bg-togo-green text-white hover:bg-togo-yellow hover:text-togo-green scale-100' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed scale-95'
              }`}
            >
              Accéder au Marché 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
