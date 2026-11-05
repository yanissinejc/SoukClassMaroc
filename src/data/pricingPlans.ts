import { PricingPlan } from '../types';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'gratuit',
    name: 'Formule Découverte',
    price: 0,
    durationDays: 30,
    badgeText: 'Standard',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    description: 'Idéal pour vendre occasionnellement un objet simple.',
    multiplierText: 'Visibilité standard',
    highlightColor: 'slate',
    features: [
      'Jusqu’à 3 photos haute définition',
      'Annonce active pendant 30 jours',
      'Affichage standard dans les recherches',
      'Contact par messagerie interne sécurisée',
      'Statistiques de base (nombre de vues)'
    ]
  },
  {
    id: 'boost',
    name: 'Formule Boost « En Vedette »',
    price: 39,
    durationDays: 15,
    popular: true,
    badgeText: '★ EN VEDETTE',
    badgeClass: 'bg-emerald-600 text-white shadow-emerald-500/20',
    description: 'Propulsez votre annonce en tête de sa catégorie.',
    multiplierText: '3x plus de contacts',
    highlightColor: 'emerald',
    features: [
      'Jusqu’à 8 photos HD avec zoom',
      'Badge distinctif vert « EN VEDETTE »',
      '1 Remontée automatique en tête de liste',
      'Mise en avant surlignée dans les résultats',
      'Bouton d’appel direct et WhatsApp actif',
      'Durée de 15 jours renouvelable'
    ]
  },
  {
    id: 'vip',
    name: 'Formule VIP Gold « Prestige »',
    price: 89,
    durationDays: 30,
    popular: false,
    badgeText: '👑 VIP GOLD',
    badgeClass: 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white shadow-amber-500/30 font-semibold',
    description: 'L’impact maximal : carrousel d’accueil & ultra-priorité.',
    multiplierText: '7x plus de vues',
    highlightColor: 'amber',
    features: [
      'Photos illimitées + support Vidéo 4K',
      'Bandeau d’accueil VIP en page principale',
      'Badge prestige or brillant « VIP GOLD »',
      'Remontée quotidienne automatique (7 jours)',
      'Bouton WhatsApp VIP instantané en 1 clic',
      'Partage automatique sur nos réseaux partenaires',
      'Protection contre le spam et les faux profils'
    ]
  },
  {
    id: 'pro',
    name: 'Pack Professionnel & Agence',
    price: 199,
    durationDays: 60,
    popular: false,
    badgeText: '✦ PRO VÉRIFIÉ',
    badgeClass: 'bg-indigo-900 text-indigo-100 border border-indigo-700 shadow-indigo-900/30',
    description: 'Pour agences immobilières, boutiques et producteurs.',
    multiplierText: 'Visibilité maximale & Vitrine Pro',
    highlightColor: 'indigo',
    features: [
      'Toutes les options de la Formule VIP Gold',
      'Page boutique dédiée avec logo & coordonnées',
      'Badge officiel « Vendeur Professionnel Certifié »',
      'Lien direct vers votre site web ou catalogue',
      'Statistiques de performance détaillées (vues, clics, leads)',
      'Conseiller client dédié sur WhatsApp 7j/7'
    ]
  }
];

export const getPlanById = (id: string): PricingPlan => {
  return PRICING_PLANS.find((p) => p.id === id) || PRICING_PLANS[0];
};
