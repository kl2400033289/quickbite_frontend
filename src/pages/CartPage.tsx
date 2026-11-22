import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

export const CartPage: React.FC = () => {
  const {
    items,
    restaurantName,
    restaurantId,
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

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-3xl border border-warm-200 shadow-card space-y-4">
          <div className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center text-warm-400 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-editorial text-charcoal-900">Your Tray is Empty</h2>
          <p className="text-sm text-charcoal-700">
            You haven't added any dishes yet. Explore our curated kitchens to start your culinary journey.
          </p>
          <div className="pt-2">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-tangerine-500 hover:bg-tangerine-600 text-white rounded-2xl font-bold text-sm shadow-glow-tangerine transition-all"
            >
              <span>Explore Restaurants</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-warm-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-tangerine-600 bg-tangerine-50 px-3 py-1 rounded-full border border-tangerine-200">
              Order Review
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-editorial text-charcoal-900 mt-2">
              Review Your Tray
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-700">
              Dishes selected from <span className="font-semibold text-charcoal-900">{restaurantName}</span>
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-semibold text-charcoal-700 hover:text-rose-600 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Empty Tray</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-warm-200 shadow-card space-y-4">
            <h2 className="text-lg font-bold text-charcoal-900 border-b border-warm-100 pb-3">
              Items ({itemCount})
            </h2>

            <div className="space-y-4 divide-y divide-warm-100">
              {items.map((item) => (
                <div key={item.menuItemId} className="pt-4 first:pt-0 flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover bg-warm-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-charcoal-900 truncate">{item.name}</h3>
                    <p className="text-xs text-tangerine-600 font-bold mt-0.5">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
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

                  <span className="font-bold text-sm text-charcoal-900 w-20 text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeItem(item.menuItemId)}
                    className="text-warm-400 hover:text-rose-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {restaurantId && (
              <div className="pt-4 border-t border-warm-100">
                <Link
                  to={`/restaurant/${restaurantId}`}
                  className="text-xs font-bold text-tangerine-600 hover:text-tangerine-700 inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Add more items from {restaurantName}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Bill Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-warm-200 shadow-card space-y-6">
            <h2 className="text-lg font-bold text-charcoal-900 border-b border-warm-100 pb-3">
              Bill Summary
            </h2>

            <div className="space-y-3 text-xs text-charcoal-700">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span className="font-semibold text-charcoal-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Platform Service Fee</span>
                <span>{formatCurrency(platformFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>{formatCurrency(taxes)}</span>
              </div>
              <div className="border-t border-warm-200 pt-3 flex justify-between text-base font-extrabold text-charcoal-900">
                <span>Grand Total</span>
                <span className="text-tangerine-600 text-lg">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full py-4 bg-tangerine-500 hover:bg-tangerine-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-glow-tangerine transition-all hover:scale-[1.01] active:scale-[0.99] text-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
