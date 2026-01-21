
import React, { useState } from 'react';
import { Product, SellingType } from '../types';
import { GeminiService } from '../services/geminiService';

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'rating' | 'reviewsCount' | 'verifiedSeller' | 'createdAt' | 'reviews'>) => void;
}

const CATEGORIES = [
  'Mode & Textile', 'Électronique', 'Alimentation', 'Artisanat', 'B2B / Gros', 'Beauté & Soins'
];

export const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '', description: '', price: 0, category: CATEGORIES[0], image: '', stock: 1, discount: 0, sellingType: 'retail' as SellingType, minOrderQuantity: 1
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImage = async () => {
    if (!formData.name) { alert("Nom requis !"); return; }
    setIsGenerating(true);
    try {
      const result = await GeminiService.generateImage(`${formData.name} - ${formData.description}`);
      if (result) setFormData(prev => ({ ...prev, image: result }));
    } catch (e) { alert("Erreur IA"); } finally { setIsGenerating(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) { alert("Image requise !"); return; }
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 sm:rounded-[2.5rem] rounded-t-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        <div className="p-6 md:p-8 bg-togo-green text-white flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Vendre 🏪</h3>
            <p className="text-[10px] font-bold text-white/80 uppercase">Publication immédiate</p>
          </div>
          <button onClick={onClose} className="text-3xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto no-scrollbar">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1">
            <button type="button" onClick={() => setFormData(v => ({...v, sellingType: 'retail'}))} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${formData.sellingType === 'retail' ? 'bg-white text-togo-green' : 'text-slate-400'}`}>🛍️ Détail</button>
            <button type="button" onClick={() => setFormData(v => ({...v, sellingType: 'wholesale'}))} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${formData.sellingType === 'wholesale' ? 'bg-togo-yellow text-togo-green' : 'text-slate-400'}`}>📦 Gros</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input required placeholder="Nom de l'article" className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-sm font-bold" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} />
              <select className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-sm font-bold" value={formData.category} onChange={e => setFormData(p => ({...p, category: e.target.value}))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Prix" className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-sm font-bold" value={formData.price} onChange={e => setFormData(p => ({...p, price: parseInt(e.target.value)}))} />
                <input required type="number" placeholder="Stock" className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-sm font-bold" value={formData.stock} onChange={e => setFormData(p => ({...p, stock: parseInt(e.target.value)}))} />
              </div>
            </div>
            <div className="relative aspect-video sm:aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden group">
              {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-slate-300 font-black uppercase text-[10px]">Photo Produit</div>}
              <button type="button" onClick={handleGenerateImage} disabled={isGenerating} className="absolute inset-x-4 bottom-4 bg-white/90 text-togo-green py-2 rounded-lg text-[9px] font-black uppercase">{isGenerating ? '...' : '✨ IA Logo'}</button>
            </div>
          </div>

          <textarea required rows={3} placeholder="Description du produit..." className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-sm font-medium" value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} />

          <button type="submit" className="w-full bg-togo-green text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-xl">Publier sur TogoMarket</button>
        </form>
      </div>
    </div>
  );
};
