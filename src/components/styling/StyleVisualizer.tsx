'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HairstyleType, StylingAccessoryType } from '@/types';
import { HAIRSTYLES, ACCESSORIES, STYLING_MATRIX } from '@/data/stylingMatrix';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { Sparkles, Clock, Compass, ShoppingBag, Check } from 'lucide-react';

export default function StyleVisualizer() {
  const [selectedHairstyle, setSelectedHairstyle] = useState<HairstyleType>('french-twist');
  const [selectedAccessory, setSelectedAccessory] = useState<StylingAccessoryType>('claw-clip');
  const { addToCart } = useCart();

  const comboKey = `${selectedHairstyle}_${selectedAccessory}`;
  const combo = STYLING_MATRIX[comboKey] || STYLING_MATRIX['french-twist_claw-clip'];

  const matchedProduct =
    PRODUCTS.find((p) => p.id === combo.recommendedProductId) || PRODUCTS[0];

  const handleGetTheLook = (e: React.MouseEvent) => {
    addToCart(matchedProduct, matchedProduct.colors[0], 1, e);
  };

  return (
    <section
      id="virtual-styling"
      className="py-16 sm:py-24 lg:py-28 px-3.5 min-[360px]:px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full max-w-full overflow-hidden"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full glass-pill mb-2.5 sm:mb-3">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--theme-accent)]" />
          <span className="caps-subtitle text-[9px] min-[360px]:text-[10px] tracking-[0.16em] sm:tracking-[0.22em] text-[var(--theme-text)]/80">
            Interactive Hair Simulator
          </span>
        </div>
        <h2 className="editorial-serif text-2xl min-[360px]:text-3xl min-[480px]:text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--theme-text)] mb-2.5 sm:mb-3">
          See It In Your Hair
        </h2>
        <p className="text-xs min-[360px]:text-sm sm:text-base text-[var(--theme-text-muted)] max-w-xl mx-auto leading-relaxed">
          Mix and match hairstyles with Prayele luxury accessories. Experience how a single hairpiece transforms everyday texture into runway couture.
        </p>
      </div>

      {/* Main Interactive Studio Grid */}
      <div className="glass-panel rounded-2xl min-[360px]:rounded-3xl p-3.5 min-[360px]:p-5 sm:p-8 lg:p-12 border border-white/70 shadow-2xl overflow-hidden w-full max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start lg:items-center">
          {/* Controls Column (Left on desktop, order-2 on mobile so model visualizer is seen first) */}
          <div className="lg:col-span-6 flex flex-col gap-6 sm:gap-8 order-2 lg:order-1">
            {/* Step 1: Select Hairstyle */}
            <div>
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <span className="caps-subtitle text-[10px] min-[360px]:text-xs tracking-wider sm:tracking-widest text-[var(--theme-text)]">
                  1. Choose Your Hairstyle
                </span>
                <span className="text-[10.5px] min-[360px]:text-[11px] text-[var(--theme-accent)] font-medium">
                  {HAIRSTYLES.find((h) => h.id === selectedHairstyle)?.name}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 min-[360px]:gap-2 sm:gap-2.5">
                {HAIRSTYLES.map((style) => {
                  const isSelected = selectedHairstyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelectedHairstyle(style.id)}
                      className={`relative px-2.5 min-[360px]:px-3 py-2 min-[360px]:py-2.5 sm:px-3.5 sm:py-3 rounded-xl min-[360px]:rounded-2xl text-left transition-all duration-300 flex items-center gap-1.5 min-[360px]:gap-2 border text-[11px] min-[360px]:text-xs sm:text-sm font-medium last:col-span-2 sm:last:col-span-1 active:scale-[0.98] ${
                        isSelected
                          ? 'bg-white border-black shadow-md text-[var(--theme-text)] scale-[1.01]'
                          : 'bg-white/40 border-black/5 text-[var(--theme-text-muted)] hover:bg-white/70 hover:text-[var(--theme-text)]'
                      }`}
                    >
                      <span className="text-sm min-[360px]:text-base shrink-0">{style.icon}</span>
                      <span className="leading-tight line-clamp-2">{style.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Accessory */}
            <div>
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <span className="caps-subtitle text-[10px] min-[360px]:text-xs tracking-wider sm:tracking-widest text-[var(--theme-text)]">
                  2. Choose Your Accessory
                </span>
                <span className="text-[10.5px] min-[360px]:text-[11px] text-[var(--theme-accent)] font-medium">
                  {ACCESSORIES.find((a) => a.id === selectedAccessory)?.name}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 min-[360px]:gap-2 sm:gap-2.5">
                {ACCESSORIES.map((acc) => {
                  const isSelected = selectedAccessory === acc.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => setSelectedAccessory(acc.id)}
                      className={`relative px-2.5 min-[360px]:px-3 py-2 min-[360px]:py-2.5 sm:px-3.5 sm:py-3 rounded-xl min-[360px]:rounded-2xl text-left transition-all duration-300 flex items-center justify-between border text-[11px] min-[360px]:text-xs sm:text-sm font-medium last:col-span-2 sm:last:col-span-1 active:scale-[0.98] gap-1.5 ${
                        isSelected
                          ? 'bg-white border-black shadow-md text-[var(--theme-text)] scale-[1.01]'
                          : 'bg-white/40 border-black/5 text-[var(--theme-text-muted)] hover:bg-white/70 hover:text-[var(--theme-text)]'
                      }`}
                    >
                      <span className="leading-tight line-clamp-2 flex-1">{acc.name}</span>
                      {isSelected && (
                        <span className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] flex items-center justify-center shrink-0">
                          <Check className="w-2 h-2 min-[360px]:w-2.5 min-[360px]:h-2.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Styling Details Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={comboKey}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="p-3.5 min-[360px]:p-5 rounded-xl min-[360px]:rounded-2xl bg-white/70 border border-black/5 shadow-sm"
              >
                <div className="flex items-center gap-3 min-[360px]:gap-4 text-[10.5px] min-[360px]:text-xs text-[var(--theme-text-muted)] mb-2.5 sm:mb-3 pb-2.5 sm:pb-3 border-b border-black/5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 text-[var(--theme-accent)] shrink-0" />
                    <span>Time: <strong className="text-[var(--theme-text)]">{combo.timeToStyle}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 text-[var(--theme-accent)] shrink-0" />
                    <span>Difficulty: <strong className="text-[var(--theme-text)]">{combo.difficulty}</strong></span>
                  </div>
                </div>

                <h3 className="editorial-serif text-lg min-[360px]:text-xl sm:text-2xl font-medium text-[var(--theme-text)] mb-0.5 sm:mb-1">
                  {combo.title}
                </h3>
                <p className="text-[11px] min-[360px]:text-xs text-[var(--theme-text-muted)] italic mb-2.5 sm:mb-3">
                  “{combo.tagline}”
                </p>
                <p className="text-[11px] min-[360px]:text-xs sm:text-sm text-[var(--theme-text)]/80 leading-relaxed">
                  <strong className="text-[var(--theme-text)] block mb-0.5">Master Stylist Secret:</strong>
                  {combo.stylistSecret}
                </p>

                {/* Match Accessory Bag Action */}
                <div className="mt-3.5 sm:mt-5 pt-3 sm:pt-4 border-t border-black/5 flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center justify-between gap-2.5 sm:gap-3">
                  <div>
                    <span className="text-[9px] min-[360px]:text-[10px] uppercase font-semibold text-[var(--theme-text-muted)]">
                      Styled Accessory:
                    </span>
                    <p className="text-[11px] min-[360px]:text-xs font-semibold text-[var(--theme-text)] truncate">
                      {matchedProduct.name} • ₹{matchedProduct.price}
                    </p>
                  </div>

                  <button
                    onClick={handleGetTheLook}
                    className="w-full min-[420px]:w-auto px-5 min-[360px]:px-6 py-2.5 sm:py-3 rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:opacity-90 active:scale-95 shadow-md flex items-center justify-center gap-2 shrink-0 whitespace-nowrap"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Get The Look</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Model Visualizer Column (Right on desktop, order-1 on mobile so user sees transformation instantly) */}
          <div className="lg:col-span-6 flex items-center justify-center order-1 lg:order-2 w-full">
            <div className="relative w-full max-w-[460px] h-[290px] min-[360px]:h-[340px] min-[420px]:h-[390px] sm:h-auto sm:aspect-[4/5] rounded-2xl min-[360px]:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border border-white/60 bg-gradient-to-b from-black/5 to-black/20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={comboKey}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  {/* High-res model back-of-hair editorial photo */}
                  <Image
                    src={combo.modelImage}
                    alt={combo.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 460px"
                    className="object-cover object-center"
                    priority
                  />

                  {/* Gradient vignettes */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

                  {/* Top Live Badge */}
                  <div className="absolute top-2.5 left-2.5 min-[360px]:top-3.5 min-[360px]:left-3.5 sm:top-5 sm:left-5 glass-pill px-2 min-[360px]:px-2.5 sm:px-3 py-0.5 min-[360px]:py-1 rounded-full text-white text-[8.5px] min-[360px]:text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest uppercase flex items-center gap-1.5 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span>Virtual Styling Studio</span>
                  </div>

                  {/* Bottom Model Info Label */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 min-[360px]:bottom-3.5 min-[360px]:left-3.5 min-[360px]:right-3.5 sm:bottom-6 sm:left-6 sm:right-6 text-white">
                    <span className="caps-subtitle text-[7.5px] min-[360px]:text-[8px] sm:text-[9px] tracking-wider sm:tracking-widest text-white/70">
                      The Styled Look
                    </span>
                    <h4 className="editorial-serif text-lg min-[360px]:text-xl sm:text-2xl md:text-3xl font-light text-white mb-0.5 sm:mb-1">
                      {combo.title}
                    </h4>
                    <p className="text-[10.5px] min-[360px]:text-[11px] sm:text-xs text-white/80 line-clamp-1">
                      Featuring {matchedProduct.name}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
