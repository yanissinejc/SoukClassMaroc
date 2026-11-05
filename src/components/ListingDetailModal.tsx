import React, { useState } from 'react';
import {
  X, Heart, MapPin, Share2, ShieldAlert, CheckCircle2,
  Phone, MessageSquare, Sparkles, Crown, Calendar, Eye, AlertCircle,
  RefreshCw, Clock, Check
} from 'lucide-react';
import { Listing } from '../types';
import { formatPriceDH } from '../data/mockListings';
import { getPlanById } from '../data/pricingPlans';
import { walletService } from '../services/walletService';

interface ListingDetailModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenChat: (listing: Listing) => void;
  onRenewListing?: (listing: Listing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenChat,
  onRenewListing
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewSuccess, setRenewSuccess] = useState(false);

  if (!isOpen || !listing) return null;

  const planInfo = getPlanById(listing.plan);
  const isVip = listing.plan === 'vip';
  const isBoost = listing.plan === 'boost';
  const isPro = listing.plan === 'pro';

  const isExpired = listing.isPremiumExpired || (listing.premiumExpiresAt && new Date(listing.premiumExpiresAt).getTime() < Date.now());
  const daysRemaining = listing.premiumExpiresAt
    ? Math.max(0, Math.ceil((new Date(listing.premiumExpiresAt).getTime() - Date.now()) / (1000 * 3600 * 24)))
    : (isVip ? 28 : isBoost ? 14 : isPro ? 58 : 0);

  const handleRenew = async () => {
    setIsRenewing(true);
    try {
      const chosenPlan = listing.plan === 'gratuit' ? 'vip' : listing.plan;
      const res = await walletService.renewPremium(
        listing.id,
        chosenPlan,
        listing.seller.name || 'client@soukclass.ma',
        listing.title
      );
      if (res.success) {
        setRenewSuccess(true);
        if (onRenewListing) {
          onRenewListing({
            ...listing,
            plan: chosenPlan,
            featured: true,
            isPremiumExpired: false,
            premiumExpiresAt: res.transaction?.premiumExpiresAt || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
            totalRevenueGenerated: (listing.totalRevenueGenerated || 0) + (res.transaction?.amount || 89)
          });
        }
        setTimeout(() => setRenewSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to renew listing:', err);
    } finally {
      setIsRenewing(false);
    }
  };

  const handleWhatsAppClick = () => {
    const cleanNumber = listing.seller.whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Salam alaykoum, j'ai vu votre annonce "${listing.title}" à ${listing.city} (${formatPriceDH(listing.price)}) sur SoukClass. Est-elle toujours disponible ?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Découvrez cette annonce sur SoukClass Maroc : ${listing.title} - ${formatPriceDH(listing.price)} à ${listing.city}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky top action bar on mobile */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg backdrop-blur-md transition-all cursor-pointer"
            title="Partager"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onToggleFavorite(listing.id)}
            className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 hover:bg-white text-slate-800'
            }`}
            title="Ajouter aux favoris"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white shadow-lg backdrop-blur-md transition-all cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          {/* Image Gallery */}
          <div className="relative bg-slate-950 aspect-[16/10] sm:aspect-[21/9] w-full flex items-center justify-center">
            <img
              src={listing.images[activeImageIndex] || listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-contain sm:object-cover"
            />

            {/* Badges on main photo */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isVip && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white shadow-lg shadow-amber-600/40">
                  <Crown className="w-4 h-4 fill-current" />
                  VIP Gold Prestige
                </span>
              )}
              {isBoost && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  En Vedette
                </span>
              )}
            </div>

            {/* Photo selector thumbnails */}
            {listing.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-2xl bg-black/50 backdrop-blur-md">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? 'border-amber-400 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {copiedShare && (
            <div className="bg-emerald-600 text-white text-center py-2 text-xs font-semibold animate-in fade-in">
              Lien de l’annonce copié dans le presse-papier !
            </div>
          )}

          {/* Details Body */}
          <div className="p-5 sm:p-8 space-y-6">
            {/* Title, Price, Location */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700 capitalize">
                    {listing.category.replace('-', ' ')}
                  </span>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1 font-semibold text-emerald-800">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{listing.city}, Quartier {listing.sector}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Publiée {listing.createdAt}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
                  {listing.title}
                </h1>
              </div>

              {/* Price block */}
              <div className="md:text-right shrink-0">
                <div className="text-2xl sm:text-3xl font-black text-slate-950">
                  {formatPriceDH(listing.price)}
                </div>
                {listing.priceNegotiable ? (
                  <span className="inline-block mt-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Prix Négociable
                  </span>
                ) : (
                  <span className="inline-block mt-1 text-xs text-slate-400 font-medium">
                    Prix Fixe
                  </span>
                )}
              </div>
            </div>

            {/* Premium Status, 30-Day Expiry & Renewal Box */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isExpired
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : (isVip || isBoost || isPro)
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isExpired ? 'bg-rose-200 text-rose-800' : (isVip || isBoost || isPro) ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {isExpired ? <Clock className="w-5 h-5" /> : (isVip || isBoost || isPro) ? <Crown className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs sm:text-sm">
                        {isExpired
                          ? 'Statut Premium de 30 jours expiré'
                          : (isVip || isBoost || isPro)
                          ? `Mise en avant ${planInfo.name} active`
                          : 'Formule standard gratuite'}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isExpired ? 'bg-rose-200 text-rose-800' : (isVip || isBoost || isPro) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {isExpired ? 'Expiré (Visibilité normale)' : `${daysRemaining}j restants`}
                      </span>
                    </div>

                    <p className="text-[11px] opacity-80 mt-0.5">
                      {isExpired
                        ? 'Le statut Premium a été automatiquement retiré à échéance. Renouvelez pour repasser en tête de liste.'
                        : (isVip || isBoost || isPro)
                        ? `Votre annonce bénéficie du statut prioritaire au Maroc. Fin de validité : ${listing.premiumExpiresAt ? new Date(listing.premiumExpiresAt).toLocaleDateString('fr-MA') : 'dans 28 jours'}.`
                        : 'Passez en formule Premium 30 jours pour multiplier vos vues par 10.'}
                    </p>
                  </div>
                </div>

                {/* Renewal CTA Button */}
                <button
                  onClick={handleRenew}
                  disabled={isRenewing}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRenewing ? 'animate-spin' : ''}`} />
                  <span>{isRenewing ? 'Renouvellement...' : isExpired ? 'Renouveler mon Premium (89 DH)' : 'Prolonger (+30 jours)'}</span>
                </button>
              </div>

              {renewSuccess && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Mise en avant de 30 jours renouvelée avec succès ! Transaction financière enregistrée.</span>
                </div>
              )}
            </div>

            {/* Quick Spec Highlights */}
            {listing.attributes && Object.keys(listing.attributes).length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Caractéristiques principales
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(listing.attributes).map(([key, value]) => (
                    <div key={key} className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                      <p className="text-[11px] text-slate-500 font-medium">{key}</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Description de l’annonce
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                {listing.description}
              </p>
            </div>

            {/* Seller profile card & contacts */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                {/* Seller info */}
                <div className="flex items-center gap-4">
                  <img
                    src={listing.seller.avatar}
                    alt={listing.seller.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-lg text-white">{listing.seller.name}</h4>
                      {listing.seller.verified && (
                        <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Vérifié
                        </span>
                      )}
                    </div>
                    {listing.seller.badge && (
                      <p className="text-xs text-amber-300 font-medium mt-0.5">{listing.seller.badge}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      Membre depuis {listing.seller.memberSince} • {listing.seller.city}
                    </p>
                    <div className="flex items-center gap-1 text-amber-400 text-xs mt-1">
                      <span>★ {listing.seller.rating}</span>
                      <span className="text-slate-400">({listing.seller.reviewCount} évaluations positives)</span>
                    </div>
                  </div>
                </div>

                {/* Contact actions */}
                <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsAppClick}
                    className="py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.06 7.42C8.91 7.42 8.68 7.47 8.47 7.7C8.27 7.92 7.71 8.45 7.71 9.53C7.71 10.6 8.5 11.64 8.6 11.79C8.72 11.94 10.23 14.28 12.56 15.28C14.5 16.11 14.9 15.95 15.32 15.91C15.74 15.87 16.68 15.35 16.88 14.79C17.07 14.23 17.07 13.76 17.01 13.66C16.96 13.56 16.81 13.5 16.58 13.39C16.34 13.27 15.19 12.71 14.98 12.63C14.76 12.55 14.61 12.51 14.45 12.75C14.29 12.98 13.84 13.51 13.7 13.67C13.56 13.83 13.43 13.85 13.2 13.73C12.96 13.62 11.98 13.3 10.82 12.27C9.91 11.46 9.3 10.46 9.18 10.26C9.07 10.05 9.17 9.94 9.28 9.83C9.39 9.72 9.52 9.55 9.64 9.41C9.76 9.27 9.8 9.17 9.88 9.01C9.96 8.85 9.92 8.71 9.86 8.6C9.8 8.48 9.35 7.37 9.16 6.92C8.98 6.47 8.79 6.54 8.66 6.53L8.14 6.52C7.98 6.52 7.82 6.57 7.7 6.69"/>
                    </svg>
                    WhatsApp Direct
                  </button>

                  {/* Phone call */}
                  {showPhone ? (
                    <a
                      href={`tel:${listing.seller.phone.replace(/\s+/g, '')}`}
                      className="py-3 px-5 rounded-2xl bg-white text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                      {listing.seller.phone}
                    </a>
                  ) : (
                    <button
                      onClick={() => setShowPhone(true)}
                      className="py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      Afficher le Numéro
                    </button>
                  )}

                  {/* In-app chat */}
                  <button
                    onClick={() => {
                      onClose();
                      onOpenChat(listing);
                    }}
                    className="py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>
            </div>

            {/* Moroccan Safety Tips */}
            <div className="bg-amber-50/80 rounded-2xl p-4 sm:p-5 border border-amber-200/80 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <p className="font-bold">Conseils de sécurité SoukClass Maroc :</p>
                <p>
                  Privilégiez la remise en main propre dans un lieu public sécurisé. Ne transférez jamais d’acompte ou d’argent à l’avance par virement ou agence de transfert sans avoir vérifié le produit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
