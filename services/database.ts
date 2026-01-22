
import { UserProfile, Transaction, WorkflowConfig, CartItem, Product, SellingType, UserRole, Order, Chat, ChatMessage, SiteRule } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';

const DB_KEY = 'TOGOMARKET_DB_VAULT_V4';
const PRODUCTS_KEY = 'TOGOMARKET_PRODUCTS_VAULT_V4';
const ORDERS_KEY = 'TOGOMARKET_ORDERS_VAULT_V4';
const CHATS_KEY = 'TOGOMARKET_CHATS_VAULT_V4';
const RULES_KEY = 'TOGOMARKET_RULES_VAULT_V4';
const SESSION_KEY = 'TOGOMARKET_SESSION_V4';
const PASS_KEY = 'TOGOMARKET_AUTH_VAULT_V4';

export const MASTER_ADMIN_EMAIL = 'godsonassima45@gmail.com';

const DEFAULT_RULES: SiteRule[] = [
  { id: 'r1', key: 'fee_commission', title: 'Commission Marketplace', description: 'Pourcentage prélevé sur chaque vente.', value: 10, type: 'percent', category: 'finance', lastUpdated: 'Mars 2024' },
  { id: 'r2', key: 'verification_fee', title: 'Frais Lumina Verify', description: 'Coût unique pour le badge de confiance.', value: 4500, type: 'amount', category: 'finance', lastUpdated: 'Mars 2024' }
];

