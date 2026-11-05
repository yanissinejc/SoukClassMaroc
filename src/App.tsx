import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles, Crown, MapPin, Search, PlusCircle, Heart,
  MessageSquare, AlertCircle, CheckCircle2,
  SlidersHorizontal, Home, Grid, User, CreditCard
} from 'lucide-react';
import {
  CategoryId, Conversation, FilterState, Listing, ListingPlanId
} from './types';
import { INITIAL_LISTINGS } from './data/mockListings';
import { MOROCCAN_CITIES } from './data/moroccoLocations';
import { CATEGORIES } from './data/categories';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { FilterBar } from './components/FilterBar';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { CreateListingModal } from './components/CreateListingModal';
import { PricingModal } from './components/PricingModal';
import { ChatModal } from './components/ChatModal';
import { FavoritesModal } from './components/FavoritesModal';
import { AdminWalletModal } from './components/AdminWalletModal';
import { walletService } from './services/walletService';
import { Footer } from './components/Footer';

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    listingId: 'sc-001',
    listingTitle: 'Superbe Villa Contemporaine avec piscine à débordement',
    listingImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    listingPrice: 8900000,
    sellerName: 'Atlas Prestige Immobilier',
    sellerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    messages: [
      {
        id: 'm1',
        senderId: 'sel-01',
        senderName: 'Atlas Prestige',
        text: 'Salam alaykoum ! Marhba bik, la villa à la Palmeraie est disponible pour une visite privée cette semaine.',
        timestamp: '10:45',
        isMe: false
      },
      {
        id: 'm2',
        senderId: 'me',
        senderName: 'Moi',
        text: 'Bonjour, le titre foncier est-il individuel et la propriété titrée ?',
        timestamp: '10:50',
        isMe: true
      },
      {
        id: 'm3',
        senderId: 'sel-01',
        senderName: 'Atlas Prestige',
        text: 'Oui tout à fait, titre foncier net et conforme, permis d’habiter récent disponible sur place.',
        timestamp: '10:52',
        isMe: false
      }
    ]
  }
];

