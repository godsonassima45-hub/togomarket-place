import React, { useState, useRef } from 'react';
import { Product, SellingType } from '../types';
import { GeminiService } from '../services/geminiService';

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'rating' | 'reviewsCount' | 'verifiedSeller' | 'createdAt' | 'reviews'> & { status: 'published' | 'draft' }) => void;
}

const CATEGORIES = [
  'Mode & Textile', 'Électronique', 'Alimentation', 'Artisanat', 'B2B / Gros', 'Beauté & Soins'
];

export const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '', 
    description: '', 
    price: 0, 
    category: CATEGORIES[0], 
    image: '', 
    stock: 1, 
    discount: 0, 
    sellingType: 'retail' as SellingType, 
    minOrderQuantity: 1,
    status: 'published' as 'published' | 'draft'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async () => {
    if (!formData.name) { alert("Nom du produit requis pour l'IA !"); return; }
    setIsGenerating(true);
    try {
      const result = await GeminiService.generateImage(`Un produit de haute qualité : ${formData.name}. ${formData.description}`);
      if (result) setFormData(prev => ({ ...prev, image: result }));
    } catch (e) { 
      (window as any).notify?.("Erreur IA lors de la génération.", "error");
    } finally { 
      setIsGenerating(false); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) { alert("Une image (réelle ou IA) est obligatoire !"); return; }
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 sm:rounded-[2.5rem] rounded-t-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[90vh]">
        <div className="p-6 md:p-8 bg-togo-green text-white flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Nouveau Produit 🏪</h3>
            <p className="text-[10px] font-bold text-white/80 uppercase">Configuration de l'offre</p>
          </div>
          <button onClick={onClose} className="text-3xl hover:scale-110 transition-transform">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto no-scrollbar">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1">
            <button type="button" onClick={() => setFormData(v => ({...v, sellingType: 'retail'}))} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${formData.sellingType === 'retail' ? 'bg-white text-togo-green shadow-sm' : 'text-slate-400'}`}>🛍️ Détail</button>
            <button type="button" onClick={() => setFormData(v => ({...v, sellingType: 'wholesale'}))} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${formData.sellingType === 'wholesale' ? 'bg-togo-yellow text-togo-green shadow-sm' : 'text-slate-400'}`}>📦 Gros</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                <input required placeholder="Ex: Pagne Wax Excellence" className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-sm font-bold border border-transparent focus:border-togo-green outline-none" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Catégorie</label>
                <select className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-sm font-bold outline-none" value={formData.category} onChange={e => setFormData(p => ({...p, category: e.target.value}))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Prix (XOF)</label>
                  <input required type="number" className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-sm font-bold outline-none" value={formData.price} onChange={e => setFormData(p => ({...p, price: parseInt(e.target.value)}))} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock</label>
                  <input required type="number" className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-sm font-bold outline-none" value={formData.stock} onChange={e => setFormData(p => ({...p, stock: parseInt(e.target.value)}))} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Visuel Produit</label>
               <div className="relative aspect-video sm:aspect-square bg-slate-50 dark:bg-slate-800 rounded-3xl overflow-hidden group border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
                {formData.image ? (
                  <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-3xl mb-2 block">📸</span>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Importez ou générez</p>
                  </div>
                )}
                
                <div className="absolute inset-x-2 bottom-2 flex gap-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white py-2 rounded-xl text-[9px] font-black uppercase shadow-lg hover:bg-white transition-all">📂 Photo</button>
                  <button type="button" onClick={handleGenerateImage} disabled={isGenerating} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-[9px] font-black uppercase shadow-lg hover:bg-indigo-500 transition-all disabled:opacity-50">
                    {isGenerating ? '...' : '✨ IA'}
                  </button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileImport} />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Description marketing</label>
            <textarea required rows={3} placeholder="Mettez en valeur les atouts de votre produit..." className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-sm font-medium outline-none border border-transparent focus:border-togo-green resize-none" value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} />
          </div>

          <div className="flex gap-4 pt-4">
             <button type="button" onClick={() => { setFormData(p => ({...p, status: 'draft'})); }} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${formData.status === 'draft' ? 'border-indigo-600 bg-indigo-600/5 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>Brouillon ✍️</button>
             <button type="submit" className="flex-[2] bg-togo-green text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all">Publier Immédiatement 🚀</button>
          </div>
        </form>
      </div>
    </div>
  );
};