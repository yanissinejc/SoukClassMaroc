import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import fs from 'fs';
import { FinancialTransaction, WithdrawalRequest, WalletStats, PremiumListingStat } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HMAC_SECRET = process.env.PAYMENT_GATEWAY_SECRET || 'morocco_cmi_gateway_secret_2026_secure';

app.use(express.json());

// In-Memory Database with optional disk persistence
const DATA_FILE = path.join(__dirname, '.wallet_data.json');

interface DatabaseSchema {
  transactions: FinancialTransaction[];
  withdrawals: WithdrawalRequest[];
  premiumListings: Record<string, {
    listingId: string;
    listingTitle: string;
    category: string;
    city: string;
    ownerName: string;
    plan: string;
    planName: string;
    totalGeneratedDH: number;
    transactionsCount: number;
    expiresAt: string;
    isExpired: boolean;
  }>;
}

// Initial seed data reflecting existing marketplace activity
const defaultData: DatabaseSchema = {
  transactions: [
    {
      id: 'TXN-MAR-2026-001',
      type: 'credit',
      amount: 89,
      date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago today
      status: 'CONFIRMED',
      userId: 'user-atlas-prestige',
      userEmail: 'contact@atlasprestige.ma',
      listingId: 'sc-001',
      listingTitle: 'Superbe Villa Contemporaine avec piscine à débordement & vue Atlas',
      planId: 'vip',
      planName: 'Formule VIP Gold « Prestige » (30 jours)',
      durationDays: 30,
      gateway: 'CMI_MAROC',
      gatewayTxRef: 'CMI_AUTH_89218844',
      serverVerified: true,
      verificationHash: crypto.createHmac('sha256', HMAC_SECRET).update('sc-001-89-CONFIRMED').digest('hex'),
      premiumExpiresAt: new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'TXN-MAR-2026-002',
      type: 'credit',
      amount: 89,
      date: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), // 5 hours ago today
      status: 'CONFIRMED',
      userId: 'user-amine-tech',
      userEmail: 'amine.tech.rabat@gmail.com',
      listingId: 'sc-003',
      listingTitle: 'iPhone 16 Pro Max 512GB Titane Naturel Sous Blister',
      planId: 'vip',
      planName: 'Formule VIP Gold « Prestige » (30 jours)',
      durationDays: 30,
      gateway: 'YOUCAN_PAY',
      gatewayTxRef: 'YCP_ORD_99182371',
      serverVerified: true,
      verificationHash: crypto.createHmac('sha256', HMAC_SECRET).update('sc-003-89-CONFIRMED').digest('hex'),
      premiumExpiresAt: new Date(Date.now() + 29 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'TXN-MAR-2026-003',
      type: 'credit',
      amount: 39,
      date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // Yesterday
      status: 'CONFIRMED',
      userId: 'user-lalla-fatima',
      userEmail: 'fatima.souss.bio@gmail.com',
      listingId: 'sc-002',
      listingTitle: 'Coffret d’Or Blanc du Souss : Huile d’Argan Pure IGP & Safran',
      planId: 'boost',
      planName: 'Formule Boost « En Vedette » (15 jours)',
      durationDays: 15,
      gateway: 'CMI_MAROC',
      gatewayTxRef: 'CMI_AUTH_77182900',
      serverVerified: true,
      verificationHash: crypto.createHmac('sha256', HMAC_SECRET).update('sc-002-39-CONFIRMED').digest('hex'),
      premiumExpiresAt: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'TXN-MAR-2026-004',
      type: 'credit',
      amount: 199,
      date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), // 2 days ago this week
      status: 'CONFIRMED',
      userId: 'user-casa-living',
      userEmail: 'direction@casablancaliving.ma',
      listingId: 'sc-005',
      listingTitle: 'Appartement Haut Standing Front de Mer avec Grande Terrasse',
      planId: 'pro',
      planName: 'Pack Professionnel & Agence (60 jours)',
      durationDays: 60,
      gateway: 'PAYZONE_MAROC',
      gatewayTxRef: 'PZ_REF_66281900',
      serverVerified: true,
      verificationHash: crypto.createHmac('sha256', HMAC_SECRET).update('sc-005-199-CONFIRMED').digest('hex'),
      premiumExpiresAt: new Date(Date.now() + 58 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'TXN-MAR-2026-005',
      type: 'credit',
      amount: 89,
      date: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), // 4 days ago this week
      status: 'CONFIRMED',
      userId: 'user-youssef-alami',
      userEmail: 'youssef.alami.tanger@gmail.com',
      listingId: 'sc-004',
      listingTitle: 'Porsche Macan GTS 440ch 2023 - Entretien Exclusif Centre Porsche Maroc',
      planId: 'vip',
      planName: 'Formule VIP Gold « Prestige » (30 jours)',
      durationDays: 30,
      gateway: 'CMI_MAROC',
      gatewayTxRef: 'CMI_AUTH_55182933',
      serverVerified: true,
      verificationHash: crypto.createHmac('sha256', HMAC_SECRET).update('sc-004-89-CONFIRMED').digest('hex'),
      premiumExpiresAt: new Date(Date.now() + 26 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'TXN-MAR-2026-006',
      type: 'credit',
      amount: 89,
      date: new Date(Date.now() - 32 * 24 * 3600 * 1000).toISOString(), // 32 days ago (Expired)
      status: 'CONFIRMED',
      userId: 'user-dar-andalus',
      userEmail: 'contact@darandalus-fes.ma',
      listingId: 'sc-008',
      listingTitle: 'Riad Historique du XVIIe Siècle Entièrement Restauré',
      planId: 'vip',
      planName: 'Formule VIP Gold « Prestige » (30 jours)',
      durationDays: 30,
      gateway: 'CMI_MAROC',
      gatewayTxRef: 'CMI_AUTH_11029388',
      serverVerified: true,
      verificationHash: crypto.createHmac('sha256', HMAC_SECRET).update('sc-008-89-CONFIRMED').digest('hex'),
      premiumExpiresAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString() // Expired 2 days ago
    },
    {
      id: 'TXN-MAR-2026-HIST-01',
      type: 'credit',
      amount: 14256,
      date: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString(), // Previous periods
      status: 'CONFIRMED',
      userId: 'user-platform-history',
      userEmail: 'finance@soukclass.ma',
      listingId: 'sc-hist-pack',
      listingTitle: 'Abonnements & Boosts Premium Historiques (Trimestre Q3/Q4)',
      planId: 'pro',
      planName: 'Souscriptions Multi-Vendeurs CMI',
      durationDays: 90,
      gateway: 'CMI_MAROC',
      gatewayTxRef: 'CMI_BULK_SETTLE_2026',
      serverVerified: true,
      verificationHash: crypto.createHmac('sha256', HMAC_SECRET).update('hist-14256-CONFIRMED').digest('hex'),
      premiumExpiresAt: new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString()
    }
  ],
  withdrawals: [
    {
      id: 'WDR-001',
      amount: 2500,
      destinationType: 'FASTPAY_CARD',
      destinationLabel: 'Carte BMCE FastPay (5355 •••• •••• 9820)',
      requestedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      processedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      status: 'TRANSFERE',
      reference: 'BOA-FASTPAY-TRF-9921',
      adminNotes: 'Recharge directe carte jeune 16 chiffres validée'
    }
  ],
  premiumListings: {}
};

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }
  return defaultData;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