export default function App() {
  // Listings State with Local Storage persistence
  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const saved = localStorage.getItem('soukclass_listings');
      return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
    } catch {
      return INITIAL_LISTINGS;
    }
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('soukclass_favorites');
      return saved ? JSON.parse(saved) : ['sc-001', 'sc-003'];
    } catch {
      return ['sc-001', 'sc-003'];
    }
  });

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    subcategory: '',
    city: 'all',
    sector: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    plan: 'all',
    sortBy: 'recent'
  });

  // Modals state
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAdminWalletOpen, setIsAdminWalletOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatListing, setActiveChatListing] = useState<Listing | null>(null);
  const [selectedPlanForCreate, setSelectedPlanForCreate] = useState<ListingPlanId>('vip');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin Wallet Balance and in-app online payments (synchronized with backend)
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('soukclass_admin_balance');
      return saved ? Number(saved) : 505;
    } catch {
      return 505;
    }
  });

  const refreshWalletStats = async () => {
    try {
      const stats = await walletService.getStats();
      if (stats) {
        setWalletBalance(stats.availableBalance);
        localStorage.setItem('soukclass_admin_balance', stats.availableBalance.toString());
      }
    } catch (err) {
      console.warn('Could not fetch wallet stats:', err);
    }
  };

  useEffect(() => {
    refreshWalletStats();
    // Synchronize listing expirations automatically
    walletService.checkExpiry().then((res) => {
      if (res && res.listings && res.listings.length > 0) {
        setListings((prev) =>
          prev.map((l) => {
            const serverMatch = res.listings.find((item: any) => item.listingId === l.id);
            if (serverMatch) {
              return {
                ...l,
                isPremiumExpired: serverMatch.isExpired,
                premiumExpiresAt: serverMatch.expiresAt,
                totalRevenueGenerated: serverMatch.totalGeneratedDH
              };
            }
            return l;
          })
        );
      }
    }).catch(() => {});
  }, []);

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('soukclass_chats');
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('soukclass_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('soukclass_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('soukclass_chats', JSON.stringify(conversations));
  }, [conversations]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Annonce retirée de vos favoris');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Annonce ajoutée à vos favoris ❤️');
        return [...prev, id];
      }
    });
  };

  // Handle open listing detail
  const handleOpenListing = (listing: Listing) => {
    setSelectedListing(listing);
    setIsDetailOpen(true);
    // Increment view count
    setListings((prev) =>
      prev.map((l) => (l.id === listing.id ? { ...l, viewsCount: l.viewsCount + 1 } : l))
    );
  };

  // Handle in-app chat
  const handleOpenChat = (listing: Listing, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveChatListing(listing);
    setIsChatOpen(true);

    // Create conversation if doesn't exist yet
    setConversations((prev) => {
      const found = prev.find((c) => c.listingId === listing.id);
      if (found) return prev;
      return [
        {
          id: `conv-${Date.now()}`,
          listingId: listing.id,
          listingTitle: listing.title,
          listingImage: listing.images[0],
          listingPrice: listing.price,
          sellerName: listing.seller.name,
          sellerAvatar: listing.seller.avatar,
          messages: [
            {
              id: `m-init-${Date.now()}`,
              senderId: listing.seller.id,
              senderName: listing.seller.name,
              text: `Salam ! Merci pour votre intérêt pour mon annonce "${listing.title}". Que puis-je faire pour vous ?`,
              timestamp: 'À l’instant',
              isMe: false
            }
          ]
        },
        ...prev
      ];
    });
  };

  const handleSendMessage = (listingId: string, text: string) => {
    const newMessage = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      senderName: 'Moi',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.listingId === listingId) {
          return {
            ...c,
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    // Simulate realistic Moroccan seller auto reply after 1.5s
    setTimeout(() => {
      const sellerReplies = [
        "Marhba ! Oui c'est toujours disponible. Vous êtes dans quelle ville ?",
        "Je peux vous faire un petit geste sur le prix en Dirhams si vous venez récupérer l'article aujourd'hui.",
        "Parfait, contactez-moi également sur WhatsApp si vous souhaitez une vidéo détaillée de l'objet !",
        "Je suis disponible cet après-midi pour vous faire visiter ou examiner le produit."
      ];
      const randomReply = sellerReplies[Math.floor(Math.random() * sellerReplies.length)];

      setConversations((prev) =>
        prev.map((c) => {
          if (c.listingId === listingId) {
            return {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `reply-${Date.now()}`,
                  senderId: 'seller',
                  senderName: c.sellerName,
                  text: randomReply,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isMe: false
                }
              ]
            };
          }
          return c;
        })
      );
    }, 1500);
  };

  // Handle new listing created with automatic wallet credit for admin
  const handleListingCreated = (newListing: Listing) => {
    setListings((prev) => [newListing, ...prev]);
    setIsCreateOpen(false);
    refreshWalletStats();

    if (newListing.plan !== 'gratuit') {
      showToast(`Paiement en ligne vérifié et versé sur votre compte admin !`);
    } else {
      showToast(`Annonce publiée avec succès en formule gratuite !`);
    }

    setSelectedListing(newListing);
    setIsDetailOpen(true);
  };

  // Handle premium renewal for a listing
  const handleListingRenewed = (renewedListing: Listing) => {
    setListings((prev) =>
      prev.map((l) => (l.id === renewedListing.id ? renewedListing : l))
    );
    setSelectedListing(renewedListing);
    refreshWalletStats();
    showToast(`Mise en avant Premium de 30 jours renouvelée avec succès !`);
  };

  // Filter & sort logic
  const filteredListings = useMemo(() => {
    return listings
      .filter((listing) => {
        // Search Query
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = listing.title.toLowerCase().includes(q);
          const matchDesc = listing.description.toLowerCase().includes(q);
          const matchCity = listing.city.toLowerCase().includes(q);
          const matchSector = listing.sector.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCity && !matchSector) return false;
        }

        // Category
        if (filters.category !== 'all' && listing.category !== filters.category) {
          return false;
        }

        // Subcategory
        if (filters.subcategory && listing.subcategory !== filters.subcategory) {
          return false;
        }

        // City
        if (filters.city !== 'all' && listing.city.toLowerCase() !== filters.city.toLowerCase()) {
          return false;
        }

        // Sector
        if (filters.sector && listing.sector.toLowerCase() !== filters.sector.toLowerCase()) {
          return false;
        }

        // Price range
        if (filters.minPrice !== '' && listing.price < Number(filters.minPrice)) {
          return false;
        }
        if (filters.maxPrice !== '' && listing.price > Number(filters.maxPrice)) {
          return false;
        }

        // Condition
        if (filters.condition && listing.condition !== filters.condition) {
          return false;
        }

        // Plan
        if (filters.plan !== 'all' && listing.plan !== filters.plan) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // VIP and Boost prioritization weight
        const getPriorityWeight = (plan: ListingPlanId) => {
          if (plan === 'vip') return 3;
          if (plan === 'boost') return 2;
          if (plan === 'pro') return 2;
          return 1;
        };

        if (filters.sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (filters.sortBy === 'price-desc') {
          return b.price - a.price;
        }
        if (filters.sortBy === 'popular') {
          return b.viewsCount - a.viewsCount;
        }

        // Default: Sort by VIP rank first, then recent
        const weightDiff = getPriorityWeight(b.plan) - getPriorityWeight(a.plan);
        if (weightDiff !== 0) return weightDiff;
        return 0;
      });
  }, [listings, filters]);

  // VIP listings for hero carousel
  const vipListings = useMemo(() => {
    return listings.filter((l) => l.plan === 'vip');
  }, [listings]);

  // Count by category
  const listingCountsByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: listings.length };
    CATEGORIES.forEach((cat) => {
      counts[cat.id] = listings.filter((l) => l.category === cat.id).length;
    });
    return counts;
  }, [listings]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-emerald-700 selection:text-white pb-16 sm:pb-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/30 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        selectedCity={filters.city}
        onSelectCity={(city) => setFilters((f) => ({ ...f, city, sector: '' }))}
        favoritesCount={favorites.length}
        unreadMessagesCount={conversations.length}
        onOpenCreateListing={() => {
          setSelectedPlanForCreate('vip');
          setIsCreateOpen(true);
        }}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenMessages={() => {
          setActiveChatListing(listings[0]);
          setIsChatOpen(true);
        }}
        onOpenAdminWallet={() => setIsAdminWalletOpen(true)}
        walletBalance={walletBalance}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters((f) => ({ ...f, searchQuery: q }))}
      />

      {/* Hero Banner (Shown when no deep search is active) */}
      {!filters.searchQuery && filters.category === 'all' && (
        <HeroBanner
          searchQuery={filters.searchQuery}
          onSearchChange={(q) => setFilters((f) => ({ ...f, searchQuery: q }))}
          selectedCategory={filters.category}
          onSelectCategory={(cat) => setFilters((f) => ({ ...f, category: cat, subcategory: '' }))}
          selectedCity={filters.city}
          onSelectCity={(city) => setFilters((f) => ({ ...f, city, sector: '' }))}
          vipListings={vipListings}
          onSelectListing={handleOpenListing}
          onOpenCreateListing={() => {
            setSelectedPlanForCreate('vip');
            setIsCreateOpen(true);
          }}
          onOpenPricing={() => setIsPricingOpen(true)}
        />
      )}

      {/* 4 Core Categories Nav Bar */}
      <CategoryBar
        selectedCategory={filters.category}
        onSelectCategory={(cat) => setFilters((f) => ({ ...f, category: cat }))}
        selectedSubcategory={filters.subcategory}
        onSelectSubcategory={(sub) => setFilters((f) => ({ ...f, subcategory: sub }))}
        listingCountsByCategory={listingCountsByCategory}
      />

      {/* Advanced Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={(newF) => setFilters((f) => ({ ...f, ...newF }))}
        onResetFilters={() =>
          setFilters({
            searchQuery: '',
            category: 'all',
            subcategory: '',
            city: 'all',
            sector: '',
            minPrice: '',
            maxPrice: '',
            condition: '',
            plan: 'all',
            sortBy: 'recent'
          })
        }
        totalResults={filteredListings.length}
      />

      {/* Main Listings Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Results title bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
              {filters.category !== 'all'
                ? CATEGORIES.find((c) => c.id === filters.category)?.name
                : 'Toutes les Annonces Récentes au Maroc'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {filters.city !== 'all' ? `À ${filters.city}` : 'Dans toutes les villes du Maroc'} • Prix en Dirhams (DH)
            </p>
          </div>

          {/* Quick CTA to boost */}
          <button
            onClick={() => setIsPricingOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors cursor-pointer border border-amber-200"
          >
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>Formules de mise en avant</span>
          </button>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Aucune annonce trouvée</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Essayez de modifier votre ville, élargir votre fourchette de prix ou supprimer certains filtres.
            </p>
            <button
              onClick={() =>
                setFilters({
                  searchQuery: '',
                  category: 'all',
                  subcategory: '',
                  city: 'all',
                  sector: '',
                  minPrice: '',
                  maxPrice: '',
                  condition: '',
                  plan: 'all',
                  sortBy: 'recent'
                })
              }
              className="mt-5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isFavorite={favorites.includes(listing.id)}
                onToggleFavorite={handleToggleFavorite}
                onClick={handleOpenListing}
                onOpenChat={handleOpenChat}
              />
            ))}
          </div>
        )}

        {/* Bottom Banner Promoting Site Web Officiel & Paiements Sécurisés */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-10 border border-blue-800/40 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
                Site Web Officiel en Ligne
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-serif text-white">
                Vendez et Achetez Partout au Maroc en Dirhams
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                La plateforme n°1 pour publier vos annonces, booster votre visibilité et recevoir directement vos paiements en ligne sur carte BMCE FastPay.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => setIsAdminWalletOpen(true)}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <CreditCard className="w-4 h-4 text-amber-300" />
                <span>Paiement en ligne ({walletBalance} DH)</span>
              </button>
              <button
                onClick={() => {
                  setSelectedPlanForCreate('vip');
                  setIsCreateOpen(true);
                }}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <PlusCircle className="w-4 h-4" />
                Publier une annonce
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile App Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => {
            setFilters((f) => ({ ...f, category: 'all', subcategory: '' }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-0.5 text-emerald-800"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Accueil</span>
        </button>

        <button
          onClick={() => setIsFavoritesOpen(true)}
          className="flex flex-col items-center gap-0.5 text-slate-600 relative"
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-medium">Favoris</span>
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </button>

        {/* Center Post Button */}
        <button
          onClick={() => {
            setSelectedPlanForCreate('vip');
            setIsCreateOpen(true);
          }}
          className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-800 to-emerald-950 text-white shadow-xl shadow-emerald-900/30 flex items-center justify-center border-2 border-white cursor-pointer"
        >
          <PlusCircle className="w-6 h-6 text-amber-400" />
        </button>

        <button
          onClick={() => {
            setActiveChatListing(listings[0]);
            setIsChatOpen(true);
          }}
          className="flex flex-col items-center gap-0.5 text-slate-600 relative"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium">Messages</span>
        </button>

        <button
          onClick={() => setIsAdminWalletOpen(true)}
          className="flex flex-col items-center gap-0.5 text-blue-700"
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px] font-bold">Paiement</span>
        </button>
      </nav>

      {/* Footer */}
      <Footer
        onSelectCity={(city) => {
          setFilters((f) => ({ ...f, city, sector: '' }));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenFastPayCard={() => setIsAdminWalletOpen(true)}
      />

      {/* Modals */}
      <ListingDetailModal
        listing={selectedListing}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isFavorite={selectedListing ? favorites.includes(selectedListing.id) : false}
        onToggleFavorite={(id) => handleToggleFavorite(id)}
        onOpenChat={(listing) => handleOpenChat(listing)}
        onRenewListing={handleListingRenewed}
      />

      <CreateListingModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onListingCreated={handleListingCreated}
        initialPlan={selectedPlanForCreate}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onSelectPlanAndCreate={(planId) => {
          setSelectedPlanForCreate(planId);
          setIsCreateOpen(true);
        }}
      />

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        listings={listings}
        onToggleFavorite={(id) => handleToggleFavorite(id)}
        onSelectListing={handleOpenListing}
      />

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activeListing={activeChatListing}
        conversations={conversations}
        onSendMessage={handleSendMessage}
      />

      <AdminWalletModal
        isOpen={isAdminWalletOpen}
        onClose={() => setIsAdminWalletOpen(false)}
        onListingUpdated={() => {
          refreshWalletStats();
        }}
      />
    </div>
  );
}
