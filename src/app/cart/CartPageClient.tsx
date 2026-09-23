'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPageClient() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    promoCode,
    applyPromoCode,
    promoError,
    isFreeShipping,
    amountNeededForFreeShipping,
    setIsCheckoutOpen,
  } = useCart();

  const [promoInput, setPromoInput] = React.useState('');
  const shipping = isFreeShipping ? 0 : subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shipping);

  if (cart.length === 0) {
    return (
      <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-4"
        >
          <ShoppingBag className="w-16 h-16 text-stone-700 mx-auto mb-6" />
          <h1 className="editorial-serif text-3xl text-white mb-3">Your Bag is Empty</h1>
          <p className="text-stone-500 text-sm mb-8 max-w-sm mx-auto">
            Discover our curated collection of luxury hair accessories and find your perfect piece.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#C5A059] text-black text-sm font-semibold hover:bg-[#D4B068] transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Start Shopping
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="caps-subtitle text-[#C5A059] mb-2">Your Bag</p>
          <h1 className="editorial-serif text-4xl font-light text-white">
            {cart.length} {cart.length === 1 ? 'Piece' : 'Pieces'} Selected
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free Shipping Progress */}
            {!isFreeShipping && subtotal > 0 && (
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-stone-400">Free shipping progress</span>
                  <span className="text-[#C5A059] font-medium">₹{amountNeededForFreeShipping} away</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#C5A059] to-[#E6B85C]"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {isFreeShipping && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-medium">
                ✨ Complimentary express shipping unlocked
              </div>
            )}

            {cart.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/15 transition-colors"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-stone-900 flex-shrink-0">
                  <Image
                    src={item.selectedColor.image}
                    alt={item.product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/product/${item.product.slug || item.product.id}`}
                        className="text-sm font-semibold text-white hover:text-[#C5A059] transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {item.selectedColor.name} • {item.product.material}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-stone-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-white/[0.06] rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-white/10 text-stone-400 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-white/10 text-stone-400 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-stone-500">
                          ₹{item.product.price.toLocaleString('en-IN')} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-6 rounded-3xl bg-white/[0.04] border border-white/10">
              <h3 className="editorial-serif text-xl text-white mb-6">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({promoCode})</span>
                    <span>−₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-400">
                  <span>Shipping</span>
                  <span className={isFreeShipping ? 'text-emerald-400 font-medium' : 'text-white'}>
                    {isFreeShipping ? 'Free' : shipping === 0 ? '—' : `₹${shipping}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="editorial-serif text-xl text-[#C5A059] font-semibold">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Promo Code */}
              {!promoCode && (
                <div className="mt-6">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        placeholder="Promo code"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-xs placeholder:text-stone-500 focus:outline-none focus:border-[#C5A059]/40"
                      />
                    </div>
                    <button
                      onClick={() => {
                        applyPromoCode(promoInput);
                        setPromoInput('');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-red-400 text-[10px] mt-2">{promoError}</p>
                  )}
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#E6B85C] text-black text-sm font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/shop"
                className="block text-center text-xs text-stone-500 hover:text-stone-300 mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
