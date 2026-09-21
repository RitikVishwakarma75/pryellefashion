'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Sparkles, CheckCircle, ShoppingBag, Camera } from 'lucide-react';
import { REVIEWS, INSTAGRAM_POSTS, PRESS_MENTIONS } from '@/data/reviews';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function SocialProof() {
  const { addToCart } = useCart();

  const handleQuickAdd = (productId: string, e: React.MouseEvent) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (product) {
      addToCart(product, product.colors[0], 1, e);
    }
  };

  return (
    <section id="social-proof" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Press Marquee Quotes */}
      <div className="mb-20 pb-12 border-b border-black/5">
        <div className="text-center mb-8">
          <span className="caps-subtitle text-[10px] tracking-[0.25em] text-[var(--theme-text-muted)]">
            As Acclaimed In Global Fashion Media
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {PRESS_MENTIONS.map((press) => (
            <div key={press.name} className="flex flex-col items-center justify-center p-4">
              <span className="editorial-serif text-2xl sm:text-3xl font-bold tracking-wider text-[var(--theme-text)] mb-2">
                {press.name}
              </span>
              <p className="text-xs text-[var(--theme-text-muted)] italic max-w-xs leading-relaxed">
                {press.quote}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Social Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
          <span className="caps-subtitle text-[10px] tracking-[0.22em] text-[var(--theme-text)]/80">
            Real Hair Transformations
          </span>
        </div>
        <h2 className="editorial-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--theme-text)] mb-3">
          Loved By Your Hair
        </h2>
        <div className="flex items-center justify-center gap-1 text-[var(--theme-accent)] mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-current" />
          ))}
        </div>
        <p className="editorial-serif text-xl sm:text-2xl font-light italic text-[var(--theme-text)] mb-2">
          “Finally a clip that actually stays in my hair.”
        </p>
        <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] font-medium">
          — Aanya Verma, Mumbai (Thick & Heavy Wavy Hair)
        </p>
      </div>

      {/* Customer Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 sm:mb-20">
        {REVIEWS.map((rev, idx) => (
          <motion.div
            key={rev.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-panel rounded-3xl p-6 border border-white/60 shadow-md flex flex-col justify-between bg-white/75"
          >
            <div>
              {/* Stars & Verified */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-[var(--theme-accent)]">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified Hair Enthusiast</span>
                </div>
              </div>

              {/* Title & Comment */}
              <h3 className="editorial-serif text-lg font-medium text-[var(--theme-text)] mb-2 leading-snug">
                {rev.title}
              </h3>
              <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed mb-4">
                {rev.comment}
              </p>
            </div>

            {/* Author details & Hair texture badge */}
            <div className="pt-4 border-t border-black/5">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-200">
                  <Image
                    src={rev.avatarUrl}
                    alt={rev.author}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[var(--theme-text)]">
                    {rev.author}
                  </h4>
                  <span className="text-[10px] text-[var(--theme-text-muted)] block">
                    {rev.location}
                  </span>
                </div>
              </div>
              <div className="mt-2.5 px-2.5 py-1 rounded-full bg-stone-100 text-[9px] font-medium text-stone-600 inline-block">
                Texture: {rev.hairType}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Shoppable Instagram Masonry Lookbook */}
      <div className="mt-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <span className="caps-subtitle text-[10px] tracking-widest text-[var(--theme-accent)] font-semibold">
              Community Gallery
            </span>
            <h3 className="editorial-serif text-2xl sm:text-4xl font-normal text-[var(--theme-text)]">
              Styled On You: #PrayeleLooks
            </h3>
          </div>
          <a
            href="#social-proof"
            className="inline-flex items-center gap-2 glass-pill px-4 py-2 rounded-full text-xs font-medium text-[var(--theme-text)] hover:bg-white"
          >
            <Camera className="w-4 h-4 text-rose-500" />
            <span>Tag @prayelestudio to be featured</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-md bg-stone-200 cursor-pointer"
            >
              <Image
                src={post.image}
                alt={post.handle}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />

              {/* Hover Shoppable Layer */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 text-white">
                <span className="text-[10px] font-medium text-white/80">
                  {post.handle}
                </span>

                <div>
                  <p className="text-[11px] font-medium text-white line-clamp-1">
                    {post.taggedProduct.name}
                  </p>
                  <p className="text-[10px] text-amber-300 font-semibold mb-2">
                    ₹{post.taggedProduct.price}
                  </p>
                  <button
                    onClick={(e) => handleQuickAdd(post.taggedProduct.id, e)}
                    className="w-full py-1.5 rounded-lg bg-white text-black text-[10px] font-semibold uppercase tracking-wider hover:bg-white/90 flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Shop Look</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
