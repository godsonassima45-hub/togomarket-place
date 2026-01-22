import React from 'react';
import { Product, AppView } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (p: Product) => void;
  onViewDetails: () => void;
  onTryOn?: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, onAdd, onViewDetails, onTryOn 
}) => {
  const finalPriceFcfa = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  const tokenPrice = Math.ceil(finalPriceFcfa / 500);
  const isWholesale = product.sellingType === 'wholesale';
  
  // Désormais, TOUS les articles peuvent être essayés virtuellement
  const isTryable = true;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-[0_20px_60px_-15px_rgba(0,106,78,0.15)] transition-all duration-500 flex flex-col h-full relative border-2 hover:border-togo-green/20">
      
      {/* Image Container with Hover Actions */}
      <div 
        className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
        onClick={onViewDetails}
      >
        <img 
          src={product.image} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-115" 
          alt={product.name} 
        />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className={`px-3 py-1.5 rounded-xl font-black text-[8px] uppercase tracking-widest shadow-xl border border-white/20 backdrop-blur-md ${isWholesale ? 'bg-togo-yellow text-togo-green' : 'bg-togo-green text-white'}`}>
            {isWholesale ? '📦 GROS' : '🛍️ DÉTAIL'}
          </div>
          {product.isSponsored && (
            <div className="bg-indigo-600 text-white px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-tighter">Sponsorisé</div>
          )}
        </div>

        {/* Hover Overlay - Subtle hint */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>

      <div className="p-5 md:p-7 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.category}</p>
          <div className="flex text-togo-yellow text-[10px]">{"★".repeat(1)} <span className="text-slate-900 dark:text-white font-black ml-1">{product.rating}</span></div>
        </div>
        
        <h3 className="font-black text-slate-900 dark:text-white line-clamp-1 text-sm md:text-base mb-4 tracking-tight">{product.name}</h3>
        
        <div className="mt-auto">
          <div className="flex flex-col mb-5">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                {finalPriceFcfa.toLocaleString()} <span className="text-[10px] uppercase font-bold text-slate-400">FCFA</span>
              </p>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
              <div className="flex items-center gap-1.5 bg-togo-yellow/10 dark:bg-togo-yellow/5 px-2 py-1 rounded-lg border border-togo-yellow/20">
                <div className="w-4 h-4 bg-togo-yellow rounded-full flex items-center justify-center text-togo-green text-[7px] font-black shadow-sm">LT</div>
                <p className="text-xs font-black text-togo-green dark:text-togo-yellow uppercase tracking-tighter">
                  {tokenPrice.toLocaleString()} LT
                </p>
              </div>
            </div>
            <p className="text-[8px] font-bold text-slate-400 mt-2 uppercase tracking-widest opacity-60">Taux fixe: 1 LT = 500 FCFA</p>
          </div>
          
          <div className="flex flex-col gap-2">
            {isTryable && (
              <button 
                onClick={(e) => { e.stopPropagation(); onTryOn?.(product); }}
                className="w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-togo-green text-togo-green hover:bg-togo-green hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
              >
                Essayer virtuellement ✨
              </button>
            )}
            
            <button 
              onClick={(e) => { e.stopPropagation(); onAdd(product); }}
              className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-90 flex items-center justify-center gap-2 ${
                isWholesale ? 'bg-togo-yellow text-togo-green hover:shadow-togo-yellow/30' : 'bg-slate-900 dark:bg-indigo-600 text-white hover:shadow-indigo-500/30'
              }`}
            >
              {isWholesale ? 'Demander Devis 📄' : 'Ajouter au Panier 🛒'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};