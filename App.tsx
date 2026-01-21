
import React, { useState, useEffect } from 'react';
import { AppView, Product, CartItem, Order, Theme, UserRole, UserProfile, SiteRule, SecurityLog, Transaction, PaymentMethod, WorkflowConfig } from './types';
import { PRODUCTS } from './data/products';
import { DatabaseService } from './services/database';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CartView } from './components/CartView';
import { SellerDashboard } from './components/SellerDashboard';
import { VirtualCabin } from './components/VirtualCabin';
import { AIStylist } from './components/AIStylist';
import { Footer } from './components/Footer';
import { ProductDetailView } from './components/ProductDetailView';
import { ProfileView } from './components/ProfileView';
import { Hero } from './components/Hero';
import { CategoryBar } from './components/CategoryBar';
import { AddProductModal } from './components/AddProductModal';
import { SuccessView } from './components/SuccessView';
import { AdminDashboard } from './components/AdminDashboard';
import { NotificationSystem } from './components/NotificationSystem';
import { WithdrawalModal } from './components/WithdrawalModal';
import { RechargeModal } from './components/RechargeModal';
import { ContactView } from './components/ContactView';
import { AuthModal } from './components/AuthModal';

const INITIAL_RULES: SiteRule[] = [
  { id: 'r1', key: 'fee_commission', title: 'Commission Marketplace', description: 'Pourcentage prélevé sur chaque vente.', value: 10, type: 'percent', category: 'finance', lastUpdated: 'Mars 2024' },
  { id: 'r2', key: 'verification_fee', title: 'Frais Lumina Verify', description: 'Coût unique pour le badge de confiance.', value: 4500, type: 'amount', category: 'finance', lastUpdated: 'Mars 2024' },
  { id: 'r3', key: 'workflow_fee', title: 'Abonnement Workflow', description: 'Service d\'automatisation pro pour les vendeurs.', value: 6500, type: 'amount', category: 'finance', lastUpdated: 'Mars 2024' }
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView | 'SUCCESS'>(AppView.STORE);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRecharge, setShowRecharge] = useState(false);
  const [inspectedUser, setInspectedUser] = useState<UserProfile | null>(null);
  const [rules] = useState<SiteRule[]>(INITIAL_RULES);

  useEffect(() => {
    const session = DatabaseService.getCurrentSession();
    if (session) setCurrentUser(session);
    else setShowAuth(true);
  }, []);

  const refreshUserData = () => {
    const session = DatabaseService.getCurrentSession();
    setCurrentUser(session);
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setShowAuth(false);
    (window as any).notify?.(`Bienvenue, ${user.name} !`, 'success');
  };

  const handleCheckout = (totalTokens: number) => {
    if (!currentUser) return;
    try {
      DatabaseService.processCheckout(currentUser.email, totalTokens, cart);
      refreshUserData();
      setCart([]);
      setView('SUCCESS' as any);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handlePayForWorkflow = () => {
    if (!currentUser) return;
    try {
      DatabaseService.purchasePremiumWorkflow(currentUser.email);
      refreshUserData();
      (window as any).notify?.("Workflow Premium Activé ! (Privilège Maître)", "success");
    } catch (e: any) {
      (window as any).notify?.(e.message, "error");
    }
  };

  const handlePayForVerification = () => {
    if (!currentUser) return;
    try {
      DatabaseService.certifySeller(currentUser.email);
      refreshUserData();
      (window as any).notify?.("Certification réussie ! (Privilège Maître)", "success");
    } catch (e: any) {
      (window as any).notify?.(e.message, "error");
    }
  };

  const handleLogout = () => {
    DatabaseService.logout();
    setCurrentUser(null);
    setShowAuth(true);
    setView(AppView.STORE);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <NotificationSystem />
      
      <Header 
        currentView={view as AppView} 
        setView={(v) => { setView(v); setInspectedUser(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
        cartCount={cart.length} 
        theme={theme} 
        toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
        role={currentUser?.role || 'buyer'} 
        onRoleChange={(r) => { if (currentUser) { const u = {...currentUser, role: r}; DatabaseService.updateProfile(u); setCurrentUser(u); } }} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        userAvatar={currentUser?.avatar}
        tokenBalance={currentUser?.tokenBalance || 0}
        onRechargeClick={() => setShowRecharge(true)}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 min-h-[60vh]">
        {view === AppView.STORE && (
          <div className="animate-in fade-in duration-700">
            <Hero onSellClick={() => { setView(AppView.SELLER_DASHBOARD); }} />
            <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />
            <div className="product-grid mb-24">
              {products
                .filter(p => (selectedCategory === 'Tous' || p.category === selectedCategory))
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(p => (
                  <ProductCard 
                    key={p.id} product={p} 
                    onAdd={p => { setCart(c => [...c, {...p, quantity: 1}]); (window as any).notify?.("Ajouté."); }} 
                    onViewDetails={() => { setSelectedProduct(p); setView(AppView.PRODUCT_DETAIL); }} 
                    onTryOn={(p) => { setSelectedProduct(p); setView(AppView.VIRTUAL_CABIN); }}
                  />
                ))}
            </div>
          </div>
        )}

        {view === AppView.ADMIN_DASHBOARD && (
          <AdminDashboard 
            orders={[]} sellers={[]}
            allUsers={DatabaseService.getAllUsers()} rules={rules} logs={[]}
            onPromoteAdmin={() => {}} onToggleVerifySeller={() => {}} 
            onViewProfile={(u) => { setInspectedUser(u); setView(AppView.PROFILE); }}
            onBanUser={(id) => {}} onWithdrawRequest={() => {}}
            onUpdateRule={() => {}} onAddRule={() => {}}
          />
        )}

        {view === AppView.SELLER_DASHBOARD && currentUser && (
          <SellerDashboard 
            orders={[]} seller={{id: currentUser.id, name: currentUser.name, logo: currentUser.avatar, rating: 5, joinedDate: currentUser.joinedDate, isVerified: currentUser.activityHistory.some(h => h.label.includes('Maître')), totalSales: 0, category: 'Tous', reviews: []}} 
            products={products} 
            workflowConfig={currentUser.workflowConfig}
            onAdvanceStatus={() => {}} onOpenChat={() => {}} 
            onCreateProduct={() => {}} 
            onPayForVerification={handlePayForVerification}
            onPayForWorkflow={handlePayForWorkflow} 
            onSaveWorkflow={(c) => { 
              const u = {...currentUser, workflowConfig: c}; 
              DatabaseService.updateProfile(u); refreshUserData(); 
              (window as any).notify?.("Configuration sauvegardée.");
            }}
            userEmail={currentUser.email}
          />
        )}

        {view === AppView.PROFILE && currentUser && (
          <ProfileView user={inspectedUser || currentUser} isMe={!inspectedUser || inspectedUser.id === currentUser?.id} orders={[]} onViewOrder={() => {}} onEditProfile={() => {}} isAdminView={currentUser.role === 'admin'} />
        )}

        {view === AppView.CART && (
          <CartView items={cart} updateQty={(id, d) => setCart(c => c.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onCheckout={handleCheckout} onBack={() => setView(AppView.STORE)} userTokenBalance={currentUser?.tokenBalance || 0} />
        )}

        {view === AppView.PRODUCT_DETAIL && selectedProduct && (
          <ProductDetailView product={selectedProduct} onAddToCart={p => { setCart(c => [...c, {...p, quantity: 1}]); (window as any).notify?.("Ajouté."); }} onBack={() => setView(AppView.STORE)} onAddReview={() => {}} />
        )}

        {view === AppView.VIRTUAL_CABIN && (
          <VirtualCabin initialProduct={selectedProduct} cartItems={cart} onBack={() => setView(AppView.STORE)} onGoToCart={() => setView(AppView.CART)} />
        )}

        {view === 'SUCCESS' && (
          <SuccessView orderId={`LMN-${Math.floor(Math.random()*9000)+1000}`} onContinue={() => setView(AppView.STORE)} />
        )}
      </main>

      <AIStylist products={products} history={[]} />

      {showRecharge && currentUser && (
        <RechargeModal 
          userEmail={currentUser.email} 
          onSuccess={(tx) => { 
            refreshUserData();
            (window as any).notify?.(`Dépôt ${tx.reference} initié !`, "info"); 
            setShowRecharge(false); 
          }} 
          onCancel={() => setShowRecharge(false)} 
        />
      )}

      {showAuth && <AuthModal onAuthSuccess={handleAuthSuccess} onClose={() => setShowAuth(false)} />}
      
      {currentUser && (
        <div className="fixed bottom-6 left-6 z-[150]">
           <button onClick={handleLogout} className="bg-red-500 text-white p-4 rounded-2xl shadow-2xl hover:bg-red-600 transition-all font-black text-[10px] uppercase tracking-widest">Déconnexion 🚪</button>
        </div>
      )}
      <Footer setView={(v) => setView(v as any)} />
    </div>
  );
};

// Fix: Add missing default export for App component to resolve import error in index.tsx
export default App;