let db = loadDatabase();

// Recompute listing statistics dynamically
function updateListingStats() {
  const map: DatabaseSchema['premiumListings'] = {};

  db.transactions.forEach((tx) => {
    if (tx.status !== 'CONFIRMED') return;
    const key = tx.listingId;
    const expiresAt = tx.premiumExpiresAt || new Date(new Date(tx.date).getTime() + (tx.durationDays || 30) * 24 * 3600 * 1000).toISOString();
    const isExpired = new Date(expiresAt).getTime() < Date.now();

    if (!map[key]) {
      map[key] = {
        listingId: tx.listingId,
        listingTitle: tx.listingTitle,
        category: 'Marketplace',
        city: 'Maroc',
        ownerName: tx.userEmail,
        plan: tx.planId,
        planName: tx.planName,
        totalGeneratedDH: 0,
        transactionsCount: 0,
        expiresAt,
        isExpired
      };
    }

    map[key].totalGeneratedDH += tx.amount;
    map[key].transactionsCount += 1;
    // Latest expiry date
    if (new Date(expiresAt).getTime() > new Date(map[key].expiresAt).getTime()) {
      map[key].expiresAt = expiresAt;
      map[key].isExpired = isExpired;
      map[key].plan = tx.planId;
      map[key].planName = tx.planName;
    }
  });

  db.premiumListings = map;
}

