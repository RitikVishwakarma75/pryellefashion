'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

  // Shopify Storefront Cart additions
  shopifyCartId: string | null;
  checkoutUrl: string | null;
  isCartSyncing: boolean;
  cartError: string | null;
  clearCartError: () => void;
  refreshShopifyCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 999;
const CART_STORAGE_KEY = 'prayele_cart';
const SHOPIFY_CART_ID_KEY = 'prayele_shopify_cart_id';
const SHOPIFY_CHECKOUT_URL_KEY = 'prayele_shopify_checkout_url';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [flyItem, setFlyItem] = useState<FlyItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState<string | null>(null);

  // Shopify Storefront states
  const [shopifyCartId, setShopifyCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isCartSyncing, setIsCartSyncing] = useState<boolean>(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const clearCartError = useCallback(() => setCartError(null), []);

  // 1. Load cart and Shopify IDs from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedCartId = localStorage.getItem(SHOPIFY_CART_ID_KEY);
      if (savedCartId) {
        setShopifyCartId(savedCartId);
      }
      const savedCheckoutUrl = localStorage.getItem(SHOPIFY_CHECKOUT_URL_KEY);
      if (savedCheckoutUrl) {
        setCheckoutUrl(savedCheckoutUrl);
      }
    } catch (e) {
      console.warn('Failed to load cart from storage', e);
    }
  }, []);

  // 2. Persist local cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to storage', e);
    }
  }, [cart]);

  // 3. Helper to update Shopify Cart ID & Checkout URL
  const updateShopifyCartMeta = useCallback((newCartId: string | null, newCheckoutUrl: string | null) => {
    setShopifyCartId(newCartId);
    setCheckoutUrl(newCheckoutUrl);
    if (newCartId) {
      localStorage.setItem(SHOPIFY_CART_ID_KEY, newCartId);
    } else {
      localStorage.removeItem(SHOPIFY_CART_ID_KEY);
    }
    if (newCheckoutUrl) {
      localStorage.setItem(SHOPIFY_CHECKOUT_URL_KEY, newCheckoutUrl);
    } else {
      localStorage.removeItem(SHOPIFY_CHECKOUT_URL_KEY);
    }
  }, []);

  // 4. Fetch/Validate existing Shopify cart on load (optional background refresh)
  const refreshShopifyCart = useCallback(async () => {
    const activeCartId = shopifyCartId || (typeof window !== 'undefined' ? localStorage.getItem(SHOPIFY_CART_ID_KEY) : null);
    if (!activeCartId) return;

    try {
      setIsCartSyncing(true);
      const res = await fetch('/api/shopify/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get', cartId: activeCartId }),
      });
      const data = await res.json();

      if (data.success && data.cart) {
        if (data.cart.checkoutUrl) {
          setCheckoutUrl(data.cart.checkoutUrl);
          localStorage.setItem(SHOPIFY_CHECKOUT_URL_KEY, data.cart.checkoutUrl);
        }
      } else {
        // If cart expired on Shopify, gracefully reset Shopify IDs
        console.info('[ShopifyCart] Cart ID no longer valid, resetting.');
        updateShopifyCartMeta(null, null);
      }
    } catch (err: any) {
      console.warn('[ShopifyCart] Background cart refresh failed:', err);
    } finally {
      setIsCartSyncing(false);
    }
  }, [shopifyCartId, updateShopifyCartMeta]);

  // Sync with Shopify in background on mount if ID exists
  useEffect(() => {
    if (shopifyCartId) {
      refreshShopifyCart();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 5. Add to Cart with optimistic local UI + Shopify sync
  const addToCart = async (
    product: Product,
    color?: ProductColor,
    quantity = 1,
    event?: React.MouseEvent
  ) => {
    const selectedColor = color || product.colors[0];
    const itemId = `${product.id}-${selectedColor.name.toLowerCase().replace(/\s+/g, '-')}`;
    const variantId = selectedColor?.variantId || product.colors[0]?.variantId;

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

    // Instant optimistic UI update
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
          variantId,
        },
      ];
    });

    // Auto open drawer after short delay
    setTimeout(() => {
      setIsCartOpen(true);
    }, 450);

    // Background Shopify Cart synchronization (only if this is a real Shopify variant)
    if (variantId && variantId.startsWith('gid://shopify/ProductVariant/')) {
      try {
        setIsCartSyncing(true);
        setCartError(null);

        const currentCartId = shopifyCartId || localStorage.getItem(SHOPIFY_CART_ID_KEY);

        if (currentCartId) {
          // Add to existing cart
          const res = await fetch('/api/shopify/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'add',
              cartId: currentCartId,
              lines: [{ merchandiseId: variantId, quantity }],
            }),
          });
          const result = await res.json();

          if (result.success && result.cart) {
            updateShopifyCartMeta(result.cart.id, result.cart.checkoutUrl);
            // Match line ID to update local item
            const matchingLine = result.cart.lines?.edges?.find(
              (edge: any) => edge.node?.merchandise?.id === variantId
            );
            if (matchingLine?.node?.id) {
              setCart((prev) =>
                prev.map((i) =>
                  i.id === itemId ? { ...i, shopifyLineId: matchingLine.node.id } : i
                )
              );
            }
          } else {
            // Cart might be expired, create a fresh cart
            console.warn('[ShopifyCart] Add to existing cart failed, creating fresh cart...');
            const createRes = await fetch('/api/shopify/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'create',
                lines: [{ merchandiseId: variantId, quantity }],
              }),
            });
            const createResult = await createRes.json();
            if (createResult.success && createResult.cart) {
              updateShopifyCartMeta(createResult.cart.id, createResult.cart.checkoutUrl);
              const newLine = createResult.cart.lines?.edges?.find(
                (edge: any) => edge.node?.merchandise?.id === variantId
              );
              if (newLine?.node?.id) {
                setCart((prev) =>
                  prev.map((i) =>
                    i.id === itemId ? { ...i, shopifyLineId: newLine.node.id } : i
                  )
                );
              }
            } else {
              setCartError(createResult.error || 'Could not sync item with Shopify.');
            }
          }
        } else {
          // Create new Shopify cart
          const res = await fetch('/api/shopify/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'create',
              lines: [{ merchandiseId: variantId, quantity }],
            }),
          });
          const result = await res.json();

          if (result.success && result.cart) {
            updateShopifyCartMeta(result.cart.id, result.cart.checkoutUrl);
            const newLine = result.cart.lines?.edges?.find(
              (edge: any) => edge.node?.merchandise?.id === variantId
            );
            if (newLine?.node?.id) {
              setCart((prev) =>
                prev.map((i) =>
                  i.id === itemId ? { ...i, shopifyLineId: newLine.node.id } : i
                )
              );
            }
          } else {
            setCartError(result.error || 'Could not create Shopify bag.');
          }
        }
      } catch (err: any) {
        console.warn('[ShopifyCart] Sync failed:', err);
        // We do not crash or revert the local bag
      } finally {
        setIsCartSyncing(false);
      }
    }
  };

  // 6. Remove item from cart
  const removeFromCart = async (itemId: string) => {
    const itemToRemove = cart.find((i) => i.id === itemId);
    // Instant optimistic update
    setCart((prev) => prev.filter((item) => item.id !== itemId));

    // Background Shopify sync
    const currentCartId = shopifyCartId || localStorage.getItem(SHOPIFY_CART_ID_KEY);
    if (currentCartId && itemToRemove?.shopifyLineId) {
      try {
        setIsCartSyncing(true);
        const res = await fetch('/api/shopify/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'remove',
            cartId: currentCartId,
            lineIds: [itemToRemove.shopifyLineId],
          }),
        });
        const result = await res.json();
        if (result.success && result.cart) {
          updateShopifyCartMeta(result.cart.id, result.cart.checkoutUrl);
        }
      } catch (err) {
        console.warn('[ShopifyCart] Remove failed:', err);
      } finally {
        setIsCartSyncing(false);
      }
    }
  };

  // 7. Update quantity
  const updateQuantity = async (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }

    const itemToUpdate = cart.find((i) => i.id === itemId);

    // Instant optimistic update
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
    );

    // Background Shopify sync
    const currentCartId = shopifyCartId || localStorage.getItem(SHOPIFY_CART_ID_KEY);
    if (currentCartId && itemToUpdate?.shopifyLineId) {
      try {
        setIsCartSyncing(true);
        const res = await fetch('/api/shopify/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update',
            cartId: currentCartId,
            lines: [{ id: itemToUpdate.shopifyLineId, quantity: qty }],
          }),
        });
        const result = await res.json();
        if (result.success && result.cart) {
          updateShopifyCartMeta(result.cart.id, result.cart.checkoutUrl);
        }
      } catch (err) {
        console.warn('[ShopifyCart] Quantity update failed:', err);
      } finally {
        setIsCartSyncing(false);
      }
    }
  };

  // 8. Clear cart completely
  const clearCart = () => {
    setCart([]);
    updateShopifyCartMeta(null, null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      // storage clear fallback
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

        // Shopify additions
        shopifyCartId,
        checkoutUrl,
        isCartSyncing,
        cartError,
        clearCartError,
        refreshShopifyCart,
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
