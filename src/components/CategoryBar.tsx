import React from 'react';
import {
  Building2, Smartphone, UtensilsCrossed, Sparkles, LayoutGrid
} from 'lucide-react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';

interface CategoryBarProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (id: CategoryId | 'all') => void;
  selectedSubcategory: string;
  onSelectSubcategory: (subId: string) => void;
  listingCountsByCategory: Record<string, number>;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedSubcategory,
  onSelectSubcategory,
  listingCountsByCategory
}) => {
  const getCategoryIcon = (catId: CategoryId | 'all') => {
    switch (catId) {
      case 'immobilier':
        return <Building2 className="w-5 h-5" />;
      case 'objets-quotidien':
        return <Smartphone className="w-5 h-5" />;
      case 'nourriture':
        return <UtensilsCrossed className="w-5 h-5" />;
      case 'autres':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <LayoutGrid className="w-5 h-5" />;
    }
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="bg-white border-b border-slate-200/80 shadow-xs py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4 Pillar Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* All */}
          <button
            onClick={() => {
              onSelectCategory('all');
              onSelectSubcategory('');
            }}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-white text-slate-700 shadow-xs'
            }`}>
              {getCategoryIcon('all')}
            </div>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm font-bold truncate">Toutes</span>
              <span className={`text-[10px] block ${selectedCategory === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
                {listingCountsByCategory['all'] || 0} annonces
              </span>
            </div>
          </button>

          {/* The 4 core user categories */}
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = listingCountsByCategory[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onSelectSubcategory('');
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-800/20'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {getCategoryIcon(cat.id)}
                </div>
                <div className="min-w-0">
                  <span className="block text-xs sm:text-sm font-bold truncate">{cat.name}</span>
                  <span className={`text-[10px] block ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                    {count} annonces
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Subcategory Pills if a category is selected */}
        {activeCategoryObj && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Sous-catégories :
            </span>
            <button
              onClick={() => onSelectSubcategory('')}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors cursor-pointer ${
                selectedSubcategory === ''
                  ? 'bg-emerald-100 text-emerald-900 font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Toutes les {activeCategoryObj.name}
            </button>
            {activeCategoryObj.subcategories.map((sub) => {
              const isSubActive = selectedSubcategory === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubcategory(sub.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors cursor-pointer ${
                    isSubActive
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