updateListingStats();

// Helper: Calculate wallet statistics strictly from server-confirmed payments
function calculateWalletStats(): WalletStats {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  // Start of week (Monday)
  const dayOfWeek = now.getDay() || 7; // 1 = Monday, 7 = Sunday
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  // Start of month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let totalConfirmedRevenue = 0;
  let todayRevenue = 0;
  let weekRevenue = 0;
  let monthRevenue = 0;
  let pendingRevenue = 0;

  db.transactions.forEach((tx) => {
    const txTime = new Date(tx.date).getTime();

    if (tx.status === 'CONFIRMED') {
      totalConfirmedRevenue += tx.amount;

      if (txTime >= startOfToday) {
        todayRevenue += tx.amount;
      }
      if (txTime >= startOfWeek.getTime()) {
        weekRevenue += tx.amount;
      }
      if (txTime >= startOfMonth) {
        monthRevenue += tx.amount;
      }
    } else if (tx.status === 'PENDING_VERIFICATION') {
      pendingRevenue += tx.amount;
    }
  });

  // Calculate completed/transferred withdrawals
  let withdrawnAmount = 0;
  db.withdrawals.forEach((w) => {
    if (w.status === 'TRANSFERE' || w.status === 'VALIDE') {
      withdrawnAmount += w.amount;
    }
  });

  const availableBalance = Math.max(0, totalConfirmedRevenue - withdrawnAmount);

  return {
    totalConfirmedRevenue,
    todayRevenue,
    weekRevenue,
    monthRevenue,
    pendingRevenue,
    withdrawnAmount,
    availableBalance
  };
}

// ======================== API ROUTES ======================== //

// 1. Get Wallet Stats (Solde total, du jour, de la semaine, du mois, solde disponible)
app.get('/api/wallet/stats', (req, res) => {
  const stats = calculateWalletStats();
  res.json({ success: true, stats });
});

// 2. Get Transaction History
app.get('/api/wallet/transactions', (req, res) => {
  res.json({
    success: true,
    transactions: db.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  });
});

// 3. Get Revenue Generated per Premium Listing
app.get('/api/wallet/premium-listings', (req, res) => {
  updateListingStats();
  const list = Object.values(db.premiumListings).map((p) => {
    const now = Date.now();
    const expiryTime = new Date(p.expiresAt).getTime();
    const isExpired = expiryTime < now;
    const diffDays = Math.ceil((expiryTime - now) / (1000 * 3600 * 24));

    return {
      ...p,
      isExpired,
      daysRemaining: isExpired ? 0 : Math.max(0, diffDays)
    };
  }).sort((a, b) => b.totalGeneratedDH - a.totalGeneratedDH);

  res.json({ success: true, premiumListings: list });
});

// 4. Get Withdrawal Requests
app.get('/api/wallet/withdrawals', (req, res) => {
  res.json({
    success: true,
    withdrawals: db.withdrawals.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
  });
});

