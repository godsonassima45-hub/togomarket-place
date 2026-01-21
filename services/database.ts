
import { UserProfile, Transaction, WorkflowConfig, CartItem } from '../types';

const DB_KEY = 'TOGOMARKET_DB_VAULT';
const SESSION_KEY = 'TOGOMARKET_SESSION';
const SECRET_SALT = 'LUMINA_228_PRO';

export const MASTER_ADMIN_EMAIL = 'godsonassima45@gmail.com';
const MASTER_ADMIN_PASSWORD_RAW = 'GOST26dou';

export class DatabaseService {
  private static verificationCodes: Record<string, string> = {};

  private static encrypt(data: any): string {
    const str = JSON.stringify(data);
    return btoa(str + SECRET_SALT);
  }

  private static decrypt(vault: string): any {
    try {
      const decoded = atob(vault);
      return JSON.parse(decoded.replace(SECRET_SALT, ''));
    } catch (e) {
      return null;
    }
  }

  private static getVault(): Record<string, UserProfile & { passwordHash: string }> {
    const data = localStorage.getItem(DB_KEY);
    let vault = data ? this.decrypt(data) : {};
    
    const normalizedMaster = MASTER_ADMIN_EMAIL.toLowerCase().trim();
    if (!vault[normalizedMaster]) {
      const adminUser: UserProfile & { passwordHash: string } = {
        id: 'u-master-godson',
        name: 'Godson Assima',
        email: normalizedMaster,
        phone: '+228 79 24 54 09',
        avatar: '',
        role: 'admin',
        address: 'Lomé, Togo',
        joinedDate: '01/01/2024',
        loyaltyPoints: 9999,
        tokenBalance: 10000,
        transactions: [],
        preferredPayment: 'Card',
        reputationScore: 100,
        activityHistory: [{ id: '0', type: 'system', label: 'Propriétaire Système Connecté', date: 'Initial' }],
        passwordHash: btoa(MASTER_ADMIN_PASSWORD_RAW + SECRET_SALT),
        workflowConfig: { isActive: true, autoAcceptOrders: true, aiNegotiation: true, maxDiscountPercent: 10, absenteeMessage: 'Admin Mode Active', whatsappAlerts: true, minStockThreshold: 1 }
      };
      vault[normalizedMaster] = adminUser;
      this.saveVault(vault);
    }
    return vault;
  }

  private static saveVault(vault: Record<string, UserProfile & { passwordHash: string }>) {
    localStorage.setItem(DB_KEY, this.encrypt(vault));
  }

  static login(email: string): UserProfile {
    const vault = this.getVault();
    const normalizedEmail = email.toLowerCase().trim();
    const userEntry = vault[normalizedEmail];
    localStorage.setItem(SESSION_KEY, normalizedEmail);
    const { passwordHash, ...profile } = userEntry;
    return profile as UserProfile;
  }

  static register(name: string, email: string, passwordRaw: string, role: 'buyer' | 'seller'): UserProfile {
    const vault = this.getVault();
    const normalizedEmail = email.toLowerCase().trim();
    const newUser: UserProfile & { passwordHash: string } = {
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      name, email: normalizedEmail, phone: '', avatar: '', role, address: 'Lomé, Togo', joinedDate: new Date().toLocaleDateString('fr-FR'),
      loyaltyPoints: 0, tokenBalance: 0, transactions: [], preferredPayment: 'TMoney', reputationScore: 100,
      activityHistory: [{ id: `act-${Date.now()}`, type: 'system', label: 'Bienvenue sur TogoMarket !', date: 'Initial' }],
      passwordHash: btoa(passwordRaw + SECRET_SALT),
      workflowConfig: { isActive: false, autoAcceptOrders: false, aiNegotiation: false, maxDiscountPercent: 5, absenteeMessage: '', whatsappAlerts: false, minStockThreshold: 1 }
    };
    vault[normalizedEmail] = newUser;
    this.saveVault(vault);
    return this.login(normalizedEmail);
  }

  static getCurrentSession(): UserProfile | null {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    const vault = this.getVault();
    const userEntry = vault[email];
    if (!userEntry) return null;
    const { passwordHash, ...profile } = userEntry;
    return profile as UserProfile;
  }

