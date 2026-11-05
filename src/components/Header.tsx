import React from 'react';
import {
  Search, Heart, MessageSquare, PlusCircle, CreditCard,
  MapPin, Crown, Menu, Sparkles, ChevronDown, Check, Globe
} from 'lucide-react';
import { MoroccanCity } from '../types';
import { MOROCCAN_CITIES } from '../data/moroccoLocations';

interface HeaderProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  favoritesCount: number;
  unreadMessagesCount: number;
  onOpenCreateListing: () => void;
  onOpenPricing: () => void;
  onOpenFavorites: () => void;
  onOpenMessages: () => void;
  onOpenAdminWallet: () => void;
  walletBalance: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  favoritesCount,
  unreadMessagesCount,
  onOpenCreateListing,
  onOpenPricing,
  onOpenFavorites,
  onOpenMessages,
  onOpenAdminWallet,
  walletBalance,
  searchQuery,
  onSearchChange
}) => {
  const [cityDropdownOpen, setCityDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner: Site Web Officiel & Logo Bleu Paiement en ligne Admin */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 text-white text-[11px] sm:text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Site Web badge */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Site Web Officiel • Maroc</span>
            </span>
            <span className="hidden md:inline px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
              Transactions en Dirhams (DH)
            </span>
          </div>

          {/* Right info: Le Logo Bleu "Paiement en ligne" pour l'Admin */}
          <div className="flex items-center gap-3 sm:gap-4 text-slate-300">
            {/* The Blue Logo for Paiement en ligne */}
            <button
              onClick={onOpenAdminWallet}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs px-3 py-0.5 rounded-lg border border-blue-400 shadow-md cursor-pointer transition-all active:scale-95"
              title="Espace Admin : Paiements en ligne reçus dans l'application"
            >
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                <CreditCard className="w-3 h-3 text-amber-300" />
              </div>
              <span>Paiement en ligne</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.1 rounded ml-1">
                {walletBalance} DH
              </span>
            </button>

            <span className="hidden sm:inline text-slate-600">|</span>
            <button
              onClick={onOpenPricing}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Crown className="w-3 h-3 text-amber-400" />
              <span className="font-semibold text-white hover:text-amber-300">Formules & Tarifs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="flex items-center gap-2.5 group">
              {/* Logo Emblem: Moroccan Star & Luxury Crest */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 flex items-center justify-center shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform border border-emerald-700/50">
                <Crown className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-serif">
                    Souk<span className="text-emerald-700">Class</span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                    MAROC
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium tracking-tight -mt-0.5 hidden sm:block">
                  Marketplace d’Exception & Annonces Vérifiées
                </p>
              </div>
            </a>
          </div>

          {/* City Selector Pill with Dropdown */}
          <div className="relative shrink-0 hidden md:block">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{selectedCity === 'all' ? 'Tout le Maroc' : selectedCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {cityDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 max-h-80 overflow-y-auto">
                <div className="p-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Choisir une ville
                </div>
                <button
                  onClick={() => {
                    onSelectCity('all');
                    setCityDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer ${
                    selectedCity === 'all' ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>Tout le Maroc (Toutes villes)</span>
                  {selectedCity === 'all' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
                <div className="my-1 border-t border-slate-100" />
                {MOROCCAN_CITIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCity(c.name);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer ${
                      selectedCity === c.name ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{c.region}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Search Bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une villa, iPhone, Argan, Rolex..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-2xl bg-slate-100/80 border border-slate-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Le Logo Bleu "Paiement en ligne" */}
            <button
              onClick={onOpenAdminWallet}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white border border-blue-400/50 shadow-md transition-all cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-black"
              title="Espace Admin : Encaissements reçus sur le site web (yslilimi2025@gmail.com)"
            >
              <CreditCard className="w-4 h-4 text-amber-300" />
              <span>Paiement en ligne</span>
            </button>

            {/* Favorites Button */}
            <button
              onClick={onOpenFavorites}
              className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors relative cursor-pointer"
              title="Mes Favoris"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Messages Button */}
            <button
              onClick={onOpenMessages}
              className="p-2 sm:p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors relative cursor-pointer"
              title="Messagerie"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Main CTA: Déposer une annonce */}
            <button
              onClick={onOpenCreateListing}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md shadow-emerald-900/20 hover:brightness-105 active:scale-95 transition-all cursor-pointer border border-emerald-600/40"
            >
              <PlusCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-300" />
              <span className="hidden xs:inline">Déposer une annonce</span>
              <span className="xs:hidden">Vendre</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input Row */}
        <div className="pb-3 sm:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher à Casablanca, Rabat, Marrakech..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 outline-none focus:bg-white focus:border-emerald-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    </header>
  );
};
