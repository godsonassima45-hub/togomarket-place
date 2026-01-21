
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { PRODUCTS } from '../data/products';
import { Product, CartItem, AppView } from '../types';

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

  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
      setResult(null);
    }
  }, [initialProduct]);

  // Filtrage intelligent : Uniquement ce qui se porte. Pas de nourriture, pas de savon liquide, pas de gros matériel.
  const isWearable = (p: Product) => {
    const name = p.name.toLowerCase();
    const cat = p.category;
    const isHeavy = p.sellingType === 'wholesale' || p.price > 300000;
    const isEdible = ['Alimentation'].includes(cat) || name.includes('café') || name.includes('huile');
    const isBeauty = name.includes('savon') || name.includes('crème') || name.includes('beurre');
    
    return !isHeavy && !isEdible && !isBeauty && (['Mode & Textile', 'Artisanat', 'Électronique'].includes(cat));
  };

  const wearableCatalog = useMemo(() => PRODUCTS.filter(isWearable), []);
  const wearableCart = useMemo(() => cartItems.filter(isWearable), [cartItems]);

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
            { text: `Génère une image réaliste de cette personne portant cet article : "${selectedProduct.name}". C'est un produit de catégorie ${selectedProduct.category}. S'il s'agit d'un vêtement, elle doit le porter. Si c'est un accessoire (montre, téléphone), elle doit le tenir ou l'utiliser.` }
          ]
        }
      });
      
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part) setResult(`data:image/png;base64,${part.inlineData.data}`);
    } catch (e) {
      (window as any).notify?.("Erreur IA. Veuillez réessayer avec une autre photo.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <button onClick={onBack} className="text-togo-green font-black uppercase text-[10px] tracking-widest mb-2">← Continuer mes achats</button>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Studio <span className="text-togo-green">Lumina</span> ✨</h2>
          <p className="text-slate-500 font-bold mt-2">Essayez virtuellement les pépites du Togo avant de commander.</p>
        </div>
        
        <div className="bg-togo-green/10 border border-togo-green/20 p-4 rounded-2xl flex items-center gap-4 max-w-sm">
           <div className="text-2xl">💰</div>
           <p className="text-[10px] font-black uppercase text-togo-green leading-tight">
             Faites des essais, validez votre look et commandez ! Un client stylé est un client satisfait.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panier & Catalogue */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border shadow-sm flex flex-col h-[250px]">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Dans votre panier ({wearableCart.length})</h3>
            <div className="grid grid-cols-3 gap-2 overflow-y-auto pr-2">
              {wearableCart.map(p => (
                <button 
                  key={p.id} onClick={() => { setSelectedProduct(p); setResult(null); }}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedProduct?.id === p.id ? 'border-togo-green scale-95' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={p.image} className="w-full h-full object-cover" />
                </button>
              ))}
              {wearableCart.length === 0 && <p className="col-span-3 text-[9px] font-bold text-slate-300 italic py-8 text-center uppercase tracking-tighter">Votre panier est vide ou ne contient que des produits non essayables.</p>}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border shadow-sm flex flex-col flex-1 overflow-hidden min-h-[300px]">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Dressing de la Boutique 👗</h3>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2">
              {wearableCatalog.map(p => (
                <button 
                  key={p.id} onClick={() => { setSelectedProduct(p); setResult(null); }}
                  className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${selectedProduct?.id === p.id ? 'border-togo-green scale-95' : 'border-transparent opacity-60'}`}
                >
                  <img src={p.image} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Miroir IA */}
        <div className="lg:col-span-5">
           <div className="bg-white dark:bg-slate-900 rounded-[3rem] border overflow-hidden h-full shadow-2xl relative min-h-[550px] flex flex-col">
              <div className="flex-1 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
                 {result ? (
                   <div className="relative w-full h-full animate-in zoom-in">
                      <img src={result} className="w-full h-full object-contain rounded-3xl" />
                      <div className="absolute bottom-6 inset-x-6 flex flex-col gap-3">
                         <div className="bg-white/90 backdrop-blur p-4 rounded-2xl text-center shadow-xl border border-togo-green/20">
                            <p className="text-[10px] font-black text-togo-green uppercase tracking-widest mb-1">Coup de cœur ? ❤️</p>
                            <p className="text-xs font-bold text-slate-900 leading-tight">Ce style vous va à ravir ! Validez votre panier pour finaliser l'achat.</p>
                         </div>
                         <button 
                          onClick={onGoToCart}
                          className="w-full bg-togo-green text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-togo-yellow hover:text-togo-green transition-all pulse-btn"
                         >
                           Acheter ce Look 🛍️
                         </button>
                      </div>
                   </div>
                 ) : (
                   <div className="text-center p-8 space-y-6">
                      <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto text-4xl">✨</div>
                      <div className="space-y-2">
                         <h4 className="text-xl font-black">Prêt pour la transformation ?</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Choisissez un article et uploadez votre photo.</p>
                      </div>
                      <button 
                        onClick={generateTryOn}
                        disabled={!userImage || !selectedProduct || loading}
                        className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl disabled:opacity-20 transition-all hover:scale-105"
                      >
                        {loading ? 'Création de votre style...' : 'Générer mon Look'}
                      </button>
                   </div>
                 )}
              </div>
              {loading && <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center z-50"><div className="w-12 h-12 border-4 border-togo-green border-t-transparent rounded-full animate-spin mb-4"></div><p className="font-black text-[10px] uppercase tracking-widest animate-pulse">L'IA vous habille...</p></div>}
           </div>
        </div>

        {/* Upload Portrait */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Votre Portrait</h3>
            <div 
              onClick={() => fileRef.current?.click()}
              className="aspect-[3/4] bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors group"
            >
              {userImage ? (
                <img src={userImage} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🤳</div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cliquez pour uploader</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} accept="image/*" />
            
            <div className="mt-8 bg-indigo-50 dark:bg-indigo-950/50 p-6 rounded-3xl border border-indigo-100">
               <p className="text-[10px] font-black uppercase text-indigo-600 mb-2">Conseils Expert</p>
               <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">Pour un rendu optimal, utilisez une photo de face avec un bon éclairage.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
