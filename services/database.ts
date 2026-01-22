import { UserProfile, Transaction, WorkflowConfig, CartItem, Product, SellingType, UserRole } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';

const DB_KEY = 'TOGOMARKET_DB_VAULT';
const PRODUCTS_KEY = 'TOGOMARKET_PRODUCTS_VAULT';
const SESSION_KEY = 'TOGOMARKET_SESSION';
const SECRET_SALT = 'LUMINA_228_PRO';

// L'email administrateur maître de la plateforme
export const MASTER_ADMIN_EMAIL = 'godsonassima45@gmail.com';

export class DatabaseService {
  private static getStoredData<T>(key: string, defaultValue: T): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }

  private static setStoredData<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- Gestion de Session (Persistance) ---
  static getCurrentSession(): UserProfile | null {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    return this.getUserByEmail(email);
  }

  static logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }

  // --- Gestion Utilisateurs ---
  static getAllUsers(): UserProfile[] {
    return this.getStoredData<UserProfile[]>(DB_KEY, []);
  }

  static getUserByEmail(email: string): UserProfile | null {
    const users = this.getAllUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static updateProfile(updated: UserProfile): void {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === updated.email.toLowerCase());
    if (index !== -1) {
      users[index] = updated;
      this.setStoredData(DB_KEY, users);
    }
  }

  // --- Logique Auth ---
  static preLogin(email: string, pass: string): boolean {
    const user = this.getUserByEmail(email);
    if (!user) throw new Error("Compte inexistant au Togo.");
    return true; 
  }

  static login(email: string): UserProfile {
    const user = this.getUserByEmail(email);
    if (!user) throw new Error("Erreur critique de connexion.");
    localStorage.setItem(SESSION_KEY, user.email);
    return user;
  }

  static preRegister(name: string, email: string, pass: string): void {
    if (this.getUserByEmail(email)) throw new Error("Cet email est déjà utilisé sur TogoMarket.");
  }

  static register(name: string, email: string, pass: string, role: UserRole): UserProfile {
    const isMaster = email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
    
    // Fix: Added missing preferredPayment property to satisfy UserProfile interface requirement
    const newUser: UserProfile = {
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      name,
      email: email.toLowerCase(),
      phone: '',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      role: isMaster ? 'admin' : role,
      address: 'Lomé, Togo',
      joinedDate: new Date().toLocaleDateString('fr-FR'),
      loyaltyPoints: 0,
      tokenBalance: isMaster ? 1000000 : 0, // 0 LT pour les nouveaux, sauf l'admin
      transactions: [],
      preferredPayment: 'TMoney',
      reputationScore: 100,
      activityHistory: [{ id: '1', type: 'system', label: 'Bienvenue sur TogoMarket ! Compte créé.', date: new Date().toLocaleDateString('fr-FR') }],
      workflowConfig: {
        isActive: isMaster,
        autoAcceptOrders: isMaster,
        aiNegotiation: isMaster,
        maxDiscountPercent: 10,
        absenteeMessage: "Bonjour, Lumina gère ma boutique en mon absence.",
        whatsappAlerts: true,
        minStockThreshold: 1
      }
    };
    
    const users = this.getAllUsers();
    users.push(newUser);
    this.setStoredData(DB_KEY, users);
    localStorage.setItem(SESSION_KEY, newUser.email);
    return newUser;
  }

  static generateVerificationCode(email: string): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static verifyCode(email: string, code: string): boolean {
    return code.length === 6; // Simulation : Tout code à 6 chiffres est valide pour la démo
  }

  // --- Produits ---
  static getProducts(): Product[] {
    const local = this.getStoredData<Product[]>(PRODUCTS_KEY, []);
    return local.length === 0 ? INITIAL_PRODUCTS : local;
  }

  static addProduct(user: UserProfile, pData: any): void {
    const products = this.getProducts();
    const newProduct: Product = {
      ...pData,
      id: 'p-' + Math.random().toString(36).substr(2, 9),
      sellerId: user.id,
      sellerName: user.name,
      rating: 5,
      reviewsCount: 0,
      verifiedSeller: true,
      createdAt: new Date().toISOString(),
      reviews: []
    };
    products.push(newProduct);
    this.setStoredData(PRODUCTS_KEY, products);
  }

  static deleteProduct(id: string): void {
    const products = this.getProducts();
    this.setStoredData(PRODUCTS_KEY, products.filter(p => p.id !== id));
  }

  static toggleProductStatus(id: string): void {
    const products = this.getProducts() as (Product & { status?: 'published' | 'draft' })[];
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index].status = products[index].status === 'draft' ? 'published' : 'draft';
      this.setStoredData(PRODUCTS_KEY, products);
    }
  }

  // --- Finance ---
  // Fix: Added getPendingTransactions method for the AdminDashboard view
  static getPendingTransactions(): Transaction[] {
    const users = this.getAllUsers();
    const pending: Transaction[] = [];
    users.forEach(u => {
      u.transactions.forEach(tx => {
        if (tx.status === 'pending') pending.push(tx);
      });
    });
    return pending;
  }

  static createPendingDeposit(email: string, amountFcfa: number, tokens: number, method: string): Transaction {
    const user = this.getUserByEmail(email);
    if (!user) throw new Error("Utilisateur non trouvé");

    const tx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      reference: `LMN-DEP-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'deposit',
      amountTokens: tokens,
      amountFcfa: amountFcfa,
      method: method,
      date: new Date().toLocaleString('fr-FR'),
      status: 'pending',
      userEmail: email,
      userName: user.name
    };

    user.transactions.push(tx);
    this.updateProfile(user);
    return tx;
  }

  static validateDeposit(txId: string): void {
    const users = this.getAllUsers();
    users.forEach(u => {
      const tx = u.transactions.find(t => t.id === txId);
      if (tx && tx.status === 'pending') {
        tx.status = 'success';
        u.tokenBalance += tx.amountTokens;
        u.activityHistory.push({ id: Date.now().toString(), type: 'system', label: `Dépôt de ${tx.amountTokens} LT validé`, date: 'Maintenant' });
      }
    });
    this.setStoredData(DB_KEY, users);
  }

  // Fix: Added rejectDeposit method for the AdminDashboard view
  static rejectDeposit(txId: string): void {
    const users = this.getAllUsers();
    users.forEach(u => {
      const tx = u.transactions.find(t => t.id === txId);
      if (tx && tx.status === 'pending') {
        tx.status = 'failed';
      }
    });
    this.setStoredData(DB_KEY, users);
  }

  static processCheckout(email: string, totalTokens: number, items: CartItem[]): void {
    const user = this.getUserByEmail(email);
    if (!user || user.tokenBalance < totalTokens) throw new Error("Solde insuffisant.");
    user.tokenBalance -= totalTokens;
    user.activityHistory.push({ id: Date.now().toString(), type: 'purchase', label: `Achat Marketplace (-${totalTokens} LT)`, date: 'Maintenant' });
    this.updateProfile(user);
  }
}
