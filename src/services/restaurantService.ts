import { apiClient, USE_MOCK_FALLBACK } from './api';
import {
  EnrichedMenuItem,
  EnrichedRestaurant,
  MenuItemRequest,
  MenuItemResponse,
  OrderDecisionResponse,
  RestaurantRequest,
  RestaurantResponse,
} from '../types/api';
import { MOCK_MENU_ITEMS, MOCK_RESTAURANTS } from './mockData';

// Helper to deterministically enrich basic backend restaurant DTO
export function enrichRestaurant(r: RestaurantResponse): EnrichedRestaurant {
  const mockMatch = MOCK_RESTAURANTS.find((m) => m.restaurantId === r.restaurantId);
  if (mockMatch) {
    return {
      ...mockMatch,
      restaurantId: r.restaurantId,
      name: r.name,
      location: r.location,
    };
  }

  // Deterministic fallback enrichment for user-created restaurants
  const cuisines = ['Continental & Grills', 'Artisanal Italian', 'Pan-Asian & Bowls', 'Indian Gourmet', 'Modern Café'];
  const images = [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
  ];

  const idx = Math.abs(r.restaurantId) % images.length;

  return {
    restaurantId: r.restaurantId,
    name: r.name,
    location: r.location,
    cuisine: cuisines[idx % cuisines.length],
    rating: 4.8,
    reviewCount: 320,
    deliveryTimeMinutes: 25 + (idx * 5),
    priceRange: '$$',
    imageUrl: images[idx],
    heroImageUrl: images[idx],
    tagline: `Signature delicacies handcrafted at ${r.name}.`,
    isOpen: true,
    featuredDishes: ['Chef Special Plate', 'Artisan Beverage', 'Signature Dessert'],
  };
}

// Helper to enrich menu item
export function enrichMenuItem(item: MenuItemResponse): EnrichedMenuItem {
  const mockItems = MOCK_MENU_ITEMS[item.restaurantId] || [];
  const mockMatch = mockItems.find((m) => m.menuItemId === item.menuItemId);
  if (mockMatch) {
    return {
      ...mockMatch,
      menuItemId: item.menuItemId,
      restaurantId: item.restaurantId,
      name: item.name,
      price: item.price,
    };
  }

  return {
    menuItemId: item.menuItemId,
    restaurantId: item.restaurantId,
    name: item.name,
    price: item.price,
    description: `Chef's special ${item.name} prepared with fresh, locally sourced ingredients.`,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    category: 'Mains',
    isVegetarian: true,
    isBestseller: false,
    spicyLevel: 1,
  };
}

