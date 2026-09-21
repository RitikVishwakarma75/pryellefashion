'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import Image from 'next/image';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, Truck, Lock } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    promoCode,
    applyPromoCode,
    promoError,
    shippingThreshold,
    isFreeShipping,
    amountNeededForFreeShipping,
    addToCart,
    setIsCheckoutOpen,
    isCartSyncing,
    cartError,
    clearCartError,
    checkoutUrl,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  // Complete the look upselling item
  const upsellProduct = PRODUCTS.find((p) => p.id === 'astra-pearl-pin') || PRODUCTS[1];

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
    }
  };

  const handleProceedToCheckout = async () => {
    if (cart.length === 0) return;

    setCheckoutError(null);

    // 1. If a valid checkoutUrl already exists, redirect directly
    if (checkoutUrl) {
      setIsRedirecting(true);
      window.location.href = checkoutUrl;
      return;
    }

    // 2. If checkoutUrl is not yet loaded, request it via /api/shopify/cart
    try {
      setIsRedirecting(true);

      const lines = cart
        .filter((item) => item.variantId && item.variantId.startsWith('gid://shopify/'))
        .map((item) => ({
          merchandiseId: item.variantId!,
          quantity: item.quantity,
        }));

      if (lines.length === 0) {
        setCheckoutError('Please add a Shopify product to launch Shopify checkout.');
        setIsRedirecting(false);
        return;
      }

      const res = await fetch('/api/shopify/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', lines }),
      });
      const data = await res.json();

      if (data.success && data.cart?.checkoutUrl) {
        window.location.href = data.cart.checkoutUrl;
      } else {
        setCheckoutError(data.error || 'Unable to connect to Shopify checkout. Please verify store configuration.');
        setIsRedirecting(false);
      }
    } catch (err: any) {
      setCheckoutError('Network error connecting to Shopify. Please try again.');
      setIsRedirecting(false);
    }
  };

  const progressPercent = Math.min(100, Math.round((subtotal / shippingThreshold) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Drawer Window */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 350, damping: 32 }}
          className="relative w-full sm:max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[var(--theme-text)]" />
              <h3 className="editorial-serif text-xl sm:text-2xl font-normal text-[var(--theme-text)]">
                Your Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h3>
              {isCartSyncing && (
                <span className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Syncing
                </span>
              )}
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-4 sm:px-5 py-3 bg-stone-50 border-b border-black/5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                <span className="font-medium text-stone-800 text-[11px] sm:text-xs">
                  {isFreeShipping ? (
                    <span className="text-emerald-700 font-semibold">
                      You’ve Unlocked Free Express Courier!
                    </span>
                  ) : (
                    <span>
                      Add <strong>₹{amountNeededForFreeShipping}</strong> more for Free Shipping
                    </span>
                  )}
                </span>
              </div>
              <span className="text-[10px] text-stone-500 font-semibold">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--theme-accent)] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Shopify Cart Sync Error Alert Banner (if any) */}
          {cartError && (
            <div className="px-4 py-2 bg-rose-50 border-b border-rose-200 flex items-center justify-between text-xs text-rose-700">
              <span className="truncate pr-2">{cartError}</span>
              <button
                onClick={clearCartError}
                className="text-[10px] uppercase font-bold text-rose-800 underline hover:no-underline flex-shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Cart Items Scroll Container */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-3 sm:space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-7 h-7 stroke-1" />
                </div>
                <h4 className="editorial-serif text-xl font-normal text-stone-800 mb-1">
                  Your bag is empty
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
                  Explore our sculpted claw clips, freshwater pearl pins, and silk clouds to begin.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-medium uppercase tracking-wider hover:opacity-90"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-2xl bg-stone-50/60 border border-black/5 items-center"
                >
                  {/* Thumbnail */}
                  <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                    <Image
                      src={item.selectedColor.image}
                      alt={item.product.name}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="editorial-serif text-sm font-medium text-stone-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1.5 my-0.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      <span>{item.selectedColor.name}</span>
                    </p>
                    <span className="text-xs font-semibold text-stone-900 block">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-rose-500 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center border border-stone-300 rounded-full px-2 py-0.5 gap-2 bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-stone-500 hover:text-black font-semibold text-xs"
                      >
                        -
                      </button>
                      <span className="text-[11px] font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-stone-500 hover:text-black font-semibold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Complete The Look Upsell Banner */}
            {cart.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/50 mt-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span className="caps-subtitle text-[10px] font-bold tracking-widest text-amber-900">
                    Complete The Look
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-stone-200 flex-shrink-0">
                      <Image
                        src={upsellProduct.colors[0].image}
                        alt={upsellProduct.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-stone-900 line-clamp-1">
                        {upsellProduct.name}
                      </h5>
                      <span className="text-[11px] text-amber-800 font-medium">
                        Bundle Add: ₹{upsellProduct.price}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => addToCart(upsellProduct, upsellProduct.colors[0], 1, e)}
                    className="px-3 py-1.5 rounded-full bg-stone-900 text-white text-[10px] font-semibold uppercase tracking-wider hover:bg-black flex-shrink-0"
                  >
                    + Add
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Billing & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-black/5 bg-white space-y-3">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Try code: ENDLESSLOOKS"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 uppercase tracking-wider focus:outline-none focus:border-stone-800"
                  />
                  {promoCode && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-600 font-semibold">
                      Applied!
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold uppercase tracking-wider active:scale-95 transition-transform"
                >
                  Apply
                </button>
              </form>

              {promoError && (
                <p className="text-[10px] text-rose-500 font-medium">{promoError}</p>
              )}

              {/* Subtotal Calculations */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount (15% off):</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Courier:</span>
                  <span>{isFreeShipping ? 'FREE' : '₹99'}</span>
                </div>
                <div className="pt-2 border-t border-stone-100 flex justify-between font-semibold text-sm text-stone-900">
                  <span>Estimated Total:</span>
                  <span>₹{Math.max(0, subtotal - discount + (isFreeShipping ? 0 : 99))}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                disabled={cart.length === 0 || isRedirecting}
                className="w-full py-3.5 rounded-full bg-black text-white text-xs font-medium uppercase tracking-wider transition-all duration-300 hover:opacity-90 active:scale-95 shadow-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isRedirecting ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Redirecting to Shopify Checkout...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {checkoutError && (
                <p className="text-[11px] text-rose-500 text-center font-medium pt-1">
                  {checkoutError}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
