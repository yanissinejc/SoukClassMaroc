import React from 'react';
import { X, Heart, Trash2, ArrowRight, MapPin } from 'lucide-react';
import { Listing } from '../types';
import { formatPriceDH } from '../data/mockListings';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  listings: Listing[];
  onToggleFavorite: (id: string) => void;
  onSelectListing: (listing: Listing) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  listings,
  onToggleFavorite,
  onSelectListing
}) => {
  if (!isOpen) return null;

  const favoriteListings = listings.filter((l) => favorites.includes(l.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-extrabold text-lg text-white">
              Mes Annonces Favorites ({favoriteListings.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {favoriteListings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8" />
              </div>
              <p className="font-bold text-slate-800 text-base">Aucune annonce sauvegardée</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Appuyez sur le cœur sur n’importe quelle annonce pour l’enregistrer et la retrouver facilement ici.
              </p>
            </div>
          ) : (
            favoriteListings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => {
                  onClose();
                  onSelectListing(listing);
                }}
                className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex items-center justify-between gap-3 cursor-pointer group bg-white"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={listing.images[0]}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {listing.city} • {listing.sector}
                    </p>
                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-700">
                      {listing.title}
                    </h4>
                    <p className="text-sm font-black text-slate-950 mt-0.5">
                      {formatPriceDH(listing.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(listing.id);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Retirer des favoris"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
