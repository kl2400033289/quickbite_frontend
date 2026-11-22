import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { formatCurrency } from '../utils/formatters';
import { soundEngine } from '../utils/soundEffects';

export const CheckoutPage: React.FC = () => {
  const { items, restaurantId, restaurantName, grandTotal, subtotal, deliveryFee, platformFee, taxes, clearCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Address inputs
  const [address, setAddress] = useState({
    street: '42, 100ft Road, HAL 2nd Stage, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    phone: '+91 98765 43210',
    instructions: 'Ring the doorbell or leave with concierge.',
  });

  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'QUICKPAY'>('QUICKPAY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-warm-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-3xl border border-warm-200 shadow-card space-y-4">
          <h2 className="text-2xl font-bold font-editorial text-charcoal-900">No Items to Checkout</h2>
          <p className="text-sm text-charcoal-700">Your tray is empty. Add dishes before heading to checkout.</p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-tangerine-500 text-white rounded-full text-sm font-semibold"
          >
            Explore Menus
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) return;

    if (!address.street.trim() || !address.phone.trim()) {
      setErrorMessage('Please provide a complete delivery street and phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Submit order to Order Service via API Gateway
      const orderPayload = {
        userId: user?.userId || 1,
        restaurantId: restaurantId,
        totalAmount: grandTotal,
      };

      const orderResponse = await orderService.placeOrder(orderPayload);
      soundEngine.playOrderSuccess();

      // Order created and payment processed securely
      clearCart();

      // Navigate to Payment Result screen with orderId and status
      navigate(
        `/payment-result?orderId=${orderResponse.orderId}&status=${orderResponse.status}&amount=${orderResponse.totalAmount}&restaurantName=${encodeURIComponent(
          restaurantName || 'Restaurant'
        )}`
      );
    } catch (err: unknown) {
      setErrorMessage(
        (err as Error)?.message ||
          'Order processing failed. Please check backend connection or retry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-warm-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tangerine-600 bg-tangerine-50 px-3 py-1 rounded-full border border-tangerine-200">
            Secure QuickBite Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-editorial text-charcoal-900 mt-2">
            Finalize Your Order
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700">
            Fulfilling from <span className="font-bold text-charcoal-900">{restaurantName}</span>
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Delivery Address & Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Details Card */}
            <div className="bg-white rounded-3xl p-6 border border-warm-200 shadow-card space-y-4">
              <div className="flex items-center gap-2 text-charcoal-900 font-bold text-base pb-3 border-b border-warm-100">
                <MapPin className="w-5 h-5 text-tangerine-500" />
                <span>Delivery Destination</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Street Address &amp; Landmark
                  </label>
                  <input
                    type="text"
                    required
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-tangerine-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-tangerine-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-tangerine-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-tangerine-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Special Delivery Instructions
                  </label>
                  <input
                    type="text"
                    value={address.instructions}
                    onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
                    placeholder="e.g. Leave with gate security"
                    className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-tangerine-500/30"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-3xl p-6 border border-warm-200 shadow-card space-y-4">
              <div className="flex items-center gap-2 text-charcoal-900 font-bold text-base pb-3 border-b border-warm-100">
                <CreditCard className="w-5 h-5 text-tangerine-500" />
                <span>Payment Orchestration</span>
              </div>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('QUICKPAY')}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    paymentMethod === 'QUICKPAY'
                      ? 'border-tangerine-500 bg-tangerine-50/50'
                      : 'border-warm-200 hover:border-warm-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-tangerine-500 text-white flex items-center justify-center font-bold text-sm">
                      ⚡
                    </div>
                    <div>
                      <div className="text-xs font-bold text-charcoal-900">
                        QuickBite Digital Pay (Recommended)
                      </div>
                      <div className="text-[11px] text-charcoal-700">
                        Synchronous Feign client payment execution via Payment Service (Port 8084)
                      </div>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border border-warm-300 flex items-center justify-center">
                    {paymentMethod === 'QUICKPAY' && (
                      <div className="w-3 h-3 rounded-full bg-tangerine-500" />
                    )}
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'border-tangerine-500 bg-tangerine-50/50'
                      : 'border-warm-200 hover:border-warm-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      UPI
                    </div>
                    <div>
                      <div className="text-xs font-bold text-charcoal-900">Instant UPI &amp; QR</div>
                      <div className="text-[11px] text-charcoal-700">GPay, PhonePe, Paytm, BHIM</div>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border border-warm-300 flex items-center justify-center">
                    {paymentMethod === 'UPI' && (
                      <div className="w-3 h-3 rounded-full bg-tangerine-500" />
                    )}
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    paymentMethod === 'CARD'
                      ? 'border-tangerine-500 bg-tangerine-50/50'
                      : 'border-warm-200 hover:border-warm-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      💳
                    </div>
                    <div>
                      <div className="text-xs font-bold text-charcoal-900">Credit / Debit Card</div>
                      <div className="text-[11px] text-charcoal-700">Visa, Mastercard, RuPay</div>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border border-warm-300 flex items-center justify-center">
                    {paymentMethod === 'CARD' && (
                      <div className="w-3 h-3 rounded-full bg-tangerine-500" />
                    )}
                  </div>
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-charcoal-700">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit TLS encrypted transaction through QuickBite API Gateway</span>
              </div>
            </div>
          </div>

          {/* Right Summary: Items & Price Breakdown */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-warm-200 shadow-card space-y-6">
            <h2 className="text-lg font-bold text-charcoal-900 border-b border-warm-100 pb-3">
              Order Summary
            </h2>

            {/* Compact items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.menuItemId} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-charcoal-900 w-5">{item.quantity}x</span>
                    <span className="text-charcoal-800 truncate max-w-[170px]">{item.name}</span>
                  </div>
                  <span className="font-semibold text-charcoal-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Details */}
            <div className="space-y-2.5 text-xs text-charcoal-700 pt-3 border-t border-warm-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-charcoal-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>{formatCurrency(platformFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (5% GST)</span>
                <span>{formatCurrency(taxes)}</span>
              </div>
              <div className="border-t border-warm-200 pt-3 flex justify-between text-base font-extrabold text-charcoal-900">
                <span>Total Amount Due</span>
                <span className="text-tangerine-600 text-lg">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-tangerine-500 hover:bg-tangerine-600 disabled:opacity-60 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-glow-tangerine transition-all hover:scale-[1.01] active:scale-[0.99] text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Orchestrating Order &amp; Payment...</span>
                </>
              ) : (
                <>
                  <span>Pay &amp; Place Order ({formatCurrency(grandTotal)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="p-3 bg-warm-50 rounded-xl border border-warm-200/80 text-[11px] text-charcoal-700 space-y-1">
              <div className="font-semibold text-charcoal-900 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Backend Orchestration Note</span>
              </div>
              <p>
                Triggers <code>POST /api/orders</code> on the Order Service, which automatically invokes the Payment Service via OpenFeign client to complete the transaction.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
