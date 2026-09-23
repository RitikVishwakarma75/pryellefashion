'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ChevronLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export default function WishlistClient() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-[#0D0C0B] pt-28 pb-24 text-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-[#C5A059] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Account
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="caps-subtitle text-[10px] tracking-[0.25em] text-[#C5A059] block">
                PRIVATE CURATION
              </span>
              <span className="text-[10px] font-semibold text-[#C5A059] px-2 py-0.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30">
                {wishlist.length} {wishlist.length === 1 ? 'Piece' : 'Pieces'}
              </span>
            </div>
            <h1 className="editorial-serif text-3xl sm:text-4xl font-normal text-white">
              My Favorites & Moodboard
            </h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={(e) => {
                wishlist.forEach((item) => {
                  const color = item.colors?.[0] || { name: 'Default', hex: '#C5A059', image: '' };
                  addToCart(item, color, 1, e);
                });
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E6B85C] text-black text-xs font-semibold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_20px_rgba(197,160,89,0.2)]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Bag ({wishlist.length})</span>
            </button>
          )}
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white/[0.02] border border-white/10">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 stroke-1" />
            </div>
            <h3 className="editorial-serif text-2xl text-white mb-2">No Saved Creations Yet</h3>
            <p className="text-stone-400 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
              You haven&apos;t added any creations to your favorites yet. Tap the heart icon on any sculpted claw, freshwater pearl pin, or silk scrunchie to curate your private collection.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E6B85C] text-black text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_4px_20px_rgba(197,160,89,0.2)]"
            >
              <span>Explore Boutique Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Favorites Grid - Shows ONLY the user's favorited products */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence>
              {wishlist.map((item) => {
                const color = item.colors?.[0] || { name: 'Default', hex: '#C5A059', image: '' };
                const imageSrc = color.image || '/placeholder.jpg';

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#C5A059]/40 transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Preview with Remove Action */}
                      <div className="relative aspect-square w-full bg-stone-900 overflow-hidden">
                        <Link href={`/product/${item.slug || item.id}`}>
                          <Image
                            src={imageSrc}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        {/* Remove from Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-rose-400 hover:text-rose-300 hover:bg-black/80 flex items-center justify-center transition-all shadow-md active:scale-90"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {item.badge && (
                          <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-widest text-[#C5A059] font-medium">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Product Meta */}
                      <div className="p-5">
                        <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">
                          {item.material || 'Haute Craft'}
                        </p>
                        <Link href={`/product/${item.slug || item.id}`}>
                          <h3 className="editorial-serif text-lg text-white group-hover:text-[#C5A059] transition-colors line-clamp-1 mb-2">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm font-semibold text-white">
                          ₹{item.price?.toLocaleString('en-IN') || item.price}
                        </p>
                      </div>
                    </div>

                    {/* Move to Bag Action */}
                    <div className="p-5 pt-0">
                      <button
                        onClick={(e) => {
                          addToCart(item, color, 1, e);
                        }}
                        className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-[#C5A059] hover:text-black border border-white/10 hover:border-[#C5A059] text-xs font-semibold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
