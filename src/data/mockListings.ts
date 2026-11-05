import { Listing } from '../types';

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'sc-001',
    title: 'Superbe Villa Contemporaine avec piscine à débordement & vue Atlas',
    description: 'Propriété d’architecte de 650 m² habitables sur un parc arboré de 5 000 m². 5 suites parentales avec dressing, marbre de Carrare, domotique complète, spa privé, hammam beldi en zellige de Fès et logement pour le personnel. Idéalement située dans le triangle d’or de la Palmeraie, sécurisée 24/7.',
    price: 8900000,
    priceNegotiable: true,
    category: 'immobilier',
    subcategory: 'villas',
    condition: 'Neuf',
    city: 'Marrakech',
    sector: 'Palmeraie',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    plan: 'vip',
    createdAt: 'Il y a 2h',
    viewsCount: 1420,
    likesCount: 98,
    featured: true,
    premiumExpiresAt: new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString(),
    isPremiumExpired: false,
    totalRevenueGenerated: 89,
    seller: {
      id: 'sel-01',
      name: 'Atlas Prestige Immobilier',
      type: 'professionnel',
      phone: '+212 661 24 55 90',
      whatsapp: '212661245590',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      reviewCount: 47,
      memberSince: 'Mars 2022',
      city: 'Marrakech',
      verified: true,
      badge: 'Agence Partenaire Agréée'
    },
    attributes: {
      'Surface habitable': '650 m²',
      'Terrain': '5 000 m²',
      'Chambres': '5 suites',
      'Piscine': 'À débordement chauffée'
    }
  },
  {
    id: 'sc-002',
    title: 'Coffret d’Or Blanc du Souss : Huile d’Argan Pure IGP & Safran de Taliouine',
    description: 'Coffret d’exception issu directement de notre coopérative féminine certifiée BIO et IGP dans le Souss. Comprend 2 flacons de 500ml d’huile d’argan cosmétique et alimentaire pressée à froid de l’année, ainsi que 5g de safran rouge pur pistils de Taliouine (Récolte d’octobre). Emballage cadeau artisanal en bois de thuya d’Essaouira.',
    price: 650,
    priceNegotiable: false,
    category: 'nourriture',
    subcategory: 'terroir-argan-safran',
    condition: 'Neuf',
    city: 'Agadir',
    sector: 'Founty (Baie des Palmiers)',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
    ],
    plan: 'boost',
    createdAt: 'Il y a 4h',
    viewsCount: 680,
    likesCount: 64,
    featured: true,
    seller: {
      id: 'sel-02',
      name: 'Lalla Fatima - Terroir Souss',
      type: 'professionnel',
      phone: '+212 672 88 11 34',
      whatsapp: '212672881134',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      reviewCount: 112,
      memberSince: 'Janvier 2023',
      city: 'Agadir',
      verified: true,
      badge: 'Producteur Certifié Bio'
    },
    attributes: {
      'Certification': 'ONSSA & Bio Ecocert',
      'Origine': 'Taroudant & Taliouine',
      'Contenance': '1L Argan + 5g Safran'
    }
  },
  {
    id: 'sc-003',
    title: 'iPhone 16 Pro Max 512GB Titane Naturel Sous Blister Garanti Maroc',
    description: 'iPhone 16 Pro Max 512 Go couleur Titane Naturel. Neuf dans sa boîte d’origine scellée avec facture d’achat magasin agréé Apple au Maroc. Garantie 2 ans constructeur valable partout au Maroc. Débloqué tous opérateurs (Maroc Telecom, Inwi, Orange). Remise en main propre sécurisée à Rabat Agdal.',
    price: 15400,
    priceNegotiable: true,
    category: 'objets-quotidien',
    subcategory: 'smartphones-hightech',
    condition: 'Neuf',
    city: 'Rabat',
    sector: 'Agdal',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1200&q=80'
    ],
    plan: 'vip',
    createdAt: 'Il y a 5h',
    viewsCount: 2150,
    likesCount: 140,
    featured: true,
    seller: {
      id: 'sel-03',
      name: 'Amine Tech Store',
      type: 'particulier',
      phone: '+212 614 99 20 15',
      whatsapp: '212614992015',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 4.8,
      reviewCount: 39,
      memberSince: 'Août 2023',
      city: 'Rabat',
      verified: true
    },
    attributes: {
      'Capacité': '512 Go',
      'Couleur': 'Titane Naturel',
      'État': 'Scellé neuf',
      'Garantie': '24 Mois'
    }
  },
  {
    id: 'sc-004',
    title: 'Porsche Macan GTS 440ch 2023 - Entretien Exclusif Centre Porsche Maroc',
    description: 'Véhicule de première main acheté neuf chez Centre Porsche Maroc (CAC). 28 000 km certifiés avec carnet et historique complet. Peinture Noir Intense métallisé, pack intérieur cuir étendu et surpiqûres craie, échappement sport PSE, suspensions pneumatiques PASM, toit ouvrant panoramique, jantes 21 pouces RS Spyder. État irréprochable proche du neuf, jamais accidenté.',
    price: 885000,
    priceNegotiable: true,
    category: 'autres',
    subcategory: 'voitures-motos',
    condition: 'Comme neuf',
    city: 'Tanger',
    sector: 'Malabata',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
    ],
    plan: 'vip',
    createdAt: 'Il y a 6h',
    viewsCount: 3410,
    likesCount: 220,
    featured: true,
    seller: {
      id: 'sel-04',
      name: 'Youssef El Alami',
      type: 'particulier',
      phone: '+212 663 88 44 21',
      whatsapp: '212663884421',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      reviewCount: 15,
      memberSince: 'Octobre 2021',
      city: 'Tanger',
      verified: true,
      badge: 'Vendeur VIP Vérifié'
    },
    attributes: {
      'Année': '2023',
      'Kilométrage': '28 000 km',
      'Boîte': 'Automatique PDK',
      'Carburant': 'Essence V6 Biturbo'
    }
  },
  {
    id: 'sc-005',
    title: 'Appartement Haut Standing Front de Mer avec Grande Terrasse Vue Océan',
    description: 'Magnifique 185 m² situé au 4ème étage d’une résidence privée ultra-sécurisée à Ain Diab. Grand salon lumineux avec baies vitrées coulissantes donnant sur l’océan, cuisine italienne entièrement équipée Gaggenau, 3 chambres dont une suite parentale avec dressing et salle de bain marbre. 2 places de garage titrées et box.',
    price: 4350000,
    priceNegotiable: true,
    category: 'immobilier',
    subcategory: 'appartements-vente',
    condition: 'Comme neuf',
    city: 'Casablanca',
    sector: 'Ain Diab',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    plan: 'pro',
    createdAt: 'Il y a 1 jour',
    viewsCount: 1890,
    likesCount: 110,
    seller: {
      id: 'sel-05',
      name: 'Casablanca Living Luxury',
      type: 'professionnel',
      phone: '+212 522 36 10 10',
      whatsapp: '212661889900',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      reviewCount: 88,
      memberSince: 'Février 2021',
      city: 'Casablanca',
      verified: true,
      badge: 'Agence Partenaire Agréée'
    },
    attributes: {
      'Surface': '185 m²',
      'Chambres': '3',
      'Terrasse': '35 m² vue mer',
      'Étage': '4ème avec ascenseur'
    }
  },
  {
    id: 'sc-006',
    title: 'Assortiment Royal Pâtisserie Fine Marocaine pour Fêtes & Événements',
    description: 'Boîte de prestige 2,5 kg comprenant les meilleures créations faites à la main avec amandes beldi fraîches et miel d’oranger pur : Cornes de gazelle fines à la fleur d’oranger distillée, Briouates dorées au miel, M’hancha aux pistaches, et Kaab Ghzal glacées. Préparé sur commande le jour même.',
    price: 450,
    priceNegotiable: false,
    category: 'nourriture',
    subcategory: 'patisseries-marocaines',
    condition: 'Neuf',
    city: 'Rabat',
    sector: 'Souissi',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
    ],
    plan: 'boost',
    createdAt: 'Il y a 1 jour',
    viewsCount: 920,
    likesCount: 82,
    seller: {
      id: 'sel-06',
      name: 'Pâtisserie Fleur d’Oranger Rabat',
      type: 'professionnel',
      phone: '+212 662 11 44 77',
      whatsapp: '212662114477',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      reviewCount: 65,
      memberSince: 'Avril 2023',
      city: 'Rabat',
      verified: true,
      badge: 'Maître Artisan Pâtissier'
    },
    attributes: {
      'Poids net': '2.5 kg',
      'Ingrédients': '100% Amandes Beldi & Miel',
      'Conservation': '3 semaines'
    }
  },
  {
    id: 'sc-007',
    title: 'Montre Rolex Submariner Date Acier Oystersteel Cadran Noir - Full Set',
    description: 'Authentique Rolex Submariner Date référence 126610LN. Boîte d’origine, surboîte, carte de garantie internationale officielle 5 ans tamponnée par concessionnaire officiel Maroc, maillons supplémentaires et livret. Jamais polie, portée seulement lors de rares cérémonies. Expertise possible chez horloger agréé à Casablanca.',
    price: 138000,
    priceNegotiable: false,
    category: 'objets-quotidien',
    subcategory: 'montres-bijoux',
    condition: 'Très bon état',
    city: 'Casablanca',
    sector: 'Anfa Supérieur',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80'
    ],
    plan: 'vip',
    createdAt: 'Il y a 2 jours',
    viewsCount: 3100,
    likesCount: 195,
    seller: {
      id: 'sel-07',
      name: 'Karim Horlogerie Privée',
      type: 'professionnel',
      phone: '+212 661 17 88 90',
      whatsapp: '212661178890',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      reviewCount: 54,
      memberSince: 'Mai 2021',
      city: 'Casablanca',
      verified: true,
      badge: 'Horloger Certifié'
    },
    attributes: {
      'Marque': 'Rolex',
      'Modèle': 'Submariner Date 126610LN',
      'Mouvement': 'Automatique Calibre 3235',
      'Étanchéité': '300 mètres'
    }
  },
  {
    id: 'sc-008',
    title: 'Riad Historique du XVIIe Siècle Entièrement Restauré - 6 Suites & Bassin',
    description: 'Véritable chef-d’œuvre architectural au cœur de la médina de Fès El Bali, accessible en voiture à 50 mètres. Patio majestueux avec fontaine en marbre sculpté, zelliges d’époque parfaitement préservés, plâtres ciselés à la main, terrasse panoramique avec vue 360° sur toute la vieille ville et les collines de Zalagh. Autorisation maison d’hôtes 1ère catégorie en règle.',
    price: 4200000,
    priceNegotiable: true,
    category: 'immobilier',
    subcategory: 'riads',
    condition: 'Très bon état',
    city: 'Fès',
    sector: 'Médina Fès El Bali',
    images: [
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?auto=format&fit=crop&w=1200&q=80'
    ],
    plan: 'vip',
    createdAt: 'Il y a 32 jours',
    viewsCount: 2200,
    likesCount: 178,
    featured: false,
    premiumExpiresAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    isPremiumExpired: true,
    totalRevenueGenerated: 89,
    seller: {
      id: 'sel-08',
      name: 'Dar Al Andalus Immobilier',
      type: 'professionnel',
      phone: '+212 668 44 22 10',
      whatsapp: '212668442210',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      reviewCount: 31,
      memberSince: 'Septembre 2022',
      city: 'Fès',
      verified: true,
      badge: 'Expert Médina Patrimoine'
    },
    attributes: {
      'Surface au sol': '280 m²',
      'Surface habitable': '520 m²',
      'Suites': '6 climatisées',
      'Licence': 'Maison d’hôtes active'
    }
  },
  {
    id: 'sc-009',
    title: 'Caftan Royal Haute Couture en Soie Pure & Zwak Maâlem Doré 24k',
    description: 'Pièce unique haute couture créée par une grande maison casablancaise. Tissu en crêpe de soie pure couleur vert émeraude impérial, broderie traditionnelle au fil d’or pur réalisée pendant 3 mois par les meilleurs Maâlems de Rabat. Ceinture (Mdamma) sertie de pierres fines assorties. Porté une seule fois lors d’un mariage.',
    price: 6800,
    priceNegotiable: true,
    category: 'objets-quotidien',
    subcategory: 'mode-caftans',
    condition: 'Comme neuf',
    city: 'Casablanca',
    sector: 'Gauthier',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80'
    ],
    plan: 'gratuit',
    createdAt: 'Il y a 3 jours',
    viewsCount: 840,
    likesCount: 76,
    seller: {
      id: 'sel-09',
      name: 'Salma K.',
      type: 'particulier',
      phone: '+212 664 77 19 22',
      whatsapp: '212664771922',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      rating: 4.7,
      reviewCount: 12,
      memberSince: 'Novembre 2023',
      city: 'Casablanca',
      verified: true
    },
    attributes: {
      'Taille': '38 - 42 adaptable',
      'Matière': '100% Soie sauvage',
      'Travail': 'Maâlem or filigrané'
    }
  },
  {
    id: 'sc-010',
    title: 'Salon Marocain Moderne en Bois de Cèdre Massif Ciselé & Velours Italien',
    description: 'Ensemble de salon complet d’une longueur totale de 12 mètres linéaires. Structure en cèdre de l’Atlas sculpté à la main, mousses haute résilience (Richbond Premium HR35), banquettes revêtues de velours antitache italien gris perle et touches dorées. Comprend 2 grandes tables d’angle octogonales, 1 grande table centrale et 6 poufs assortis.',
    price: 19500,
    priceNegotiable: true,
    category: 'objets-quotidien',
    subcategory: 'mobilier-deco',
    condition: 'Très bon état',
    city: 'Casablanca',
    sector: 'Bourgogne',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    ],
    plan: 'boost',
    createdAt: 'Il y a 3 jours',
    viewsCount: 1100,
    likesCount: 92,
    seller: {
      id: 'sel-10',
      name: 'Artisanat & Décoration Maroc',
      type: 'professionnel',
      phone: '+212 661 50 40 30',
      whatsapp: '212661504030',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      reviewCount: 78,
      memberSince: 'Juin 2022',
      city: 'Casablanca',
      verified: true,
      badge: 'Atelier d’Ébénisterie'
    },
    attributes: {
      'Longueur': '12 mètres',
      'Bois': 'Cèdre naturel de l’Atlas',
      'Mousse': 'Richbond HR 35'
    }
  },
  {
    id: 'sc-011',
    title: 'Miel Pur d’Euphorbe (Daghmous) & Miel de Thym Sauvage de l’Atlas',
    description: 'Lot de 3 pots de 1 kg de miel pur 100% naturel récolté par nos apiculteurs nomades dans les hauteurs du Haut Atlas et la région de Guelmim. Réputé pour ses vertus tonifiantes et respiratoires, goût piquant et caractéristique du Daghmous authentique. Analyses de laboratoire fournies sur demande.',
    price: 490,
    priceNegotiable: false,
    category: 'nourriture',
    subcategory: 'miels-amlou',
    condition: 'Neuf',
    city: 'Marrakech',
    sector: 'Guéliz',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
    ],
    plan: 'gratuit',
    createdAt: 'Il y a 4 jours',
    viewsCount: 530,
    likesCount: 45,
    seller: {
      id: 'sel-11',
      name: 'Rucher Bio de l’Atlas',
      type: 'particulier',
      phone: '+212 665 30 20 10',
      whatsapp: '212665302010',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      reviewCount: 28,
      memberSince: 'Décembre 2023',
      city: 'Marrakech',
      verified: true
    },
    attributes: {
      'Quantité': '3 x 1 kg',
      'Variétés': 'Daghmous & Thym Sauvage',
      'Origine': 'Haut Atlas marocain'
    }
  },
  {
    id: 'sc-012',
    title: 'Bateau de Plaisance Boston Whaler 320 Outrage - Place au Port Marina Smir',
    description: 'Unité exceptionnelle de 2021 motorisée par 2 x Mercury Verado 300ch (180 heures de marche). Équipement électronique Simrad complet avec radar, sondeur 3D et pilote automatique. Cabine couchette, sellerie marine neuve, taud de soleil, échelle de bain et guindeau électrique. Possibilité de reprise de la place d’amarrage à Marina Smir.',
    price: 1650000,
    priceNegotiable: true,
    category: 'autres',
    subcategory: 'nautisme-jetski',
    condition: 'Comme neuf',
    city: 'Tétouan',
    sector: 'Marina Smir',
    images: [
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80'
    ],
    plan: 'vip',
    createdAt: 'Il y a 5 jours',
    viewsCount: 2950,
    likesCount: 160,
    featured: true,
    seller: {
      id: 'sel-12',
      name: 'Nautica North Yachting',
      type: 'professionnel',
      phone: '+212 661 99 77 00',
      whatsapp: '212661997700',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      reviewCount: 42,
      memberSince: 'Mai 2020',
      city: 'Tétouan',
      verified: true,
      badge: 'Courtier Maritime Partenaire'
    },
    attributes: {
      'Longueur': '9.80 m',
      'Motorisation': '2x 300ch Mercury Verado',
      'Heures': '180h',
      'Port d’attache': 'Marina Smir Tétouan'
    }
  }
];

export const formatPriceDH = (price: number): string => {
  return new Intl.NumberFormat('fr-MA', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(price) + ' DH';
};
