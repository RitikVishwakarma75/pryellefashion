'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingBag, Star, ShieldCheck, Truck, RefreshCw, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const currentColor = product.colors[selectedColorIdx] || product.colors[0];
  const isWished = isInWishlist(product.id);
  const isAvailable = product.availableForSale !== false;

  const handleAdd = (e: React.MouseEvent) => {
    if (!isAvailable) return;
    addToCart(product, currentColor, quantity, e);
  };

  return (
    <div className="pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back to Catalog Breadcrumb */}
      <div className="mb-6 sm:mb-8">
        <Link
          href="/#product-showcase"
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Collection</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/5] sm:aspect-square w-full rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-stone-100"
          >
            <Image
              src={currentColor.image}
              alt={`${product.name} - ${currentColor.name}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover object-center transition-transform duration-700 hover:scale-104"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {!isAvailable ? (
                <span className="glass-pill px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-stone-900/80 text-white shadow-sm">
                  Sold Out
                </span>
              ) : (
                product.badge && (
                  <span className="glass-pill px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-[var(--theme-text)] shadow-sm">
                    {product.badge}
                  </span>
                )
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full glass-pill flex items-center justify-center transition-all duration-300 z-10 active:scale-90 ${
                isWished ? 'bg-rose-50 text-rose-500' : 'hover:bg-white text-[var(--theme-text)]'
              }`}
              aria-label={isWished ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
            </button>
          </motion.div>

          {/* Color & Variant Thumbnail Selector */}
          {product.colors.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
              {product.colors.map((c, idx) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColorIdx(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedColorIdx === idx
                      ? 'border-black ring-2 ring-[var(--theme-accent)]/50 scale-105'
                      : 'border-black/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={c.image} alt={c.name} fill sizes="80px" className="object-cover" />
                  <span className="absolute bottom-1 left-1 right-1 text-[8px] truncate bg-black/60 text-white px-1 py-0.5 rounded text-center">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details & Purchase Form */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Rating & Availability */}
            <div className="flex items-center justify-between mb-3">
              <span className="caps-subtitle text-xs text-[var(--theme-accent)] font-semibold">
                {product.subtitle}
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

            {/* Product Title */}
            <h1 className="editorial-serif text-3xl sm:text-5xl font-light text-[var(--theme-text)] leading-tight mb-3">
              {product.name}
            </h1>

            {/* Price & Availability Pill */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-black/10">
              <span className="editorial-serif text-3xl sm:text-4xl font-normal text-[var(--theme-text)]">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-base line-through text-[var(--theme-text-muted)]">
                  ₹{product.originalPrice}
                </span>
              )}
              {!isAvailable ? (
                <span className="text-xs text-stone-600 bg-stone-100 px-3 py-1 rounded-full font-medium ml-auto">
                  Currently Sold Out
                </span>
              ) : (
                <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium ml-auto">
                  In Stock • Dispatch in 24h
                </span>
              )}
            </div>

            {/* Editorial Description */}
            <p className="text-sm sm:text-base text-[var(--theme-text-muted)] leading-relaxed mb-6 font-normal">
              {product.description}
            </p>

            {product.editorialNote && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/40 text-xs sm:text-sm text-stone-700 italic mb-6 leading-relaxed">
                “{product.editorialNote}”
              </div>
            )}

            {/* Variant / Finish Options */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="caps-subtitle text-xs text-[var(--theme-text)]">
                  Selected Finish:
                </span>
                <span className="text-xs font-semibold text-[var(--theme-accent)]">
                  {currentColor.name}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {product.colors.map((c, idx) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs transition-all active:scale-95 ${
                      selectedColorIdx === idx
                        ? 'border-black bg-white shadow-md font-semibold text-[var(--theme-text)]'
                        : 'border-black/15 hover:border-black/30 text-[var(--theme-text-muted)]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications Cards */}
            <div className="grid grid-cols-2 gap-3 mb-8 p-4 rounded-2xl bg-stone-50/80 border border-black/5 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider mb-0.5">
                  Material
                </span>
                <strong className="text-stone-800 font-medium">{product.material}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider mb-0.5">
                  Hold Strength
                </span>
                <strong className="text-stone-800 font-medium">{product.holdStrength}</strong>
              </div>
              <div className="mt-2">
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider mb-0.5">
                  Dimensions
                </span>
                <strong className="text-stone-800 font-medium">{product.dimensions}</strong>
              </div>
              <div className="mt-2">
                <span className="text-stone-400 block text-[10px] uppercase tracking-wider mb-0.5">
                  Hair Types
                </span>
                <strong className="text-stone-800 font-medium">
                  {product.hairTypes.join(', ')}
                </strong>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-black/10">
            <div className="flex items-center gap-3 mb-4">
              {/* Quantity Controls */}
              <div className="flex items-center border border-black/15 rounded-full px-3.5 py-2.5 gap-3 bg-stone-50">
                <button
                  disabled={!isAvailable}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-stone-500 hover:text-black font-semibold text-sm w-5 h-5 flex items-center justify-center active:scale-90 disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="text-xs font-semibold w-5 text-center">{quantity}</span>
                <button
                  disabled={!isAvailable}
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-stone-500 hover:text-black font-semibold text-sm w-5 h-5 flex items-center justify-center active:scale-90 disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              {!isAvailable ? (
                <button
                  disabled
                  className="flex-1 py-4 rounded-full bg-stone-200 text-stone-400 text-xs font-semibold tracking-wider uppercase cursor-not-allowed shadow-none flex items-center justify-center gap-2"
                >
                  <span>Currently Sold Out</span>
                </button>
              ) : (
                <button
                  onClick={handleAdd}
                  className="flex-1 py-4 rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:opacity-90 active:scale-95 shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • ₹{product.price * quantity}</span>
                </button>
              )}
            </div>

            {/* Trust Strip */}
            <div className="grid grid-cols-2 gap-3 text-[11px] text-stone-500 pt-3 border-t border-black/5">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
                <span>Complimentary Express Courier over ₹999</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
                <span>14-Day Boutique Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
