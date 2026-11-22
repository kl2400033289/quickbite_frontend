import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Clock, RefreshCw, ChefHat } from 'lucide-react';
import { orderService } from '../services/orderService';
import { restaurantService } from '../services/restaurantService';
import { useAuth } from '../context/AuthContext';
import { OrderResponse, EnrichedRestaurant } from '../types/api';
import { formatCurrency, getOrderStatusDetails } from '../utils/formatters';

export const OrderHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [restaurants, setRestaurants] = useState<Record<number, EnrichedRestaurant>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = user?.userId
        ? await orderService.listOrdersByUser(user.userId)
        : await orderService.listOrders();
      setOrders(data);

      // fetch restaurants for names
      const restMap: Record<number, EnrichedRestaurant> = {};
      const uniqueRestIds = Array.from(new Set(data.map((o) => o.restaurantId)));
      await Promise.all(
        uniqueRestIds.map(async (rid) => {
          try {
            const r = await restaurantService.getRestaurant(rid);
            restMap[rid] = r;
          } catch {
            // ignore
          }
        })
      );
      setRestaurants(restMap);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return (
    <div className="pt-28 pb-20 min-h-screen bg-warm-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-tangerine-600 bg-tangerine-50 px-3 py-1 rounded-full border border-tangerine-200">
              Account Activity
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-editorial text-charcoal-900 mt-2">
              Order History &amp; Tracking
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-700">
              Review and track all tickets orchestrated through your account.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-warm-200 rounded-2xl text-xs font-semibold text-charcoal-700 hover:bg-warm-100 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white rounded-3xl p-6 border border-warm-200 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-4xl p-12 text-center border border-warm-200 shadow-card space-y-4">
            <div className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center text-warm-400 mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-editorial text-charcoal-900">No Orders Placed Yet</h3>
            <p className="text-sm text-charcoal-700 max-w-sm mx-auto">
              Browse our master kitchens and place your first food delivery order.
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-tangerine-500 text-white rounded-2xl text-xs font-bold shadow-glow-tangerine"
            >
              <span>Explore Restaurants</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusDetails = getOrderStatusDetails(order.status);
              const rest = restaurants[order.restaurantId];

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-3xl p-6 border border-warm-200 shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-charcoal-900">
                        #QB-{order.orderId}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusDetails.badgeClass}`}>
                        {statusDetails.label}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-charcoal-900">
                      {rest?.name || `Restaurant #${order.restaurantId}`}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-charcoal-700">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-warm-400" />
                        <span>Order Service Ticket</span>
                      </span>
                      <span>•</span>
                      <span className="font-bold text-charcoal-900">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 sm:pt-0">
                    <Link
                      to={`/track/${order.orderId}`}
                      className="px-4 py-2.5 bg-tangerine-500 hover:bg-tangerine-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <span>Track Progress</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {order.restaurantId && (
                      <Link
                        to={`/restaurant/${order.restaurantId}`}
                        className="px-4 py-2.5 bg-warm-100 hover:bg-warm-200 text-charcoal-800 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Reorder Menu
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
