import React, { useEffect, useState } from 'react';
import {
  Shield,
  Users,
  UtensilsCrossed,
  ShoppingBag,
  RefreshCw,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { authService } from '../services/authService';
import { restaurantService } from '../services/restaurantService';
import { orderService } from '../services/orderService';
import { EnrichedRestaurant, OrderResponse, UserResponse, UserRole } from '../types/api';
import { ROLE_META } from '../context/AuthContext';
import { formatCurrency, getOrderStatusDetails } from '../utils/formatters';

const ROLE_BADGE_CLASS: Record<UserRole, string> = {
  CUSTOMER: 'bg-sky-50 text-sky-700 border-sky-200',
  RESTAURANT: 'bg-amber-50 text-amber-700 border-amber-200',
  DELIVERY_PARTNER: 'bg-violet-50 text-violet-700 border-violet-200',
  ADMIN: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const AdminDashboardPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [restaurants, setRestaurants] = useState<EnrichedRestaurant[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'restaurants' | 'orders'>('users');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlatformData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [userList, restaurantList, orderList] = await Promise.all([
        authService.listUsers(),
        restaurantService.listRestaurants(),
        orderService.listOrders(),
      ]);
      setUsers(userList);
      setRestaurants(restaurantList);
      setOrders(orderList.sort((a, b) => b.orderId - a.orderId));
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to load admin overview.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0);

  return (
    <div className="pt-28 pb-20 min-h-screen bg-warm-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Platform Administration</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-editorial text-charcoal-900 mt-2">
              QuickBite Admin Control Center
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-700">
              Live oversight across Auth Service (:8081), Restaurant Service (:8082), and Order Service (:8083).
            </p>
          </div>

          <button
            onClick={loadPlatformData}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-warm-200 rounded-2xl text-xs font-bold text-charcoal-800 hover:bg-warm-100 transition-colors shadow-xs cursor-pointer self-start"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-warm-200 shadow-card">
            <div className="flex items-center justify-between text-charcoal-600 text-xs font-bold uppercase">
              <span>Registered Users</span>
              <Users className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-3xl font-black text-charcoal-900 mt-2">{users.length}</div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-warm-200 shadow-card">
            <div className="flex items-center justify-between text-charcoal-600 text-xs font-bold uppercase">
              <span>Restaurants</span>
              <UtensilsCrossed className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-charcoal-900 mt-2">{restaurants.length}</div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-warm-200 shadow-card">
            <div className="flex items-center justify-between text-charcoal-600 text-xs font-bold uppercase">
              <span>Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-tangerine-600" />
            </div>
            <div className="text-3xl font-black text-charcoal-900 mt-2">{orders.length}</div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-warm-200 shadow-card">
            <div className="flex items-center justify-between text-charcoal-600 text-xs font-bold uppercase">
              <span>Gross Volume</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-700 mt-2">{formatCurrency(totalRevenue)}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-warm-200 pb-2">
          {(['users', 'restaurants', 'orders'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-charcoal-900 text-white'
                  : 'bg-white text-charcoal-700 border border-warm-200 hover:bg-warm-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-warm-200 shadow-card overflow-hidden">
            <div className="divide-y divide-warm-100">
              {users.map((u) => (
                <div key={u.userId} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-charcoal-900">{u.email}</div>
                    <div className="text-charcoal-600 font-mono">User ID: #{u.userId}</div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                      ROLE_BADGE_CLASS[u.role] || ROLE_BADGE_CLASS.CUSTOMER
                    }`}
                  >
                    {ROLE_META[u.role]?.label || u.role}
                  </span>
                </div>
              ))}
              {users.length === 0 && !isLoading && (
                <div className="p-8 text-center text-xs text-charcoal-600">No users found.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((r) => (
              <div key={r.restaurantId} className="bg-white rounded-3xl p-5 border border-warm-200 shadow-card space-y-1">
                <div className="text-[11px] font-mono text-charcoal-600">ID #{r.restaurantId}</div>
                <h3 className="text-base font-bold text-charcoal-900">{r.name}</h3>
                <p className="text-xs text-charcoal-600">{r.location}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-warm-200 shadow-card overflow-hidden">
            <div className="divide-y divide-warm-100">
              {orders.map((o) => {
                const statusInfo = getOrderStatusDetails(o.status);
                return (
                  <div key={o.orderId} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-charcoal-900">Order #{o.orderId}</div>
                      <div className="text-charcoal-600">
                        User #{o.userId} · Restaurant #{o.restaurantId}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-charcoal-900">{formatCurrency(o.totalAmount)}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusInfo.badgeClass}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                );
              })}
              {orders.length === 0 && !isLoading && (
                <div className="p-8 text-center text-xs text-charcoal-600">No orders placed yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
