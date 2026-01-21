
import React, { useState } from 'react';
import { WorkflowConfig } from '../types';

interface WorkflowManagerProps {
  config: WorkflowConfig;
  onSave: (newConfig: WorkflowConfig) => void;
}

export const WorkflowManager: React.FC<WorkflowManagerProps> = ({ config, onSave }) => {
  const [localConfig, setLocalConfig] = useState<WorkflowConfig>(config);

  const toggle = (key: keyof WorkflowConfig) => {
    setLocalConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-3xl animate-in slide-in-from-bottom-8">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-3xl shadow-xl shadow-indigo-500/20 text-white">⚙️</div>
        <div>
          <h3 className="text-3xl font-black tracking-tighter uppercase">Moteur Lumina Auto-Sales</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuration des automatisations pro</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Toggle Sections */}
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border-2 transition-all ${localConfig.autoAcceptOrders ? 'border-togo-green bg-togo-green/5' : 'border-slate-100 dark:border-slate-800'}`}>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-black text-sm uppercase tracking-tighter">Ventes Fantômes (Absentee)</h4>
              <button 
                onClick={() => toggle('autoAcceptOrders')}
                className={`w-14 h-8 rounded-full transition-all relative ${localConfig.autoAcceptOrders ? 'bg-togo-green' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${localConfig.autoAcceptOrders ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed">Valide automatiquement les commandes si le stock est suffisant et le paiement LT confirmé.</p>
          </div>

          <div className={`p-6 rounded-3xl border-2 transition-all ${localConfig.aiNegotiation ? 'border-indigo-600 bg-indigo-600/5' : 'border-slate-100 dark:border-slate-800'}`}>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-black text-sm uppercase tracking-tighter">Négociateur IA</h4>
              <button 
                onClick={() => toggle('aiNegotiation')}
                className={`w-14 h-8 rounded-full transition-all relative ${localConfig.aiNegotiation ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${localConfig.aiNegotiation ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed">L'IA Lumina peut proposer des remises limitées aux clients sérieux en votre absence.</p>
          </div>

          <div className={`p-6 rounded-3xl border-2 transition-all ${localConfig.whatsappAlerts ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-slate-800'}`}>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-black text-sm uppercase tracking-tighter">Alertes WhatsApp 228</h4>
              <button 
                onClick={() => toggle('whatsappAlerts')}
                className={`w-14 h-8 rounded-full transition-all relative ${localConfig.whatsappAlerts ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${localConfig.whatsappAlerts ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed">Recevez une notification instantanée sur votre numéro Togo lors d'une vente automatique.</p>
          </div>
        </div>

        {/* Adjustments */}
        <div className="space-y-8 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem]">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Marge de Remise IA (%)</label>
            <input 
              type="range" min="0" max="25" step="1"
              value={localConfig.maxDiscountPercent}
              onChange={e => setLocalConfig(prev => ({ ...prev, maxDiscountPercent: Number(e.target.value) }))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs font-black text-indigo-600">
              <span>0% (Fixe)</span>
              <span>{localConfig.maxDiscountPercent}% (Max)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Message d'Absence IA</label>
            <textarea 
              value={localConfig.absenteeMessage}
              onChange={e => setLocalConfig(prev => ({ ...prev, absenteeMessage: e.target.value }))}
              className="w-full bg-white dark:bg-slate-900 rounded-2xl p-4 text-xs font-medium border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
              placeholder="Ex: Je suis actuellement absent..."
            />
          </div>

          <div className="pt-4">
            <button 
              onClick={() => onSave(localConfig)}
              className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all"
            >
              Enregistrer Configuration ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
