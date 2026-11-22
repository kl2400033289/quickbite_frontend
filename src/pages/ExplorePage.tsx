import React, { useEffect, useState } from 'react';
import { Search, Star, Clock, MapPin, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { restaurantService } from '../services/restaurantService';
import { EnrichedRestaurant } from '../types/api';
import { RestaurantCardSkeleton } from '../components/common/LoadingSkeleton';

const CUISINE_FILTERS = [
  'All',
  'American & BBQ',
  'North Indian & Mughlai',
  'Italian & Artisanal Pizza',
  'Japanese & Pan-Asian',
  'Healthy & Organic Bowls',
  'French Desserts & Bakery',
];

export const ExplorePage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<EnrichedRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'delivery' | 'name'>('rating');
  const [minRating45, setMinRating45] = useState(false);

  useEffect(() => {
    let mounted = true;
    restaurantService
      .listRestaurants()
      .then((data) => {
        if (mounted) {
          setRestaurants(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = restaurants
    .filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCuisine =
        selectedCuisine === 'All' || r.cuisine.toLowerCase() === selectedCuisine.toLowerCase();
      const matchesRating = minRating45 ? r.rating >= 4.8 : true;
      return matchesSearch && matchesCuisine && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'delivery') return a.deliveryTimeMinutes - b.deliveryTimeMinutes;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="pt-28 pb-20 bg-warm-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-tangerine-600 bg-tangerine-50 px-3 py-1 rounded-full border border-tangerine-200">
            Culinary Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-editorial text-charcoal-900 tracking-tight">
            Explore All Restaurants
          </h1>
          <p className="text-sm sm:text-base text-charcoal-700 max-w-xl">
            Discover {restaurants.length} distinguished dining establishments offering instant kitchen dispatch.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-warm-200 shadow-card space-y-5">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-charcoal-700 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by restaurant name, location, or cuisine..."
                className="w-full pl-11 pr-4 py-3 bg-warm-50 border border-warm-200 rounded-2xl text-sm text-charcoal-900 placeholder-charcoal-700 focus:outline-none focus:ring-2 focus:ring-tangerine-500/30 focus:border-tangerine-500 transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-charcoal-700" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'delivery' | 'name')}
                className="px-4 py-3 bg-warm-50 border border-warm-200 rounded-2xl text-sm font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-tangerine-500/30"
              >
                <option value="rating">Sort: Highest Rated</option>
                <option value="delivery">Sort: Fastest Delivery</option>
                <option value="name">Sort: Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Cuisine Pill Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-warm-100">
            <span className="text-xs font-bold text-charcoal-700 flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Cuisine:
            </span>
            {CUISINE_FILTERS.map((cuisine) => {
              const isActive = selectedCuisine === cuisine;
              return (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-tangerine-500 text-white shadow-xs'
                      : 'bg-warm-100 hover:bg-warm-200 text-charcoal-700'
                  }`}
                >
                  {cuisine}
                </button>
              );
            })}

            <button
              onClick={() => setMinRating45(!minRating45)}
              className={`ml-auto px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                minRating45
                  ? 'bg-amber-400 text-charcoal-900 shadow-xs'
                  : 'bg-warm-100 text-charcoal-700 hover:bg-warm-200'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>4.8+ Only</span>
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs font-bold text-charcoal-700 px-1">
          <span>Showing {filtered.length} kitchens</span>
          {(searchQuery || selectedCuisine !== 'All' || minRating45) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCuisine('All');
                setMinRating45(false);
              }}
              className="text-tangerine-600 hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Grid of Restaurant Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-warm-200 space-y-4">
            <p className="text-xl font-bold text-charcoal-900">No restaurants match your filters</p>
            <p className="text-sm text-charcoal-700">Try broadening your search or resetting active filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((restaurant) => (
              <Link
                key={restaurant.restaurantId}
                to={`/restaurant/${restaurant.restaurantId}`}
                className="bg-white rounded-3xl overflow-hidden border border-warm-200 shadow-card hover:shadow-card-hover transition-all flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-warm-100">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent opacity-60" />

                  {/* Rating Tag */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-charcoal-900 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{restaurant.rating}</span>
                    <span className="text-[10px] text-charcoal-700">({restaurant.reviewCount})</span>
                  </div>

                  {/* Cuisine */}
                  <div className="absolute bottom-3 left-4 bg-charcoal-900/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {restaurant.cuisine}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-charcoal-900 group-hover:text-tangerine-600 transition-colors">
                        {restaurant.name}
                      </h3>
                      <span className="text-xs font-bold text-olive-700 bg-olive-50 px-2 py-0.5 rounded border border-olive-200">
                        {restaurant.priceRange}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-charcoal-700">
                      <MapPin className="w-3.5 h-3.5 text-warm-400 shrink-0" />
                      <span className="truncate">{restaurant.location}</span>
                    </div>

                    <p className="text-xs text-charcoal-700 line-clamp-2 pt-1 leading-relaxed">
                      {restaurant.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-warm-100 flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1 text-charcoal-700">
                      <Clock className="w-3.5 h-3.5 text-tangerine-500" />
                      <span>{restaurant.deliveryTimeMinutes} mins delivery</span>
                    </span>

                    <span className="text-tangerine-600 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      View Menu →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
