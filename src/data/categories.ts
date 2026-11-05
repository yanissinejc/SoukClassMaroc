import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'immobilier',
    name: 'Immobilier',
    tagline: 'Villas d’exception, appartements standing & riads',
    iconName: 'Building2',
    badgeColor: 'from-amber-600 to-amber-700',
    featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      { id: 'villas', name: 'Villas de Luxe & Propriétés', description: 'Palmeraie, front de mer, domaines privés' },
      { id: 'appartements-vente', name: 'Appartements Haut Standing', description: 'Duplex, penthouses, résidences fermées' },
      { id: 'riads', name: 'Riads & Maisons Traditionnelles', description: 'Médinas historiques de Marrakech, Fès, Essaouira' },
      { id: 'location-vacances', name: 'Locations Saisonnières & Vacances', description: 'Courte durée, villas avec piscine, conciergerie' },
      { id: 'terrains', name: 'Terrains & Domaines Agricoles', description: 'Zones constructibles, fermes, titrés' },
      { id: 'bureaux-commerces', name: 'Bureaux & Locaux Commerciaux', description: 'Plateaux de bureaux, boutiques, showrooms' }
    ]
  },
  {
    id: 'objets-quotidien',
    name: 'Objets du quotidien',
    tagline: 'High-tech, horlogerie, ameublement & mode de luxe',
    iconName: 'Smartphone',
    badgeColor: 'from-emerald-600 to-emerald-700',
    featuredImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      { id: 'smartphones-hightech', name: 'Téléphones & High-Tech', description: 'iPhones récents, MacBooks, iPad, audio haut de gamme' },
      { id: 'montres-bijoux', name: 'Montres & Haute Horlogerie', description: 'Rolex, Cartier, Omega, or 18k et diamants certifiés' },
      { id: 'mobilier-deco', name: 'Salons Marocains & Décoration Design', description: 'Boiseries nobles, canapés design, lustres artisanaux' },
      { id: 'electromenager', name: 'Électroménager & Maison', description: 'Robots Thermomix, machines à café pro, réfrigérateurs' },
      { id: 'mode-caftans', name: 'Caftans & Mode Haute Couture', description: 'Caftans Maâlem sur mesure, maroquinerie de luxe' },
      { id: 'bricolage-jardin', name: 'Bricolage, Outillage & Jardin', description: 'Équipements de jardinage, outillage de précision' }
    ]
  },
  {
    id: 'nourriture',
    name: 'Nourriture & Terroir',
    tagline: 'Produits du terroir marocain, bio, pâtisseries & épicerie fine',
    iconName: 'UtensilsCrossed',
    badgeColor: 'from-orange-600 to-orange-700',
    featuredImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      { id: 'terroir-argan-safran', name: 'Huile d’Argan & Safran Pur', description: 'Argan certifié bio IGP, Safran pur de Taliouine' },
      { id: 'patisseries-marocaines', name: 'Pâtisserie Royale & Gâteaux de Fête', description: 'Cornes de gazelle beldi, briouates miel d’oranger' },
      { id: 'miels-amlou', name: 'Miels Purs & Amlou Beldi', description: 'Miel d’euphorbe (Daghmous), thym de l’Atlas, amlou amandes' },
      { id: 'produits-bio-frais', name: 'Produits Bio de Ferme & Frais', description: 'Huile d’olive première pression à froid, dattes Majhoul' },
      { id: 'traiteur-evenements', name: 'Traiteurs & Buffets d’Exception', description: 'Mariages, réceptions privées, méchoui royal' },
      { id: 'fruits-de-mer', name: 'Produits de la Mer & Épicerie Fine', description: 'Langoustes de Dakhla, huîtres d’Oualidia, poutargue' }
    ]
  },
  {
    id: 'autres',
    name: 'Autres',
    tagline: 'Véhicules, nautisme, services d’exception & opportunités',
    iconName: 'Sparkles',
    badgeColor: 'from-blue-600 to-indigo-700',
    featuredImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      { id: 'voitures-motos', name: 'Voitures & Véhicules de Prestige', description: 'SUV de luxe, berlines allemandes, motos gros cube' },
      { id: 'nautisme-jetski', name: 'Bateaux, Yachts & Jet-Ski', description: 'Yachts Marina Smir, Jet-skis, équipements marins' },
      { id: 'services-conciergerie', name: 'Services VIP & Conciergerie', description: 'Chauffeurs privés, conciergerie de luxe, gardiennage' },
      { id: 'animaux-equitation', name: 'Chevaux Pur-Sang & Équitation', description: 'Barbes-arabes, selles marocaines d’apparat, élevage' },
      { id: 'materiel-pro', name: 'Matériel Professionnel & BTP', description: 'Équipements CHR, groupes électrogènes, machines pro' },
      { id: 'art-antiquites', name: 'Art Orientaliste & Antiquités', description: 'Tapis berbères anciens Beni Ouarain, poteries de Safi' }
    ]
  }
];

export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find((cat) => cat.id === id);
};
