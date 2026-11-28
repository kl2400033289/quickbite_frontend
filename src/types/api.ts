// Backend Microservices Contracts matching Spring Boot DTOs

export type UserRole = 'CUSTOMER' | 'RESTAURANT' | 'DELIVERY_PARTNER' | 'ADMIN';

export interface RegisterRequest {
  email: string;
  password: string;
  role?: UserRole;
  captchaId: string;
  captchaAnswer: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: UserRole;
  captchaId: string;
  captchaAnswer: string;
}

export interface CaptchaResponse {
  captchaId: string;
  imageDataUrl: string;
  expiresInSeconds: number;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId?: number;
  email?: string;
  role?: UserRole;
}

export interface UserResponse {
  userId: number;
  email: string;
  role: UserRole;
  token?: string;
  tokenType?: string;
}

export interface RestaurantRequest {
  name: string;
  location: string;
}

export interface RestaurantResponse {
  restaurantId: number;
  name: string;
  location: string;
}

export interface MenuItemRequest {
  name: string;
  price: number;
}

export interface MenuItemResponse {
  menuItemId: number;
  restaurantId: number;
  name: string;
  price: number;
}

export interface OrderRequest {
  userId: number;
  restaurantId: number;
  totalAmount: number;
}

export interface OrderResponse {
  orderId: number;
  userId: number;
  restaurantId: number;
  totalAmount: number;
  status: string; // "PLACED" | "ACCEPTED" | "REJECTED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED"
}

export interface OrderStatusUpdateRequest {
  status: string;
}

export interface OrderDecisionResponse {
  orderId: number;
  restaurantId: number;
  status?: string;
  decision?: string;
}

export interface PaymentRequest {
  orderId: number;
  amount: number;
}

export interface PaymentResponse {
  paymentId: number;
  orderId: number;
  amount: number;
  paymentStatus: string; // "SUCCESS" | "FAILED"
}

// Enriched types for rich UI presentation
export interface EnrichedRestaurant extends RestaurantResponse {
  cuisine: string;
  rating: number;
  reviewCount: number;
  deliveryTimeMinutes: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  imageUrl: string;
  heroImageUrl: string;
  tagline: string;
  isPopular?: boolean;
  isOpen: boolean;
  featuredDishes?: string[];
}

export interface EnrichedMenuItem extends MenuItemResponse {
  description: string;
  imageUrl: string;
  category: string;
  isVegetarian: boolean;
  isBestseller?: boolean;
  spicyLevel?: 0 | 1 | 2 | 3;
}

export interface CartItem {
  menuItemId: number;
  restaurantId: number;
  restaurantName: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  isVegetarian?: boolean;
}
