
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';

interface AIStudioProps {
  initialImage?: string;
}

interface PromptCategory {
  name: string;
  icon: React.ReactNode;
  prompts: string[];
}

export const AIStudio: React.FC<AIStudioProps> = ({ initialImage }) => {
  const [history, setHistory] = useState<string[]>(initialImage ? [initialImage] : []);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const [prompt, setPrompt] = useState('');
  const [genPrompt, setGenPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<{ message: string; type: 'safety' | 'complexity' | 'general' | 'none' }>({ message: '', type: 'none' });
  const [activeCategory, setActiveCategory] = useState<string>('AI Smart');

  // Variations state
  const [variations, setVariations] = useState({
    color: '',
    size: '',
    material: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const currentImage = history[historyIndex] || null;

  const staticCategories: PromptCategory[] = [
    {
      name: 'Lighting',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ),
      prompts: [
        "Warm sunset golden hour lighting",
        "Dramatic neon pink studio lights",
        "Soft natural morning window sunlight",
        "Moody noir shadows with rim light"
      ]
    },
    {
      name: 'Scene',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      prompts: [
        "Minimalist white marble surface",
        "Lush tropical green leaves background",
        "Cyberpunk laboratory setting",
        "Serene mountain landscape with fog"
      ]
    }
  ];

  useEffect(() => {
    if (currentImage && !loading) {
      loadSuggestions(currentImage);
    }
  }, [currentImage]);

  const loadSuggestions = async (img: string) => {
    setSuggestionsLoading(true);
    try {
      const suggestions = await GeminiService.getSmartSuggestions(img);
      setSmartSuggestions(suggestions);
      if (suggestions.length > 0 && activeCategory === 'none') setActiveCategory('AI Smart');
    } catch (err) {
      console.error("Failed to load smart suggestions", err);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const constructVariationString = () => {
    const parts = [];
    if (variations.color) parts.push(`Color: ${variations.color}`);
    if (variations.size) parts.push(`Size: ${variations.size}`);
    if (variations.material) parts.push(`Material: ${variations.material}`);
    return parts.length > 0 ? `. Product variations: ${parts.join(', ')}.` : '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setHistory([result]);
        setHistoryIndex(0);
        setError({ message: '', type: 'none' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!genPrompt.trim()) return;
    setLoading(true);
    setError({ message: '', type: 'none' });
    try {
      const finalPrompt = `${genPrompt}${constructVariationString()}`;
      const result = await GeminiService.generateImage(finalPrompt);
      if (result) {
        setHistory([result]);
        setHistoryIndex(0);
        setGenPrompt('');
      } else {
        throw new Error("EMPTY_RESULT");
      }
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setError({ message: "Failed to generate image. Please try a different description.", type: 'general' });
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentImage) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const bgResult = reader.result as string;
        setLoading(true);
        setError({ message: '', type: 'none' });
        try {
          const result = await GeminiService.replaceBackground(currentImage, bgResult);
          if (result) {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(result);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
          } else {
            throw new Error("EMPTY_RESULT");
          }
        } catch (err: any) {
          setError({ message: "Failed to apply custom background. Try a different scene.", type: 'general' });
        } finally {
          setLoading(false);
          if (bgInputRef.current) bgInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!currentImage || !prompt) return;

    setLoading(true);
    setError({ message: '', type: 'none' });
    try {
      const finalPrompt = `${prompt}${constructVariationString()}`;
      const result = await GeminiService.editImage(currentImage, finalPrompt);
      if (result) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(result);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      } else {
        throw new Error("EMPTY_RESULT");
      }
    } catch (err: any) {
      console.error("AI Edit Error:", err);
      let userMsg = "Something went wrong. Please try again in a moment.";
      let type: 'safety' | 'complexity' | 'general' = 'general';
      const errorStr = String(err?.message || err).toLowerCase();

      if (errorStr.includes("safety") || errorStr.includes("finish_reason_safety") || errorStr.includes("blocked")) {
        userMsg = "The request was flagged by our safety filters. Please try a different prompt.";
        type = 'safety';
      } else if (errorStr.includes("too complex") || errorStr.includes("long") || prompt.split(' ').length > 40) {
        userMsg = "This request seems a bit complex. Try breaking it down into smaller, simpler instructions.";
        type = 'complexity';
      } else if (errorStr.includes("quota") || errorStr.includes("429") || errorStr.includes("rate limit")) {
        userMsg = "The studio is currently busy. Please wait a minute before trying your next masterpiece.";
        type = 'general';
      }
      setError({ message: userMsg, type });
    } finally {
      setLoading(false);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setError({ message: '', type: 'none' });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setError({ message: '', type: 'none' });
    }
  };

  const surpriseMe = () => {
    const allPrompts = [...smartSuggestions, ...staticCategories.flatMap(c => c.prompts)];
    if (allPrompts.length === 0) return;
    const randomPrompt = allPrompts[Math.floor(Math.random() * allPrompts.length)];
    setPrompt(randomPrompt);
    setError({ message: '', type: 'none' });
  };

  const reset = () => {
    setHistory(initialImage ? [initialImage] : []);
    setHistoryIndex(0);
    setPrompt('');
    setVariations({ color: '', size: '', material: '' });
    setError({ message: '', type: 'none' });
    setSmartSuggestions([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.047a1 1 0 00-1.1 0l-7 4.5a1 1 0 00-.488.848v3.5a1 1 0 00.5.866l7 4a1 1 0 001 0l7-4a1 1 0 00.5-.866V6.395a1 1 0 00-.488-.848l-7-4.5zM10 2.158l6 3.857v3.31l-6 3.429-6-3.428v-3.31l6-3.858z" clipRule="evenodd" />
          </svg>
          POWERED BY GEMINI 2.5 FLASH IMAGE
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">AI Creative Studio</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Elevate your product visuals instantly. Our AI understands your image and suggests context-aware enhancements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="aspect-[16/10] bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 overflow-hidden relative group shadow-inner">
            {!currentImage ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-8">
                <div className="max-w-md w-full">
                   <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Start Your Creation</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6">Upload a photo or describe a product for AI to generate from scratch.</p>
                  
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                    >
                      Upload Image
                    </button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
                      <div className="relative flex justify-center text-sm uppercase"><span className="px-2 bg-white dark:bg-slate-900 text-slate-400">Or generate with text</span></div>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="e.g., A luxury leather watch..."
                        value={genPrompt}
                        onChange={(e) => setGenPrompt(e.target.value)}
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button 
                        onClick={handleGenerate}
                        disabled={!genPrompt.trim() || loading}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-xl disabled:opacity-50 transition-all"
                      >
                        {loading ? '...' : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                <div className="relative h-full w-full flex items-center justify-center">
                   <img 
                    src={currentImage} 
                    alt="Current work" 
                    className={`max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all duration-700 ${loading ? 'opacity-50 grayscale' : 'opacity-100 grayscale-0'}`}
                  />
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={undo}
                      disabled={historyIndex === 0 || loading}
                      className="w-10 h-10 bg-white dark:bg-slate-800 shadow-lg rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95 border border-slate-100 dark:border-slate-700"
                      title="Undo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      onClick={redo}
                      disabled={historyIndex === history.length - 1 || loading}
                      className="w-10 h-10 bg-white dark:bg-slate-800 shadow-lg rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95 border border-slate-100 dark:border-slate-700"
                      title="Redo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {loading && (
                    <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-slate-900 dark:text-white rounded-xl z-10">
                      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="font-bold text-lg">AI is working its magic...</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Applying your changes using Gemini</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {currentImage && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="flex flex-wrap gap-4">
                <button 
                  onClick={reset}
                  className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Reset to Original
                </button>
                <button 
                  onClick={() => bgInputRef.current?.click()}
                  disabled={loading}
                  className="px-6 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 font-bold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Custom Background
                </button>
                <input type="file" ref={bgInputRef} onChange={handleBackgroundUpload} className="hidden" accept="image/*" />
                
                <a 
                  href={currentImage} 
                  download="lumina-ai-edit.png"
                  className="px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download Result
                </a>
              </div>
              <div className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                Step {historyIndex} of {history.length - 1}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Variations Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              Product Variations
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Color Theme</label>
                <div className="flex flex-wrap gap-2">
                  {['Red', 'Blue', 'Emerald', 'Gold', 'Noir', 'Pure White'].map(c => (
                    <button
                      key={c}
                      onClick={() => setVariations(v => ({ ...v, color: v.color === c ? '' : c }))}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${variations.color === c ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Size / Format</label>
                <select 
                  value={variations.size}
                  onChange={(e) => setVariations(v => ({ ...v, size: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Default Size</option>
                  <option value="Compact / Travel Size">Compact</option>
                  <option value="Oversized / Bold">Oversized</option>
                  <option value="Standard Retail">Standard</option>
                  <option value="Miniature">Miniature</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Material / Finish</label>
                <div className="flex flex-wrap gap-2">
                  {['Leather', 'Matte', 'Chrome', 'Glass', 'Wood', 'Silk'].map(m => (
                    <button
                      key={m}
                      onClick={() => setVariations(v => ({ ...v, material: v.material === m ? '' : m }))}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${variations.material === m ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                Creative Prompt
              </h4>
              <button 
                onClick={surpriseMe}
                disabled={!currentImage || loading}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
              >
                Surprise Me
              </button>
            </div>
            <div className="space-y-4">
              <textarea 
                placeholder="Describe what you want to change..."
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (error.type !== 'none') setError({ message: '', type: 'none' });
                }}
                rows={4}
                disabled={!currentImage || loading}
                className={`w-full p-4 rounded-xl border focus:ring-2 outline-none resize-none text-slate-700 dark:text-slate-200 bg-transparent placeholder:text-slate-400 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 transition-all font-medium ${error.type !== 'none' ? 'border-red-300 ring-red-100 bg-red-50/30' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500'}`}
              />

              {error.type !== 'none' && (
                <div className={`p-4 rounded-xl text-sm border flex gap-3 ${error.type === 'safety' ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  <div className="flex-shrink-0 mt-0.5">
                    {error.type === 'safety' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">{error.type === 'safety' ? 'Safety Filter' : error.type === 'complexity' ? 'Prompt Too Complex' : 'Edit Failed'}</p>
                    <p>{error.message}</p>
                    {error.type === 'complexity' && (
                      <button 
                        onClick={() => setPrompt(p => p.slice(0, 50) + "...")}
                        className="text-xs font-bold underline text-left mt-1 hover:text-red-900"
                      >
                        Shorten my prompt
                      </button>
                    )}
                  </div>
                </div>
              )}

              <button 
                onClick={handleEdit}
                disabled={!currentImage || !prompt || loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {loading ? 'Processing...' : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                    Apply Magic Edit
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Prompt Recommendations</h4>
              {suggestionsLoading && <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>}
            </div>
            
            <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveCategory('AI Smart')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all whitespace-nowrap border-b-2 ${activeCategory === 'AI Smart' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM6.464 14.95a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0z" />
                </svg>
                AI Smart
              </button>
              {staticCategories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold transition-all whitespace-nowrap border-b-2 ${activeCategory === cat.name ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {activeCategory === 'AI Smart' ? (
                <>
                  {smartSuggestions.length > 0 ? (
                    smartSuggestions.map((p, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          setPrompt(p);
                          setError({ message: '', type: 'none' });
                        }}
                        disabled={!currentImage || loading}
                        className="w-full text-left text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-3 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all group flex items-center justify-between"
                      >
                        <span className="line-clamp-1">{p}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    ))
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {suggestionsLoading ? "Analyzing image content..." : "Upload or generate an image to get personalized AI suggestions."}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                staticCategories.find(c => c.name === activeCategory)?.prompts.map((p, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setPrompt(p);
                      setError({ message: '', type: 'none' });
                    }}
                    disabled={!currentImage || loading}
                    className="w-full text-left text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-3 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all group flex items-center justify-between"
                  >
                    <span className="line-clamp-1">{p}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                ))
              )}
            </div>

            <p className="mt-auto pt-6 text-[10px] text-slate-400 dark:text-slate-500 text-center italic">
              AI Smart, Custom Background, and Generation use Gemini's native image understanding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
