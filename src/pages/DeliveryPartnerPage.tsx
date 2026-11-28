import React, { useEffect, useState } from 'react';
import {
  Bike,
  PackageCheck,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  AlertCircle,
  Navigation,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { restaurantService } from '../services/restaurantService';
import { EnrichedRestaurant, OrderResponse } from '../types/api';
import { formatCurrency, getOrderStatusDetails } from '../utils/formatters';
import { soundEngine } from '../utils/soundEffects';

export const DeliveryPartnerPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [restaurants, setRestaurants] = useState<Record<number, EnrichedRestaurant>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const notify = (type: 'success' | 'error', message: string) => {
    setBanner({ type, message });
    setTimeout(() => setBanner(null), 3500);
  };

  const loadDeliveries = async () => {
    setIsLoading(true);
    try {
      const [allOrders, allRestaurants] = await Promise.all([
        orderService.listOrders(),
        restaurantService.listRestaurants(),
      ]);
      const restMap: Record<number, EnrichedRestaurant> = {};
      allRestaurants.forEach((r) => {
        restMap[r.restaurantId] = r;
      });
      setRestaurants(restMap);
      setOrders(allOrders.sort((a, b) => b.orderId - a.orderId));
    } catch (err: unknown) {
      notify('error', (err as Error)?.message || 'Failed to load delivery queue.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const handleStatusChange = async (orderId: number, nextStatus: 'OUT_FOR_DELIVERY' | 'DELIVERED') => {
    setUpdatingOrderId(orderId);
    try {
      await orderService.updateOrderStatus(orderId, nextStatus);
      soundEngine.playOrderSuccess();
      notify(
        'success',
        nextStatus === 'OUT_FOR_DELIVERY'
          ? `Order #${orderId} picked up and marked OUT FOR DELIVERY.`
          : `Order #${orderId} marked DELIVERED.`
      );
      await loadDeliveries();
    } catch (err: unknown) {
      notify('error', (err as Error)?.message || 'Failed to update delivery status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const readyForPickup = orders.filter((o) =>
    ['ACCEPTED', 'PREPARING'].includes(o.status.toUpperCase())
  );
  const inTransit = orders.filter((o) => o.status.toUpperCase() === 'OUT_FOR_DELIVERY');
  const completed = orders.filter((o) => o.status.toUpperCase() === 'DELIVERED');

  return (
    <div className="pt-28 pb-20 min-h-screen bg-warm-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-tangerine-600 bg-tangerine-50 px-3 py-1 rounded-full border border-tangerine-200">
              Delivery Partner Dispatch
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-editorial text-charcoal-900 mt-2">
              Active Delivery Queue
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-700">
              Claim restaurant-confirmed orders and update real-time transit status via Order Service (:8083).
            </p>
          </div>

          <button
            onClick={loadDeliveries}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-warm-200 rounded-2xl text-xs font-bold text-charcoal-800 hover:bg-warm-100 transition-colors shadow-xs cursor-pointer self-start"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>

        {banner && (
          <div
            className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
              banner.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {banner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{banner.message}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-warm-200 shadow-card flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-charcoal-600 uppercase">Ready for Pickup</div>
              <div className="text-3xl font-black text-charcoal-900 mt-1">{readyForPickup.length}</div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-warm-200 shadow-card flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-charcoal-600 uppercase">In Transit</div>
              <div className="text-3xl font-black text-tangerine-600 mt-1">{inTransit.length}</div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-tangerine-50 text-tangerine-600 flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-warm-200 shadow-card flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-charcoal-600 uppercase">Completed Today</div>
              <div className="text-3xl font-black text-emerald-600 mt-1">{completed.length}</div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Ready + Active Deliveries */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-charcoal-900">Dispatchable &amp; Active Orders</h2>
          {isLoading ? (
            <div className="h-32 bg-white rounded-3xl border border-warm-200 animate-pulse" />
          ) : readyForPickup.length === 0 && inTransit.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-warm-200 shadow-card space-y-2">
              <Bike className="w-10 h-10 text-warm-400 mx-auto" />
              <h3 className="text-lg font-bold text-charcoal-900">No Active Pickups Right Now</h3>
              <p className="text-xs text-charcoal-600">
                Orders appear here once a restaurant accepts a customer order.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...inTransit, ...readyForPickup].map((order) => {
                const rest = restaurants[order.restaurantId];
                const statusInfo = getOrderStatusDetails(order.status);
                const isTransit = order.status.toUpperCase() === 'OUT_FOR_DELIVERY';
                return (
                  <div
                    key={order.orderId}
                    className="bg-white rounded-3xl p-6 border border-warm-200 shadow-card space-y-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-mono text-charcoal-600">
                          ORDER #{order.orderId} · USER #{order.userId}
                        </div>
                        <h3 className="text-lg font-bold text-charcoal-900 mt-0.5">
                          {rest?.name || `Restaurant #${order.restaurantId}`}
                        </h3>
                        {rest?.location && (
                          <div className="flex items-center gap-1 text-xs text-charcoal-600 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-tangerine-500" />
                            <span>{rest.location}</span>
                          </div>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusInfo.badgeClass}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-warm-100">
                      <div className="text-sm font-black text-charcoal-900">
                        Total: {formatCurrency(order.totalAmount)}
                      </div>

                      {!isTransit ? (
                        <button
                          onClick={() => handleStatusChange(order.orderId, 'OUT_FOR_DELIVERY')}
                          disabled={updatingOrderId === order.orderId}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-tangerine-500 hover:bg-tangerine-600 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-glow-tangerine transition-all cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Pick Up Order</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(order.orderId, 'DELIVERED')}
                          disabled={updatingOrderId === order.orderId}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Delivered</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed History */}
        {completed.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-charcoal-900">Completed Deliveries</h2>
            <div className="bg-white rounded-3xl border border-warm-200 divide-y divide-warm-100 overflow-hidden">
              {completed.map((order) => (
                <div key={order.orderId} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-charcoal-900">Order #{order.orderId}</span>
                    <span className="text-charcoal-600 ml-2">
                      {restaurants[order.restaurantId]?.name || `Restaurant #${order.restaurantId}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-charcoal-900">{formatCurrency(order.totalAmount)}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                      DELIVERED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
