
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 'md', showText = true }) => {
  const sizes = {
    sm: { box: 'w-8 h-8', text: 'text-lg' },
    md: { box: 'w-12 h-12', text: 'text-xl' },
    lg: { box: 'w-16 h-16', text: 'text-3xl' },
    xl: { box: 'w-24 h-24', text: 'text-5xl' }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Glyph */}
      <div className={`${sizes[size].box} relative flex-shrink-0 group`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl transition-transform group-hover:rotate-3">
          {/* Main Bag Shape / T body */}
          <path d="M25 35C25 32.2386 27.2386 30 30 30H70C72.7614 30 35 32.2386 35 35V75C35 83.2843 41.7157 90 50 90H50C58.2843 90 65 83.2843 65 75V35" fill="white" className="dark:fill-slate-800" />
          <path d="M20 40C20 34.4772 24.4772 30 30 30H70C75.5228 30 80 34.4772 80 40V70C80 81.0457 71.0457 90 60 90H40C28.9543 90 20 81.0457 20 70V40Z" fill="#006a4e" />
          
          {/* Handle forming top of T */}
          <path d="M35 30V20C35 11.7157 41.7157 5 50 5C58.2843 5 65 11.7157 65 20V30" stroke="#ffce00" strokeWidth="10" strokeLinecap="round" />
          
          {/* "Smile" path like Alibaba/Amazon */}
          <path d="M30 65C35 72 65 72 70 65" stroke="#ffce00" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
          
          {/* T-Bar inside */}
          <rect x="35" y="45" width="30" height="8" rx="4" fill="white" fillOpacity="0.2" />
        </svg>
        
        {/* Sparkle effect */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-togo-yellow rounded-full animate-ping opacity-75"></div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${sizes[size].text} font-black tracking-tighter text-togo-green dark:text-white uppercase`}>
            TogoMarket
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-togo-yellow bg-togo-green px-1.5 py-0.5 rounded tracking-widest uppercase">
              Place
            </span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Enterprise 🇹🇬</span>
          </div>
        </div>
      )}
    </div>
  );
};