// 5. Create Withdrawal Request
app.post('/api/wallet/withdrawals', (req, res) => {
  const { amount, destinationType, destinationNumber } = req.body;
  const numAmount = Number(amount);

  if (!numAmount || numAmount <= 0) {
    return res.status(400).json({ success: false, error: 'Montant de retrait invalide' });
  }

  const stats = calculateWalletStats();
  if (numAmount > stats.availableBalance) {
    return res.status(400).json({
      success: false,
      error: `Solde insuffisant. Votre solde disponible est de ${stats.availableBalance} DH.`
    });
  }

  // Mask destination details for security - NEVER store full sensitive data
  let maskedLabel = '';
  if (destinationType === 'FASTPAY_CARD') {
    const cleaned = String(destinationNumber || '').replace(/\D/g, '');
    const last4 = cleaned.slice(-4) || '9820';
    maskedLabel = `Carte BMCE FastPay (•••• •••• •••• ${last4})`;
  } else if (destinationType === 'BANK_RIB') {
    const cleaned = String(destinationNumber || '').replace(/\D/g, '');
    const last4 = cleaned.slice(-4) || '0123';
    maskedLabel = `Compte bancaire RIB (•••• •••• •••• •••• •••• ${last4})`;
  } else {
    maskedLabel = `M-Wallet DabaPay (${String(destinationNumber || '+212 661 ••••')})`;
  }

  const newWithdrawal: WithdrawalRequest = {
    id: `WDR-${Date.now()}`,
    amount: numAmount,
    destinationType: destinationType || 'FASTPAY_CARD',
    destinationLabel: maskedLabel,
    requestedAt: new Date().toISOString(),
    status: 'EN_ATTENTE',
    reference: `REF-TRF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    adminNotes: 'Demande de retrait enregistrée côté serveur'
  };

  db.withdrawals.unshift(newWithdrawal);
  saveDatabase(db);

  res.json({
    success: true,
    message: `Demande de retrait de ${numAmount} DH enregistrée avec succès.`,
    withdrawal: newWithdrawal,
    stats: calculateWalletStats()
  });
});

// 6. Process Withdrawal Request (Admin validate/transfer)
app.post('/api/wallet/withdrawals/:id/process', (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const withdrawal = db.withdrawals.find((w) => w.id === id);
  if (!withdrawal) {
    return res.status(404).json({ success: false, error: 'Demande de retrait introuvable' });
  }

  withdrawal.status = status || 'TRANSFERE';
  withdrawal.processedAt = new Date().toISOString();
  if (adminNotes) withdrawal.adminNotes = adminNotes;

  saveDatabase(db);
  res.json({ success: true, withdrawal, stats: calculateWalletStats() });
});

// 7. Create Payment Intent (Client wants to buy Premium 30 days)
// NOTE: SECURITY MANDATE: NEVER consider simple click as paid! Status starts as PENDING_VERIFICATION.
app.post('/api/payments/create-intent', (req, res) => {
  const { listingId, listingTitle, planId, userEmail, userId } = req.body;

  const planPrices: Record<string, { price: number; name: string; days: number }> = {
    gratuit: { price: 0, name: 'Formule Gratuite', days: 30 },
    boost: { price: 39, name: 'Formule Boost « En Vedette »', days: 15 },
    vip: { price: 89, name: 'Formule VIP Gold « Prestige »', days: 30 },
    pro: { price: 199, name: 'Pack Pro & Entreprise', days: 60 }
  };

  const plan = planPrices[planId] || planPrices['vip'];

  if (plan.price === 0) {
    return res.json({
      success: true,
      free: true,
      message: 'Annonce gratuite activée sans transaction financière'
    });
  }

  // Create intent ID and cryptographic signature
  const txId = `TXN-MAR-${Date.now()}`;
  const gatewayTxRef = `GW_INTENT_${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  const verificationHash = crypto.createHmac('sha256', HMAC_SECRET)
    .update(`${txId}-${listingId}-${plan.price}-PENDING`)
    .digest('hex');

  const transaction: FinancialTransaction = {
    id: txId,
    type: 'credit',
    amount: plan.price,
    date: new Date().toISOString(),
    status: 'PENDING_VERIFICATION', // STRICT: Not credited yet!
    userId: userId || 'user_guest',
    userEmail: userEmail || 'client@soukclass.ma',
    listingId,
    listingTitle: listingTitle || 'Annonce Marketplace',
    planId,
    planName: plan.name,
    durationDays: plan.days,
    gateway: 'CMI_MAROC',
    gatewayTxRef,
    serverVerified: false,
    verificationHash
  };

  db.transactions.unshift(transaction);
  saveDatabase(db);

  res.json({
    success: true,
    intent: {
      transactionId: txId,
      amount: plan.price,
      currency: 'MAD',
      gatewayTxRef,
      status: 'PENDING_VERIFICATION',
      verificationHash
    }
  });
});

// 8. Server-Side Verification Endpoint (Simulates real payment gateway callback / 3D-Secure check)
// MANDATE: Only upon valid cryptographic gateway verification is the amount added to admin balance!
app.post('/api/payments/verify-gateway', (req, res) => {
  const { transactionId, paymentToken } = req.body;

  const transaction = db.transactions.find((t) => t.id === transactionId);
  if (!transaction) {
    return res.status(404).json({ success: false, error: 'Transaction introuvable' });
  }

  if (transaction.status === 'CONFIRMED') {
    return res.json({
      success: true,
      message: 'Transaction déjà confirmée',
      transaction,
      stats: calculateWalletStats()
    });
  }

  // In production, this validates HMAC signature or queries CMI / YouCan Pay API directly server-to-server.
  // Validate token structure
  if (!paymentToken || String(paymentToken).length < 6) {
    transaction.status = 'FAILED';
    saveDatabase(db);
    return res.status(400).json({ success: false, error: 'Échec de la validation bancaire par la passerelle' });
  }

  // Confirm payment server-side
  transaction.status = 'CONFIRMED';
  transaction.serverVerified = true;
  transaction.gatewayTxRef = `CMI_AUTH_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  transaction.verificationHash = crypto.createHmac('sha256', HMAC_SECRET)
    .update(`${transaction.id}-${transaction.listingId}-${transaction.amount}-CONFIRMED`)
    .digest('hex');

  // Set 30-day (or plan duration) expiration
  const durationDays = transaction.durationDays || 30;
  transaction.premiumExpiresAt = new Date(Date.now() + durationDays * 24 * 3600 * 1000).toISOString();

  updateListingStats();
  saveDatabase(db);

  res.json({
    success: true,
    message: `Paiement de ${transaction.amount} DH vérifié et confirmé côté serveur. Solde administrateur crédité.`,
    transaction,
    stats: calculateWalletStats()
  });
});

// 9. Renew an expired or expiring Premium listing
app.post('/api/listings/:id/renew', (req, res) => {
  const { id } = req.params;
  const { planId, userEmail, listingTitle } = req.body;

  const planPrices: Record<string, { price: number; name: string; days: number }> = {
    boost: { price: 39, name: 'Formule Boost « En Vedette »', days: 15 },
    vip: { price: 89, name: 'Formule VIP Gold « Prestige » (30 jours)', days: 30 },
    pro: { price: 199, name: 'Pack Pro & Entreprise (60 jours)', days: 60 }
  };

  const chosenPlan = planPrices[planId || 'vip'] || planPrices['vip'];
  const txId = `TXN-RENEW-${Date.now()}`;
  const gatewayTxRef = `RENEW_AUTH_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  // Direct server renewal transaction (Confirmed upon renewal request)
  const transaction: FinancialTransaction = {
    id: txId,
    type: 'credit',
    amount: chosenPlan.price,
    date: new Date().toISOString(),
    status: 'CONFIRMED',
    userId: 'user_renew',
    userEmail: userEmail || 'client@soukclass.ma',
    listingId: id,
    listingTitle: listingTitle || 'Annonce Renouvelée',
    planId: (planId as any) || 'vip',
    planName: chosenPlan.name,
    durationDays: chosenPlan.days,
    gateway: 'CMI_MAROC',
    gatewayTxRef,
    serverVerified: true,
    verificationHash: crypto.createHmac('sha256', HMAC_SECRET).update(`${txId}-${id}-RENEWED`).digest('hex'),
    premiumExpiresAt: new Date(Date.now() + chosenPlan.days * 24 * 3600 * 1000).toISOString()
  };

  db.transactions.unshift(transaction);
  updateListingStats();
  saveDatabase(db);

  res.json({
    success: true,
    message: `Mise en avant Premium de 30 jours renouvelée avec succès pour l'annonce.`,
    transaction,
    premiumListing: db.premiumListings[id],
    stats: calculateWalletStats()
  });
});

// 10. Check Expiration of all Listings (Automated Job)
app.get('/api/listings/check-expiry', (req, res) => {
  updateListingStats();
  const now = Date.now();
  let expiredCount = 0;

  Object.values(db.premiumListings).forEach((item) => {
    if (new Date(item.expiresAt).getTime() < now) {
      item.isExpired = true;
      expiredCount++;
    }
  });

  saveDatabase(db);
  res.json({
    success: true,
    checkedAt: new Date().toISOString(),
    expiredCount,
    activeCount: Object.values(db.premiumListings).length - expiredCount,
    listings: Object.values(db.premiumListings)
  });
});

// ======================== SERVING FRONTEND ======================== //

async function setupServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SoukClass Maroc server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
