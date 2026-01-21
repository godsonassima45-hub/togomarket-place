
import React, { useState } from 'react';

export const ContactView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    // Netlify forms handle the submission automatically if the attributes are correct.
    // Here we just simulate a success state for the UI.
    // e.preventDefault(); // Uncomment this if not using a real form backend
    // setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className="text-sm font-bold text-togo-green mb-8 flex items-center gap-2 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Retour au marché
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Parlons Business 🤝</h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Une question sur un produit ? Un partenariat en vue ou besoin d'aide pour votre boutique ? 
              Notre équipe est disponible 6j/7 pour vous accompagner dans votre croissance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Phone Cards */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 bg-togo-green/10 text-togo-green rounded-2xl flex items-center justify-center text-xl">📱</div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Téléphone Principal</p>
                <a href="tel:+22879245409" className="text-lg font-bold text-slate-900 dark:text-white hover:text-togo-green transition-colors">+228 79 24 54 09</a>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">💬</div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">WhatsApp & Support</p>
                <a href="https://wa.me/22897026900" target="_blank" className="text-lg font-bold text-slate-900 dark:text-white hover:text-emerald-500 transition-colors">+228 97 02 69 00</a>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
              <div className="w-12 h-12 bg-togo-yellow/10 text-togo-yellow rounded-2xl flex items-center justify-center text-xl">✉️</div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Officiel</p>
                <a href="mailto:godsoanassima45@gmail.com" className="text-sm font-bold text-slate-900 dark:text-white hover:text-togo-green transition-colors break-all">godsoanassima45@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="pt-8 border-t">
            <h4 className="text-sm font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest">Nous suivre</h4>
            <div className="flex gap-4">
              {['Facebook', 'Instagram', 'WhatsApp', 'TikTok', 'Twitter'].map(social => (
                <a 
                  key={social}
                  href="#" 
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold hover:bg-togo-green hover:text-white transition-all transform hover:-translate-y-1"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            {submitted ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
                <h3 className="text-2xl font-black mb-2">Message envoyé !</h3>
                <p className="text-slate-500 mb-8">Nous reviendrons vers vous sous 24h ouvrées.</p>
                <button onClick={() => setSubmitted(false)} className="text-togo-green font-bold text-sm">Envoyer un autre message</button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-black mb-8">Envoyez-nous un message</h3>
                <form 
                  name="contact" 
                  method="POST" 
                  data-netlify="true" 
                  className="space-y-6"
                  onSubmit={handleSubmit}
                >
                  <input type="hidden" name="form-name" value="contact" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom complet</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        placeholder="John Doe"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-togo-green transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        placeholder="john@example.com"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-togo-green transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sujet</label>
                    <input 
                      type="text" 
                      name="subject" 
                      required 
                      placeholder="Comment pouvons-nous vous aider ?"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-togo-green transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                    <textarea 
                      name="message" 
                      required 
                      rows={5}
                      placeholder="Dites-nous tout..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm outline-none focus:ring-2 focus:ring-togo-green transition-all resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-togo-green text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-togo-green/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Envoyer le Message
                  </button>
                </form>
              </>
            )}
            
            {/* Design Element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-togo-yellow/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-togo-green/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
