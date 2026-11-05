import React from 'react';
import {
  SlidersHorizontal, MapPin, X, RotateCcw,
  ArrowUpDown, Sparkles, Crown, Check
} from 'lucide-react';
import { FilterState, ListingPlanId } from '../types';
import { MOROCCAN_CITIES, getCityByName } from '../data/moroccoLocations';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults
}) => {
  const [expanded, setExpanded] = React.useState(false);

  // Active city sectors
  const selectedCityObj = filters.city !== 'all' ? getCityByName(filters.city) : undefined;
  const availableSectors = selectedCityObj ? selectedCityObj.sectors : [];

  // Check how many active non-default filters exist
  const activeFiltersCount = [
    filters.city !== 'all',
    filters.sector !== '',
    filters.minPrice !== '',
    filters.maxPrice !== '',
    filters.condition !== '',
    filters.plan !== 'all',
    filters.searchQuery !== ''
  ].filter(Boolean).length;

  return (
    <div className="bg-white border-b border-slate-200/90 py-3.5 sticky top-16 sm:top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Main Row: City, Sector, Plan, Sort, Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Quick filters (City & Sector & Plan) */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* City Dropdown */}
            <div className="relative min-w-[140px] sm:min-w-[160px]">
              <select
                value={filters.city}
                onChange={(e) => {
                  onFilterChange({ city: e.target.value, sector: '' });
                }}
                className="w-full pl-8 pr-7 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
              >
                <option value="all">📍 Tout le Maroc</option>
                {MOROCCAN_CITIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sector Dropdown (Dynamic when city selected) */}
            {filters.city !== 'all' && availableSectors.length > 0 && (
              <div className="relative min-w-[140px]">
                <select
                  value={filters.sector}
                  onChange={(e) => onFilterChange({ sector: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/50 text-emerald-950 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="">Tous les quartiers de {filters.city}</option>
                  {availableSectors.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Plan filter (VIP, Boost, Standard) */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => onFilterChange({ plan: 'all' })}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  filters.plan === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => onFilterChange({ plan: 'vip' })}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                  filters.plan === 'vip' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-700 hover:text-amber-900'
                }`}
              >
                <Crown className="w-3 h-3" /> VIP Gold
              </button>
              <button
                onClick={() => onFilterChange({ plan: 'boost' })}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                  filters.plan === 'boost' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:text-emerald-900'
                }`}
              >
                <Sparkles className="w-3 h-3" /> En Vedette
              </button>
            </div>

            {/* Expand Advanced Filters Button */}
            <button
              onClick={() => setExpanded(!expanded)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                expanded || activeFiltersCount > 0
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Plus de filtres</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Reset Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 px-2.5 py-2 text-xs text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                title="Réinitialiser tous les filtres"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Effacer filtres</span>
              </button>
            )}
          </div>

          {/* Right: Results count & Sort selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium hidden lg:inline">
              <strong className="text-slate-900 font-extrabold">{totalResults}</strong> annonce{totalResults > 1 ? 's' : ''} disponible{totalResults > 1 ? 's' : ''}
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
                className="px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="recent">Plus récentes</option>
                <option value="price-asc">Prix croissant (DH)</option>
                <option value="price-desc">Prix décroissant (DH)</option>
                <option value="popular">Plus populaires</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expanded Drawer: Price Range DH, Condition, Mobile Plan */}
        {expanded && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-150">
            {/* Price Range in Dirhams */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Fourchette de Prix en Dirhams (DH)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min DH"
                  value={filters.minPrice}
                  onChange={(e) => onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : '' })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold outline-none focus:border-emerald-500"
                />
                <span className="text-slate-400 text-xs">à</span>
                <input
                  type="number"
                  placeholder="Max DH"
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : '' })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                État du bien
              </label>
              <select
                value={filters.condition}
                onChange={(e) => onFilterChange({ condition: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold outline-none focus:border-emerald-500 bg-white"
              >
                <option value="">Tous les états</option>
                <option value="Neuf">Neuf</option>
                <option value="Comme neuf">Comme neuf</option>
                <option value="Très bon état">Très bon état</option>
                <option value="Bon état">Bon état</option>
              </select>
            </div>

            {/* Plan filter on mobile / small screen */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Niveau de visibilité
              </label>
              <select
                value={filters.plan}
                onChange={(e) => onFilterChange({ plan: e.target.value as any })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold outline-none focus:border-emerald-500 bg-white"
              >
                <option value="all">Toutes les formules</option>
                <option value="vip">👑 Formule VIP Gold</option>
                <option value="boost">★ Formule En Vedette</option>
                <option value="gratuit">Standard Gratuit</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
