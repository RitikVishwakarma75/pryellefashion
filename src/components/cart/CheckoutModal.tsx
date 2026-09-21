'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { X, Lock, ShieldCheck, ArrowRight, ShoppingBag, ExternalLink } from 'lucide-react';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    discount,
    isFreeShipping,
    checkoutUrl,
  } = useCart();

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const totalPayable = Math.max(0, subtotal - discount + (isFreeShipping ? 0 : 99));

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCheckoutError(null);
    setIsRedirecting(false);
  };

  const handleProceedToShopify = async () => {
    if (cart.length === 0) return;

    setCheckoutError(null);

    // 1. Direct redirect if checkoutUrl exists
    if (checkoutUrl) {
      setIsRedirecting(true);
      window.location.href = checkoutUrl;
      return;
    }

    // 2. Generate cart on demand via server endpoint
    try {
      setIsRedirecting(true);
      const lines = cart
        .filter((item) => item.variantId && item.variantId.startsWith('gid://shopify/'))
        .map((item) => ({
          merchandiseId: item.variantId!,
          quantity: item.quantity,
        }));

      if (lines.length === 0) {
        setCheckoutError(
          'Your shopping bag contains preview items. Add a live Shopify creation to launch checkout.'
        );
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
        setCheckoutError(
          data.error || 'Unable to connect to Shopify checkout. Please verify store configuration.'
        );
        setIsRedirecting(false);
      }
    } catch (err: any) {
      setCheckoutError('Network error connecting to checkout. Please try again.');
      setIsRedirecting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 my-auto border border-white/70"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-black/5 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span className="caps-subtitle text-[10px] sm:text-[11px] font-semibold tracking-widest text-stone-800">
                PRAYELE Encrypted Checkout
              </span>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-200 flex items-center justify-center transition-colors text-stone-600 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 sm:p-8 max-h-[82vh] overflow-y-auto overscroll-contain space-y-6">
            <div>
              <h3 className="editorial-serif text-2xl sm:text-3xl font-normal text-stone-900 mb-1">
                Complete Your Order
              </h3>
              <p className="text-xs text-stone-500">
                You will be securely redirected to Shopify&apos;s PCI-DSS compliant checkout to enter shipping address and complete payment.
              </p>
            </div>

            {/* Bag Review */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 pb-1 border-b border-stone-100">
                <span>Selected Pieces ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                <span>Subtotal</span>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-stone-400">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Your shopping bag is currently empty.</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                          <Image
                            src={item.selectedColor.image}
                            alt={item.product.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="text-xs font-medium text-stone-900 line-clamp-1">
                            {item.product.name}
                          </h5>
                          <p className="text-[11px] text-stone-500">
                            {item.selectedColor.name} &times; {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-stone-900">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Order Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Promo Savings:</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Express Courier:</span>
                <span>{isFreeShipping ? 'FREE' : '₹99'}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-semibold text-sm text-stone-900">
                <span>Total Payable:</span>
                <span>₹{totalPayable}</span>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-900/90 leading-relaxed">
                <strong>Certified Bank-Grade Protection:</strong> Payment details, cards, and UPI authentications are executed exclusively inside Shopify&apos;s certified PCI-DSS Level 1 payment gateway. We never store financial credentials.
              </div>
            </div>

            {checkoutError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {checkoutError}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-col-reverse min-[420px]:flex-row items-stretch min-[420px]:items-center justify-between border-t border-stone-100 gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-stone-500 hover:text-stone-900 font-medium py-2 text-center"
              >
                ← Return to Bag
              </button>

              <button
                onClick={handleProceedToShopify}
                disabled={cart.length === 0 || isRedirecting}
                className="w-full min-[420px]:w-auto px-8 py-3.5 rounded-full bg-black text-white text-xs font-medium uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRedirecting ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Connecting to Shopify...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Shopify Checkout</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
