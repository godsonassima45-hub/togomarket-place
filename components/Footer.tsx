
import React from 'react';
import { AppView } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  setView: (v: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Logo size="md" />
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              La plateforme e-commerce leader au Togo. Nous connectons les entreprises et les particuliers pour un commerce plus sûr et plus rapide en Afrique de l'Ouest.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-togo-green hover:text-white transition-colors">f</a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-togo-green hover:text-white transition-colors">in</a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-togo-green hover:text-white transition-colors">x</a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Acheter par catégorie</h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><button onClick={() => setView(AppView.STORE)} className="hover:text-togo-green transition-colors">Mode & Textile</button></li>
              <li><button onClick={() => setView(AppView.STORE)} className="hover:text-togo-green transition-colors">Électronique</button></li>
              <li><button onClick={() => setView(AppView.STORE)} className="hover:text-togo-green transition-colors">B2B / Vente en Gros</button></li>
              <li><button onClick={() => setView(AppView.STORE)} className="hover:text-togo-green transition-colors">Alimentation Locale</button></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Aide & Support</h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><button onClick={() => setView(AppView.CONTACT)} className="hover:text-togo-green transition-colors">Contactez-nous</button></li>
              <li><button className="hover:text-togo-green transition-colors">Centre d'aide</button></li>
              <li><button className="hover:text-togo-green transition-colors">Suivi de commande</button></li>
              <li><button className="hover:text-togo-green transition-colors">Devenir Vendeur</button></li>
            </ul>
          </div>

          {/* Contact Info Quick View */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Siège Social</h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex gap-3">
                <span className="text-togo-green">📍</span>
                Lomé, Togo 🇹🇬
              </li>
              <li className="flex gap-3">
                <span className="text-togo-green">📞</span>
                +228 79 24 54 09
              </li>
              <li className="flex gap-3">
                <span className="text-togo-green">✉️</span>
                godsoanassima45@gmail.com
              </li>
            </ul>
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex gap-4">
               <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="TMoney">TM</div>
               <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-help" title="Flooz">FL</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <p>© 2024 TogoMarketPlace Enterprise. Tous droits réservés.</p>
          <div className="flex gap-8">
            <button className="hover:text-slate-900 dark:hover:text-white transition-colors">Mentions Légales</button>
            <button className="hover:text-slate-900 dark:hover:text-white transition-colors">Confidentialité</button>
            <button className="hover:text-slate-900 dark:hover:text-white transition-colors">Conditions d'utilisation</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
