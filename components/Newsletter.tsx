
import React from 'react';

export const Newsletter: React.FC = () => {
  return (
    <div className="bg-togo-green rounded-[3rem] p-12 mb-20 relative overflow-hidden">
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
        <div className="max-w-lg">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none">
            Ne manquez plus les meilleures offres !
          </h2>
          <p className="text-white/70 font-medium">
            Inscrivez-vous à notre newsletter pour recevoir des codes promos exclusifs et découvrir les nouveaux arrivages de nos artisans.
          </p>
        </div>
        <div className="w-full max-w-md">
          <form className="flex gap-2 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <input 
              type="email" 
              placeholder="votre.email@gmail.com"
              className="flex-1 bg-transparent border-none outline-none text-white px-4 placeholder:text-white/50 text-sm"
            />
            <button className="bg-togo-yellow text-togo-green px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
              S'inscrire
            </button>
          </form>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-togo-yellow/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
    </div>
  );
};
