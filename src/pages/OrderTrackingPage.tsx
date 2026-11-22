import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Bike,
  Flame,
  ShoppingBag,
  ArrowLeft,
  RefreshCw,
  MapPin,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { restaurantService } from '../services/restaurantService';
import { OrderResponse, EnrichedRestaurant } from '../types/api';
import { formatCurrency, getOrderStatusDetails } from '../utils/formatters';

const TIMELINE_STEPS = [
  { status: 'PLACED', title: 'Order Placed', desc: 'Received & sent to restaurant', icon: ShoppingBag },
  { status: 'ACCEPTED', title: 'Kitchen Confirmed', desc: 'Chef preparing fresh dishes', icon: Flame },
  { status: 'OUT_FOR_DELIVERY', title: 'Out for Delivery', desc: 'Valet en route to your address', icon: Bike },
  { status: 'DELIVERED', title: 'Delivered', desc: 'Enjoy your gourmet meal', icon: CheckCircle2 },
];

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const idNum = Number(orderId);

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [restaurant, setRestaurant] = useState<EnrichedRestaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrderData = async () => {
    try {
      const ord = await orderService.getOrder(idNum);
      setOrder(ord);
      if (ord.restaurantId) {
        try {
          const rest = await restaurantService.getRestaurant(ord.restaurantId);
          setRestaurant(rest);
        } catch {
          // ignore
        }
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
    const interval = setInterval(fetchOrderData, 8000); // Live poll every 8s
    return () => clearInterval(interval);
  }, [idNum]);

  // Demo status advancement helper for evaluation
  const handleAdvanceStatus = async () => {
    if (!order) return;
    const current = order.status.toUpperCase();
    let nextStatus = 'ACCEPTED';
    if (current === 'PLACED') nextStatus = 'ACCEPTED';
    else if (current === 'ACCEPTED') nextStatus = 'OUT_FOR_DELIVERY';
    else if (current === 'OUT_FOR_DELIVERY') nextStatus = 'DELIVERED';
    else if (current === 'DELIVERED') nextStatus = 'PLACED';

    setIsRefreshing(true);
    try {
      const updated = await orderService.updateOrderStatus(order.orderId, nextStatus);
      setOrder(updated);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 max-w-3xl mx-auto px-4 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-tangerine-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-charcoal-700">Connecting to Order Service (Port 8083)...</p>
      </div>
    );
  }

  const currentStatus = (order?.status || 'PLACED').toUpperCase();
  const statusDetails = getOrderStatusDetails(currentStatus);

  const currentStepIndex =
    currentStatus === 'DELIVERED'
      ? 3
      : currentStatus === 'OUT_FOR_DELIVERY'
      ? 2
      : currentStatus === 'ACCEPTED' || currentStatus === 'PREPARING'
      ? 1
      : 0;

  return (
    <div className="pt-28 pb-20 min-h-screen bg-warm-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back and Refresh Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-700 hover:text-charcoal-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Past Orders</span>
          </Link>

          <button
            onClick={() => {
              setIsRefreshing(true);
              fetchOrderData();
            }}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-warm-200 rounded-full text-xs font-semibold text-charcoal-700 hover:bg-warm-100 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-tangerine-500' : ''}`} />
            <span>Live Sync</span>
          </button>
        </div>

        {/* Hero Order Card */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-warm-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-warm-100">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-charcoal-700 font-bold">
                Live Order Tracking
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-editorial text-charcoal-900">
                Order #QB-{order?.orderId || idNum}
              </h1>
              <p className="text-xs text-charcoal-700">
                From <span className="font-bold text-charcoal-900">{restaurant?.name || 'QuickBite Partner Restaurant'}</span>
              </p>
            </div>

            {/* Current status pill */}
            <div className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 ${statusDetails.badgeClass}`}>
              <span className={`w-2 h-2 rounded-full ${statusDetails.dotColor} animate-pulse`} />
              <span>{statusDetails.label}</span>
            </div>
          </div>

          {/* Timeline Visual Progress Tracker */}
          <div className="py-4 space-y-6">
            <div className="grid grid-cols-4 gap-2 relative">
              {/* Progress bar background line */}
              <div className="absolute top-5 left-8 right-8 h-1 bg-warm-200 -z-0" />
              <div
                className="absolute top-5 left-8 h-1 bg-tangerine-500 transition-all duration-700 -z-0"
                style={{ width: `${(currentStepIndex / 3) * 85}%` }}
              />

              {TIMELINE_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.status} className="flex flex-col items-center text-center space-y-2 relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-tangerine-500 text-white shadow-glow-tangerine ring-4 ring-tangerine-100'
                          : isPassed
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-warm-200 text-charcoal-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className={`text-xs font-bold ${isCurrent ? 'text-tangerine-600' : 'text-charcoal-900'}`}>
                        {step.title}
                      </div>
                      <div className="hidden sm:block text-[10px] text-charcoal-700 mt-0.5 max-w-[100px] leading-tight">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Explanation Box */}
          <div className="bg-warm-50 rounded-2xl p-4 border border-warm-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-tangerine-500" />
              <div>
                <span className="font-bold text-charcoal-900">Estimated Delivery: </span>
                <span className="text-charcoal-700">
                  {currentStatus === 'DELIVERED' ? 'Successfully Delivered' : '20 - 30 minutes'}
                </span>
              </div>
            </div>

            <div className="font-bold text-charcoal-900">
              Total: {formatCurrency(order?.totalAmount || 0)}
            </div>
          </div>

          {/* Animated Companion Delivery Buddy */}
          <div className="bg-gradient-to-r from-teal-500/10 via-amber-500/10 to-tangerine-500/10 rounded-2xl p-4 border border-teal-500/20 flex items-center gap-4">
            <div className="w-16 h-16 shrink-0 flex items-center justify-center">
              <img
                src={currentStatus === 'DELIVERED' ? '/assets/characters/biscuit-pup.png' : '/assets/characters/pip-rider.png'}
                alt="QuickBite Delivery Buddy"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-charcoal-900 flex items-center gap-1.5">
                <span>{currentStatus === 'DELIVERED' ? '🐾 Biscuit says:' : '🛵 Pip the Express Rider:'}</span>
              </div>
              <p className="text-xs text-charcoal-700">
                {currentStatus === 'DELIVERED'
                  ? 'Delivery complete! The food is hot, fresh, and Biscuit-approved! Enjoy your meal! 🎉'
                  : currentStatus === 'OUT_FOR_DELIVERY'
                  ? 'I have picked up your order from the kitchen and I am cruising your way now! Stay hungry!'
                  : 'Chef has received your ticket and the pans are sizzling! I am standing by to grab it the moment it is packed!'}
              </p>
            </div>
          </div>

          {/* Demonstration Control for Academic Evaluation */}
          <div className="pt-2 border-t border-warm-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-charcoal-700 text-center sm:text-left">
              Academic demo simulator: Test status progression through <code>PUT /api/orders/{idNum}/status</code>
            </span>

            <button
              onClick={handleAdvanceStatus}
              disabled={isRefreshing}
              className="px-4 py-2 bg-charcoal-900 hover:bg-tangerine-500 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <span>Advance Status</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Microservices Trace Card */}
        <div className="bg-white rounded-3xl p-5 border border-warm-200 shadow-sm text-xs text-charcoal-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-charcoal-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Live Order Journey Trace</span>
          </div>
          <p className="leading-relaxed">
            Data queried dynamically from <strong>Order Service</strong> (<code>http://localhost:8083/api/orders/{idNum}</code>) via Spring Cloud API Gateway (Port 8080).
          </p>
        </div>
      </div>
    </div>
  );
};
