import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Sparkles, Flame } from 'lucide-react';
import { AnimatedCustomer } from '../characters/AnimatedCustomer';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { EnrichedMenuItem } from '../../types/api';

const SHOWCASE_DISHES: (EnrichedMenuItem & { restaurantName: string })[] = [
  {
    menuItemId: 101,
    restaurantId: 1,
    restaurantName: 'The Charcoal Bistro & Grill',
    name: 'Smoked Wagyu Smash Burger',
    price: 499.00,
    description: 'Double grilled patties, melted aged cheddar, caramelized shallots, brioche bun, and secret sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80',
    category: 'Burgers',
    isVegetarian: false,
    isBestseller: true,
  },
  {
    menuItemId: 301,
    restaurantId: 3,
    restaurantName: 'Osteria Napoli 1889',
    name: 'Truffle Burrata Woodfire Pizza',
    price: 649.00,
    description: 'Fresh artisanal burrata center, wild forest mushrooms, black truffle paste, and aromatic basil.',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80',
    category: 'Pizza',
    isVegetarian: true,
    isBestseller: true,
  },
  {
    menuItemId: 201,
    restaurantId: 2,
    restaurantName: 'Saffron & Spice Courtyard',
    name: 'Hyderabadi Dum Gosht Biryani',
    price: 549.00,
    description: 'Aged basmati rice layered with tender marinated lamb shank, saffron strands, and ghee.',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
    category: 'Biryani',
    isVegetarian: false,
    isBestseller: true,
  },
  {
    menuItemId: 601,
    restaurantId: 6,
    restaurantName: 'L’Atelier Sucré Pâtisserie',
    name: 'Valrhona Chocolate Fondant',
    price: 379.00,
    description: 'Warm French molten chocolate cake with a cascading liquid dark ganache center and vanilla bean gelato.',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80',
    category: 'Desserts',
    isVegetarian: true,
    isBestseller: true,
  },
];

export const SignatureDishes: React.FC = () => {
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<number[]>([]);

  const handleAdd = (dish: (typeof SHOWCASE_DISHES)[0]) => {
    const success = addItem({
      menuItemId: dish.menuItemId,
      restaurantId: dish.restaurantId,
      restaurantName: dish.restaurantName,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      imageUrl: dish.imageUrl,
      isVegetarian: dish.isVegetarian,
    });

    if (success) {
      setAddedIds((prev) => [...prev, dish.menuItemId]);
      setTimeout(() => {
        setAddedIds((prev) => prev.filter((id) => id !== dish.menuItemId));
      }, 1800);
    }
  };

  return (
    <section className="py-20 bg-warm-50 border-b border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header with Maya Customer Companion */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="text-center md:text-left space-y-3 flex-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-tangerine-600 bg-tangerine-50 px-3.5 py-1 rounded-full border border-tangerine-200">
              <Flame className="w-3.5 h-3.5 text-tangerine-500" />
              Gastronomy Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-editorial text-charcoal-900 tracking-tight">
              Signature Chef Creations
            </h2>
            <p className="text-sm sm:text-base text-charcoal-700">
              Handcrafted with uncompromising culinary passion. Tap to add directly to your order tray.
            </p>
          </div>

          {/* Living Character: Maya presenting signature food */}
          <div className="shrink-0 pointer-events-none">
            <AnimatedCustomer
              variant="guide"
              size="md"
              speechBubble="These artisan plates are sensational! 😋"
              badge="Chef's Choice"
            />
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SHOWCASE_DISHES.map((dish) => {
            const isRecentlyAdded = addedIds.includes(dish.menuItemId);
            return (
              <motion.div
                key={dish.menuItemId}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl overflow-hidden border border-warm-200 shadow-card hover:shadow-card-hover transition-all flex flex-col group"
              >
                {/* Food Image */}
                <div className="relative h-48 overflow-hidden bg-warm-100">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Veg / Non-veg indicator */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-1.5 rounded-lg shadow-xs">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        dish.isVegetarian ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      title={dish.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                    />
                  </div>

                  {dish.isBestseller && (
                    <div className="absolute top-3 right-3 bg-charcoal-900/90 backdrop-blur-xs text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>Bestseller</span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-tangerine-600 uppercase tracking-wider">
                      {dish.restaurantName}
                    </div>
                    <h3 className="font-bold text-base text-charcoal-900 group-hover:text-tangerine-600 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-charcoal-700 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-warm-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-charcoal-700 block">Price</span>
                      <span className="text-base font-extrabold text-charcoal-900">
                        {formatCurrency(dish.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAdd(dish)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                        isRecentlyAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-tangerine-500 hover:bg-tangerine-600 text-white shadow-xs hover:shadow-glow-tangerine'
                      }`}
                    >
                      {isRecentlyAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Tray</span>
                        </>
                      )}
                    </button>
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
