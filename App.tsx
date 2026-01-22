
import React, { useState, useEffect } from 'react';
import { AppView, Product, CartItem, Order, Theme, UserRole, UserProfile, SiteRule, SecurityLog, Transaction, PaymentMethod, WorkflowConfig } from './types';
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
import { SuccessView } from './components/SuccessView';
import { AdminDashboard } from './components/AdminDashboard';
import { NotificationSystem } from './components/NotificationSystem';
import { RechargeModal } from './components/RechargeModal';
import { ContactView } from './components/ContactView';
import { AuthModal } from './components/AuthModal';
import { RulesModal } from './components/RulesModal';
import { Newsletter } from './components/Newsletter';
import { AddProductModal } from './components/AddProductModal';

const INITIAL_RULES: SiteRule[] = [
  { id: 'r1', key: 'fee_commission', title: 'Commission Marketplace', description: 'Pourcentage prélevé sur chaque vente.', value: 10, type: 'percent', category: 'finance', lastUpdated: 'Mars 2024' },
  { id: 'r2', key: 'verification_fee', title: 'Frais Lumina Verify', description: 'Coût unique pour le badge de confiance.', value: 4500, type: 'amount', category: 'finance', lastUpdated: 'Mars 2024' },
  { id: 'r3', key: 'workflow_fee', title: 'Abonnement Workflow', description: 'Service d\'automatisation pro pour les vendeurs.', value: 6500, type: 'amount', category: 'finance', lastUpdated: 'Mars 2024' }
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.STORE);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [products, setProducts] = useState<(Product & { status?: 'published' | 'draft' })[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRecharge, setShowRecharge] = useState(false);
  const [inspectedUser, setInspectedUser] = useState<UserProfile | null>(null);
  const [rules] = useState<SiteRule[]>(INITIAL_RULES);

  useEffect(() => {
    const session = DatabaseService.getCurrentSession();
    if (session) {
      setCurrentUser(session);
      setShowAuth(false);
    } else {
      setShowAuth(true);
    }
    setProducts(DatabaseService.getProducts());
  }, []);

  const refreshAppData = () => {
    const updated = DatabaseService.getCurrentSession();
    if (updated) setCurrentUser(updated);
    setProducts(DatabaseService.getProducts());
  };

  const handleAuthSuccess = (user: UserProfile, isNewUser: boolean) => {
    setCurrentUser(user);
    setShowAuth(false);
    if (isNewUser) {
      setShowRules(true);
    }
    (window as any).notify?.(`Bienvenue sur TogoMarket, ${user.name}`, 'success');
  };

  const handleLogout = () => {
    DatabaseService.logout();
    setCurrentUser(null);
    setShowAuth(true);
    setView(AppView.STORE);
  };

  const handleCheckout = (totalTokens: number) => {
    if (!currentUser) return;
    try {
      DatabaseService.processCheckout(currentUser.email, totalTokens, cart);
      refreshAppData();
      setCart([]);
      setView(AppView.SUCCESS);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      (window as any).notify?.(e.message, "error");
    }
  };

  const navigateTo = (v: AppView) => {
    setView(v);
    setInspectedUser(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Tous' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <NotificationSystem />
      
      <Header 
        currentView={view} 
        setView={navigateTo} 
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

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 min-h-[70vh]">
        {view === AppView.STORE && (
          <div className="animate-in fade-in duration-700">
            <Hero onSellClick={() => navigateTo(AppView.SELLER_DASHBOARD)} />
            <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />
            <div className="product-grid mb-16">
              {filteredProducts.map(p => (
                <ProductCard 
                  key={p.id} product={p} 
                  onAdd={p => { setCart(c => [...c, {...p, quantity: 1}]); (window as any).notify?.("Ajouté au panier."); }} 
                  onViewDetails={() => { setSelectedProduct(p); setView(AppView.PRODUCT_DETAIL); }} 
                  onTryOn={(p) => { setSelectedProduct(p); setView(AppView.VIRTUAL_CABIN); }}
                />
              ))}
            </div>
            <Newsletter />
          </div>
        )}

        {view === AppView.VIRTUAL_CABIN && (
          <VirtualCabin 
            initialProduct={selectedProduct} 
            cartItems={cart} 
            onBack={() => navigateTo(AppView.STORE)} 
            onGoToCart={() => navigateTo(AppView.CART)} 
          />
        )}

        {view === AppView.CART && (
          <CartView 
            items={cart} 
            updateQty={(id, d) => setCart(c => c.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} 
            onCheckout={handleCheckout} 
            onBack={() => setView(AppView.STORE)} 
            userTokenBalance={currentUser?.tokenBalance || 0} 
          />
        )}

        {view === AppView.PRODUCT_DETAIL && selectedProduct && (
          <ProductDetailView 
            product={selectedProduct} 
            onAddToCart={p => { setCart(c => [...c, {...p, quantity: 1}]); (window as any).notify?.("Ajouté."); }} 
            onBack={() => navigateTo(AppView.STORE)} 
            onAddReview={() => {}} 
          />
        )}

        {view === AppView.PROFILE && currentUser && (
          <ProfileView 
            user={inspectedUser || currentUser} 
            isMe={!inspectedUser || inspectedUser.id === currentUser.id} 
            orders={[]} 
            onViewOrder={() => {}} 
            onEditProfile={(u) => { DatabaseService.updateProfile(u); refreshAppData(); }} 
            isAdminView={currentUser.role === 'admin'}
          />
        )}

        {view === AppView.SELLER_DASHBOARD && currentUser && (
          <SellerDashboard 
            orders={[]} 
            seller={{...currentUser, logo: currentUser.avatar, isVerified: true, totalSales: 0, category: 'Vendeur Premium', reviews: []}} 
            products={products} 
            onAdvanceStatus={() => {}} 
            onOpenChat={() => {}} 
            onCreateProduct={() => setShowAddProduct(true)} 
            onPayForVerification={() => {}} 
            onPayForWorkflow={() => {}} 
            onSaveWorkflow={() => {}} 
            onUpdateInventory={refreshAppData} 
            userEmail={currentUser.email}
          />
        )}

        {view === AppView.ADMIN_DASHBOARD && currentUser?.role === 'admin' && (
          <AdminDashboard 
            orders={[]} 
            sellers={DatabaseService.getAllUsers().filter(u => u.role === 'seller') as any}
            allUsers={DatabaseService.getAllUsers()} 
            rules={rules} 
            logs={[]}
            onPromoteAdmin={() => {}} 
            onToggleVerifySeller={() => {}} 
            onViewProfile={(u) => { setInspectedUser(u); setView(AppView.PROFILE); }}
            onBanUser={(id) => {}} 
            onWithdrawRequest={() => {}}
            onUpdateRule={() => {}} 
            onAddRule={() => {}}
          />
        )}

        {view === AppView.CONTACT && <ContactView onBack={() => navigateTo(AppView.STORE)} />}

        {view === AppView.SUCCESS && (
          <SuccessView orderId={`LMN-${Math.floor(Math.random()*9000)+1000}`} onContinue={() => navigateTo(AppView.STORE)} />
        )}
      </main>

      <AIStylist products={products} history={[]} />

      {showAuth && <AuthModal onAuthSuccess={handleAuthSuccess} onClose={() => setShowAuth(false)} />}
      
      {showRules && currentUser && (
        <RulesModal userName={currentUser.name} onAccept={() => setShowRules(false)} onDecline={handleLogout} />
      )}

      {showRecharge && currentUser && (
        <RechargeModal userEmail={currentUser.email} onSuccess={() => { refreshAppData(); setShowRecharge(false); }} onCancel={() => setShowRecharge(false)} />
      )}

      {showAddProduct && (
        <AddProductModal onClose={() => setShowAddProduct(false)} onAdd={(p) => { DatabaseService.addProduct(currentUser!, p); refreshAppData(); }} />
      )}
      
      {currentUser && (
        <button onClick={handleLogout} className="fixed bottom-6 left-6 z-[150] bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase border border-red-500/20 shadow-lg transition-all">Déconnexion 🚪</button>
      )}

      <Footer setView={navigateTo} />
    </div>
  );
};

export default App;
