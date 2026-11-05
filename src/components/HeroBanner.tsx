import React from 'react';
import {
  Sparkles, Crown, MapPin, Search, ShieldCheck,
  ArrowRight, CheckCircle2, ChevronRight
} from 'lucide-react';
import { CategoryId, Listing } from '../types';
import { CATEGORIES } from '../data/categories';
import { MOROCCAN_CITIES } from '../data/moroccoLocations';
import { formatPriceDH } from '../data/mockListings';

interface HeroBannerProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  vipListings: Listing[];
  onSelectListing: (listing: Listing) => void;
  onOpenCreateListing: () => void;
  onOpenPricing: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedCity,
  onSelectCity,
  vipListings,
  onSelectListing,
  onOpenCreateListing,
  onOpenPricing
}) => {
  return (
    <div className="relative bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white overflow-hidden border-b border-emerald-900/40">
      {/* Decorative Moroccan Subtle Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, Pitch & Quick Filter Box */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>La référence des annonces d’exception au Maroc</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-serif text-white">
              Achetez et vendez vos biens en toute <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">sérénité</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Immobilier de standing, objets du quotidien certifiés, terroir d’exception et véhicules de prestige dans toutes les villes du Royaume en Dirhams (DH).
            </p>

            {/* Quick Hero Search & Filter Card */}
            <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-white/20 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Keyword */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Mots-clés (ex: Villa, Rolex...)"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white text-slate-900 text-xs sm:text-sm font-medium placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Category select */}
                <select
                  value={selectedCategory}
                  onChange={(e) => onSelectCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white text-slate-900 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="all">Toutes les catégories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* City select */}
                <select
                  value={selectedCity}
                  onChange={(e) => onSelectCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white text-slate-900 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="all">Tout le Maroc</option>
                  {MOROCCAN_CITIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fast stats row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-white/10 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Prix certifiés en Dirhams (DH)</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Formules Boost & VIP dès 39 DH</span>
                </div>
                <button
                  onClick={onOpenPricing}
                  className="text-white hover:text-amber-300 underline font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Voir les formules
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Featured VIP Selection Spotlight */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 rounded-3xl p-5 border border-amber-400/40 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Sélection VIP Gold</h3>
                    <p className="text-[11px] text-amber-300/80">En tête d’affiche au Maroc</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  Prioritaire
                </span>
              </div>

              {/* Top VIP item featured card */}
              {vipListings.length > 0 && (
                <div
                  onClick={() => onSelectListing(vipListings[0])}
                  className="group relative rounded-2xl overflow-hidden bg-slate-950 cursor-pointer border border-white/10 hover:border-amber-400/50 transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={vipListings[0].images[0]}
                      alt={vipListings[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-md">
                        <Crown className="w-3 h-3" /> VIP GOLD
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mb-1">
                        <MapPin className="w-3 h-3" />
                        <span>{vipListings[0].city} • {vipListings[0].sector}</span>
                      </div>
                      <h4 className="font-extrabold text-sm line-clamp-1 group-hover:text-amber-300 transition-colors">
                        {vipListings[0].title}
                      </h4>
                      <p className="font-black text-base text-amber-400 mt-1">
                        {formatPriceDH(vipListings[0].price)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Secondary VIP row */}
              <div className="grid grid-cols-2 gap-2.5 mt-3">
                {vipListings.slice(1, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectListing(item)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-400/30 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <img
                      src={item.images[0]}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
                      <p className="text-[10px] text-amber-300 font-black">{formatPriceDH(item.price)}</p>
                      <p className="text-[9px] text-slate-400 truncate">{item.city}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA to get VIP visibility */}
              <button
                onClick={onOpenCreateListing}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white text-xs font-black uppercase tracking-wider hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Mettre mon annonce en VIP Gold</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
