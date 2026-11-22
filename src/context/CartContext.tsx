import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '../types/api';
import { soundEngine } from '../utils/soundEffects';

interface CartContextType {
  items: CartItem[];
  restaurantId: number | null;
  restaurantName: string | null;
  addItem: (item: CartItem) => boolean; // returns false if prompt needed
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, delta: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  grandTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('quickbite_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('quickbite_cart', JSON.stringify(items));
  }, [items]);

  const restaurantId = items.length > 0 ? items[0].restaurantId : null;
  const restaurantName = items.length > 0 ? items[0].restaurantName : null;

  const addItem = (newItem: CartItem): boolean => {
    if (items.length > 0 && items[0].restaurantId !== newItem.restaurantId) {
      // Trying to add from another restaurant
      const confirmReset = window.confirm(
        `Your cart contains items from "${items[0].restaurantName}". Discard current cart and start a new order with "${newItem.restaurantName}"?`
      );
      if (!confirmReset) {
        return false;
      }
      setItems([{ ...newItem, quantity: 1 }]);
      setIsCartOpen(true);
      return true;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === newItem.menuItemId);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === newItem.menuItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
    });

    soundEngine.playAddToCart();
    setIsCartOpen(true);
    return true;
  };

  const removeItem = (menuItemId: number) => {
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.menuItemId === menuItemId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const deliveryFee = subtotal > 0 ? (subtotal >= 500 ? 0 : 40) : 0;
  const platformFee = subtotal > 0 ? 15 : 0;
  const taxes = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const grandTotal = subtotal + deliveryFee + platformFee + taxes;

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        restaurantName,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        platformFee,
        taxes,
        grandTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
