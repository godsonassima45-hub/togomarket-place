
import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ items, onRemove, onUpdateQuantity, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h3>
        <p className="text-slate-500 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet. Time to explore!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 group">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <button onClick={() => onRemove(item.id)} className="text-slate-400 hover:text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-slate-500">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="p-1 px-3 hover:bg-slate-50 text-slate-600 disabled:opacity-30"
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="p-1 px-3 hover:bg-slate-50 text-slate-600"
                    >+</button>
                  </div>
                  <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 h-fit sticky top-24">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-slate-900 font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-base font-bold text-slate-900">Total</span>
              <span className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={onCheckout}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
          >
            Checkout Now
          </button>
          <p className="mt-4 text-center text-xs text-slate-400">Secure checkout powered by Stripe</p>
        </div>
      </div>
    </div>
  );
};
