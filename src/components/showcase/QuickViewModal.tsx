'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, Star, ShoppingBag, Truck, RefreshCw, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (product) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [product]);

  if (!product || !isClient) return null;

  const currentColor = product.colors[selectedColorIdx] || product.colors[0];
  const isWished = isInWishlist(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    addToCart(product, currentColor, quantity, e);
    onClose();
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 md:p-8 overscroll-contain">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window (Bottom Sheet on mobile, centered modal on tablet+) */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-4xl bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/60 z-10 sm:my-auto max-h-[92vh] sm:max-h-[88vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black/70 hover:text-black hover:bg-white shadow-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto overscroll-contain">
            {/* Image Column */}
            <div className="md:col-span-6 relative h-[210px] min-[360px]:h-[240px] min-[480px]:h-[290px] md:h-auto md:min-h-[480px] bg-stone-100 shrink-0">
              <Image
                src={currentColor.image}
                alt={`${product.name} - ${currentColor.name}`}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover object-center"
              />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 glass-pill px-3 py-1 rounded-full text-xs font-medium text-[var(--theme-text)]">
                Selected: {currentColor.name}
              </div>
            </div>

            {/* Details Column */}
            <div className="md:col-span-6 p-4 sm:p-6 md:p-8 flex flex-col justify-between">
              <div>
                {/* Rating & Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="caps-subtitle text-[10px] text-[var(--theme-accent)] font-semibold tracking-widest">
                    {product.badge || 'Haute Collection'}
                  </span>
                  <div className="flex items-center gap-1 text-[var(--theme-accent)]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-semibold text-xs text-[var(--theme-text)]">
                      {product.rating}
                    </span>
                    <span className="text-xs text-[var(--theme-text-muted)]">
                      ({product.reviewsCount} reviews)
                    </span>
                  </div>
                </div>

                <h2 className="editorial-serif text-2xl sm:text-3xl font-medium text-[var(--theme-text)] mb-1">
                  {product.name}
                </h2>
                <div className="flex items-center justify-between mb-3 gap-2">
                  <p className="text-xs text-[var(--theme-accent)] font-medium">
                    {product.subtitle}
                  </p>
                  <Link
                    href={`/product/${product.slug || product.id}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600 hover:text-black hover:underline shrink-0"
                  >
                    <span>Full Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-black/5">
                  <span className="editorial-serif text-2xl sm:text-3xl font-semibold text-[var(--theme-text)]">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm line-through text-[var(--theme-text-muted)]">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                    In Stock • Ready to Dispatch
                  </span>
                </div>

                {/* Description & Editorial Note */}
                <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] leading-relaxed mb-4">
                  {product.description}
                </p>

                <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/40 text-xs text-stone-700 italic mb-4 leading-relaxed">
                  “{product.editorialNote}”
                </div>

                {/* Color Swatches */}
                <div className="mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-text)] block mb-2">
                    Available Finishes:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.colors.map((c, idx) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColorIdx(idx)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all ${
                          selectedColorIdx === idx
                            ? 'border-black bg-stone-100 font-medium'
                            : 'border-black/15 hover:border-black/40'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] mb-6 p-3 rounded-xl bg-stone-50 border border-black/5">
                  <div>
                    <span className="text-stone-400 block text-[9px] uppercase tracking-wider">
                      Material
                    </span>
                    <strong className="text-stone-800 font-medium">{product.material}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9px] uppercase tracking-wider">
                      Hold Strength
                    </span>
                    <strong className="text-stone-800 font-medium">{product.holdStrength}</strong>
                  </div>
                  <div className="mt-1">
                    <span className="text-stone-400 block text-[9px] uppercase tracking-wider">
                      Dimensions
                    </span>
                    <strong className="text-stone-800 font-medium">{product.dimensions}</strong>
                  </div>
                  <div className="mt-1">
                    <span className="text-stone-400 block text-[9px] uppercase tracking-wider">
                      Best For
                    </span>
                    <strong className="text-stone-800 font-medium">
                      {product.hairTypes.join(', ')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div>
                <div className="flex flex-col min-[380px]:flex-row items-stretch min-[380px]:items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between min-[380px]:justify-start gap-2">
                    <div className="flex items-center border border-black/15 rounded-full px-2.5 min-[360px]:px-3 py-1.5 gap-2.5 min-[360px]:gap-3 bg-stone-50/80">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-stone-500 hover:text-black font-semibold text-sm w-5 h-5 flex items-center justify-center active:scale-90"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-stone-500 hover:text-black font-semibold text-sm w-5 h-5 flex items-center justify-center active:scale-90"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Mobile Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`min-[380px]:hidden p-2.5 rounded-full border border-black/15 transition-colors active:scale-90 ${
                        isWished ? 'text-rose-500 bg-rose-50 border-rose-200' : 'hover:bg-stone-50'
                      }`}
                      aria-label={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={handleAdd}
                    className="flex-1 py-3 sm:py-3.5 rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:opacity-90 active:scale-95 shadow-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • ₹{product.price * quantity}</span>
                  </button>

                  {/* Desktop / Tablet Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`hidden min-[380px]:flex p-3 sm:p-3.5 rounded-full border border-black/15 transition-colors active:scale-90 ${
                      isWished ? 'text-rose-500 bg-rose-50 border-rose-200' : 'hover:bg-stone-50'
                    }`}
                    aria-label={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-col min-[480px]:flex-row items-start min-[480px]:items-center justify-between text-[9.5px] min-[360px]:text-[10px] text-stone-500 pt-2.5 sm:pt-3 border-t border-black/5 gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Complimentary Express Shipping over ₹999</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>14-Day Easy Exchange</span>
                  </div>
                </div>

                {/* Full Editorial PDP Link */}
                <div className="mt-3.5 pt-3 border-t border-black/5 text-center">
                  <Link
                    href={`/product/${product.slug || product.id}`}
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[var(--theme-text)] hover:text-[var(--theme-accent)] transition-colors group/link"
                  >
                    <span>View Dedicated Product Page &amp; Styling Guide</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
