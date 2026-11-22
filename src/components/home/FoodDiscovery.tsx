import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EnrichedRestaurant } from '../../types/api';
import { AnimatedRider } from '../characters/AnimatedRider';

const CATEGORIES = [
  { id: 'ALL', label: 'All Cuisines', icon: '🍽️' },
  { id: 'Indian', label: 'Indian & Mughlai', icon: '🍛' },
  { id: 'Burgers', label: 'Gourmet Burgers', icon: '🍔' },
  { id: 'Pizza', label: 'Artisanal Pizza', icon: '🍕' },
  { id: 'Asian', label: 'Pan-Asian & Ramen', icon: '🍜' },
  { id: 'Healthy', label: 'Healthy & Bowls', icon: '🥗' },
  { id: 'Desserts', label: 'French Pâtisserie', icon: '🍰' },
];

interface FoodDiscoveryProps {
  restaurants: EnrichedRestaurant[];
  isLoading: boolean;
}

export const FoodDiscovery: React.FC<FoodDiscoveryProps> = ({ restaurants, isLoading }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      r.cuisine.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="discovery" className="py-20 bg-warm-50 border-b border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-tangerine-600 bg-tangerine-50 px-3 py-1 rounded-full border border-tangerine-200/50">
              Curated Discovery
            </span>
            <div className="flex items-center gap-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-editorial text-charcoal-900 tracking-tight">
                Flavors Crafted to Perfection
              </h2>
              <div className="shrink-0 pointer-events-none">
                <AnimatedRider
                  size="xs"
                  speechBubble="Explore by dish or restaurant! 🛵"
                  badge="Express"
                />
              </div>
            </div>
            <p className="text-sm sm:text-base text-charcoal-700 max-w-xl">
              Filter by culinary craving or search your favorite neighborhood dining establishments.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-charcoal-700 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes or restaurants..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-warm-300 rounded-2xl text-sm text-charcoal-900 placeholder-charcoal-700 focus:outline-none focus:ring-2 focus:ring-tangerine-500/30 focus:border-tangerine-500 transition-all shadow-subtle"
            />
          </div>
        </div>

        {/* Category Chips Scrollbar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-md shadow-charcoal-900/10'
                    : 'bg-white text-charcoal-700 border-warm-200 hover:border-warm-400 hover:bg-warm-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Restaurant Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-4 border border-warm-200 shadow-card animate-pulse space-y-4">
                <div className="w-full h-48 bg-warm-200 rounded-2xl" />
                <div className="h-6 bg-warm-200 rounded w-2/3" />
                <div className="h-4 bg-warm-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-warm-200 p-8 space-y-3">
            <p className="text-lg font-bold text-charcoal-900">No restaurants found matching your criteria</p>
            <p className="text-sm text-charcoal-700">Try adjusting your search query or selecting a different cuisine filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 bg-warm-100 hover:bg-warm-200 text-charcoal-800 text-xs font-semibold rounded-full transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <motion.div
                key={restaurant.restaurantId}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl overflow-hidden border border-warm-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col group"
              >
                {/* Image Container */}
                <div className="relative h-52 overflow-hidden bg-warm-100">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent opacity-60" />

                  {/* Rating Tag */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-charcoal-900 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{restaurant.rating}</span>
                    <span className="text-[10px] text-charcoal-700 font-normal">({restaurant.reviewCount})</span>
                  </div>

                  {/* Price range & Delivery time pills */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="px-2.5 py-0.5 rounded-full bg-charcoal-900/80 backdrop-blur-xs">
                      {restaurant.cuisine}
                    </span>
                    <span className="flex items-center gap-1 bg-charcoal-900/80 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3 h-3 text-tangerine-400" />
                      <span>{restaurant.deliveryTimeMinutes} mins</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg text-charcoal-900 group-hover:text-tangerine-600 transition-colors">
                        {restaurant.name}
                      </h3>
                      <span className="text-xs font-bold text-olive-600 bg-olive-50 px-2 py-0.5 rounded border border-olive-200">
                        {restaurant.priceRange}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-charcoal-700">
                      <MapPin className="w-3.5 h-3.5 text-warm-400 shrink-0" />
                      <span className="truncate">{restaurant.location}</span>
                    </div>

                    <p className="text-xs text-charcoal-700 line-clamp-2 pt-1 leading-relaxed">
                      {restaurant.tagline}
                    </p>
                  </div>

                  {/* Action Link */}
                  <Link
                    to={`/restaurant/${restaurant.restaurantId}`}
                    className="w-full py-2.5 px-4 bg-warm-100 hover:bg-tangerine-500 hover:text-white text-charcoal-800 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <span>View Menu &amp; Order</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
