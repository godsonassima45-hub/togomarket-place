
import React from 'react';
import { Order } from '../types';

interface OrderDetailsViewProps {
  order: Order;
  onBack: () => void;
}

export const OrderDetailsView: React.FC<OrderDetailsViewProps> = ({ order, onBack }) => {
  const steps = [
    { key: 'paye', label: 'Paiement Confirmé', icon: '💳' },
    { key: 'preparation', label: 'Préparation', icon: '📦' },
    { key: 'expedie', label: 'Expédié', icon: '🚚' },
    { key: 'livre', label: 'Livré', icon: '🏠' },
  ];

  // Helper to determine status indices
  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'paye': return 0;
      case 'preparation': return 1;
      case 'expedie': return 2;
      case 'livre': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStatusIndex(order.status);
  const isCancelled = order.status === 'annule';

  // Helper to get formatted date for a specific status
  const getStatusTime = (statusKey: string) => {
    const update = order.statusHistory?.find(h => h.status === statusKey);
    if (!update) return null;
    const d = new Date(update.timestamp);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className="text-sm font-black text-togo-green mb-8 flex items-center gap-2 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Retour
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 md:p-12 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Détails de la Commande</p>
              <h2 className="text-3xl font-black text-togo-green dark:text-togo-yellow tracking-tighter">#{order.id}</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">{order.date}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Montant Total</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{order.total.toLocaleString()} FCFA</p>
              <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black mt-2 uppercase ${order.paymentMethod === 'TMoney' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                Payé via {order.paymentMethod}
              </span>
            </div>
          </div>
        </div>

        {/* Tracker Section */}
        <div className="p-8 md:p-12">
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-10 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-6 bg-togo-green rounded-full"></span>
            Suivi de livraison en temps réel
          </h3>

          {isCancelled ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-6 rounded-3xl flex items-center gap-4 text-red-700 dark:text-red-400">
              <span className="text-2xl">⚠️</span>
              <p className="font-bold">Cette commande a été annulée.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -z-0">
                <div 
                  className="h-full bg-togo-green transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,106,78,0.5)]"
                  style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>

              {/* Steps */}
              <div className="relative z-10 flex justify-between">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentIndex;
                  const isActive = idx === currentIndex;
                  const isInProgress = idx === currentIndex + 1;
                  const timestamp = getStatusTime(step.key);

                  return (
                    <div key={step.key} className="flex flex-col items-center group">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-lg transition-all duration-500 border-4 relative ${
                          isCompleted 
                            ? 'bg-togo-green border-white dark:border-slate-900 text-white' 
                            : isInProgress
                            ? 'bg-white dark:bg-slate-800 border-togo-green/30 text-togo-green animate-pulse ring-4 ring-togo-green/10'
                            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-300'
                        } ${isActive ? 'scale-125 ring-4 ring-togo-green/20' : ''}`}
                      >
                        {isCompleted && idx < currentIndex ? '✓' : step.icon}
                        
                        {/* "In Progress" indicator label */}
                        {isInProgress && (
                           <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[7px] font-black bg-togo-green text-white px-2 py-0.5 rounded-full whitespace-nowrap animate-bounce">
                             EN COURS
                           </span>
                        )}
                      </div>
                      
                      <div className="mt-4 flex flex-col items-center">
                        <p className={`text-[10px] font-black uppercase tracking-widest text-center max-w-[80px] ${
                          isCompleted ? 'text-togo-green dark:text-togo-yellow' : isInProgress ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                        }`}>
                          {step.label}
                        </p>
                        {timestamp && (
                          <p className="text-[8px] text-slate-400 font-bold mt-1 whitespace-nowrap">
                            {timestamp}
                          </p>
                        )}
                        {isInProgress && !timestamp && (
                          <div className="flex gap-1 mt-1">
                            <div className="w-1 h-1 bg-togo-green rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-togo-green rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-1 h-1 bg-togo-green rounded-full animate-bounce [animation-delay:0.4s]"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="px-8 md:px-12 pb-12">
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-6 bg-togo-yellow rounded-full"></span>
            Articles commandés
          </h3>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                <img src={item.image} className="w-16 h-16 object-cover rounded-xl shadow-sm" alt={item.name} />
                <div className="flex-1">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 dark:text-white">{item.price.toLocaleString()} FCFA</p>
                  <p className="text-xs text-slate-500 font-medium">Qté: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-6 bg-togo-green/5 dark:bg-togo-yellow/5 rounded-3xl border border-togo-green/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-togo-green text-white rounded-full flex items-center justify-center text-lg">📍</div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adresse de Livraison</p>
                <p className="font-bold text-slate-900 dark:text-white">{order.customerName}, Lomé, Togo</p>
              </div>
            </div>
            <button className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-togo-green hover:text-white transition-all shadow-sm">
              Télécharger Facture PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
