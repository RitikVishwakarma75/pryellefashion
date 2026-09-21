'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, ProductColor } from '@/types';
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
  placeOrder: (shippingDetails: any) => Promise<string>;
  lastPlacedOrderId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 999;

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [flyItem, setFlyItem] = useState<FlyItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState<string | null>(null);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('prayele_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load cart from storage');
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('prayele_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to storage');
    }
  }, [cart]);

  const addToCart = (
    product: Product,
    color?: ProductColor,
    quantity = 1,
    event?: React.MouseEvent
  ) => {
    const selectedColor = color || product.colors[0];
    const itemId = `${product.id}-${selectedColor.name.toLowerCase().replace(/\s+/g, '-')}`;

    // Trigger fly-to-cart animation if click coordinates available
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

    // Auto open drawer after short delay
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

  const placeOrder = async (shippingDetails: any): Promise<string> => {
    const orderId = `PRY-${Math.floor(100000 + Math.random() * 900000)}`;
    setLastPlacedOrderId(orderId);
    clearCart();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C5A059', '#D98B94', '#E6B85C', '#181716'],
      });
    } catch (e) {
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
