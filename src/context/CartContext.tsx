'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  ReactNode,
} from 'react';
import { CartItem, Product, ProductColor, ShippingDetails } from '@/types';
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
const CART_STORAGE_KEY = 'prayele_cart';
const CART_EVENT = 'prayele-cart-change';

function subscribeToCart(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(CART_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(CART_EVENT, onStoreChange);
  };
}

function getCartSnapshot() {
  try {
    return localStorage.getItem(CART_STORAGE_KEY) ?? '[]';
  } catch {
    return '[]';
  }
}

function getServerCartSnapshot() {
  return '[]';
}

function writeCart(next: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
  } catch {
    console.warn('Failed to save cart to storage');
  }
  window.dispatchEvent(new Event(CART_EVENT));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const cartJson = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot);
  const cart = useMemo<CartItem[]>(() => {
    try {
      const parsed = JSON.parse(cartJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [cartJson]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [flyItem, setFlyItem] = useState<FlyItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState<string | null>(null);

  const setCart = (updater: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    const next = typeof updater === 'function' ? updater(cart) : updater;
    writeCart(next);
  };

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

    setTimeout(() => {
      setIsCartOpen(true);
    }, 450);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
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
