
import React, { useState, useRef, useEffect } from 'react';

interface BotVerificationProps {
  onVerified: () => void;
  title?: string;
}

export const BotVerification: React.FC<BotVerificationProps> = ({ onVerified, title = "Vérification de Sécurité" }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [sliderPos, setSliderPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = () => setIsDragging(true);
  
  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || isVerified) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pos = Math.max(0, Math.min(clientX - rect.left - 30, rect.width - 60));
    
    setSliderPos(pos);
    
    if (pos >= rect.width - 65) {
      setIsVerified(true);
      setIsDragging(false);
      setSliderPos(rect.width - 60);
      setTimeout(onVerified, 800);
    }
  };

  const handleEnd = () => {
    if (isVerified) return;
    setIsDragging(false);
    setSliderPos(0);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div className="space-y-4 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between px-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          {title}
        </p>
        {isVerified && <span className="text-[10px] font-black text-togo-green uppercase">Vérifié ✓</span>}
      </div>

      <div 
        ref={containerRef}
        className={`relative h-16 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
          isVerified ? 'bg-togo-green/10 border-togo-green' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-opacity ${isDragging ? 'opacity-0' : 'opacity-40'}`}>
            {isVerified ? 'Accès Autorisé' : 'Glisser pour confirmer'}
          </p>
        </div>

        <div 
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          style={{ transform: `translateX(${sliderPos}px)` }}
          className={`absolute top-1 left-1 bottom-1 w-14 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-shadow shadow-lg ${
            isVerified ? 'bg-togo-green text-white' : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white'
          } ${isDragging ? 'shadow-indigo-500/40' : ''}`}
        >
          {isVerified ? '🛡️' : '🤖'}
        </div>
      </div>
      
      <p className="text-[8px] text-center text-slate-400 font-bold uppercase tracking-widest opacity-60">
        Lumina Anti-Bot Protection • v4.2 Secure
      </p>
    </div>
  );
};
