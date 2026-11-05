import React, { useState, useEffect } from 'react';
import {
  X, Lock, ShieldCheck, Wallet, ArrowDownRight, ArrowUpRight,
  CheckCircle2, AlertTriangle, CreditCard, Landmark, RefreshCw,
  LogOut, Send, Calendar, Clock, Sparkles, Building2, Eye,
  AlertCircle, ChevronRight, Check, History, Layers
} from 'lucide-react';
import {
  FinancialTransaction,
  WithdrawalRequest,
  WalletStats,
  PremiumListingStat,
  ListingPlanId
} from '../types';
import { walletService } from '../services/walletService';
import { formatPriceDH } from '../data/mockListings';

const ADMIN_AUTHORIZED_EMAIL = 'yslilimi2025@gmail.com';

interface AdminWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingUpdated?: () => void;
}

export const AdminWalletModal: React.FC<AdminWalletModalProps> = ({
  isOpen,
  onClose,
  onListingUpdated
}) => {
  // Authentication State
  const [currentEmail, setCurrentEmail] = useState(() => {
    return localStorage.getItem('soukclass_admin_email') || '';
  });
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active sub-tab inside « Mon portefeuille »
  const [activeTab, setActiveTab] = useState<'stats' | 'transactions' | 'premium_listings' | 'withdrawals'>('stats');

  // Live Wallet Data
  const [stats, setStats] = useState<WalletStats>({
    totalConfirmedRevenue: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    pendingRevenue: 0,
    withdrawnAmount: 0,
    availableBalance: 0
  });
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [premiumListings, setPremiumListings] = useState<PremiumListingStat[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Withdrawal form state
  const [wdrAmount, setWdrAmount] = useState<number | ''>('');
  const [wdrType, setWdrType] = useState<'PRESTATAIRE_DIRECT' | 'BANK_RIB'>('PRESTATAIRE_DIRECT');
  const [providerFirstName, setProviderFirstName] = useState('Yassine');
  const [wdrTargetNumber, setWdrTargetNumber] = useState('007 780 0001234567890123 45');
  const [wdrFeedback, setWdrFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Renewal state
  const [renewingListingId, setRenewingListingId] = useState<string | null>(null);
  const [renewFeedback, setRenewFeedback] = useState<string | null>(null);

  const isAuthenticated = currentEmail.toLowerCase().trim() === ADMIN_AUTHORIZED_EMAIL.toLowerCase();

  // Load live data from server API
  const refreshWalletData = async () => {
    setIsLoading(true);
    try {
      const [statsData, txsData, premiumData, wdrData] = await Promise.all([
        walletService.getStats(),
        walletService.getTransactions(),
        walletService.getPremiumListings(),
        walletService.getWithdrawals()
      ]);
      setStats(statsData);
      setTransactions(txsData);
      setPremiumListings(premiumData);
      setWithdrawals(wdrData);
    } catch (err) {
      console.error('Failed to load wallet data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      refreshWalletData();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputEmail.toLowerCase().trim();

    if (clean !== ADMIN_AUTHORIZED_EMAIL.toLowerCase()) {
      setAuthError(`Accès strictement restreint. Seule l'adresse e-mail "${ADMIN_AUTHORIZED_EMAIL}" est habilitée à accéder au portefeuille financier.`);
      return;
    }

    setAuthError('');
    setCurrentEmail(clean);
    localStorage.setItem('soukclass_admin_email', clean);
  };

  const handleLogout = () => {
    setCurrentEmail('');
    localStorage.removeItem('soukclass_admin_email');
    setInputEmail('');
    setInputPassword('');
  };

  // Submit withdrawal request to server
  const handleSubmitWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(wdrAmount);
    if (!amt || amt <= 0) return;

    if (amt > stats.availableBalance) {
      setWdrFeedback({
        type: 'error',
        message: `Solde insuffisant. Vous ne pouvez retirer que jusqu'à ${formatPriceDH(stats.availableBalance)}.`
      });
      return;
    }

    setWdrFeedback(null);
    const firstName = providerFirstName.trim() || 'Yassine';
    const res = await walletService.requestWithdrawal(amt, wdrType, wdrTargetNumber, firstName);

    if (res.success) {
      setWdrFeedback({
        type: 'success',
        message: `Demande de retrait de ${formatPriceDH(amt)} enregistrée pour le prestataire ${firstName}.`
      });
      setWdrAmount('');
      refreshWalletData();
    } else {
      setWdrFeedback({
        type: 'error',
        message: res.error || 'Erreur lors de la demande de retrait.'
      });
    }
  };

  // Process / Validate withdrawal as Admin
  const handleProcessWithdrawal = async (id: string, status: 'VALIDE' | 'TRANSFERE') => {
    await walletService.processWithdrawal(id, status, `Validé par l'administrateur (${ADMIN_AUTHORIZED_EMAIL})`);
    refreshWalletData();
  };

  // Renew an expired or active Premium listing
  const handleRenewListing = async (stat: PremiumListingStat) => {
    setRenewingListingId(stat.listingId);
    setRenewFeedback(null);

    const res = await walletService.renewPremium(
      stat.listingId,
      stat.plan,
      stat.ownerName,
      stat.listingTitle
    );

    setRenewingListingId(null);
    if (res.success) {
      setRenewFeedback(`Mise en avant Premium de 30 jours renouvelée pour "${stat.listingTitle}" !`);
      refreshWalletData();
      if (onListingUpdated) onListingUpdated();
      setTimeout(() => setRenewFeedback(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-12 space-y-6 max-w-xl mx-auto w-full">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                  <Lock className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Espace ADMIN — Mon portefeuille
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gestion financière et des revenus de l'application
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950 space-y-1">
                <p className="font-bold">Accès strictement réservé au Propriétaire :</p>
                <p>
                  Cet espace gère les encaissements réels, les calculs de solde et les retraits de fonds. Connexion autorisée uniquement avec : <strong className="text-slate-900 font-mono underline">{ADMIN_AUTHORIZED_EMAIL}</strong>.
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Adresse e-mail administrateur
                </label>
                <input
                  type="email"
                  placeholder="votre-email@gmail.com"
                  value={inputEmail}
                  onChange={(e) => {
                    setInputEmail(e.target.value);
                    setAuthError('');
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mot de passe / Code d’accès
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setInputEmail(ADMIN_AUTHORIZED_EMAIL);
                    setInputPassword('admin2026');
                  }}
                  className="text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  Remplir mon e-mail ({ADMIN_AUTHORIZED_EMAIL})
                </button>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-extrabold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Accéder à « Mon portefeuille »
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED WALLET INTERFACE */
          <>
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white p-6 relative shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-300 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Espace ADMIN</span>
                    <span>•</span>
                    <span className="font-mono text-amber-300">{ADMIN_AUTHORIZED_EMAIL}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Mon portefeuille financier
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={refreshWalletData}
                    disabled={isLoading}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Actualiser les données côté serveur"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Actualiser</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 4 MANDATED FINANCIAL METRICS IN DIRHAMS (DH) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                {/* 1. Solde Total des Revenus */}
                <div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                    <span>1. Solde Total des Revenus</span>
                    <Wallet className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
                    {formatPriceDH(stats.totalConfirmedRevenue)}
                  </div>
                  <span className="text-[10px] text-emerald-300 font-bold block mt-0.5">
                    Disponible : {formatPriceDH(stats.availableBalance)}
                  </span>
                </div>

                {/* 2. Revenus du Jour */}
                <div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                    <span>2. Revenus du Jour</span>
                    <Calendar className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                    {formatPriceDH(stats.todayRevenue)}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Aujourd'hui</span>
                </div>

                {/* 3. Revenus de la Semaine */}
                <div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                    <span>3. Revenus de la Semaine</span>
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-blue-400 mt-1">
                    {formatPriceDH(stats.weekRevenue)}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Semaine en cours</span>
                </div>

                {/* 4. Revenus du Mois */}
                <div className="bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                    <span>4. Revenus du Mois</span>
                    <Landmark className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-purple-300 mt-1">
                    {formatPriceDH(stats.monthRevenue)}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Mois en cours</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/10 text-xs font-bold overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'stats' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Vue d'ensemble
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'transactions' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  5. Historique des Transactions ({transactions.length})
                </button>
                <button
                  onClick={() => setActiveTab('premium_listings')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'premium_listings' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  6. Montant par Annonce Premium ({premiumListings.length})
                </button>
                <button
                  onClick={() => setActiveTab('withdrawals')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'withdrawals' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  7. Demandes de Retrait ({withdrawals.length})
                </button>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
              {renewFeedback && (
                <div className="p-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-md animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{renewFeedback}</span>
                </div>
              )}

              {/* ================= TAB 1: OVERVIEW ================= */}
              {activeTab === 'stats' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Security Compliance & Moroccan Gateways Notice */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/90 text-xs text-slate-700 space-y-2.5">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>Règles de Sécurité & Passerelles Marocaines</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <p className="font-bold text-slate-900">Confirmation Réelle Obligatoire</p>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Un simple clic « J'ai payé » n'ajoute JAMAIS d'argent au solde. Chaque transaction passe par un hachage cryptographique HMAC sha256 validé côté serveur.
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <p className="font-bold text-slate-900">Passerelles CMI & YouCan Pay</p>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Les API du CMI (Centre Monétique Interbancaire) et de YouCan Pay sont prêtes pour l'encaissement direct des cartes bancaires marocaines.
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <p className="font-bold text-slate-900">Zéro Stockage de Carte</p>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Aucun numéro de carte bancaire n'est stocké conformément aux normes PCI-DSS. Seules les références de paiement sont conservées.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Summary of Top Performing Listings */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Top annonces générant des revenus
                      </h4>
                      <button
                        onClick={() => setActiveTab('premium_listings')}
                        className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                      >
                        Voir toutes les annonces
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {premiumListings.slice(0, 4).map((item) => (
                        <div
                          key={item.listingId}
                          className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-between gap-3 shadow-xs"
                        >
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              {item.planName}
                            </span>
                            <h5 className="font-bold text-slate-900 text-xs sm:text-sm mt-1 truncate">
                              {item.listingTitle}
                            </h5>
                            <p className="text-[11px] text-slate-500">
                              Propriétaire: {item.ownerName}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-black text-base text-slate-950">
                              {formatPriceDH(item.totalGeneratedDH)}
                            </span>
                            <span className={`block text-[10px] font-bold ${item.isExpired ? 'text-rose-600' : 'text-emerald-700'}`}>
                              {item.isExpired ? 'Expiré' : `${item.daysRemaining}j restants`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 2: TRANSACTION HISTORY ================= */}
              {activeTab === 'transactions' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        Historique de toutes les transactions financières
                      </h4>
                      <p className="text-xs text-slate-500">
                        Enregistrement du montant, de la date, de l'identifiant utilisateur et de l'annonce concernée.
                      </p>
                    </div>
                    <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-700">
                      {transactions.length} enregistrements
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    {transactions.map((tx) => {
                      const isConfirmed = tx.status === 'CONFIRMED';
                      const isPending = tx.status === 'PENDING_VERIFICATION';

                      return (
                        <div key={tx.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              isConfirmed ? 'bg-emerald-100 text-emerald-800' : isPending ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isConfirmed ? <ArrowDownRight className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900 text-sm truncate">
                                  {tx.listingTitle}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                  {tx.planName}
                                </span>
                              </div>

                              <div className="text-slate-500 text-[11px] space-y-0.5 mt-1">
                                <p>
                                  <strong>Utilisateur :</strong> {tx.userEmail} ({tx.userId})
                                </p>
                                <p>
                                  <strong>Annonce ID :</strong> <code className="bg-slate-100 px-1 py-0.2 rounded font-mono text-slate-800">{tx.listingId}</code>
                                  {' • '}
                                  <strong>Passerelle :</strong> {tx.gateway} ({tx.gatewayTxRef})
                                </p>
                                <p className="text-slate-400 text-[10px]">
                                  Date : {new Date(tx.date).toLocaleString('fr-MA')} • Hash serveur : <span className="font-mono">{tx.verificationHash?.slice(0, 16)}...</span>
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="sm:text-right shrink-0">
                            <div className="text-lg font-black text-slate-950">
                              +{tx.amount} DH
                            </div>
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              isConfirmed
                                ? 'bg-emerald-100 text-emerald-800'
                                : isPending
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isConfirmed && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {tx.status === 'CONFIRMED' ? 'Confirmé & Crédité' : tx.status === 'PENDING_VERIFICATION' ? 'En attente passerelle' : 'Échoué'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= TAB 3: REVENUE GENERATED PER PREMIUM LISTING ================= */}
              {activeTab === 'premium_listings' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        Montant généré par chaque annonce Premium
                      </h4>
                      <p className="text-xs text-slate-500">
                        Suivi des 30 jours de mise en avant, gestion des expirations automatiques et renouvellement.
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    {premiumListings.map((stat) => (
                      <div key={stat.listingId} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="font-extrabold text-slate-900 text-sm truncate">
                              {stat.listingTitle}
                            </h5>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              stat.isExpired ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {stat.isExpired ? 'Premium Expiré' : 'Actif'}
                            </span>
                          </div>

                          <div className="text-slate-500 text-[11px] mt-1 space-y-0.5">
                            <p>
                              <strong>Formule :</strong> {stat.planName} • <strong>Propriétaire :</strong> {stat.ownerName}
                            </p>
                            <p>
                              <strong>Expiration des 30 jours :</strong> {new Date(stat.expiresAt).toLocaleDateString('fr-MA')} ({stat.isExpired ? 'Statut Premium retiré' : `${stat.daysRemaining} jours restants`})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total généré</p>
                            <p className="text-base font-black text-slate-950">
                              {formatPriceDH(stat.totalGeneratedDH)}
                            </p>
                            <span className="text-[10px] text-slate-500 font-semibold">
                              {stat.transactionsCount} transaction{stat.transactionsCount > 1 ? 's' : ''}
                            </span>
                          </div>

                          {/* Renew Premium Button */}
                          <button
                            onClick={() => handleRenewListing(stat)}
                            disabled={renewingListingId === stat.listingId}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${renewingListingId === stat.listingId ? 'animate-spin' : ''}`} />
                            <span>Renouveler</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 4: WITHDRAWAL REQUESTS ================= */}
              {activeTab === 'withdrawals' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Create New Withdrawal Request Card */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5 text-blue-700" />
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          Nouvelle demande de retrait de fonds
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        Solde disponible : <strong className="text-emerald-700">{formatPriceDH(stats.availableBalance)}</strong>
                      </span>
                    </div>

                    <form onSubmit={handleSubmitWithdrawal} className="space-y-4">
                      {/* Destination Type */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setWdrType('PRESTATAIRE_DIRECT');
                            setWdrTargetNumber('007 780 0001234567890123 45');
                          }}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            wdrType === 'PRESTATAIRE_DIRECT'
                              ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 text-blue-700 mb-1" />
                          <span className="font-extrabold text-xs block text-slate-900">Virement direct au prestataire</span>
                          <span className="text-[10px] text-slate-500">Transféré automatiquement sous son prénom ({providerFirstName || 'Yassine'})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setWdrType('BANK_RIB');
                            setWdrTargetNumber('007 780 0001234567890123 45');
                          }}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            wdrType === 'BANK_RIB'
                              ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <Landmark className="w-4 h-4 text-emerald-700 mb-1" />
                          <span className="font-extrabold text-xs block text-slate-900">Virement Bancaire National</span>
                          <span className="text-[10px] text-slate-500">RIB 24 chiffres officiel au Maroc</span>
                        </button>
                      </div>

                      {/* Provider First Name Input */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Prénom du prestataire de paiement (automatique)
                        </label>
                        <input
                          type="text"
                          value={providerFirstName}
                          onChange={(e) => setProviderFirstName(e.target.value)}
                          placeholder="Ex: Yassine"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-600"
                          required
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          Le virement sera automatiquement émis et enregistré sous ce prénom par le prestataire.
                        </p>
                      </div>

                      {/* Destination Number */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Numéro de compte / RIB du prestataire
                        </label>
                        <input
                          type="text"
                          value={wdrTargetNumber}
                          onChange={(e) => setWdrTargetNumber(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-600 tracking-wider"
                          required
                        />
                      </div>

                      {/* Amount */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Montant du retrait en Dirhams (DH)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="10"
                            max={stats.availableBalance}
                            value={wdrAmount}
                            onChange={(e) => setWdrAmount(e.target.value ? Number(e.target.value) : '')}
                            placeholder={`Ex: 500 (Max: ${stats.availableBalance})`}
                            className="w-full pl-4 pr-16 py-2.5 rounded-xl border border-slate-300 font-black text-slate-950 text-base bg-white outline-none focus:ring-2 focus:ring-blue-600"
                            required
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-500">
                            DH
                          </span>
                        </div>
                      </div>

                      {wdrFeedback && (
                        <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                          wdrFeedback.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {wdrFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                          <span>{wdrFeedback.message}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={!wdrAmount || Number(wdrAmount) > stats.availableBalance}
                        className="w-full py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-950 disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Enregistrer la demande de retrait côté serveur
                      </button>
                    </form>
                  </div>

                  {/* List of Withdrawal Requests */}
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm mb-3">
                      Historique des demandes de retrait ({withdrawals.length})
                    </h4>

                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                      {withdrawals.length === 0 ? (
                        <p className="p-6 text-center text-xs text-slate-500">
                          Aucune demande de retrait effectuée pour le moment.
                        </p>
                      ) : (
                        withdrawals.map((w) => (
                          <div key={w.id} className="p-4 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900 text-sm">
                                  {w.destinationLabel}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  w.status === 'TRANSFERE'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : w.status === 'VALIDE'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {w.status === 'TRANSFERE' ? 'Transféré' : w.status === 'VALIDE' ? 'Validé' : 'En attente'}
                                </span>
                              </div>

                              <p className="text-slate-500 text-[11px] mt-1">
                                Réf: <span className="font-mono">{w.reference}</span> • Demandé le : {new Date(w.requestedAt).toLocaleDateString('fr-MA')}
                                {w.adminNotes && ` • ${w.adminNotes}`}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-base font-black text-slate-950">
                                {formatPriceDH(w.amount)}
                              </span>

                              {/* Action to validate or transfer if pending */}
                              {w.status === 'EN_ATTENTE' && (
                                <button
                                  onClick={() => handleProcessWithdrawal(w.id, 'TRANSFERE')}
                                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                                >
                                  Valider & Transférer
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
