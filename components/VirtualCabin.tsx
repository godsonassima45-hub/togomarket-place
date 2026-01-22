
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Product, CartItem } from '../types';
import { DatabaseService } from '../services/database';

interface VirtualCabinProps {
  onBack: () => void;
  onGoToCart?: () => void;
  initialProduct?: Product | null;
  cartItems?: CartItem[];
}

export const VirtualCabin: React.FC<VirtualCabinProps> = ({ onBack, onGoToCart, initialProduct, cartItems = [] }) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProduct || null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ACCÈS À TOUT LE CATALOGUE
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: userImage.split(',')[1], mimeType: 'image/jpeg' } },
            { text: `CONTEXTE : Cabine d'essayage virtuelle TogoMarket. 
              INSTRUCTION : La photo de l'utilisateur montre son CORPS COMPLET debout. 
              Intègre cet article : "${selectedProduct.name}" (Catégorie: ${selectedProduct.category}) de façon ultra-réaliste. 
              - S'il s'agit de vêtements, fais-les lui porter.
              - S'il s'agit d'un accessoire ou d'un objet (phone, jarre, huile), place-le dans les mains de l'utilisateur ou à côté de lui de manière naturelle.
              - Conserve l'identité et le visage de l'utilisateur intacts.` }
          ]
        }
      });
      
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part) setResult(`data:image/png;base64,${part.inlineData.data}`);
    } catch (e) {
      (window as any).notify?.("Désolé, l'IA est occupée. Vérifiez la qualité de votre photo.", "error");
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
          <p className="text-slate-500 font-bold mt-2">Essayez n'importe quel article sur vous instantanément.</p>
        </div>
        
        <div className="bg-indigo-600/10 border border-indigo-600/20 p-5 rounded-2xl flex items-center gap-4 max-w-sm">
           <div className="text-2xl animate-bounce">📸</div>
           <p className="text-[10px] font-black uppercase text-indigo-600 leading-tight">
             IMPORTANT : Utilisez une photo de vous DEBOUT en ENTIER (corps complet) pour un résultat parfait.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Articles */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border shadow-sm flex flex-col flex-1 overflow-hidden min-h-[300px]">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tout le catalogue 🌍</h3>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2">
              {catalog.map(p => (
                <button 
                  key={p.id} onClick={() => { setSelectedProduct(p); setResult(null); }}
                  className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${selectedProduct?.id === p.id ? 'border-togo-green scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={p.image} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Le Miroir */}
        <div className="lg:col-span-5">
           <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border-4 border-slate-100 dark:border-slate-800 overflow-hidden h-full shadow-2xl relative min-h-[600px] flex flex-col">
              <div className="flex-1 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
                 {result ? (
                   <div className="relative w-full h-full animate-in zoom-in">
                      <img src={result} className="w-full h-full object-contain rounded-3xl" />
                      <div className="absolute bottom-6 inset-x-6 flex flex-col gap-3">
                         <button 
                          onClick={onGoToCart}
                          className="w-full bg-togo-green text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-togo-yellow hover:text-togo-green transition-all"
                         >
                           🛒 Commander cet article
                         </button>
                         <button onClick={() => setResult(null)} className="text-[10px] font-black text-white/50 uppercase tracking-widest">Réessayer</button>
                      </div>
                   </div>
                 ) : (
                   <div className="text-center p-8 space-y-8">
                      <div className="w-28 h-28 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-5xl shadow-xl">✨</div>
                      <div className="space-y-3">
                         <h4 className="text-2xl font-black tracking-tight">Prêt pour l'essai ?</h4>
                         <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest max-w-xs mx-auto">
                           Choisissez un article et chargez une photo de vous en entier.
                         </p>
                      </div>
                      <button 
                        onClick={generateTryOn}
                        disabled={!userImage || !selectedProduct || loading}
                        className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl disabled:opacity-20 hover:scale-105 transition-all"
                      >
                        {loading ? 'Génération...' : 'Voir sur moi'}
                      </button>
                   </div>
                 )}
              </div>
              {loading && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50 text-white">
                  <div className="w-16 h-16 border-4 border-togo-green border-t-transparent rounded-full animate-spin mb-6"></div>
                  <p className="font-black text-xs uppercase tracking-[0.3em] animate-pulse">Lumina Vision Génération...</p>
                </div>
              )}
           </div>
        </div>

        {/* Photo Upload */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border shadow-sm flex flex-col h-full">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Votre Photo (Corps Complet)</h3>
            <div 
              onClick={() => fileRef.current?.click()}
              className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-3xl border-4 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-500 transition-all min-h-[300px]"
            >
              {userImage ? (
                <img src={userImage} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6">
                  <div className="text-5xl mb-4">👤</div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Cliquez pour charger<br/>votre photo debout
                  </p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} accept="image/*" />
          </div>
        </div>

      </div>
    </div>
  );
};
