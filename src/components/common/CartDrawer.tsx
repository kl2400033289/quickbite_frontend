import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { AnimatedDog } from '../characters/AnimatedDog';
import { formatCurrency } from '../../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    items,
    restaurantName,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    deliveryFee,
    platformFee,
    taxes,
    grandTotal,
    itemCount,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-warm-50 shadow-2xl z-50 flex flex-col border-l border-warm-200"
          >
            {/* Header */}
            <div className="p-5 border-b border-warm-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tangerine-50 flex items-center justify-center text-tangerine-600">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-lg text-charcoal-900">Your Cart</h2>
                    {items.length > 0 && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        🐾 Biscuit watching order
                      </span>
                    )}
                  </div>
                  {restaurantName && (
                    <p className="text-xs text-charcoal-700 truncate max-w-[200px]">
                      From <span className="font-medium text-charcoal-900">{restaurantName}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    title="Clear Cart"
                    className="p-2 text-charcoal-700 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-charcoal-700 hover:text-charcoal-900 rounded-full hover:bg-warm-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  {/* Biscuit Dog Mascot in Empty Tray */}
                  <AnimatedDog
                    size="md"
                    hasItems={false}
                    speechBubble="Ruff! Fill me up with tasty bites! 🐶"
                    className="mb-1"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-charcoal-900">Your tray is empty</h3>
                    <p className="text-xs text-charcoal-700 mt-1 max-w-xs">
                      Explore top neighborhood restaurants and add culinary favorites to start an order.
                    </p>
                  </div>
                  <Link
                    to="/explore"
                    onClick={() => setIsCartOpen(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-tangerine-500 hover:bg-tangerine-600 text-white rounded-full font-medium text-xs sm:text-sm transition-all shadow-md hover:shadow-glow-tangerine mt-2"
                  >
                    Browse Restaurants
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="bg-white rounded-2xl p-3 border border-warm-200/80 shadow-sm flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-charcoal-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-tangerine-600 font-semibold mt-0.5">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-warm-100 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.menuItemId, -1)}
                        className="w-6 h-6 rounded-full bg-white text-charcoal-800 flex items-center justify-center hover:bg-warm-200 transition-colors shadow-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-charcoal-900 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, 1)}
                        className="w-6 h-6 rounded-full bg-tangerine-500 text-white flex items-center justify-center hover:bg-tangerine-600 transition-colors shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="text-warm-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Living Character: Biscuit Pup Companion in Active Cart */}
            {items.length > 0 && (
              <div className="px-5 py-2.5 bg-gradient-to-r from-warm-100/90 to-amber-50/60 border-t border-warm-200 flex items-center justify-between pointer-events-none">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-charcoal-900 flex items-center gap-1.5">
                    <span>Biscuit is guarding your tray</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                      ✓ Fresh
                    </span>
                  </div>
                  <div className="text-[11px] text-charcoal-700">
                    Ready to dispatch once you place order!
                  </div>
                </div>
                <div className="shrink-0 pointer-events-auto">
                  <AnimatedDog
                    size="xs"
                    hasItems={true}
                    speechBubble="Woof! Ready to checkout! 🐾"
                    badge="Guard Dog"
                  />
                </div>
              </div>
            )}

            {/* Footer Bill & Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-warm-200 bg-white space-y-4">
                <div className="space-y-1.5 text-xs text-charcoal-700">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-charcoal-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Partner Fee</span>
                    <span>{deliveryFee === 0 ? <span className="text-emerald-600 font-medium">FREE</span> : formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Service Fee</span>
                    <span>{formatCurrency(platformFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>{formatCurrency(taxes)}</span>
                  </div>
                  <div className="border-t border-warm-200 pt-2 flex justify-between text-sm font-bold text-charcoal-900">
                    <span>To Pay</span>
                    <span className="text-tangerine-600 font-extrabold">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="flex-1 py-3 px-4 bg-tangerine-500 hover:bg-tangerine-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-glow-tangerine transition-all text-sm active:scale-[0.98]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