export class DatabaseService {
  private static getStoredData<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error("Storage error:", e);
      return defaultValue;
    }
  }

  private static setStoredData<T>(key: string, data: T): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (e) {
      console.error("Storage set error:", e);
    }
  }

  // --- Rules Management ---
  static getRules(): SiteRule[] {
    return this.getStoredData<SiteRule[]>(RULES_KEY, DEFAULT_RULES);
  }

  static updateRule(ruleId: string, newValue: any): void {
    const rules = this.getRules();
    const idx = rules.findIndex(r => r.id === ruleId);
    if (idx !== -1) {
      rules[idx].value = newValue;
      rules[idx].lastUpdated = new Date().toLocaleDateString('fr-FR');
      this.setStoredData(RULES_KEY, rules);
    }
  }

  static addRule(rule: Omit<SiteRule, 'id' | 'lastUpdated'>): void {
    const rules = this.getRules();
    const newRule: SiteRule = {
      ...rule,
      id: 'r-' + Math.random().toString(36).substr(2, 9),
      lastUpdated: new Date().toLocaleDateString('fr-FR')
    };
    rules.push(newRule);
    this.setStoredData(RULES_KEY, rules);
  }

  static deleteRule(ruleId: string): void {
    const rules = this.getRules().filter(r => r.id !== ruleId);
    this.setStoredData(RULES_KEY, rules);
  }

  // --- Auth & Session ---
  static getCurrentSession(): UserProfile | null {
    const email = localStorage.getItem(SESSION_KEY);
    return email ? this.getUserByEmail(email) : null;
  }

  static logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }

  static preLogin(email: string, pass: string): boolean {
    const lowEmail = email.toLowerCase();
    const passwords = this.getStoredData<Record<string, string>>(PASS_KEY, {});
    
    if (lowEmail === MASTER_ADMIN_EMAIL.toLowerCase()) {
        if (!passwords[lowEmail]) return true; 
        return passwords[lowEmail] === pass;
    }
    
    const user = this.getUserByEmail(lowEmail);
    return !!user && passwords[lowEmail] === pass;
  }

  static login(email: string): UserProfile {
    const lowEmail = email.toLowerCase();
    let user = this.getUserByEmail(lowEmail);
    
    if (!user && lowEmail === MASTER_ADMIN_EMAIL.toLowerCase()) {
      user = this.register("Propriétaire Master", lowEmail, "admin", "admin");
    }
    
    if (!user) throw new Error("Compte inexistant.");
    localStorage.setItem(SESSION_KEY, lowEmail);
    return user;
  }

  static register(name: string, email: string, pass: string, role: UserRole): UserProfile {
    const lowEmail = email.toLowerCase();
    if (this.getUserByEmail(lowEmail)) throw new Error("Email déjà utilisé.");
    
    const isMaster = lowEmail === MASTER_ADMIN_EMAIL.toLowerCase();
    
    const newUser: UserProfile = {
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      name,
      email: lowEmail,
      phone: '',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      role: isMaster ? 'admin' : role,
      address: 'Lomé, Togo',
      joinedDate: new Date().toLocaleDateString('fr-FR'),
      loyaltyPoints: 0,
      tokenBalance: 0, // TOUT LE MONDE COMMENCE À 0 LT
      transactions: [],
      preferredPayment: 'TMoney',
      reputationScore: 100,
      activityHistory: [{ id: Date.now().toString(), type: 'system', label: 'Bienvenue ! Solde initial: 0 LT. Veuillez recharger votre compte.', date: new Date().toLocaleDateString('fr-FR') }],
      workflowConfig: {
        isActive: isMaster,
        autoAcceptOrders: isMaster,
        aiNegotiation: isMaster,
        maxDiscountPercent: 15,
        absenteeMessage: "Lumina AI est connectée.",
        whatsappAlerts: true,
        minStockThreshold: 1
      }
    };
    
    const users = this.getAllUsers();
    users.push(newUser);
    this.setStoredData(DB_KEY, users);

    const passwords = this.getStoredData<Record<string, string>>(PASS_KEY, {});
    passwords[lowEmail] = pass;
    this.setStoredData(PASS_KEY, passwords);

    localStorage.setItem(SESSION_KEY, lowEmail);
    return newUser;
  }

  static verifyCode(email: string, code: string): boolean {
    return code.length === 6; 
  }

  static generateVerificationCode(email: string): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // --- Core Methods ---
  static getAllUsers(): UserProfile[] {
    return this.getStoredData<UserProfile[]>(DB_KEY, []);
  }

  static getUserByEmail(email: string): UserProfile | null {
    return this.getAllUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static getUserById(id: string): UserProfile | null {
    return this.getAllUsers().find(u => u.id === id) || null;
  }

  static updateProfile(updated: UserProfile): void {
    const users = this.getAllUsers();
    const idx = users.findIndex(u => u.id === updated.id);
    if (idx !== -1) {
      users[idx] = updated;
      this.setStoredData(DB_KEY, users);
    }
  }

  static getProducts(): Product[] {
    const p = this.getStoredData<Product[]>(PRODUCTS_KEY, []);
    if (p.length === 0) {
      this.setStoredData(PRODUCTS_KEY, INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    return p;
  }

  static addProduct(user: UserProfile, pData: any): void {
    const products = this.getProducts();
    const newProduct: Product = {
      ...pData,
      id: 'p-' + Math.random().toString(36).substr(2, 9),
      sellerId: user.id,
      sellerName: user.name,
      rating: 5.0,
      reviewsCount: 0,
      verifiedSeller: user.reputationScore > 90,
      createdAt: new Date().toISOString(),
      reviews: []
    };
    products.push(newProduct);
    this.setStoredData(PRODUCTS_KEY, products);
  }

  static processCheckout(email: string, totalTokens: number, items: CartItem[]): Order {
    const buyer = this.getUserByEmail(email);
    if (!buyer || buyer.tokenBalance < totalTokens) throw new Error("Solde insuffisant.");
    
    // Commission rule
    const rules = this.getRules();
    const commissionRate = (rules.find(r => r.key === 'fee_commission')?.value as number) || 10;

    // 1. Débit de l'acheteur
    buyer.tokenBalance -= totalTokens;
    buyer.activityHistory.push({
      id: Date.now().toString(),
      type: 'purchase',
      label: `Achat Marketplace : -${totalTokens} LT`,
      date: new Date().toLocaleDateString('fr-FR')
    });

    // 2. Dispatch aux vendeurs avec commission de 10%
    items.forEach(item => {
        const itemTotalTokens = Math.ceil((item.price * item.quantity) / 500);
        const commission = itemTotalTokens * (commissionRate / 100);
        const netVendeur = itemTotalTokens - commission;

        const seller = this.getUserById(item.sellerId);
        if (seller) {
            seller.tokenBalance += netVendeur;
            seller.activityHistory.push({
                id: 'sale-' + Date.now(),
                type: 'system',
                label: `Vente de "${item.name}" : +${netVendeur.toFixed(1)} LT (Commission plateforme de ${commissionRate}% déduite)`,
                date: new Date().toLocaleDateString('fr-FR')
            });
            this.updateProfile(seller);
        }
    });

    const orderId = 'LMN-' + Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('fr-FR'),
      items,
      total: items.reduce((s, i) => s + (i.price * i.quantity), 0),
      tokenTotal: totalTokens,
      commissionLumina: totalTokens * (commissionRate / 100),
      netVendeur: totalTokens * (1 - (commissionRate / 100)),
      status: 'paye',
      paymentMethod: 'TMoney',
      customerName: buyer.name,
      customerEmail: buyer.email,
      customerPhone: buyer.phone || 'Non renseigné',
      statusHistory: [{ status: 'paye', timestamp: new Date().toISOString() }]
    };

    const orders = this.getOrders();
    orders.push(newOrder);
    this.setStoredData(ORDERS_KEY, orders);
    this.updateProfile(buyer);
    return newOrder;
  }

  static getOrders(): Order[] {
    return this.getStoredData<Order[]>(ORDERS_KEY, []);
  }

  static getOrdersByBuyer(email: string): Order[] {
    return this.getOrders().filter(o => o.customerEmail?.toLowerCase() === email.toLowerCase());
  }

  static getOrdersBySeller(sellerId: string): Order[] {
    return this.getOrders().filter(o => o.items.some(i => i.sellerId === sellerId));
  }

  static validateDeposit(txId: string): void {
    const users = this.getAllUsers();
    users.forEach(u => {
      const tx = u.transactions.find(t => t.id === txId);
      if (tx && tx.status === 'pending') {
        tx.status = 'success';
        u.tokenBalance += tx.amountTokens;
        u.activityHistory.push({
            id: Date.now().toString(),
            type: 'system',
            label: `Dépôt de +${tx.amountTokens} LT validé par l'administration !`,
            date: new Date().toLocaleDateString('fr-FR')
        });
      }
    });
    this.setStoredData(DB_KEY, users);
  }

  static rejectDeposit(txId: string): void {
    const users = this.getAllUsers();
    users.forEach(u => {
      const tx = u.transactions.find(t => t.id === txId);
      if (tx && tx.status === 'pending') tx.status = 'failed';
    });
    this.setStoredData(DB_KEY, users);
  }

  static getPendingTransactions(): Transaction[] {
    let pending: Transaction[] = [];
    this.getAllUsers().forEach(u => {
      pending = [...pending, ...u.transactions.filter(t => t.status === 'pending')];
    });
    return pending;
  }

  static createPendingDeposit(email: string, amountFcfa: number, tokens: number, method: string): Transaction {
    const user = this.getUserByEmail(email);
    if (!user) throw new Error("Utilisateur introuvable.");

    const tx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      reference: `DEP-${Math.floor(Math.random() * 900000)}`,
      type: 'deposit',
      amountTokens: tokens,
      amountFcfa: amountFcfa,
      method,
      date: new Date().toLocaleString('fr-FR'),
      status: 'pending',
      userEmail: email,
      userName: user.name
    };

    user.transactions.push(tx);
    this.updateProfile(user);
    return tx;
  }

  static getChats(userId: string): Chat[] {
    return this.getStoredData<Chat[]>(CHATS_KEY, []).filter(c => c.participants.some(p => p.id === userId));
  }

  static sendMessage(chatId: string, senderId: string, text: string): void {
    const chats = this.getStoredData<Chat[]>(CHATS_KEY, []);
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      chat.messages.push({
        id: Date.now().toString(),
        senderId,
        text,
        timestamp: new Date().toISOString()
      });
      chat.lastUpdate = new Date().toISOString();
      this.setStoredData(CHATS_KEY, chats);
    }
  }

  static deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    this.setStoredData(PRODUCTS_KEY, products);
  }

  static toggleProductStatus(id: string): void {
    const products = this.getProducts() as (Product & { status?: string })[];
    const p = products.find(x => x.id === id);
    if (p) {
      p.status = p.status === 'draft' ? 'published' : 'draft';
      this.setStoredData(PRODUCTS_KEY, products);
    }
  }
}
