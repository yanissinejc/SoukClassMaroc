import React from 'react';
import { Crown, ShieldCheck, Heart, CreditCard, HelpCircle, MapPin, Globe } from 'lucide-react';
import { MOROCCAN_CITIES } from '../data/moroccoLocations';
import { CATEGORIES } from '../data/categories';

interface FooterProps {
  onSelectCity: (city: string) => void;
  onOpenPricing: () => void;
  onOpenFastPayCard?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCity,
  onOpenPricing,
  onOpenFastPayCard
}) => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 mt-16">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-white/10 bg-gradient-to-r from-blue-950/60 via-slate-900 to-emerald-950/60 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Annonces Vérifiées</h4>
              <p className="text-xs text-slate-400">Modération rigoureuse au Maroc</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">100% en Dirhams (DH)</h4>
              <p className="text-xs text-slate-400">Transactions transparentes sans frais</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Carte BMCE FastPay</h4>
              <p className="text-xs text-slate-400">Paiement direct sur 16 chiffres</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Site Web Disponible 24/7</h4>
              <p className="text-xs text-slate-400">Accessible sur mobile, PC et tablette</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-2xl font-black font-serif tracking-tight">
                Souk<span className="text-emerald-500">Class</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              La marketplace marocaine en ligne de référence pour vendre et acheter facilement : villas, appartements, high-tech, gastronomie et terroir en dirhams.
            </p>

            {onOpenFastPayCard && (
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={onOpenFastPayCard}
                  className="px-3.5 py-2 rounded-xl bg-blue-900/60 hover:bg-blue-900 text-blue-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-blue-500/30"
                >
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Ma Carte BMCE FastPay</span>
                </button>
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3">
              Catégories Principales
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <a href="#" className="hover:text-amber-300 transition-colors">
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Formules & Visibilité */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3">
              Formules & Tarifs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={onOpenPricing} className="hover:text-amber-300 transition-colors cursor-pointer text-left">
                  Plan Gratuit (0 DH)
                </button>
              </li>
              <li>
                <button onClick={onOpenPricing} className="hover:text-amber-300 transition-colors cursor-pointer text-left">
                  Pack Boost En Vedette (39 DH)
                </button>
              </li>
              <li>
                <button onClick={onOpenPricing} className="hover:text-amber-300 transition-colors cursor-pointer text-left text-amber-400 font-semibold">
                  Pack VIP Gold (89 DH)
                </button>
              </li>
              <li>
                <button onClick={onOpenPricing} className="hover:text-amber-300 transition-colors cursor-pointer text-left">
                  Pack Professionnel (199 DH)
                </button>
              </li>
              {onOpenFastPayCard && (
                <li className="pt-1 border-t border-white/10">
                  <button onClick={onOpenFastPayCard} className="text-amber-300 hover:text-amber-200 font-bold transition-colors cursor-pointer text-left flex items-center gap-1">
                    <span>Ma Carte BMCE FastPay</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Villes au Maroc */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3">
              Villes Populaires
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-400">
              {MOROCCAN_CITIES.slice(0, 8).map((city) => (
                <button
                  key={city.id}
                  onClick={() => onSelectCity(city.name)}
                  className="hover:text-white transition-colors cursor-pointer text-left truncate"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Moroccan Cities Directory Bar */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            Toutes les villes couvertes au Maroc :
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">
            {MOROCCAN_CITIES.map((c, i) => (
              <span key={c.id}>
                <button
                  onClick={() => onSelectCity(c.name)}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {c.name}
                </button>
                {i < MOROCCAN_CITIES.length - 1 && <span className="text-slate-700 ml-3">•</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} SoukClass Maroc. Tous droits réservés.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Conçu avec fierté pour le Maroc <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> en Dirhams (DH)
          </p>
        </div>
      </div>
    </footer>
  );
};
