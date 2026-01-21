
import React, { useState, useRef } from 'react';
import { PRODUCTS } from '../data/products';
import { GeminiService } from '../services/geminiService';
import { Product } from '../types';

export const VirtualTryOn: React.FC = () => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    if (!userImage || !selectedProduct) return;
    setLoading(true);
    try {
      const res = await GeminiService.virtualTryOn(userImage, selectedProduct.name + ": " + selectedProduct.description);
      setResultImage(res);
    } catch (e) {
      alert("Failed to blend image. Try a clearer photo!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">AI Dressing Room</h2>
        <p className="text-slate-500 dark:text-slate-400">Upload your photo and see yourself in Lumina premium gear.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">1. Your Photo</h3>
            <div 
              className="aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden cursor-pointer bg-slate-50 dark:bg-slate-900"
              onClick={() => fileInputRef.current?.click()}
            >
              {userImage ? (
                <img src={userImage} className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-400 text-sm text-center px-4">Click to upload portrait</span>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} accept="image/*" />
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">2. Select Product</h3>
            <div className="grid grid-cols-3 gap-2">
              {PRODUCTS.slice(0, 6).map(p => (
                <button 
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`aspect-square rounded-xl border-2 overflow-hidden transition-all ${selectedProduct?.id === p.id ? 'border-indigo-600' : 'border-transparent'}`}
                >
                  <img src={p.image} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 h-full overflow-hidden relative min-h-[500px] flex items-center justify-center shadow-2xl">
            {resultImage ? (
              <img src={resultImage} className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-12">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to see the look?</h4>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">Upload your photo and pick a product to start the AI transformation.</p>
                <button 
                  onClick={handleTryOn}
                  disabled={!userImage || !selectedProduct || loading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
                >
                  {loading ? 'Magic in progress...' : 'Generate Look'}
                </button>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center flex-col">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-black text-indigo-600 uppercase tracking-tighter">Gemini is styling you...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