  static logout() { localStorage.removeItem(SESSION_KEY); }

  // --- WORKFLOW PREMIUM ENGINE (Gratuit pour le Propriétaire) ---
  static purchasePremiumWorkflow(userEmail: string): void {
    const vault = this.getVault();
    const email = userEmail.toLowerCase().trim();
    const user = vault[email];
    if (!user) throw new Error("Utilisateur introuvable.");

    const isOwner = email === MASTER_ADMIN_EMAIL.toLowerCase();
    const COST_TOKENS = isOwner ? 0 : 13;

    if (!isOwner && user.tokenBalance < COST_TOKENS) {
      throw new Error(`Solde insuffisant. Le Workflow Premium nécessite ${COST_TOKENS} jetons (6 500 XOF).`);
    }

    user.tokenBalance -= COST_TOKENS;
    
    if (!user.workflowConfig) {
      user.workflowConfig = { isActive: true, autoAcceptOrders: false, aiNegotiation: false, maxDiscountPercent: 5, absenteeMessage: '', whatsappAlerts: false, minStockThreshold: 1 };
    } else {
      user.workflowConfig.isActive = true;
    }

    const tx: Transaction = {
      id: `tx-wf-${Math.random().toString(36).substr(2, 9)}`,
      reference: isOwner ? `ADMIN-FREE-WF` : `LMN-WF-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'workflow_purchase',
      amountTokens: COST_TOKENS,
      amountFcfa: isOwner ? 0 : 6500,
      method: isOwner ? 'Admin Privilege' : 'Lumina Wallet',
      date: new Date().toLocaleString('fr-FR'),
      status: 'success',
      userEmail: user.email,
      userName: user.name
    };

    user.transactions = [tx, ...user.transactions];
    user.activityHistory.push({
      id: `act-${Date.now()}`,
      type: 'system',
      label: isOwner ? "Privilège Maître : Workflow Débloqué" : `Achat Workflow Premium : -13 LT`,
      date: new Date().toLocaleDateString('fr-FR')
    });

    this.saveVault(vault);
  }

  // --- SELLER CERTIFICATION (Gratuit pour le Propriétaire) ---
  static certifySeller(userEmail: string): void {
    const vault = this.getVault();
    const email = userEmail.toLowerCase().trim();
    const user = vault[email];
    if (!user) throw new Error("Utilisateur introuvable.");

    const isOwner = email === MASTER_ADMIN_EMAIL.toLowerCase();
    const COST_TOKENS = isOwner ? 0 : 9;

    if (!isOwner && user.tokenBalance < COST_TOKENS) {
      throw new Error(`Solde insuffisant. La certification nécessite ${COST_TOKENS} jetons.`);
    }

    user.tokenBalance -= COST_TOKENS;
    
    const tx: Transaction = {
      id: `tx-cert-${Math.random().toString(36).substr(2, 9)}`,
      reference: isOwner ? `ADMIN-FREE-CERT` : `LMN-CERT-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'payment',
      amountTokens: COST_TOKENS,
      amountFcfa: isOwner ? 0 : COST_TOKENS * 500,
      method: isOwner ? 'Admin Privilege' : 'Lumina Wallet',
      date: new Date().toLocaleString('fr-FR'),
      status: 'success',
      userEmail: user.email,
      userName: user.name
    };

    user.transactions = [tx, ...user.transactions];
    user.activityHistory.push({
      id: `act-${Date.now()}`,
      type: 'system',
      label: isOwner ? "Privilège Maître : Certification Accordée" : 'Profil Vendeur Vérifié Lumina',
      date: new Date().toLocaleDateString('fr-FR')
    });

    this.saveVault(vault);
  }

  static createPendingDeposit(userEmail: string, amountXof: number, tokens: number, method: string): Transaction {
    const vault = this.getVault();
    const user = vault[userEmail.toLowerCase()];
    const tx: Transaction = {
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      reference: `LMN-${Math.floor(1000 + Math.random() * 9000)}-DP`,
      type: 'deposit',
      amountTokens: tokens,
      amountFcfa: amountXof,
      method: method,
      date: new Date().toLocaleString('fr-FR'),
      status: 'pending',
      userEmail: user.email,
      userName: user.name
    };
    user.transactions = [tx, ...user.transactions];
    this.saveVault(vault);
    return tx;
  }

