'use client';

import React, { useState } from 'react';
import { COLLECTIONS, CollectionInfo } from '@/data/collections';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { ArrowUpRight, Sparkles, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CollectionSection() {
  const [selectedCollection, setSelectedCollection] = useState<CollectionInfo | null>(null);
  const { addToCart } = useCart();

  const collectionProducts = selectedCollection
    ? PRODUCTS.filter((p) => p.collection === selectedCollection.id)
    : [];

  return (
    <section id="collections" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
          <span className="caps-subtitle text-[10px] tracking-[0.22em] text-[var(--theme-text)]/80">
            Curated Universes
          </span>
        </div>
        <h2 className="editorial-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--theme-text)] mb-3">
          Four Cinematic Collections
        </h2>
        <p className="text-sm sm:text-base text-[var(--theme-text-muted)] max-w-xl mx-auto">
          Each collection possesses its own distinct sensory atmosphere, hand-selected materials, and styling philosophy.
        </p>
      </div>

      {/* 4 Large Cinematic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {COLLECTIONS.map((col, idx) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            onClick={() => setSelectedCollection(col)}
            className="group relative h-[380px] sm:h-[460px] rounded-3xl overflow-hidden cursor-pointer shadow-xl border border-white/40 flex flex-col justify-end p-6 sm:p-10"
          >
            {/* Background Editorial Image */}
            <Image
              src={col.heroImage}
              alt={col.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-108"
            />

            {/* Dark Dramatic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:from-black/90 transition-colors duration-500" />

            {/* Content Overlays */}
            <div className="relative z-10 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="caps-subtitle text-[10px] tracking-[0.25em] text-white/70">
                  {col.tagline} • {col.productCount} Creations
                </span>
                <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45 group-hover:bg-white group-hover:text-black">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              <h3 className="editorial-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-2 leading-tight">
                {col.name}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 line-clamp-2 max-w-md font-normal leading-relaxed">
                {col.ethos}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Collection Exploration Modal Drawer */}
      <AnimatePresence>
        {selectedCollection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCollection(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 my-auto max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="relative p-5 sm:p-8 bg-stone-900 text-white flex items-start sm:items-center justify-between gap-4">
                <div className="pr-8 sm:pr-0">
                  <span className="caps-subtitle text-[10px] tracking-[0.25em] text-white/60">
                    {selectedCollection.tagline}
                  </span>
                  <h3 className="editorial-serif text-2xl sm:text-4xl font-light text-white mt-1">
                    {selectedCollection.name} Collection
                  </h3>
                  <p className="text-xs text-white/80 mt-1 max-w-xl">
                    {selectedCollection.ethos}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCollection(null)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0 active:scale-95"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Products in Collection */}
              <div className="p-4 sm:p-8 overflow-y-auto overscroll-contain grid grid-cols-1 min-[440px]:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {collectionProducts.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-black/5 bg-stone-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-stone-200">
                        <Image
                          src={item.colors[0].image}
                          alt={item.name}
                          fill
                          sizes="300px"
                          className="object-cover"
                        />
                      </div>
                      <h4 className="editorial-serif text-lg font-medium text-[var(--theme-text)]">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[var(--theme-text-muted)] line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
                      <span className="editorial-serif text-lg font-semibold text-[var(--theme-text)]">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={(e) => {
                          addToCart(item, item.colors[0], 1, e);
                        }}
                        className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-medium uppercase tracking-wider hover:opacity-90 flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
