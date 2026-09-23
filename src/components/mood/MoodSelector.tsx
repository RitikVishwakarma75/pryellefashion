'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { MOODS } from '@/data/moods';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { MoodType } from '@/types';
import Image from 'next/image';
import { Sparkles, ShoppingBag, Check } from 'lucide-react';

export default function MoodSelector() {
  const { activeMood, setActiveMood } = useTheme();
  const { addToCart } = useCart();

  const currentMood = MOODS.find((m) => m.id === activeMood) || MOODS[0];

  // Resolve recommended products
  const recommendedProducts = currentMood.recommendedProductIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  const handleAddBundleToBag = (e: React.MouseEvent) => {
    recommendedProducts.forEach((prod) => {
      if (prod) {
        addToCart(prod, prod.colors[0], 1, e);
      }
    });
  };

  return (
    <section id="find-your-look" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
          <span className="caps-subtitle text-[10px] tracking-[0.22em] text-[var(--theme-text)]/80">
            Intelligent Styling Concierge
          </span>
        </div>
        <h2 className="editorial-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--theme-text)] mb-4">
          What’s your hair mood today?
        </h2>
        <p className="text-sm sm:text-base text-[var(--theme-text-muted)] font-normal max-w-xl mx-auto">
          Select an aura. We curate the exact accessory combination, hairstyle technique, and harmonious palette to elevate your day.
        </p>
      </div>

      {/* 5 Visual Mood Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-10 sm:mb-14">
        {MOODS.map((mood) => {
          const isSelected = activeMood === mood.id;

          return (
            <button
              key={mood.id}
              onClick={() => setActiveMood(mood.id as MoodType)}
              className={`group relative rounded-3xl p-5 sm:p-6 text-left transition-all duration-500 overflow-hidden flex flex-col justify-between h-[150px] min-[400px]:h-[165px] sm:h-[190px] border last:col-span-2 sm:last:col-span-1 lg:last:col-span-1 active:scale-[0.98] ${
                isSelected
                  ? 'border-[var(--theme-text)]/40 shadow-xl scale-[1.02] bg-white/90'
                  : 'border-black/5 hover:border-black/20 glass-panel hover:shadow-md'
              }`}
            >
              {/* Background gradient hint */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${mood.bgGradient} opacity-20 group-hover:opacity-30 transition-opacity`}
              />

              {/* Top Row: Emoji & Selection Indicator */}
              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="text-2xl sm:text-3xl">{mood.emoji}</span>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[var(--theme-text)] text-[var(--theme-bg)]'
                      : 'border border-black/15 text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3" />
                </span>
              </div>

              {/* Bottom Row: Name & Tagline */}
              <div className="relative z-10">
                <h3 className="editorial-serif text-lg sm:text-xl font-medium tracking-tight text-[var(--theme-text)]">
                  {mood.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-[var(--theme-text-muted)] line-clamp-1 mt-0.5">
                  {mood.tagline}
                </p>
              </div>

              {/* Active Ring Animation */}
              {isSelected && (
                <motion.div
                  layoutId="activeMoodBorder"
                  className="absolute inset-0 rounded-3xl ring-2 ring-[var(--theme-accent)] pointer-events-none"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Recommendation Showcase Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMood.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/70 shadow-2xl overflow-hidden"
        >
          {/* Subtle Ambient Mesh in Box */}
          <div
            className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-25 bg-gradient-to-br ${currentMood.bgGradient} pointer-events-none`}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Mood Editorial Photo & Hairstyle Tip */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-lg border border-white/40">
                <Image
                  src={currentMood.editorialImage}
                  alt={currentMood.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="caps-subtitle text-[9px] tracking-widest text-white/80">
                    Recommended Hairstyle
                  </span>
                  <p className="editorial-serif text-xl sm:text-2xl font-light">
                    {currentMood.hairstyle}
                  </p>
                </div>
              </div>

              {/* Hairstyle Pro Advice */}
              <div className="p-4 rounded-2xl bg-black/[0.03] border border-black/5 text-xs text-[var(--theme-text-muted)] leading-relaxed">
                <span className="font-semibold text-[var(--theme-text)] block mb-1">
                  Stylist Secret:
                </span>
                {currentMood.hairstyleTip}
              </div>
            </div>

            {/* Right Column: Recommended Accessories Trio & Bundle CTA */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{currentMood.emoji}</span>
                  <span className="caps-subtitle text-xs text-[var(--theme-accent)] font-semibold">
                    The {currentMood.name} Edit
                  </span>
                </div>
                <h3 className="editorial-serif text-2xl sm:text-4xl font-normal text-[var(--theme-text)] mb-3">
                  {currentMood.tagline}
                </h3>
                <p className="text-sm text-[var(--theme-text-muted)] leading-relaxed mb-6 sm:mb-8">
                  {currentMood.description}
                </p>

                {/* 3 Recommended Items */}
                <span className="caps-subtitle text-[10px] tracking-widest text-[var(--theme-text-muted)] block mb-3">
                  Curated Styling Trio (Included in Look):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  {recommendedProducts.map((item, idx) => {
                    if (!item) return null;
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-white/80 border border-black/5 flex sm:flex-col items-center sm:items-start gap-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="relative w-14 h-14 sm:w-full sm:aspect-square rounded-xl overflow-hidden bg-black/5 flex-shrink-0">
                          <Image
                            src={item.colors[0].image}
                            alt={item.name}
                            fill
                            sizes="120px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[var(--theme-accent)] uppercase font-semibold tracking-wider">
                            0{idx + 1} • {item.megaCategory.replace(/-/g, ' ')}
                          </p>
                          <h4 className="text-xs font-semibold text-[var(--theme-text)] truncate mt-0.5">
                            {item.name}
                          </h4>
                          <p className="text-xs text-[var(--theme-text-muted)] mt-0.5">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bundle Action Bar */}
              <div className="pt-4 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[var(--theme-text-muted)] block">
                    Complete Look Bundle (Save 20%):
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="editorial-serif text-2xl sm:text-3xl font-semibold text-[var(--theme-text)]">
                      ₹{currentMood.bundlePrice}
                    </span>
                    <span className="text-sm line-through text-[var(--theme-text-muted)]/70">
                      ₹{currentMood.bundleOriginalPrice}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--theme-accent)]/15 text-[var(--theme-accent)] font-semibold uppercase">
                      Bundle Savings
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAddBundleToBag}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:opacity-90 hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop This Look</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
