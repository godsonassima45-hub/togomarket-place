
import React from 'react';

const CATEGORIES = [
  { id: 'Tous', label: '🛒 Tous', icon: 'all' },
  { id: 'Mode & Textile', label: '👕 Mode & Wax', icon: 'fashion' },
  { id: 'Électronique', label: '📱 Tech', icon: 'tech' },
  { id: 'Alimentation', label: '🥘 Alimentation', icon: 'food' },
  { id: 'Artisanat', label: '🎨 Artisanat', icon: 'craft' },
  { id: 'B2B / Gros', label: '📦 Vente en Gros', icon: 'b2b' },
];

interface CategoryBarProps {
  selected: string;
  onSelect: (cat: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-8 mb-8">
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-6 py-3 rounded-2xl whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all border-2 ${
            selected === cat.id 
              ? 'bg-togo-green border-togo-green text-white shadow-lg shadow-togo-green/20' 
              : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-togo-green/30'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};
