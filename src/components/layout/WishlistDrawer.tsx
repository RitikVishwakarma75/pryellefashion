'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Heart, ShoppingBag, ExternalLink } from 'lucide-react';

export default function WishlistDrawer() {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsWishlistOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 350, damping: 32 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-current" />
              <h3 className="editorial-serif text-xl sm:text-2xl font-normal text-[var(--theme-text)]">
                Saved Favorites ({wishlist.length})
              </h3>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 stroke-1" />
                </div>
                <h4 className="editorial-serif text-xl font-normal text-stone-800 mb-1">
                  No saved creations yet
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
                  Click the heart icon on any hairpiece to save it to your private moodboard.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsWishlistOpen(false)}
                  className="inline-block px-6 py-2.5 rounded-full bg-black text-white text-xs font-medium uppercase tracking-wider hover:opacity-90"
                >
                  Browse Catalog
                </Link>
              </div>
            ) : (
              wishlist.map((item) => {
                const color = item.colors?.[0] || { name: 'Default', hex: '#C5A059', image: '' };
                const imageSrc = color.image || '/placeholder.jpg';

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-2xl bg-stone-50 border border-black/5 items-center"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                      <Image
                        src={imageSrc}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="editorial-serif text-sm font-medium text-stone-900 truncate">
                        {item.name}
                      </h4>
                      <span className="text-xs font-semibold text-stone-900 block my-0.5">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={(e) => {
                          addToCart(item, color, 1, e);
                          toggleWishlist(item);
                        }}
                        className="text-[11px] text-[var(--theme-accent)] font-semibold uppercase tracking-wider hover:underline flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    </div>

                    <button
                      onClick={() => toggleWishlist(item)}
                      className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-5 border-t border-black/5 bg-stone-50 space-y-2">
              <button
                onClick={(e) => {
                  wishlist.forEach((item) => {
                    const color = item.colors?.[0] || { name: 'Default', hex: '#C5A059', image: '' };
                    addToCart(item, color, 1, e);
                  });
                  setIsWishlistOpen(false);
                }}
                className="w-full py-3.5 rounded-full bg-black text-white text-xs font-medium uppercase tracking-wider hover:opacity-90 shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All to Bag ({wishlist.length} Items)</span>
              </button>

              <Link
                href="/account/wishlist"
                onClick={() => setIsWishlistOpen(false)}
                className="w-full py-2.5 rounded-full border border-stone-300 text-stone-700 hover:text-black text-xs font-medium uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full Moodboard Page</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