  static validateDeposit(transactionId: string): void {
    const vault = this.getVault();
    for (const email in vault) {
      const user = vault[email];
      const tx = user.transactions.find(t => t.id === transactionId);
      if (tx && tx.status === 'pending') {
        tx.status = 'success';
        user.tokenBalance += tx.amountTokens;
        user.activityHistory.push({ id: `act-${Date.now()}`, type: 'system', label: `Dépôt validé : +${tx.amountTokens} LT`, date: 'Maintenant' });
        this.saveVault(vault);
        return;
      }
    }
  }

  static rejectDeposit(transactionId: string): void {
    const vault = this.getVault();
    for (const email in vault) {
      const user = vault[email];
      const tx = user.transactions.find(t => t.id === transactionId);
      if (tx && tx.status === 'pending') {
        tx.status = 'failed';
        this.saveVault(vault);
        return;
      }
    }
  }

  static processCheckout(userEmail: string, totalTokens: number, items: CartItem[]): void {
    const vault = this.getVault();
    const buyer = vault[userEmail.toLowerCase()];
    if (!buyer || buyer.tokenBalance < totalTokens) throw new Error("Solde insuffisant.");

    buyer.tokenBalance -= totalTokens;
    const txPay: Transaction = {
      id: `pay-${Math.random().toString(36).substr(2, 9)}`,
      reference: `LMN-${Math.floor(1000 + Math.random() * 9000)}-PUR`,
      type: 'payment',
      amountTokens: totalTokens,
      amountFcfa: totalTokens * 500,
      method: 'Lumina Wallet',
      date: new Date().toLocaleString('fr-FR'),
      status: 'success',
      userEmail: buyer.email,
      userName: buyer.name
    };
    buyer.transactions = [txPay, ...buyer.transactions];

    const commissionAmount = Math.ceil(totalTokens * 0.10);
    const admin = vault[MASTER_ADMIN_EMAIL.toLowerCase()];
    admin.tokenBalance += commissionAmount;
    admin.transactions = [{
      ...txPay, id: `com-${txPay.id}`, type: 'admin_revenue', amountTokens: commissionAmount, userName: 'Marketplace Commission'
    }, ...admin.transactions];

    this.saveVault(vault);
  }

  static getPendingTransactions(): Transaction[] {
    const vault = this.getVault();
    const pending: Transaction[] = [];
    for (const email in vault) {
      pending.push(...vault[email].transactions.filter(t => t.status === 'pending'));
    }
    return pending.sort((a, b) => b.date.localeCompare(a.date));
  }

  static getAllUsers(): UserProfile[] {
    return Object.values(this.getVault()).map(({ passwordHash, ...p }) => p as UserProfile);
  }

  static updateProfile(user: UserProfile) {
    const vault = this.getVault();
    const current = vault[user.email.toLowerCase()];
    if (current) {
      vault[user.email.toLowerCase()] = { ...user, passwordHash: current.passwordHash };
      this.saveVault(vault);
    }
  }

  static generateVerificationCode(email: string): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationCodes[email.toLowerCase().trim()] = code;
    return code;
  }

  static verifyCode(email: string, code: string): boolean {
    return this.verificationCodes[email.toLowerCase().trim()] === code;
  }

  static preLogin(email: string, passwordRaw: string): boolean {
    const vault = this.getVault();
    const user = vault[email.toLowerCase().trim()];
    if (!user) throw new Error("Compte inexistant.");
    if (user.passwordHash !== btoa(passwordRaw + SECRET_SALT)) throw new Error("Identifiants incorrects.");
    return email.toLowerCase() !== MASTER_ADMIN_EMAIL.toLowerCase();
  }

  static preRegister(name: string, email: string, passwordRaw: string) {
    const vault = this.getVault();
    if (vault[email.toLowerCase().trim()]) throw new Error("Email déjà utilisé.");
  }
}
