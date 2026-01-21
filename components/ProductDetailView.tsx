
import React, { useState } from 'react';
import { Product, Review } from '../types';

interface ProductDetailViewProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBack: () => void;
  onAddReview: (productId: string, rating: number, comment: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onAddToCart, onBack, onAddReview }) => {
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onAddReview(product.id, userRating, comment);
    setComment('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <button onClick={onBack} className="text-sm font-black text-togo-green mb-8 flex items-center gap-2 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Retour au marché
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xl">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {product.discount && (
            <div className="absolute top-6 left-6 bg-togo-red text-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">
              -{product.discount}% OFF
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{product.category}</p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-none">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex text-togo-yellow text-xl">
              {"★".repeat(Math.round(product.rating))}
              <span className="text-slate-200 dark:text-slate-700">{"★".repeat(5 - Math.round(product.rating))}</span>
            </div>
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
              {product.rating.toFixed(1)} ({product.reviewsCount} Avis)
            </span>
            {product.verifiedSeller && (
              <span className="bg-togo-green/10 text-togo-green text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Vérifié ✓</span>
            )}
          </div>

          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-col gap-6 mb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-black text-togo-green dark:text-togo-yellow">
                {product.price.toLocaleString()} <span className="text-lg">FCFA</span>
              </span>
            </div>
            <div className="text-sm font-bold text-slate-500 flex items-center gap-2">
              <span className={product.stock > 0 ? 'text-green-500' : 'text-red-500'}>●</span>
              {product.stock > 0 ? `${product.stock} articles en stock` : 'Rupture de stock'}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className="flex-1 bg-togo-green text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-togo-green/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
            >
              Ajouter au Panier
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t dark:border-slate-800 pt-16">
        <h2 className="text-3xl font-black mb-12 flex items-center gap-4">
          Avis Clients <span className="text-slate-300">/</span> {product.reviewsCount}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Review Form */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 sticky top-32">
              <h3 className="text-xl font-black mb-6">Laisser une critique</h3>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Note globale</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className={`text-2xl transition-all ${star <= userRating ? 'text-togo-yellow scale-110' : 'text-slate-300 dark:text-slate-700'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Commentaire</label>
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Qu'avez-vous pensé de cet article ?"
                    className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl p-6 text-sm outline-none focus:ring-2 focus:ring-togo-green transition-all h-32 resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-slate-900 dark:bg-slate-800 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  Publier l'avis
                </button>
              </form>
            </div>
          </div>

          {/* Review List */}
          <div className="lg:col-span-7 space-y-8">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div key={review.id} className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm animate-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-lg">{review.author}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {new Date(review.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex text-togo-yellow">
                      {"★".repeat(review.rating)}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
              ))
            ) : (
              <div className="py-20 text-center opacity-30">
                <p className="font-black uppercase tracking-[0.2em]">Aucun avis pour le moment</p>
                <p className="text-xs mt-2">Soyez le premier à donner votre avis !</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