export const restaurantService = {
  async listRestaurants(): Promise<EnrichedRestaurant[]> {
    try {
      const data = await apiClient<RestaurantResponse[]>('/api/restaurants');
      if (Array.isArray(data) && data.length > 0) {
        return data.map(enrichRestaurant);
      }
      if (USE_MOCK_FALLBACK) {
        return MOCK_RESTAURANTS;
      }
      return [];
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        return MOCK_RESTAURANTS;
      }
      throw error;
    }
  },

  async getRestaurant(restaurantId: number): Promise<EnrichedRestaurant> {
    try {
      const data = await apiClient<RestaurantResponse>(`/api/restaurants/${restaurantId}`);
      return enrichRestaurant(data);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        const found = MOCK_RESTAURANTS.find((r) => r.restaurantId === restaurantId);
        if (found) return found;
      }
      throw error;
    }
  },

  async createRestaurant(req: RestaurantRequest): Promise<EnrichedRestaurant> {
    try {
      const data = await apiClient<RestaurantResponse>('/api/restaurants', {
        method: 'POST',
        body: JSON.stringify(req),
      });
      return enrichRestaurant(data);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        const newId = Date.now();
        const created: EnrichedRestaurant = enrichRestaurant({
          restaurantId: newId,
          name: req.name,
          location: req.location,
        });
        MOCK_RESTAURANTS.unshift(created);
        return created;
      }
      throw error;
    }
  },

  async updateRestaurant(restaurantId: number, req: RestaurantRequest): Promise<EnrichedRestaurant> {
    try {
      const data = await apiClient<RestaurantResponse>(`/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        body: JSON.stringify(req),
      });
      return enrichRestaurant(data);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        const idx = MOCK_RESTAURANTS.findIndex((r) => r.restaurantId === restaurantId);
        if (idx !== -1) {
          MOCK_RESTAURANTS[idx].name = req.name;
          MOCK_RESTAURANTS[idx].location = req.location;
          return MOCK_RESTAURANTS[idx];
        }
      }
      throw error;
    }
  },

  async deleteRestaurant(restaurantId: number): Promise<void> {
    try {
      await apiClient<void>(`/api/restaurants/${restaurantId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        const idx = MOCK_RESTAURANTS.findIndex((r) => r.restaurantId === restaurantId);
        if (idx !== -1) MOCK_RESTAURANTS.splice(idx, 1);
        return;
      }
      throw error;
    }
  },

  async listMenu(restaurantId: number): Promise<EnrichedMenuItem[]> {
    try {
      const data = await apiClient<MenuItemResponse[]>(`/api/restaurants/${restaurantId}/menu`);
      if (Array.isArray(data) && data.length > 0) {
        return data.map(enrichMenuItem);
      }
      if (USE_MOCK_FALLBACK) {
        return MOCK_MENU_ITEMS[restaurantId] || [];
      }
      return [];
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        return MOCK_MENU_ITEMS[restaurantId] || [];
      }
      throw error;
    }
  },

  async addMenuItem(restaurantId: number, req: MenuItemRequest): Promise<EnrichedMenuItem> {
    try {
      const data = await apiClient<MenuItemResponse>(`/api/restaurants/${restaurantId}/menu`, {
        method: 'POST',
        body: JSON.stringify(req),
      });
      return enrichMenuItem(data);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        const newItem: EnrichedMenuItem = enrichMenuItem({
          menuItemId: Date.now(),
          restaurantId,
          name: req.name,
          price: req.price,
        });
        if (!MOCK_MENU_ITEMS[restaurantId]) {
          MOCK_MENU_ITEMS[restaurantId] = [];
        }
        MOCK_MENU_ITEMS[restaurantId].push(newItem);
        return newItem;
      }
      throw error;
    }
  },

  async updateMenuItem(
    restaurantId: number,
    menuItemId: number,
    req: MenuItemRequest
  ): Promise<EnrichedMenuItem> {
    try {
      const data = await apiClient<MenuItemResponse>(
        `/api/restaurants/${restaurantId}/menu/${menuItemId}`,
        {
          method: 'PUT',
          body: JSON.stringify(req),
        }
      );
      return enrichMenuItem(data);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        const items = MOCK_MENU_ITEMS[restaurantId] || [];
        const item = items.find((i) => i.menuItemId === menuItemId);
        if (item) {
          item.name = req.name;
          item.price = req.price;
          return item;
        }
      }
      throw error;
    }
  },

  async deleteMenuItem(restaurantId: number, menuItemId: number): Promise<void> {
    try {
      await apiClient<void>(`/api/restaurants/${restaurantId}/menu/${menuItemId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        const items = MOCK_MENU_ITEMS[restaurantId] || [];
        const idx = items.findIndex((i) => i.menuItemId === menuItemId);
        if (idx !== -1) items.splice(idx, 1);
        return;
      }
      throw error;
    }
  },

  async acceptOrder(restaurantId: number, orderId: number): Promise<OrderDecisionResponse> {
    try {
      return await apiClient<OrderDecisionResponse>(
        `/api/restaurants/${restaurantId}/orders/${orderId}/accept`,
        { method: 'POST' }
      );
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        return { orderId, restaurantId, decision: 'ACCEPTED', status: 'ACCEPTED' };
      }
      throw error;
    }
  },

  async rejectOrder(restaurantId: number, orderId: number): Promise<OrderDecisionResponse> {
    try {
      return await apiClient<OrderDecisionResponse>(
        `/api/restaurants/${restaurantId}/orders/${orderId}/reject`,
        { method: 'POST' }
      );
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        return { orderId, restaurantId, decision: 'REJECTED', status: 'REJECTED' };
      }
      throw error;
    }
  },
};
