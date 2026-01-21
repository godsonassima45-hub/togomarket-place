
import React, { useEffect, useState } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export const NotificationSystem: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // On expose une fonction globale pour simplifier (méthode rapide pour ce prototype)
  useEffect(() => {
    (window as any).notify = (message: string, type: Toast['type'] = 'success') => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };
  }, []);

  return (
    <div className="fixed top-6 right-6 z-[300] flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className={`pointer-events-auto px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-4 animate-in slide-in-from-right-8 fade-in duration-300 ${
            toast.type === 'success' ? 'bg-togo-green text-white border-togo-green' : 
            toast.type === 'error' ? 'bg-red-600 text-white border-red-600' : 
            'bg-slate-900 text-white border-slate-800'
          }`}
        >
          <span className="text-xl">
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <p className="text-[11px] font-black uppercase tracking-widest">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};
