'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  index?: number;
}

export default function ProductCard({ product, onQuickView, index = 0 }: ProductCardProps) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const currentColor = product.colors[selectedColorIdx] || product.colors[0];
  const isWished = isInWishlist(product.id);
  const productHref = `/product/${product.slug || product.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
      className="group relative flex flex-col justify-between rounded-2xl min-[360px]:rounded-3xl p-3 min-[360px]:p-3.5 sm:p-5 transition-all duration-500 glass-panel border border-white/60 hover:shadow-2xl hover:border-black/15 bg-white/70 gpu-layer w-full max-w-full overflow-hidden"
    >
      {/* Product Image Stage */}
      <div className="relative w-full aspect-[4/5] rounded-xl min-[360px]:rounded-2xl overflow-hidden bg-gradient-to-b from-stone-100 to-stone-200/50 mb-3 sm:mb-4">
        <Link href={productHref} className="absolute inset-0 z-0">
          <Image
            src={currentColor.image}
            alt={`${product.name} - ${currentColor.name}`}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
          />
        </Link>

        {/* Ambient Hover Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-2 left-2 min-[360px]:top-2.5 min-[360px]:left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="glass-pill px-1.5 min-[360px]:px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[7.5px] min-[360px]:text-[8px] sm:text-[9px] font-semibold tracking-wider uppercase text-[var(--theme-text)] shadow-sm">
              {product.badge}
            </span>
          )}
          {product.is3DSupported && (
            <span className="glass-pill px-1.5 sm:px-2 py-0.5 rounded-full text-[7px] sm:text-[8px] font-medium tracking-wider uppercase text-[var(--theme-accent)] shadow-sm">
              3D View
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 min-[360px]:top-2.5 min-[360px]:right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full glass-pill flex items-center justify-center transition-all duration-300 z-10 active:scale-90 ${
            isWished
              ? 'bg-rose-50 text-rose-500 border-rose-200'
              : 'text-[var(--theme-text)] hover:scale-110 hover:bg-white'
          }`}
          aria-label={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover/Touch Pill */}
        <div className="absolute inset-x-2 min-[360px]:inset-x-2.5 sm:inset-x-4 bottom-2 min-[360px]:bottom-2.5 sm:bottom-4 z-10 flex gap-2 opacity-95 md:opacity-0 md:translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => onQuickView?.(product)}
            className="flex-1 py-1.5 sm:py-2.5 rounded-xl bg-white/95 backdrop-blur-md text-[var(--theme-text)] text-[9.5px] min-[360px]:text-[10px] sm:text-xs font-medium tracking-wider uppercase shadow-lg hover:bg-white active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 transition-colors"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[9.5px] min-[360px]:text-[10px] sm:text-[11px] text-[var(--theme-text-muted)] mb-1 gap-1">
            <span className="uppercase tracking-widest text-[8px] min-[360px]:text-[8.5px] sm:text-[9px] font-medium truncate max-w-[100px] min-[360px]:max-w-[130px] sm:max-w-none">
              {product.subCategory.replace(/-/g, ' ')}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-[var(--theme-accent)] shrink-0">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              <span className="font-semibold text-[var(--theme-text)] text-[9px] min-[360px]:text-[9.5px] sm:text-[10px]">
                {product.rating}
              </span>
              <span className="text-[8px] min-[360px]:text-[8.5px] sm:text-[9px] text-[var(--theme-text-muted)]">
                ({product.reviewsCount})
              </span>
            </div>
          </div>

          {/* Product Name & Subtitle */}
          <Link href={productHref} className="block group/title">
            <h3 className="editorial-serif text-base min-[360px]:text-lg sm:text-xl font-normal text-[var(--theme-text)] cursor-pointer group-hover/title:text-[var(--theme-accent)] transition-colors leading-snug mb-1 line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-[11px] min-[360px]:text-xs text-[var(--theme-text-muted)] line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>

        {/* Swatches, Price & Add to Bag */}
        <div>
          {/* Color Swatch Bar */}
          <div className="flex items-center justify-between mb-2.5 sm:mb-3.5 pt-2 border-t border-black/5 gap-1.5">
            <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
              {product.colors.map((color, idx) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColorIdx(idx)}
                  className="w-6 h-6 min-[360px]:w-7 sm:w-8 -m-0.5 min-[360px]:-m-1 flex items-center justify-center rounded-full active:scale-90 transition-transform"
                  title={color.name}
                  aria-label={`Select ${color.name} finish`}
                >
                  <span
                    className={`w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all ${
                      selectedColorIdx === idx
                        ? 'scale-125 border-black ring-1 ring-black/40 shadow-sm'
                        : 'border-black/20 hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              ))}
            </div>
            <span className="text-[8.5px] min-[360px]:text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] font-medium truncate max-w-[75px] min-[360px]:max-w-[90px] sm:max-w-none">
              {currentColor.name}
            </span>
          </div>

          {/* Price & Add to Bag */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="editorial-serif text-lg min-[360px]:text-xl sm:text-2xl font-medium text-[var(--theme-text)]">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs line-through text-[var(--theme-text-muted)]">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            <button
              onClick={(e) => addToCart(product, currentColor, 1, e)}
              className="px-2.5 min-[360px]:px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] text-[9.5px] min-[360px]:text-[10px] sm:text-xs font-medium tracking-wider uppercase transition-all duration-300 hover:opacity-90 active:scale-95 shadow-md flex items-center gap-1 sm:gap-1.5 hover:shadow-lg whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
