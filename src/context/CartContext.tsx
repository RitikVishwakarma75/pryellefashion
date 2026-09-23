'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { CartItem, Product, ProductColor, ShippingDetails } from '@/types';
import { useAuth } from '@/context/AuthContext';
import confetti from 'canvas-confetti';

interface FlyItem {
  id: string;
  image: string;
  startX: number;
  startY: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, color?: ProductColor, quantity?: number, event?: React.MouseEvent) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  promoError: string;
  shippingThreshold: number;
  isFreeShipping: boolean;
  amountNeededForFreeShipping: number;
  flyItem: FlyItem | null;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  placeOrder: (shippingDetails: ShippingDetails) => Promise<string>;
  lastPlacedOrderId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 999;

function getCartStorageKey(userId?: string | null): string {
  return userId ? `prayele_cart_${userId}` : 'prayele_cart_guest';
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [cart, setCartState] = useState<CartItem[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null | undefined>(undefined);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [flyItem, setFlyItem] = useState<FlyItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState<string | null>(null);

  // Helper to persist to isolated storage
  const persistCart = useCallback((items: CartItem[], uid?: string | null) => {
    try {
      const key = getCartStorageKey(uid);
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save isolated cart to storage', e);
    }
  }, []);

  // Handle User Switching & Isolated Cart Hydration
  useEffect(() => {
    if (isAuthLoading) return;

    const currentUid = user?.userId || null;

    // Discard any obsolete un-scoped legacy cart
    try {
      localStorage.removeItem('prayele_cart');
    } catch {}

    if (activeUserId !== currentUid) {
      // Transitioning: Guest -> Logged In
      if (!activeUserId && currentUid) {
        let guestItems: CartItem[] = [];
        try {
          const rawGuest = localStorage.getItem('prayele_cart_guest');
          if (rawGuest) guestItems = JSON.parse(rawGuest);
        } catch {}

        let userItems: CartItem[] = [];
        try {
          const rawUser = localStorage.getItem(`prayele_cart_${currentUid}`);
          if (rawUser) userItems = JSON.parse(rawUser);
        } catch {}

        // Merge guest items into user items without duplicating IDs
        let merged = [...userItems];
        if (guestItems.length > 0) {
          for (const gItem of guestItems) {
            const idx = merged.findIndex((i) => i.id === gItem.id);
            if (idx > -1) {
              merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + gItem.quantity };
            } else {
              merged.push(gItem);
            }
          }
          // Clear guest cart once safely merged
          try {
            localStorage.removeItem('prayele_cart_guest');
          } catch {}

          // Also trigger server-side merge
          fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'merge' }),
          }).catch(() => {});
        }

        persistCart(merged, currentUid);
        setCartState(merged);
      }
      // Transitioning: Logged In -> Logged Out (Logout)
      else if (activeUserId && !currentUid) {
        // Clear active cart immediately so User A's items vanish
        setCartState([]);
        // Re-initialize clean guest cart
        try {
          const rawGuest = localStorage.getItem('prayele_cart_guest');
          const guestItems = rawGuest ? JSON.parse(rawGuest) : [];
          setCartState(Array.isArray(guestItems) ? guestItems : []);
        } catch {
          setCartState([]);
        }
      }
      // Initial mount or switching between accounts
      else {
        try {
          const raw = localStorage.getItem(getCartStorageKey(currentUid));
          const parsed = raw ? JSON.parse(raw) : [];
          setCartState(Array.isArray(parsed) ? parsed : []);
        } catch {
          setCartState([]);
        }
      }

      setActiveUserId(currentUid);
    }
  }, [user, activeUserId, isAuthLoading, persistCart]);

  // Synchronize cart state mutations with isolated storage & server
  const setCart = useCallback(
    (updater: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
      setCartState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        persistCart(next, user?.userId);
        return next;
      });
    },
    [persistCart, user?.userId]
  );

  const addToCart = (
    product: Product,
    color?: ProductColor,
    quantity = 1,
    event?: React.MouseEvent
  ) => {
    const selectedColor = color || product.colors[0];
    const itemId = `${product.id}-${selectedColor.name.toLowerCase().replace(/\s+/g, '-')}`;

    if (event) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      setFlyItem({
        id: itemId,
        image: selectedColor.image,
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
      });

      setTimeout(() => {
        setFlyItem(null);
      }, 900);
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          selectedColor,
          quantity,
        },
      ];
    });

    // Sync to backend DB if authenticated
    if (isAuthenticated) {
      const variantId = `${product.id}-${selectedColor.name.toLowerCase().replace(/\s+/g, '-')}`;
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          variantId,
          quantity,
        }),
      }).catch(() => {});
    }

    setTimeout(() => {
      setIsCartOpen(true);
    }, 450);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));

    if (isAuthenticated) {
      fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      }).catch(() => {});
    }
  };

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
    );

    if (isAuthenticated) {
      fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity: qty }),
      }).catch(() => {});
    }
  };

  const clearCart = () => {
    setCart([]);
    if (isAuthenticated) {
      fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clearAll: true }),
      }).catch(() => {});
    }
  };

  const applyPromoCode = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'ENDLESSLOOKS' || normalized === 'PRAYELE15') {
      setPromoCode(normalized);
      setDiscountPercent(0.15);
      setPromoError('');
      return true;
    } else if (normalized === 'FIRSTLOOK' || normalized === 'HAUTE10') {
      setPromoCode(normalized);
      setDiscountPercent(0.1);
      setPromoError('');
      return true;
    } else {
      setPromoError('Invalid promotion code. Try "ENDLESSLOOKS" for 15% off.');
      return false;
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = Math.round(subtotal * discountPercent);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const placeOrder = async (_shippingDetails: ShippingDetails): Promise<string> => {
    void _shippingDetails;
    const orderId = `PRY-${Math.floor(100000 + Math.random() * 900000)}`;
    setLastPlacedOrderId(orderId);
    clearCart();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C5A059', '#D98B94', '#E6B85C', '#181716'],
      });
    } catch {
      // Confetti fallback
    }

    return orderId;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        discount,
        promoCode,
        applyPromoCode,
        promoError,
        shippingThreshold: FREE_SHIPPING_THRESHOLD,
        isFreeShipping,
        amountNeededForFreeShipping,
        flyItem,
        isCheckoutOpen,
        setIsCheckoutOpen,
        placeOrder,
        lastPlacedOrderId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
