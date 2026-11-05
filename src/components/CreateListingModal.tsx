import React, { useState } from 'react';
import {
  X, Check, Crown, Sparkles, Building2, Smartphone, UtensilsCrossed,
  ArrowRight, ArrowLeft, Upload, MapPin, Tag, ShieldCheck,
  CreditCard, CheckCircle2, AlertCircle, Image as ImageIcon
} from 'lucide-react';
import { CategoryId, Listing, ListingPlanId } from '../types';
import { CATEGORIES } from '../data/categories';
import { MOROCCAN_CITIES, getCityByName } from '../data/moroccoLocations';
import { PRICING_PLANS, getPlanById } from '../data/pricingPlans';
import { formatPriceDH } from '../data/mockListings';
import { walletService } from '../services/walletService';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated: (newListing: Listing) => void;
  initialPlan?: ListingPlanId;
}

// Sample luxury image presets by category for quick preview
const SAMPLE_IMAGE_PRESETS: Record<CategoryId, string[]> = {
  'immobilier': [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
  ],
  'objets-quotidien': [
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
  ],
  'nourriture': [
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
  ],
  'autres': [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
  ]
};

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onListingCreated,
  initialPlan = 'vip'
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('immobilier');
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [priceNegotiable, setPriceNegotiable] = useState(true);
  const [condition, setCondition] = useState<Listing['condition']>('Neuf');
  const [description, setDescription] = useState('');

  // Location in Morocco
  const [city, setCity] = useState('Casablanca');
  const [sector, setSector] = useState('Gauthier');

  // Seller info
  const [sellerName, setSellerName] = useState('Karim Benjelloun');
  const [phone, setPhone] = useState('+212 661 23 45 67');
  const [whatsapp, setWhatsapp] = useState('212661234567');

  // Selected formula
  const [selectedPlan, setSelectedPlan] = useState<ListingPlanId>(initialPlan);

  // Images
  const [images, setImages] = useState<string[]>([SAMPLE_IMAGE_PRESETS['immobilier'][0]]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Payment simulator state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');

  if (!isOpen) return null;

  // Selected city object for sectors
  const selectedCityObj = getCityByName(city) || MOROCCAN_CITIES[0];
  const activeCategoryObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  const handleCityChange = (newCityName: string) => {
    setCity(newCityName);
    const found = getCityByName(newCityName);
    if (found && found.sectors.length > 0) {
      setSector(found.sectors[0]);
    }
  };

  const handleCategoryChange = (newCat: CategoryId) => {
    setCategory(newCat);
    const catObj = CATEGORIES.find((c) => c.id === newCat);
    if (catObj && catObj.subcategories.length > 0) {
      setSubcategory(catObj.subcategories[0].id);
    }
    // Update default image preset
    if (images.length === 1 && SAMPLE_IMAGE_PRESETS[category].includes(images[0])) {
      setImages([SAMPLE_IMAGE_PRESETS[newCat][0]]);
    }
  };

  const handleAddPresetImage = (url: string) => {
    if (!images.includes(url)) {
      setImages([...images, url]);
    }
  };

  const handleAddCustomImage = () => {
    if (customImageUrl.trim()) {
      setImages([...images, customImageUrl.trim()]);
      setCustomImageUrl('');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Create local object URLs for instant preview
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        newUrls.push(URL.createObjectURL(files[i]));
      }
      setImages([...images, ...newUrls]);
    }
  };

  const handleSubmitListing = async () => {
    const chosenPlan = getPlanById(selectedPlan);
    const listingId = `sc-user-${Date.now()}`;
    const listingTitle = title.trim() || 'Annonce d’exception sans titre';
    const userEmail = phone ? `${phone.replace(/\D/g, '')}@soukclass.ma` : 'client@soukclass.ma';

    // If paid plan, perform real server-side payment flow
    if (chosenPlan.price > 0) {
      setIsProcessingPayment(true);
      try {
        // 1. Create Payment Intent on the server (starts as PENDING_VERIFICATION)
        const intentRes = await walletService.createPaymentIntent({
          listingId,
          listingTitle,
          planId: selectedPlan,
          userEmail,
          userId: `usr-${Date.now()}`
        });

        if (intentRes.success && intentRes.intent?.transactionId) {
          // 2. Perform server-side HMAC gateway verification (Simulating CMI 3D-Secure success token)
          const gatewayToken = `CMI_AUTH_TOKEN_${Date.now()}`;
          const verifyRes = await walletService.verifyGatewayPayment(
            intentRes.intent.transactionId,
            gatewayToken
          );

          if (verifyRes.success) {
            setPaymentSuccess(true);
            const premiumExpiresAt = verifyRes.transaction?.premiumExpiresAt || 
              new Date(Date.now() + chosenPlan.durationDays * 24 * 3600 * 1000).toISOString();
            completeCreation(listingId, premiumExpiresAt, chosenPlan.price);
          } else {
            alert('Échec de la validation bancaire : ' + (verifyRes.error || 'Erreur inconnue'));
          }
        } else {
          // Fallback creation
          completeCreation(listingId, new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(), chosenPlan.price);
        }
      } catch (err) {
        console.error('Error during payment processing:', err);
        completeCreation(listingId, new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(), chosenPlan.price);
      } finally {
        setIsProcessingPayment(false);
      }
    } else {
      completeCreation(listingId);
    }
  };

  const completeCreation = (
    listingId: string,
    premiumExpiresAt?: string,
    revenueGenerated: number = 0
  ) => {
    const chosenPlan = getPlanById(selectedPlan);
    const newListing: Listing = {
      id: listingId,
      title: title || 'Annonce d’exception sans titre',
      description: description || 'Magnifique bien mis en vente sur la plateforme SoukClass Maroc.',
      price: typeof price === 'number' ? price : 1000,
      priceNegotiable,
      category,
      subcategory: subcategory || activeCategoryObj.subcategories[0]?.id || 'divers',
      condition,
      city,
      sector,
      images: images.length > 0 ? images : [SAMPLE_IMAGE_PRESETS[category][0]],
      plan: selectedPlan,
      createdAt: 'À l’instant',
      viewsCount: 1,
      likesCount: 0,
      featured: selectedPlan === 'vip' || selectedPlan === 'boost',
      premiumExpiresAt,
      isPremiumExpired: false,
      totalRevenueGenerated: revenueGenerated,
      seller: {
        id: `sel-me-${Date.now()}`,
        name: sellerName || 'Vendeur SoukClass',
        type: selectedPlan === 'pro' ? 'professionnel' : 'particulier',
        phone: phone || '+212 600 00 00 00',
        whatsapp: whatsapp.replace(/\D/g, '') || '212600000000',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 5.0,
        reviewCount: 1,
        memberSince: 'Aujourd’hui',
        city,
        verified: true,
        badge: selectedPlan === 'pro' ? 'Vendeur Pro Vérifié' : selectedPlan === 'vip' ? 'Membre VIP' : undefined
      },
      attributes: {
        'Localisation': `${city} (${sector})`,
        'Formule': chosenPlan.name,
        'Garantie SoukClass': 'Vérifiée',
        'Validité': chosenPlan.price > 0 ? `${chosenPlan.durationDays} jours garantis` : 'Standard'
      }
    };

    onListingCreated(newListing);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              SoukClass Maroc • Déposer une annonce
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
              Mettre en vente un bien d’exception
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80 flex items-center justify-between text-xs font-semibold shrink-0 overflow-x-auto">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              1
            </span>
            <span>Détails & Catégorie</span>
          </div>
          <div className="w-8 h-[2px] bg-slate-200" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              2
            </span>
            <span>Photos & Description</span>
          </div>
          <div className="w-8 h-[2px] bg-slate-200" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              3
            </span>
            <span>Ville & Secteur</span>
          </div>
          <div className="w-8 h-[2px] bg-slate-200" />
          <div className={`flex items-center gap-2 ${step >= 4 ? 'text-amber-700' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step >= 4 ? 'bg-amber-500 text-white font-bold' : 'bg-slate-200 text-slate-600'
            }`}>
              4
            </span>
            <span>Choix de la Formule</span>
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Details & Category */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Category Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Choisissez la Catégorie
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/30'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="font-extrabold text-sm text-slate-900 block">{cat.name}</span>
                        <span className="text-[11px] text-slate-500 mt-1 line-clamp-1">{cat.tagline}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Sous-catégorie spécifique
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {activeCategoryObj.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} — ({sub.description})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Titre de l’annonce
                </label>
                <input
                  type="text"
                  placeholder="Ex : Superbe Villa contemporaine avec piscine, iPhone 16 Pro Max, Argan Bio..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Price & Negotiation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Prix en Dirhams Marocains (DH)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Ex : 4500000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                      className="w-full pl-4 pr-14 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-base focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                      DH
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Négociation du prix
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPriceNegotiable(true)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        priceNegotiable
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600 bg-white'
                      }`}
                    >
                      Prix Négociable
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceNegotiable(false)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        !priceNegotiable
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600 bg-white'
                      }`}
                    >
                      Prix Fixe
                    </button>
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  État de l’objet / bien
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Neuf', 'Comme neuf', 'Très bon état', 'Bon état', 'Pour pièces'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCondition(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        condition === c
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Photos & Description */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Image previews */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Photos du bien ({images.length} sélectionnée{images.length > 1 ? 's' : ''})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                      <img src={imgUrl} alt="Aperçu" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100 cursor-pointer"
                        title="Supprimer la photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white font-bold">
                          Principale
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Add photo trigger */}
                  <label className="aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:text-emerald-700 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[11px] font-bold">Importer photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Sample HD Presets for quick selection */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">
                  Ou choisissez parmi nos photos d’illustration haute qualité pour cette catégorie :
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {SAMPLE_IMAGE_PRESETS[category].map((presetUrl, i) => (
                    <img
                      key={i}
                      src={presetUrl}
                      alt="Preset"
                      onClick={() => handleAddPresetImage(presetUrl)}
                      className="w-16 h-12 rounded-lg object-cover border border-slate-200 cursor-pointer hover:scale-105 transition-transform shrink-0"
                      title="Cliquer pour ajouter"
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description complète de votre annonce
                </label>
                <textarea
                  rows={5}
                  placeholder="Décrivez précisément votre produit ou propriété au Maroc : état, dimensions, facture, garantie, quartier, conditions de livraison ou de visite..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Morocco Location & Contact */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200/80 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950">
                  <p className="font-bold">Localisation précise au Maroc</p>
                  <p>
                    Les acheteurs sur SoukClass filtrent principalement par ville et par quartier. Sélectionnez précisément votre secteur pour maximiser vos contacts.
                  </p>
                </div>
              </div>

              {/* Moroccan City */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ville au Maroc
                </label>
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {MOROCCAN_CITIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.region})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Sectors for the chosen city */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Quartier / Secteur à {city}
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {selectedCityObj.sectors.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seller details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Votre Nom ou Nom de Boutique
                  </label>
                  <input
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Numéro de Téléphone Marocain
                  </label>
                  <input
                    type="tel"
                    placeholder="+212 6..."
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setWhatsapp(e.target.value.replace(/\D/g, ''));
                    }}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Monetization & Visibility Formulas */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="text-center max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  Options de Mise en Avant & Tarifs
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Choisissez la formule idéale pour votre annonce
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Du plan gratuit sans frais aux formules VIP Gold pour vendre en moins de 48 heures au Maroc.
                </p>
              </div>

              {/* The 4 Monetization Formula Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRICING_PLANS.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  const isFree = plan.price === 0;
                  const isVip = plan.id === 'vip';
                  const isBoost = plan.id === 'boost';

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? isVip
                            ? 'border-amber-500 bg-amber-50/40 shadow-xl ring-2 ring-amber-400/40'
                            : isBoost
                            ? 'border-emerald-500 bg-emerald-50/40 shadow-lg ring-2 ring-emerald-400/40'
                            : 'border-slate-900 bg-slate-50 shadow-md ring-2 ring-slate-900/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {/* Checkmark circle when selected */}
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${plan.badgeClass}`}>
                            {plan.badgeText}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-base mt-1.5">{plan.name}</h4>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-slate-900 text-white' : 'border border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      {/* Price in DH */}
                      <div className="my-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-slate-950">
                            {isFree ? '0 DH' : `${plan.price} DH`}
                          </span>
                          {!isFree && <span className="text-xs text-slate-500">({plan.durationDays} jours)</span>}
                        </div>
                        <p className="text-xs font-semibold text-emerald-700 mt-0.5">{plan.multiplierText}</p>
                      </div>

                      {/* Key features */}
                      <ul className="text-xs text-slate-600 space-y-1.5 border-t border-slate-100 pt-3">
                        {plan.features.slice(0, 3).map((feat, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Payment preview if paid plan */}
              {selectedPlan !== 'gratuit' && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      <span className="font-bold text-xs uppercase tracking-wide text-slate-200">
                        Paiement en Ligne Sécurisé par Carte
                      </span>
                    </div>
                    <span className="text-amber-400 font-black text-sm">
                      Total : {getPlanById(selectedPlan).price} DH
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-2">
                    <span>Moyen : Carte Bancaire marocaine / Visa / Mastercard</span>
                    <span className="text-emerald-400 font-semibold">Validation & Activation immédiate</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 rounded-xl text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Précédent
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              Étape suivante
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isProcessingPayment}
              onClick={handleSubmitListing}
              className={`px-6 py-2.5 rounded-xl text-white text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                selectedPlan === 'vip'
                  ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:brightness-105 shadow-amber-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
              }`}
            >
              {isProcessingPayment ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Paiement & Activation...
                </>
              ) : selectedPlan === 'gratuit' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Publier Gratuitement (0 DH)
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Régler {getPlanById(selectedPlan).price} DH & Publier en VIP
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
