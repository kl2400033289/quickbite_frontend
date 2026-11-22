import { apiClient, USE_MOCK_FALLBACK } from './api';
import { OrderRequest, OrderResponse, OrderStatusUpdateRequest } from '../types/api';
import { MOCK_ORDERS } from './mockData';

// Storage for client-side placed orders during the session so reloads and tracking work seamlessly
const SESSION_ORDERS_KEY = 'quickbite_session_orders';

function getSessionOrders(): OrderResponse[] {
  try {
    const raw = localStorage.getItem(SESSION_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessionOrder(order: OrderResponse): void {
  const existing = getSessionOrders();
  const filtered = existing.filter((o) => o.orderId !== order.orderId);
  localStorage.setItem(SESSION_ORDERS_KEY, JSON.stringify([order, ...filtered]));
}

export const orderService = {
  async listOrders(): Promise<OrderResponse[]> {
    try {
      const data = await apiClient<OrderResponse[]>('/api/orders');
      return data;
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        return [...getSessionOrders(), ...MOCK_ORDERS];
      }
      throw error;
    }
  },

  async getOrder(orderId: number): Promise<OrderResponse> {
    try {
      const data = await apiClient<OrderResponse>(`/api/orders/${orderId}`);
      return data;
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        const sessionMatch = getSessionOrders().find((o) => o.orderId === orderId);
        if (sessionMatch) return sessionMatch;
        const mockMatch = MOCK_ORDERS.find((o) => o.orderId === orderId);
        if (mockMatch) return mockMatch;
      }
      throw error;
    }
  },

  async listOrdersByUser(userId: number): Promise<OrderResponse[]> {
    try {
      const data = await apiClient<OrderResponse[]>(`/api/orders/user/${userId}`);
      return data;
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        const sessionUserOrders = getSessionOrders().filter((o) => o.userId === userId || !o.userId);
        const mockUserOrders = MOCK_ORDERS.filter((o) => o.userId === userId);
        return [...sessionUserOrders, ...mockUserOrders];
      }
      throw error;
    }
  },

  async listOrdersByRestaurant(restaurantId: number): Promise<OrderResponse[]> {
    try {
      const data = await apiClient<OrderResponse[]>(`/api/orders/restaurant/${restaurantId}`);
      return data;
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        const sessionRestOrders = getSessionOrders().filter((o) => o.restaurantId === restaurantId);
        const mockRestOrders = MOCK_ORDERS.filter((o) => o.restaurantId === restaurantId);
        return [...sessionRestOrders, ...mockRestOrders];
      }
      throw error;
    }
  },

  async placeOrder(req: OrderRequest): Promise<OrderResponse> {
    try {
      const data = await apiClient<OrderResponse>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(req),
      });
      saveSessionOrder(data);
      return data;
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        const createdOrder: OrderResponse = {
          orderId: Math.floor(1000 + Math.random() * 9000),
          userId: req.userId || 1,
          restaurantId: req.restaurantId,
          totalAmount: req.totalAmount,
          status: 'PLACED',
        };
        saveSessionOrder(createdOrder);
        return createdOrder;
      }
      throw error;
    }
  },

  async updateOrderStatus(orderId: number, status: string): Promise<OrderResponse> {
    try {
      const payload: OrderStatusUpdateRequest = { status };
      const data = await apiClient<OrderResponse>(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      saveSessionOrder(data);
      return data;
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        const existing = getSessionOrders().find((o) => o.orderId === orderId) ||
          MOCK_ORDERS.find((o) => o.orderId === orderId) || {
            orderId,
            userId: 1,
            restaurantId: 1,
            totalAmount: 499,
            status: 'PLACED',
          };
        const updated: OrderResponse = { ...existing, status };
        saveSessionOrder(updated);
        return updated;
      }
      throw error;
    }
  },
};
