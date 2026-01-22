
export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  stock: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Transaction {
  id: string; // ID interne système
  reference: string; // Référence publique (ex: TGMP-123456)
  type: 'deposit' | 'payment' | 'withdrawal' | 'workflow_purchase' | 'admin_revenue';
  amountTokens: number;
  amountFcfa: number;
  method: string;
  date: string;
  status: 'success' | 'failed' | 'pending';
  from?: string;
  userEmail: string;
  userName: string;
}

export interface WorkflowConfig {
  isActive: boolean;
  autoAcceptOrders: boolean;
  aiNegotiation: boolean;
  maxDiscountPercent: number;
  absenteeMessage: string;
  whatsappAlerts: boolean;
  minStockThreshold: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  coverImage?: string;
  bio?: string;
  address: string;
  joinedDate: string;
  loyaltyPoints: number;
  tokenBalance: number; 
  transactions: Transaction[]; 
  preferredPayment: 'TMoney' | 'Flooz' | 'Cash' | 'Card';
  followersCount?: number;
  reputationScore: number;
  activityHistory: { id: string; type: 'purchase' | 'review' | 'post' | 'login' | 'system'; label: string; date: string }[];
  workflowConfig?: WorkflowConfig;
}

export type SellingType = 'retail' | 'wholesale';
export type PaymentMethod = 'TMoney' | 'Flooz' | 'Card';

export interface SiteRule {
  id: string;
  key: string;
  title: string;
  description: string;
  value: string | number;
  type: 'percent' | 'amount' | 'toggle' | 'text';
  category: 'finance' | 'safety' | 'workflow';
  lastUpdated: string;
}

export interface SecurityLog {
  id: string;
  adminName: string;
  action: string;
  timestamp: string;
  level: 'low' | 'medium' | 'critical';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; 
  category: string;
  image: string;
  sellerId: string;
  sellerName: string;
  rating: number;
  reviewsCount: number;
  verifiedSeller: boolean;
  isSponsored?: boolean;
  stock: number;
  discount?: number;
  createdAt: string; 
  variants?: ProductVariant[];
  reviews?: Review[];
  sellingType: SellingType;
  minOrderQuantity?: number;
}

export interface Seller {
  id: string;
  name: string;
  logo: string;
  rating: number;
  joinedDate: string;
  isVerified: boolean;
  totalSales: number;
  category: string;
  verificationId?: string;
  verificationReason?: string;
  reviews: Review[];
  isBanned?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  participants: { id: string; name: string; avatar: string; role: UserRole }[];
  messages: ChatMessage[];
  lastUpdate: string;
  relatedProductId?: string; 
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderStatusUpdate {
  status: string;
  timestamp: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  tokenTotal: number; 
  commissionLumina: number; 
  netVendeur: number; 
  status: 'en_attente' | 'paye' | 'preparation' | 'expedie' | 'livre' | 'annule';
  paymentMethod: PaymentMethod;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  statusHistory: OrderStatusUpdate[];
  isReviewed?: boolean;
}

export enum AppView {
  STORE = 'STORE',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  SELLER_DASHBOARD = 'SELLER_DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  VIRTUAL_CABIN = 'VIRTUAL_CABIN',
  CART = 'CART',
  WISHLIST = 'WISHLIST',
  CONTACT = 'CONTACT',
  ORDER_DETAILS = 'ORDER_DETAILS',
  MESSAGES = 'MESSAGES',
  PROFILE = 'PROFILE',
  SUCCESS = 'SUCCESS'
}

export type Theme = 'light' | 'dark';
export type UserRole = 'buyer' | 'seller' | 'admin';
export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating';
