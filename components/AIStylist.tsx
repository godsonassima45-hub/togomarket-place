
import React, { useState, useEffect, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import { Product } from '../types';

interface AIStylistProps {
  products: Product[];
  history: string[];
}

export const AIStylist: React.FC<AIStylistProps> = ({ products, history }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'recos' | 'live'>('chat');
  const [isLiveActive, setIsLiveActive] = useState(false);

  // Live Audio Refs
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const stopLiveSession = () => {
    setIsLiveActive(false);
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (inputAudioCtxRef.current) inputAudioCtxRef.current.close();
    if (outputAudioCtxRef.current) outputAudioCtxRef.current.close();
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  };

  const startLiveSession = async () => {
    try {
      setIsLiveActive(true);
      setActiveTab('live');

      inputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = GeminiService.connectLiveStylist({
        onopen: () => {
          const source = inputAudioCtxRef.current!.createMediaStreamSource(stream);
          const scriptProcessor = inputAudioCtxRef.current!.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = GeminiService.createBlob(inputData);
            sessionPromise.then(session => {
              if (session) session.sendRealtimeInput({ media: pcmBlob });
            });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioCtxRef.current!.destination);
        },
        onmessage: async (message) => {
          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && outputAudioCtxRef.current) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioCtxRef.current.currentTime);
            const audioBuffer = await GeminiService.decodeAudioData(
              GeminiService.decode(base64Audio),
              outputAudioCtxRef.current,
              24000,
              1
            );
            const source = outputAudioCtxRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioCtxRef.current.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }
          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (e) => console.error("Live Stylist Error:", e),
        onclose: () => setIsLiveActive(false)
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Mic access denied or session failed:", err);
      setIsLiveActive(false);
    }
  };

  const handleAsk = async () => {
    if (!query) return;
    setLoading(true);
    const catalog = JSON.stringify(products.map(p => ({ n: p.name, id: p.id, c: p.category })));
    const response = await GeminiService.getStylistAdvice(query, catalog);
    setAnswer(response || '');
    setLoading(false);
  };

  useEffect(() => {
    return () => stopLiveSession();
  }, []);

  return (
    <div className="fixed bottom-24 right-6 z-[160]">
      {open ? (
        <div className="w-80 md:w-96 h-[600px] bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6">
          <div className="bg-gradient-to-r from-togo-green to-emerald-600 p-6 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">✨</div>
              <div>
                <p className="font-black text-xs uppercase tracking-tighter">Lumina IQ v3.0</p>
                <p className="text-[8px] font-bold opacity-70">Intelligence Temps Réel 🛰️</p>
              </div>
            </div>
            <button onClick={() => { setOpen(false); stopLiveSession(); }} className="text-2xl hover:scale-110 transition-transform">&times;</button>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 mx-4 mt-4 rounded-2xl shrink-0">
            {(['chat', 'recos', 'live'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => {
                  if (tab === 'live') startLiveSession();
                  else { stopLiveSession(); setActiveTab(tab); }
                }}
                className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-togo-green shadow-sm' : 'text-slate-400'}`}
              >
                {tab === 'live' ? 'Vocal 🎤' : tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
            {activeTab === 'chat' && (
              <div className="space-y-4">
                {answer ? (
                  <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-3xl border text-xs font-medium leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2">
                    {answer}
                  </div>
                ) : (
                  <div className="text-center py-20 opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-widest italic">Lumina attend votre question...</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'live' && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in">
                <div className="relative">
                  <div className={`w-32 h-32 bg-togo-green/10 rounded-full absolute inset-0 ${isLiveActive ? 'animate-ping' : ''}`}></div>
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-2xl relative z-10 transition-colors ${isLiveActive ? 'bg-togo-green text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {isLiveActive ? '🎤' : '💤'}
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-lg">{isLiveActive ? 'Session Active' : 'Session Terminée'}</h4>
                  <p className="text-xs text-slate-500 mt-2 px-6 italic">
                    {isLiveActive ? 'Dites : "Trouve-moi un pagne wax pour un mariage"' : 'Prêt à redémarrer ?'}
                  </p>
                </div>
                {isLiveActive ? (
                  <button onClick={stopLiveSession} className="bg-red-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-red-600 transition-colors">Arrêter</button>
                ) : (
                  <button onClick={startLiveSession} className="bg-togo-green text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Relancer</button>
                )}
              </div>
            )}
          </div>

          {activeTab === 'chat' && (
            <div className="p-6 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-2 shrink-0">
              <input 
                value={query} 
                onChange={e => setQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleAsk()}
                className="flex-1 bg-white dark:bg-slate-800 border-none rounded-2xl px-5 py-3 text-xs font-bold outline-none shadow-inner" 
                placeholder="Questionnez Lumina..."
              />
              <button onClick={handleAsk} className="bg-togo-green text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50" disabled={loading}>
                {loading ? '...' : '→'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <button 
          onClick={() => setOpen(true)}
          className="w-16 h-16 bg-togo-green text-white rounded-[2rem] shadow-2xl flex items-center justify-center text-3xl hover:scale-110 transition-all relative group"
        >
          <span className="relative z-10">✨</span>
          <div className="absolute inset-0 bg-togo-green rounded-[2rem] animate-ping opacity-25"></div>
        </button>
      )}
    </div>
  );
};
