import React from 'react';
import { Heart, MapPin, Eye, CheckCircle2, MessageSquare, Phone, Sparkles, Crown } from 'lucide-react';
import { Listing } from '../types';
import { formatPriceDH } from '../data/mockListings';
import { getPlanById } from '../data/pricingPlans';

interface ListingCardProps {
  listing: Listing;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClick: (listing: Listing) => void;
  onOpenChat: (listing: Listing, e: React.MouseEvent) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isFavorite,
  onToggleFavorite,
  onClick,
  onOpenChat
}) => {
  const planInfo = getPlanById(listing.plan);
  const isExpired = Boolean(listing.isPremiumExpired || (listing.premiumExpiresAt && new Date(listing.premiumExpiresAt).getTime() < Date.now()));
  const isVip = !isExpired && listing.plan === 'vip';
  const isBoost = !isExpired && listing.plan === 'boost';
  const isPro = !isExpired && listing.plan === 'pro';

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanNumber = listing.seller.whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Salam alaykoum, votre annonce "${listing.title}" à ${listing.city} (${formatPriceDH(listing.price)}) sur SoukClass m'intéresse. Est-elle toujours disponible ?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div
      onClick={() => onClick(listing)}
      className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between border ${
        isVip
          ? 'border-amber-300 shadow-md hover:shadow-xl hover:-translate-y-1 ring-1 ring-amber-300/50'
          : isBoost
          ? 'border-emerald-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 ring-1 ring-emerald-300/40'
          : 'border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300'
      }`}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay on bottom of image for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Plan / Priority Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isExpired && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-rose-300 border border-rose-500/40 shadow-md">
              Premium Expiré
            </span>
          )}
          {isVip && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white shadow-lg shadow-amber-600/30">
              <Crown className="w-3 h-3 fill-current" />
              VIP Gold
            </span>
          )}
          {isBoost && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-md shadow-emerald-700/30">
              <Sparkles className="w-3 h-3" />
              En Vedette
            </span>
          )}
          {isPro && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-900 text-indigo-100 border border-indigo-700">
              Pro Certifié
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(listing.id, e)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-black/30 hover:bg-black/50 text-white'
          }`}
          aria-label="Ajouter aux favoris"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Condition tag & photo count */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
          <span className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md font-medium">
            {listing.condition}
          </span>
          <span className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {listing.viewsCount}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location and time */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 font-medium truncate text-emerald-800">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span className="truncate">{listing.city} • {listing.sector}</span>
            </div>
            <span className="shrink-0 text-[11px] text-slate-400">{listing.createdAt}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
            {listing.title}
          </h3>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-extrabold text-slate-950 tracking-tight">
              {formatPriceDH(listing.price)}
            </span>
            {listing.priceNegotiable && (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                Négociable
              </span>
            )}
          </div>
        </div>

        {/* Footer info: seller and quick actions */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Seller badge */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={listing.seller.avatar}
              alt={listing.seller.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-800 truncate">
                  {listing.seller.name}
                </span>
                {listing.seller.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                )}
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                {listing.seller.city}
              </span>
            </div>
          </div>

          {/* Quick Contact buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* WhatsApp direct */}
            <button
              onClick={handleWhatsAppClick}
              title="Contacter sur WhatsApp"
              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.06 7.42C8.91 7.42 8.68 7.47 8.47 7.7C8.27 7.92 7.71 8.45 7.71 9.53C7.71 10.6 8.5 11.64 8.6 11.79C8.72 11.94 10.23 14.28 12.56 15.28C14.5 16.11 14.9 15.95 15.32 15.91C15.74 15.87 16.68 15.35 16.88 14.79C17.07 14.23 17.07 13.76 17.01 13.66C16.96 13.56 16.81 13.5 16.58 13.39C16.34 13.27 15.19 12.71 14.98 12.63C14.76 12.55 14.61 12.51 14.45 12.75C14.29 12.98 13.84 13.51 13.7 13.67C13.56 13.83 13.43 13.85 13.2 13.73C12.96 13.62 11.98 13.3 10.82 12.27C9.91 11.46 9.3 10.46 9.18 10.26C9.07 10.05 9.17 9.94 9.28 9.83C9.39 9.72 9.52 9.55 9.64 9.41C9.76 9.27 9.8 9.17 9.88 9.01C9.96 8.85 9.92 8.71 9.86 8.6C9.8 8.48 9.35 7.37 9.16 6.92C8.98 6.47 8.79 6.54 8.66 6.53L8.14 6.52C7.98 6.52 7.82 6.57 7.7 6.69"/>
              </svg>
            </button>

            {/* In-app chat */}
            <button
              onClick={(e) => onOpenChat(listing, e)}
              title="Discuter sur SoukClass"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
