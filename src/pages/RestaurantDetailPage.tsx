import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  MapPin,
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  Check,
} from 'lucide-react';
import { restaurantService } from '../services/restaurantService';
import { EnrichedMenuItem, EnrichedRestaurant } from '../types/api';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { DishCardSkeleton } from '../components/common/LoadingSkeleton';

export const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const restaurantId = Number(id);
  const [restaurant, setRestaurant] = useState<EnrichedRestaurant | null>(null);
  const [menuItems, setMenuItems] = useState<EnrichedMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [recentAddedId, setRecentAddedId] = useState<number | null>(null);

  const { items, addItem, updateQuantity, setIsCartOpen, itemCount, grandTotal } = useCart();

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    Promise.all([
      restaurantService.getRestaurant(restaurantId),
      restaurantService.listMenu(restaurantId),
    ])
      .then(([restData, menuData]) => {
        if (mounted) {
          setRestaurant(restData);
          setMenuItems(menuData);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [restaurantId]);

  const categories = ['All', ...Array.from(new Set(menuItems.map((m) => m.category || 'Mains')))];

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const handleAddToCart = (item: EnrichedMenuItem) => {
    if (!restaurant) return;
    const ok = addItem({
      menuItemId: item.menuItemId,
      restaurantId: restaurant.restaurantId,
      restaurantName: restaurant.name,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
      isVegetarian: item.isVegetarian,
    });

    if (ok) {
      setRecentAddedId(item.menuItemId);
      setTimeout(() => setRecentAddedId(null), 1500);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="w-full h-72 bg-warm-200 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <DishCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="pt-32 pb-20 text-center max-w-lg mx-auto px-4 space-y-4">
        <h2 className="text-2xl font-bold text-charcoal-900">Restaurant Not Found</h2>
        <p className="text-sm text-charcoal-700">The requested establishment could not be retrieved from the backend service.</p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-tangerine-500 text-white font-semibold rounded-full text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-28 bg-warm-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-xs font-bold text-charcoal-700 hover:text-charcoal-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Restaurants</span>
        </Link>

        {/* Restaurant Hero Card */}
        <div className="relative rounded-4xl overflow-hidden shadow-xl border border-warm-200 bg-charcoal-950 text-white">
          <div className="relative h-72 sm:h-80 overflow-hidden">
            <img
              src={restaurant.heroImageUrl || restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />

            {/* Floating details over image */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-tangerine-500/90 text-white backdrop-blur-xs">
                    {restaurant.cuisine}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/20 text-warm-100">
                    {restaurant.priceRange}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black font-editorial tracking-tight text-white">
                  {restaurant.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-warm-300">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-tangerine-400" />
                    <span>{restaurant.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-tangerine-400" />
                    <span>{restaurant.deliveryTimeMinutes} mins prep &amp; dispatch</span>
                  </div>
                </div>
              </div>

              {/* Rating Box */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-charcoal-950 font-black text-lg">
                  <Star className="w-5 h-5 fill-charcoal-950" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-white">{restaurant.rating} / 5.0</div>
                  <div className="text-[11px] text-warm-300">{restaurant.reviewCount} customer reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold font-editorial text-charcoal-900">
                Crafted Menu Offerings
              </h2>
              <p className="text-xs text-charcoal-700">Freshly prepared to order upon kitchen confirmation.</p>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-charcoal-900 text-white'
                      : 'bg-white text-charcoal-700 hover:bg-warm-100 border border-warm-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Dishes List */}
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-warm-200 space-y-2">
              <p className="font-bold text-charcoal-900">No items available in this category</p>
              <p className="text-xs text-charcoal-700">Please choose another tab or check back shortly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((dish) => {
                const cartMatch = items.find((i) => i.menuItemId === dish.menuItemId);
                const isJustAdded = recentAddedId === dish.menuItemId;

                return (
                  <div
                    key={dish.menuItemId}
                    className="bg-white rounded-3xl p-5 border border-warm-200 shadow-card hover:shadow-card-hover transition-all flex justify-between gap-4 group"
                  >
                    {/* Item Details */}
                    <div className="flex-1 space-y-2 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              dish.isVegetarian ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            title={dish.isVegetarian ? 'Veg' : 'Non-Veg'}
                          />
                          {dish.isBestseller && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                              <Sparkles className="w-3 h-3" />
                              Bestseller
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-base text-charcoal-900 group-hover:text-tangerine-600 transition-colors">
                          {dish.name}
                        </h3>

                        <p className="text-xs text-charcoal-700 line-clamp-2 leading-relaxed">
                          {dish.description}
                        </p>
                      </div>

                      <div className="pt-2 text-base font-extrabold text-charcoal-900">
                        {formatCurrency(dish.price)}
                      </div>
                    </div>

                    {/* Image & Add Button */}
                    <div className="relative flex flex-col items-center justify-between shrink-0 w-32">
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="w-28 h-28 rounded-2xl object-cover bg-warm-100 shadow-xs"
                        loading="lazy"
                      />

                      {/* Add or Quantity Controls */}
                      <div className="mt-2 w-full">
                        {cartMatch ? (
                          <div className="flex items-center justify-between bg-warm-100 rounded-xl p-1 border border-warm-200">
                            <button
                              onClick={() => updateQuantity(dish.menuItemId, -1)}
                              className="w-7 h-7 rounded-lg bg-white text-charcoal-800 flex items-center justify-center hover:bg-warm-200 transition-colors shadow-xs"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold text-charcoal-900">
                              {cartMatch.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(dish.menuItemId, 1)}
                              className="w-7 h-7 rounded-lg bg-tangerine-500 text-white flex items-center justify-center hover:bg-tangerine-600 transition-colors shadow-xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(dish)}
                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs ${
                              isJustAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-tangerine-500 hover:bg-tangerine-600 text-white hover:shadow-glow-tangerine'
                            }`}
                          >
                            {isJustAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add to Tray</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Trigger Pill at Bottom */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-charcoal-950 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-charcoal-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-tangerine-500 text-white flex items-center justify-center text-xs font-bold">
                {itemCount}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold">Tray Ready ({itemCount} items)</div>
                <div className="text-[11px] text-warm-300">From {restaurant.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-tangerine-400">
                {formatCurrency(grandTotal)}
              </span>
              <span className="text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1">
                <span>View Tray</span>
                <ShoppingBag className="w-3.5 h-3.5 text-tangerine-400" />
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
