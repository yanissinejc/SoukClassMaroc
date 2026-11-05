export type CategoryId = 'immobilier' | 'objets-quotidien' | 'nourriture' | 'autres';

export interface SubCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  iconName: string;
  badgeColor: string;
  subcategories: SubCategory[];
  featuredImage: string;
}

export interface Sector {
  name: string;
  popular?: boolean;
}

export interface MoroccanCity {
  id: string;
  name: string;
  region: string;
  sectors: string[];
}

export type ListingPlanId = 'gratuit' | 'boost' | 'vip' | 'pro';

export interface PricingPlan {
  id: ListingPlanId;
  name: string;
  price: number; // in Dirhams (DH)
  durationDays: number;
  badgeText: string;
  badgeClass: string;
  popular?: boolean;
  features: string[];
  description: string;
  highlightColor: string;
  multiplierText: string;
}

export interface Seller {
  id: string;
  name: string;
  type: 'particulier' | 'professionnel';
  phone: string;
  whatsapp: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  memberSince: string;
  city: string;
  verified: boolean;
  badge?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number; // in Dirhams
  priceNegotiable: boolean;
  category: CategoryId;
  subcategory: string;
  condition: 'Neuf' | 'Comme neuf' | 'Très bon état' | 'Bon état' | 'Pour pièces';
  city: string;
  sector: string;
  images: string[];
  plan: ListingPlanId;
  createdAt: string; // ISO date or relative
  viewsCount: number;
  likesCount: number;
  seller: Seller;
  featured?: boolean;
  premiumExpiresAt?: string; // ISO date of 30-day expiration
  isPremiumExpired?: boolean;
  totalRevenueGenerated?: number;
  attributes?: Record<string, string | number>;
}

export interface FilterState {
  searchQuery: string;
  category: CategoryId | 'all';
  subcategory: string;
  city: string;
  sector: string;
  minPrice: number | '';
  maxPrice: number | '';
  condition: string;
  plan: ListingPlanId | 'all';
  sortBy: 'recent' | 'price-asc' | 'price-desc' | 'popular';
}

export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  listingPrice: number;
  sellerName: string;
  sellerAvatar: string;
  messages: MessageItem[];
}

export type PaymentStatus = 'PENDING_VERIFICATION' | 'CONFIRMED' | 'FAILED' | 'REFUNDED';
export type PaymentGateway = 'CMI_MAROC' | 'YOUCAN_PAY' | 'PAYZONE_MAROC' | 'TEST_SIMULATOR';

export interface FinancialTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number; // in Dirhams (DH)
  date: string; // ISO date
  status: PaymentStatus;
  userId: string;
  userEmail: string;
  listingId: string;
  listingTitle: string;
  planId: ListingPlanId;
  planName: string;
  durationDays: number;
  gateway: PaymentGateway;
  gatewayTxRef: string;
  serverVerified: boolean;
  verificationHash: string;
  premiumExpiresAt?: string;
}

export type WithdrawalStatus = 'EN_ATTENTE' | 'VALIDE' | 'TRANSFERE' | 'REJETE';
export type WithdrawalDestinationType = 'PRESTATAIRE_DIRECT' | 'BANK_RIB';

export interface WithdrawalRequest {
  id: string;
  amount: number; // in Dirhams (DH)
  destinationType: WithdrawalDestinationType;
  providerFirstName?: string; // Prénom du prestataire de paiement (ex: Yassine)
  destinationLabel: string; // Ex: "Virement direct prestataire : Yassine (Compte •••• 9820)"
  requestedAt: string;
  processedAt?: string;
  status: WithdrawalStatus;
  reference: string;
  adminNotes?: string;
}

export interface WalletStats {
  totalConfirmedRevenue: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  pendingRevenue: number;
  withdrawnAmount: number;
  availableBalance: number;
}

export interface PremiumListingStat {
  listingId: string;
  listingTitle: string;
  category: CategoryId;
  city: string;
  ownerName: string;
  plan: ListingPlanId;
  planName: string;
  totalGeneratedDH: number;
  transactionsCount: number;
  expiresAt: string;
  isExpired: boolean;
  daysRemaining: number;
}

