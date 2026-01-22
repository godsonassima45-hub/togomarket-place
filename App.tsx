
import React, { useState, useEffect } from 'react';
import { AppView, Product, CartItem, Order, Theme, UserProfile, Chat, Seller } from './types';
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
import { ChatSystem } from './components/ChatSystem';
import { OrderDetailsView } from './components/OrderDetailsView';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRecharge, setShowRecharge] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const session = DatabaseService.getCurrentSession();
    if (session) {
      setCurrentUser(session);
      setChats(DatabaseService.getChats(session.id));
    } else {
      setShowAuth(true);
    }
    setProducts(DatabaseService.getProducts());
  }, []);

  const refreshAppData = () => {
    const updated = DatabaseService.getCurrentSession();
    if (updated) {
      setCurrentUser(updated);
      setChats(DatabaseService.getChats(updated.id));
    }
    setProducts(DatabaseService.getProducts());
  };

  const handleAuthSuccess = (user: UserProfile, isNewUser: boolean) => {
    setCurrentUser(user);
    setShowAuth(false);
    if (isNewUser) setShowRules(true);
    (window as any).notify?.(`Bienvenue, ${user.name} 🇹🇬`, 'success');
  };

  const navigateTo = (v: AppView) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Tous' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Construct seller object with correct typing
  const sellerObject: Seller | null = currentUser ? {
    id: currentUser.id,
    name: currentUser.name,
    logo: currentUser.avatar,
    rating: currentUser.reputationScore,
    joinedDate: currentUser.joinedDate,
    isVerified: true,
    totalSales: 0,
    category: 'Vendeur Lumina',
    reviews: []
  } : null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <NotificationSystem />
      
      <Header 
        currentView={view} setView={navigateTo} cartCount={cart.length} 
        theme={theme} toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
        role={currentUser?.role || 'buyer'} 
        onRoleChange={(r) => { if (currentUser) { const u = {...currentUser, role: r}; DatabaseService.updateProfile(u); setCurrentUser(u); } }} 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
        userAvatar={currentUser?.avatar} tokenBalance={currentUser?.tokenBalance || 0}
        onRechargeClick={() => setShowRecharge(true)}
      />

      <main className="max-w-7xl mx-auto px-4 py-12 min-h-[70vh]">
        {view === AppView.STORE && (
          <div className="animate-in fade-in duration-700">
            <Hero onSellClick={() => navigateTo(AppView.SELLER_DASHBOARD)} />
            <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />
            <div className="product-grid mb-16">
              {filteredProducts.map(p => (
                <ProductCard 
                  key={p.id} product={p} 
                  onAdd={p => { setCart(c => [...c, {...p, quantity: 1}]); (window as any).notify?.("Ajouté."); }} 
                  onViewDetails={() => { setSelectedProduct(p); setView(AppView.PRODUCT_DETAIL); }} 
                  onTryOn={(p) => { setSelectedProduct(p); setView(AppView.VIRTUAL_CABIN); }}
                />
              ))}
            </div>
            <Newsletter />
          </div>
        )}

        {view === AppView.VIRTUAL_CABIN && (
          <VirtualCabin initialProduct={selectedProduct} onBack={() => navigateTo(AppView.STORE)} onGoToCart={() => navigateTo(AppView.CART)} />
        )}

        {view === AppView.CART && (
          <CartView 
            items={cart} 
            updateQty={(id, d) => setCart(c => c.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} 
            onCheckout={(tokens) => { 
              try { 
                DatabaseService.processCheckout(currentUser!.email, tokens, cart); 
                refreshAppData(); setCart([]); setView(AppView.SUCCESS); 
              } catch(e: any) { (window as any).notify?.(e.message, 'error'); } 
            }} 
            onBack={() => setView(AppView.STORE)} 
            userTokenBalance={currentUser?.tokenBalance || 0} 
          />
        )}

        {view === AppView.ADMIN_DASHBOARD && currentUser?.role === 'admin' && (
          <AdminDashboard 
            orders={DatabaseService.getOrders()} 
            allUsers={DatabaseService.getAllUsers()} 
            onBanUser={(id) => { (window as any).notify?.("Action Admin effectuée."); }}
          />
        )}

        {view === AppView.PROFILE && currentUser && (
          <ProfileView 
            user={currentUser} isMe={true} orders={DatabaseService.getOrdersByBuyer(currentUser.email)} 
            onViewOrder={() => {}} onEditProfile={(u) => { DatabaseService.updateProfile(u); refreshAppData(); }} 
          />
        )}

        {view === AppView.PRODUCT_DETAIL && selectedProduct && (
          <ProductDetailView product={selectedProduct} onAddToCart={p => { setCart(c => [...c, {...p, quantity: 1}]); }} onBack={() => navigateTo(AppView.STORE)} onAddReview={() => {}} />
        )}

        {view === AppView.SELLER_DASHBOARD && currentUser && sellerObject && (
          <SellerDashboard 
            orders={DatabaseService.getOrdersBySeller(currentUser.id)} 
            seller={sellerObject} 
            products={products} onCreateProduct={() => setShowAddProduct(true)} 
            onAdvanceStatus={() => {}} onOpenChat={() => setShowChat(true)} onPayForVerification={() => {}} 
            onPayForWorkflow={() => {}} onSaveWorkflow={() => {}} onUpdateInventory={refreshAppData} userEmail={currentUser.email}
          />
        )}

        {view === AppView.CONTACT && <ContactView onBack={() => navigateTo(AppView.STORE)} />}
        {view === AppView.SUCCESS && <SuccessView orderId={`LMN-${Math.floor(Math.random()*9000)}`} onContinue={() => navigateTo(AppView.STORE)} />}
      </main>

      <AIStylist products={products} history={[]} />
      {showAuth && <AuthModal onAuthSuccess={handleAuthSuccess} onClose={() => setShowAuth(false)} />}
      {showRecharge && currentUser && <RechargeModal userEmail={currentUser.email} onSuccess={() => { refreshAppData(); setShowRecharge(false); }} onCancel={() => setShowRecharge(false)} />}
      {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} onAdd={(p) => { DatabaseService.addProduct(currentUser!, p); refreshAppData(); }} />}
      {showChat && currentUser && <ChatSystem currentUserId={currentUser.id} role={currentUser.role} chats={chats} onSendMessage={(cid, txt) => { DatabaseService.sendMessage(cid, currentUser.id, txt); refreshAppData(); }} onFinalizeSale={() => {}} onClose={() => setShowChat(false)} />}
      {showRules && currentUser && <RulesModal userName={currentUser.name} onAccept={() => setShowRules(false)} onDecline={() => { DatabaseService.logout(); window.location.reload(); }} />}
      <Footer setView={navigateTo} />
    </div>
  );
};

export default App;
