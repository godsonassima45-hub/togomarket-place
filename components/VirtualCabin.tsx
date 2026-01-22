
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { DatabaseService } from '../services/database';
import { GeminiService } from '../services/geminiService';

interface VirtualCabinProps {
  onBack: () => void;
  onGoToCart?: () => void;
  initialProduct?: Product | null;
  cartItems?: CartItem[];
}

export const VirtualCabin: React.FC<VirtualCabinProps> = ({ onBack, onGoToCart, initialProduct }) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProduct || null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const catalog = useMemo(() => DatabaseService.getProducts(), []);

  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
      setResult(null);
    }
  }, [initialProduct]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateTryOn = async () => {
    if (!userImage || !selectedProduct) return;
    setLoading(true);
    try {
      const res = await GeminiService.virtualTryOn(userImage, `${selectedProduct.name} (${selectedProduct.category})`);
      if (res) setResult(res);
      else throw new Error("IA occupée");
    } catch (e) {
      (window as any).notify?.("Erreur IA. Veuillez réessayer.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <button onClick={onBack} className="text-togo-green font-black uppercase text-[10px] tracking-widest mb-2">← Marché</button>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Miroir Intelligent <span className="text-togo-green">IA</span> ✨</h2>
        </div>
        <div className="bg-indigo-600/10 border border-indigo-600/20 p-5 rounded-2xl flex items-center gap-4 max-w-sm">
           <div className="text-2xl animate-bounce">📸</div>
           <p className="text-[10px] font-black uppercase text-indigo-600 leading-tight">PHOTO EN ENTIER RECOMMANDÉE.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border shadow-sm flex flex-col min-h-[300px]">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Catalogue 🌍</h3>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2">
              {catalog.map(p => (
                <button 
                  key={p.id} onClick={() => { setSelectedProduct(p); setResult(null); }}
                  className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${selectedProduct?.id === p.id ? 'border-togo-green' : 'border-transparent opacity-60'}`}
                >
                  <img src={p.image} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
           <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border-4 border-slate-100 overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col">
              <div className="flex-1 flex items-center justify-center p-4">
                 {result ? (
                   <div className="relative w-full h-full animate-in zoom-in">
                      <img src={result} className="w-full h-full object-contain rounded-3xl" />
                      <div className="absolute bottom-6 inset-x-6 flex flex-col gap-3">
                         <button onClick={onGoToCart} className="w-full bg-togo-green text-white py-5 rounded-2xl font-black uppercase text-xs">Commander 🛒</button>
                         <button onClick={() => setResult(null)} className="text-[10px] font-black text-white/50 uppercase">Réessayer</button>
                      </div>
                   </div>
                 ) : (
                   <div className="text-center p-8 space-y-8">
                      <div className="w-28 h-28 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-5xl shadow-xl">✨</div>
                      <button 
                        onClick={generateTryOn}
                        disabled={!userImage || !selectedProduct || loading}
                        className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase text-xs shadow-2xl disabled:opacity-20"
                      >
                        {loading ? 'Génération...' : 'Voir sur moi'}
                      </button>
                   </div>
                 )}
              </div>
              {loading && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50 text-white">
                  <div className="w-16 h-16 border-4 border-togo-green border-t-transparent rounded-full animate-spin mb-6"></div>
                  <p className="font-black text-xs uppercase tracking-[0.3em]">IA Lumina...</p>
                </div>
              )}
           </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border shadow-sm flex flex-col h-full">
            <h3 className="text-[10px] font-black text-slate-400 uppercase text-center mb-6">Votre Photo</h3>
            <div 
              onClick={() => fileRef.current?.click()}
              className="flex-1 bg-slate-50 rounded-3xl border-4 border-dashed border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer"
            >
              {userImage ? <img src={userImage} className="w-full h-full object-cover" /> : <p className="text-[10px] font-black uppercase">Charger Photo</p>}
            </div>
            <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} accept="image/*" />
          </div>
        </div>
      </div>
    </div>
  );
};
