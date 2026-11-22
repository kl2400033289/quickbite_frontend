import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ArrowRight, Sparkles, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EnrichedRestaurant } from '../../types/api';

interface FeaturedRestaurantsProps {
  restaurants: EnrichedRestaurant[];
}

export const FeaturedRestaurants: React.FC<FeaturedRestaurantsProps> = ({ restaurants }) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const featured = restaurants.slice(0, 3);

  return (
    <section className="py-20 bg-warm-100/60 border-b border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-olive-700 bg-olive-100 px-3 py-1 rounded-full border border-olive-200">
              <Sparkles className="w-3.5 h-3.5 text-olive-600" />
              Chef Spotlight
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-editorial text-charcoal-900 tracking-tight">
              Featured Kitchens of Distinction
            </h2>
            <p className="text-sm sm:text-base text-charcoal-700 max-w-xl">
              Award-winning establishments renowned for impeccable culinary technique and consistency.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-sm font-bold text-tangerine-600 hover:text-tangerine-700 transition-colors group"
          >
            <span>See All Kitchens</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featured.map((restaurant) => {
            const isFav = favorites.includes(restaurant.restaurantId);
            return (
              <motion.div
                key={restaurant.restaurantId}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl overflow-hidden border border-warm-200 shadow-card hover:shadow-card-hover transition-all flex flex-col group relative"
              >
                {/* Image showcase */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={restaurant.heroImageUrl || restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent" />

                  {/* Favorite button */}
                  <button
                    onClick={() => toggleFavorite(restaurant.restaurantId)}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-charcoal-700 hover:text-rose-500 transition-colors shadow-sm"
                    aria-label="Add to favorites"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                  </button>

                  {/* Michelin / High Rating Badge */}
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-amber-500/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-xs font-bold text-charcoal-950">
                        <Star className="w-3.5 h-3.5 fill-charcoal-950" />
                        <span>{restaurant.rating}</span>
                      </div>
                      <span className="text-xs font-medium text-warm-200">
                        ({restaurant.reviewCount} reviews)
                      </span>
                    </div>
                    <h3 className="font-editorial text-2xl font-bold text-white tracking-wide">
                      {restaurant.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <p className="text-xs text-charcoal-700 leading-relaxed">
                      {restaurant.tagline}
                    </p>

                    {/* Featured items pills */}
                    {restaurant.featuredDishes && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-charcoal-700 flex items-center gap-1">
                          <ChefHat className="w-3.5 h-3.5 text-tangerine-500" />
                          Signature Creations
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {restaurant.featuredDishes.map((dish, i) => (
                            <span
                              key={i}
                              className="text-xs px-2.5 py-1 rounded-lg bg-warm-100 text-charcoal-800 font-medium border border-warm-200/60"
                            >
                              {dish}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-warm-200/60 flex items-center justify-between">
                    <div className="text-xs text-charcoal-700">
                      <span>Delivery in </span>
                      <span className="font-bold text-charcoal-900">{restaurant.deliveryTimeMinutes} mins</span>
                    </div>

                    <Link
                      to={`/restaurant/${restaurant.restaurantId}`}
                      className="px-4 py-2 bg-charcoal-900 hover:bg-tangerine-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span>Explore Menu</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
