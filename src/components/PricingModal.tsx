import React from 'react';
import { X, Check, Crown, Zap, Sparkles, Building, HelpCircle, ArrowRight } from 'lucide-react';
import { PRICING_PLANS } from '../data/pricingPlans';
import { ListingPlanId } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlanAndCreate: (planId: ListingPlanId) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onSelectPlanAndCreate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-xs tracking-wider uppercase mb-3 border border-amber-500/30">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Tarifs & Formules de Visibilité
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Vendez plus vite avec nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">formules premium</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Du plan gratuit aux options VIP Gold, choisissez la visibilité adaptée à la valeur de vos biens au Maroc. Tarifs transparents en Dirhams marocains (DH), sans commission cachée.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {PRICING_PLANS.map((plan) => {
              const isFree = plan.price === 0;
              const isVip = plan.id === 'vip';
              const isBoost = plan.id === 'boost';
              const isPro = plan.id === 'pro';

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 border ${
                    isVip 
                      ? 'border-amber-400 bg-gradient-to-b from-amber-50/50 to-white shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/50' 
                      : isBoost
                      ? 'border-emerald-400 bg-gradient-to-b from-emerald-50/40 to-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/40'
                      : isPro
                      ? 'border-indigo-300 bg-slate-50/80 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Top Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-sm tracking-wide">
                      RECOMMANDÉ
                    </div>
                  )}
                  {isVip && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-md tracking-wide flex items-center gap-1">
                      <Crown className="w-3 h-3" /> BEST-SELLER
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${plan.badgeClass}`}>
                        {plan.badgeText}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        {plan.durationDays} jours
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg mt-1">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.description}</p>

                    {/* Price */}
                    <div className="my-4 pt-3 border-t border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-slate-950">
                          {isFree ? 'Gratuit' : `${plan.price} DH`}
                        </span>
                        {!isFree && <span className="text-xs text-slate-500 font-medium">/ annonce</span>}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                        {plan.multiplierText}
                      </div>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-2.5 text-xs text-slate-600 my-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isVip ? 'text-amber-600' : isBoost ? 'text-emerald-600' : isPro ? 'text-indigo-600' : 'text-slate-500'
                          }`} />
                          <span className={idx === 0 || idx === 1 ? 'font-medium text-slate-900' : ''}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => {
                      onClose();
                      onSelectPlanAndCreate(plan.id);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isVip
                        ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white hover:brightness-105 shadow-md shadow-amber-600/20'
                        : isBoost
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20'
                        : isPro
                        ? 'bg-indigo-900 text-white hover:bg-indigo-950'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    Choisir cette formule
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* FAQ section */}
          <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/80">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              Questions fréquentes sur les formules au Maroc
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
              <div>
                <p className="font-bold text-slate-800 mb-1">Le plan gratuit est-il vraiment 100% gratuit ?</p>
                <p>Oui, absolument. Vous pouvez poster votre annonce sans payer le moindre dirham, elle restera active pendant 30 jours.</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 mb-1">Comment payer les options payantes au Maroc ?</p>
                <p>Nous acceptons toutes les cartes bancaires marocaines (CMI, Visa, Mastercard) ainsi qu’Apple Pay et virement instantané.</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 mb-1">Quelle est la formule recommandée pour l’immobilier ou les voitures ?</p>
                <p>Pour les biens de grande valeur (villas, appartements, voitures), la formule VIP Gold (89 DH) offre le meilleur retour sur investissement grâce au carrousel prioritaire.</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 mb-1">Mon annonce peut-elle être modifiée après publication ?</p>
                <p>Oui, vous pouvez modifier le prix, le texte ou ajouter des photos à tout moment depuis votre espace sans frais supplémentaires.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
