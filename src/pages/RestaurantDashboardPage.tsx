import React, { useEffect, useState } from 'react';
import {
  ChefHat,
  ShoppingBag,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  Clock,
  TrendingUp,
  RefreshCw,
  Search,
  AlertCircle,
  Building2,
  Layers,
  MapPin,
} from 'lucide-react';
import { restaurantService } from '../services/restaurantService';
import { orderService } from '../services/orderService';
import {
  EnrichedMenuItem,
  EnrichedRestaurant,
  MenuItemRequest,
  OrderResponse,
  RestaurantRequest,
} from '../types/api';
import { formatCurrency, getOrderStatusDetails } from '../utils/formatters';
import { soundEngine } from '../utils/soundEffects';

export const RestaurantDashboardPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<EnrichedRestaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number>(1);
  const [menuItems, setMenuItems] = useState<EnrichedMenuItem[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'restaurant'>('orders');

  // Modal states
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EnrichedMenuItem | null>(null);
  const [menuForm, setMenuForm] = useState<MenuItemRequest>({ name: '', price: 299 });

  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
  const [restForm, setRestForm] = useState<RestaurantRequest>({ name: '', location: '' });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const allRest = await restaurantService.listRestaurants();
      setRestaurants(allRest);
      if (allRest.length > 0 && !allRest.some((r) => r.restaurantId === selectedRestaurantId)) {
        setSelectedRestaurantId(allRest[0].restaurantId);
      }

      await loadRestaurantSpecificData(selectedRestaurantId);
    } catch {
      showNotification('error', 'Failed to fetch microservices data.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRestaurantSpecificData = async (restId: number) => {
    try {
      const [menuData, orderData] = await Promise.all([
        restaurantService.listMenu(restId),
        orderService.listOrdersByRestaurant(restId),
      ]);
      setMenuItems(menuData);
      setOrders(orderData);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      loadRestaurantSpecificData(selectedRestaurantId);
    }
  }, [selectedRestaurantId]);

  const selectedRestaurant =
    restaurants.find((r) => r.restaurantId === selectedRestaurantId) || restaurants[0];

  // ORDER ACTIONS: Accept and Reject
  const handleAcceptOrder = async (orderId: number) => {
    setIsProcessing(true);
    try {
      await restaurantService.acceptOrder(selectedRestaurantId, orderId);
      soundEngine.playKitchenBell();
      showNotification('success', `Order #${orderId} ACCEPTED. Dispatched to kitchen.`);
      await loadRestaurantSpecificData(selectedRestaurantId);
    } catch (err: unknown) {
      showNotification('error', (err as Error)?.message || 'Failed to accept order.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    setIsProcessing(true);
    try {
      await restaurantService.rejectOrder(selectedRestaurantId, orderId);
      showNotification('success', `Order #${orderId} REJECTED.`);
      await loadRestaurantSpecificData(selectedRestaurantId);
    } catch (err: unknown) {
      showNotification('error', (err as Error)?.message || 'Failed to reject order.');
    } finally {
      setIsProcessing(false);
    }
  };

  // MENU ACTIONS: Add, Edit, Delete
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuForm.name.trim() || menuForm.price <= 0) return;

    setIsProcessing(true);
    try {
      if (editingItem) {
        await restaurantService.updateMenuItem(selectedRestaurantId, editingItem.menuItemId, menuForm);
        showNotification('success', `Menu item "${menuForm.name}" updated successfully.`);
      } else {
        await restaurantService.addMenuItem(selectedRestaurantId, menuForm);
        showNotification('success', `Menu item "${menuForm.name}" added successfully.`);
      }
      setIsMenuModalOpen(false);
      setEditingItem(null);
      setMenuForm({ name: '', price: 299 });
      await loadRestaurantSpecificData(selectedRestaurantId);
    } catch (err: unknown) {
      showNotification('error', (err as Error)?.message || 'Menu action failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteMenuItem = async (menuItemId: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) return;

    setIsProcessing(true);
    try {
      await restaurantService.deleteMenuItem(selectedRestaurantId, menuItemId);
      showNotification('success', `Deleted "${name}".`);
      await loadRestaurantSpecificData(selectedRestaurantId);
    } catch (err: unknown) {
      showNotification('error', (err as Error)?.message || 'Deletion failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  // CREATE RESTAURANT ACTION
  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restForm.name.trim() || !restForm.location.trim()) return;

    setIsProcessing(true);
    try {
      const created = await restaurantService.createRestaurant(restForm);
      showNotification('success', `Restaurant "${created.name}" created successfully.`);
      setIsRestaurantModalOpen(false);
      setRestForm({ name: '', location: '' });
      const updatedRest = await restaurantService.listRestaurants();
      setRestaurants(updatedRest);
      setSelectedRestaurantId(created.restaurantId);
    } catch (err: unknown) {
      showNotification('error', (err as Error)?.message || 'Failed to create restaurant.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Metrics
  const pendingOrders = orders.filter((o) => o.status === 'PLACED');
  const acceptedOrders = orders.filter((o) => o.status === 'ACCEPTED' || o.status === 'DELIVERED');
  const totalRevenue = acceptedOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-warm-50 text-charcoal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-warm-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                Operator Terminal
              </span>
              <span className="text-xs font-mono text-charcoal-700">
                Restaurant Service: Port 8082
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-editorial text-charcoal-900 mt-2">
              Kitchen Operations Hub
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-700">
              Manage live incoming tickets, accept or reject orders, and control kitchen menu offerings.
            </p>
          </div>

          {/* Restaurant Selector & Actions */}
          <div className="flex items-center gap-3">
            <select
              value={selectedRestaurantId}
              onChange={(e) => setSelectedRestaurantId(Number(e.target.value))}
              className="px-4 py-2.5 bg-white border border-warm-300 rounded-2xl text-xs font-bold text-charcoal-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-tangerine-500/30"
            >
              {restaurants.map((r) => (
                <option key={r.restaurantId} value={r.restaurantId}>
                  {r.name} ({r.location})
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsRestaurantModalOpen(true)}
              className="px-3.5 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              title="Add New Restaurant"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Kitchen</span>
            </button>

            <button
              onClick={() => loadRestaurantSpecificData(selectedRestaurantId)}
              className="p-2.5 bg-white border border-warm-200 hover:bg-warm-100 text-charcoal-700 rounded-2xl transition-colors shadow-xs"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {notification && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border shadow-sm animate-pulse ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-warm-200 shadow-card space-y-2">
            <div className="flex items-center justify-between text-charcoal-700 text-xs font-semibold">
              <span>Pending Tickets</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">
              {pendingOrders.length}
            </div>
            <div className="text-[11px] text-charcoal-700">Requires kitchen decision</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-warm-200 shadow-card space-y-2">
            <div className="flex items-center justify-between text-charcoal-700 text-xs font-semibold">
              <span>Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-tangerine-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-charcoal-900">
              {orders.length}
            </div>
            <div className="text-[11px] text-charcoal-700">Lifetime orders received</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-warm-200 shadow-card space-y-2">
            <div className="flex items-center justify-between text-charcoal-700 text-xs font-semibold">
              <span>Menu Items</span>
              <UtensilsCrossed className="w-4 h-4 text-olive-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-charcoal-900">
              {menuItems.length}
            </div>
            <div className="text-[11px] text-charcoal-700">Active dish offerings</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-warm-200 shadow-card space-y-2">
            <div className="flex items-center justify-between text-charcoal-700 text-xs font-semibold">
              <span>Revenue Total</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-[11px] text-charcoal-700">Accepted orders sum</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-warm-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-tangerine-500 text-tangerine-600'
                : 'border-transparent text-charcoal-700 hover:text-charcoal-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Incoming Orders ({orders.length})</span>
            {pendingOrders.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
                {pendingOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'menu'
                ? 'border-tangerine-500 text-tangerine-600'
                : 'border-transparent text-charcoal-700 hover:text-charcoal-900'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Menu Management ({menuItems.length})</span>
          </button>
        </div>

        {/* TAB 1: INCOMING ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-charcoal-900">
                Orders for {selectedRestaurant?.name}
              </h2>
              <span className="text-xs text-charcoal-700">
                Real-time decisions link to <code>/orders/{'{id}'}/accept</code> and <code>/reject</code>
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-warm-200 shadow-card space-y-3">
                <ShoppingBag className="w-12 h-12 text-warm-300 mx-auto" />
                <h3 className="font-bold text-lg text-charcoal-900">No Orders in Queue</h3>
                <p className="text-xs text-charcoal-700">
                  New customer orders placed for this restaurant will appear here immediately.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => {
                  const statusDetails = getOrderStatusDetails(ord.status);
                  const isPending = ord.status === 'PLACED';

                  return (
                    <div
                      key={ord.orderId}
                      className="bg-white rounded-3xl p-5 border border-warm-200 shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-charcoal-900">
                            Ticket #QB-{ord.orderId}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusDetails.badgeClass}`}>
                            {statusDetails.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-charcoal-700">
                          <span>User ID: #{ord.userId}</span>
                          <span>•</span>
                          <span className="font-extrabold text-charcoal-900 text-sm">
                            {formatCurrency(ord.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Decision buttons */}
                      <div className="flex items-center gap-2">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleAcceptOrder(ord.orderId)}
                              disabled={isProcessing}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accept Order</span>
                            </button>
                            <button
                              onClick={() => handleRejectOrder(ord.orderId)}
                              disabled={isProcessing}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-charcoal-700 bg-warm-100 px-3 py-1.5 rounded-xl border border-warm-200">
                            Decision Recorded: {ord.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MENU MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-charcoal-900">
                  Menu Items ({menuItems.length})
                </h2>
                <p className="text-xs text-charcoal-700">
                  Manage prices and availability via <code>/api/restaurants/{selectedRestaurantId}/menu</code>
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingItem(null);
                  setMenuForm({ name: '', price: 299 });
                  setIsMenuModalOpen(true);
                }}
                className="px-4 py-2.5 bg-tangerine-500 hover:bg-tangerine-600 text-white font-bold text-xs rounded-2xl shadow-glow-tangerine transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dish</span>
              </button>
            </div>

            {menuItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-warm-200 shadow-card space-y-3">
                <UtensilsCrossed className="w-12 h-12 text-warm-300 mx-auto" />
                <h3 className="font-bold text-lg text-charcoal-900">No Dishes in Menu</h3>
                <p className="text-xs text-charcoal-700">
                  Click "Add Dish" to publish a new menu item to this restaurant.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="bg-white rounded-3xl p-5 border border-warm-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-base text-charcoal-900">{item.name}</h3>
                        <p className="text-base font-extrabold text-tangerine-600 mt-1">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-charcoal-700 bg-warm-100 px-2 py-0.5 rounded">
                        ID: {item.menuItemId}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-warm-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setMenuForm({ name: item.name, price: item.price });
                          setIsMenuModalOpen(true);
                        }}
                        className="p-2 text-charcoal-700 hover:text-charcoal-900 bg-warm-100 hover:bg-warm-200 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
                        title="Edit Dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteMenuItem(item.menuItemId, item.name)}
                        className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL: ADD / EDIT MENU ITEM */}
        {isMenuModalOpen && (
          <div className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-4xl p-6 sm:p-8 max-w-md w-full border border-warm-200 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-warm-100">
                <h3 className="font-bold text-lg text-charcoal-900">
                  {editingItem ? 'Edit Menu Dish' : 'Add New Menu Dish'}
                </h3>
                <button
                  onClick={() => setIsMenuModalOpen(false)}
                  className="text-charcoal-700 hover:text-charcoal-900"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveMenuItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    required
                    value={menuForm.name}
                    onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                    placeholder="e.g. Smoked Angus Slider"
                    className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tangerine-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tangerine-500/30"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMenuModalOpen(false)}
                    className="flex-1 py-2.5 bg-warm-100 hover:bg-warm-200 text-charcoal-800 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-2.5 bg-tangerine-500 hover:bg-tangerine-600 text-white rounded-xl text-xs font-bold shadow-glow-tangerine"
                  >
                    {isProcessing ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Dish'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CREATE RESTAURANT */}
        {isRestaurantModalOpen && (
          <div className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-4xl p-6 sm:p-8 max-w-md w-full border border-warm-200 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-warm-100">
                <h3 className="font-bold text-lg text-charcoal-900">Register New Restaurant</h3>
                <button
                  onClick={() => setIsRestaurantModalOpen(false)}
                  className="text-charcoal-700 hover:text-charcoal-900"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRestaurant} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Establishment Name
                  </label>
                  <input
                    type="text"
                    required
                    value={restForm.name}
                    onChange={(e) => setRestForm({ ...restForm, name: e.target.value })}
                    placeholder="e.g. Saffron & Charcoal Bistro"
                    className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tangerine-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Location / Neighborhood
                  </label>
                  <input
                    type="text"
                    required
                    value={restForm.location}
                    onChange={(e) => setRestForm({ ...restForm, location: e.target.value })}
                    placeholder="e.g. Indiranagar, Bengaluru"
                    className="w-full px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tangerine-500/30"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRestaurantModalOpen(false)}
                    className="flex-1 py-2.5 bg-warm-100 hover:bg-warm-200 text-charcoal-800 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-2.5 bg-tangerine-500 hover:bg-tangerine-600 text-white rounded-xl text-xs font-bold shadow-glow-tangerine"
                  >
                    {isProcessing ? 'Registering...' : 'Register Kitchen'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
