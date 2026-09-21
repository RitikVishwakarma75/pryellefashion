'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import FloatingHero3D from './FloatingHero3D';
import ProductSwitcher from './ProductSwitcher';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';

interface HeroExperienceProps {
  onExploreLooks?: () => void;
  onShopCollection?: () => void;
}

export default function HeroExperience({
  onExploreLooks,
  onShopCollection,
}: HeroExperienceProps) {
  const { currentTheme } = useTheme();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[100svh] sm:min-h-screen flex flex-col justify-between pt-20 min-[400px]:pt-22 sm:pt-28 md:pt-32 pb-6 min-[400px]:pb-8 sm:pb-12 md:pb-16 px-3 min-[360px]:px-4 sm:px-6 lg:px-8 xl:px-10 max-w-7xl mx-auto overflow-hidden w-full">
      {/* Top Tagline & Editorial Branding */}
      <div className="text-center pt-1 min-[400px]:pt-2 sm:pt-4 z-10 w-full max-w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTheme.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill mb-3"
          >
            <Sparkles className="w-3 h-3 text-[var(--theme-accent)]" />
            <span className="caps-subtitle text-[10px] tracking-[0.25em] text-[var(--theme-text)]/80">
              {currentTheme.tagline}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Large Editorial Headline */}
        <div className="w-full min-h-[3rem] min-[360px]:min-h-[3.5rem] min-[400px]:min-h-[4rem] sm:min-h-[4.5rem] md:min-h-[5.5rem] lg:min-h-[6.5rem] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentTheme.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="editorial-serif text-[1.25rem] min-[360px]:text-[1.4rem] min-[400px]:text-[1.6rem] min-[480px]:text-[1.85rem] sm:text-[2.25rem] md:text-[3rem] lg:text-[3.75rem] xl:text-[4.25rem] font-normal tracking-tight text-[var(--theme-text)] w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto leading-[1.15] text-center break-words"
            >
              {currentTheme.headline}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Supporting Copy */}
        <div className="w-full min-h-[2.5rem] min-[400px]:min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center mt-1.5 min-[400px]:mt-2 sm:mt-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTheme.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[10.5px] min-[360px]:text-[11px] min-[400px]:text-xs sm:text-sm md:text-base text-[var(--theme-text-muted)] w-full sm:max-w-md md:max-w-lg mx-auto font-normal leading-relaxed text-center"
            >
              {currentTheme.supportingText}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col min-[480px]:flex-row items-center justify-center gap-2.5 min-[400px]:gap-3 sm:gap-4 mt-4 min-[400px]:mt-5 sm:mt-6 z-20 w-full mx-auto">
          <button
            onClick={() => {
              if (onShopCollection) onShopCollection();
              else scrollToSection('product-showcase');
            }}
            className="w-full min-[480px]:w-auto px-5 min-[400px]:px-6 sm:px-8 py-2.5 min-[400px]:py-3 sm:py-3.5 rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] text-[11px] min-[400px]:text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:opacity-90 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Shop The Collection</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => {
              if (onExploreLooks) onExploreLooks();
              else scrollToSection('find-your-look');
            }}
            className="w-full min-[480px]:w-auto px-5 min-[400px]:px-6 sm:px-8 py-2.5 min-[400px]:py-3 sm:py-3.5 rounded-full glass-panel text-[var(--theme-text)] text-[11px] min-[400px]:text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:bg-white/80 hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Compass className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
            <span>Explore The Looks</span>
          </button>
        </div>
      </div>

      {/* Floating 3D Product Hero Component */}
      <div className="my-auto py-2 min-[400px]:py-3 sm:py-5 md:py-6 w-full max-w-full overflow-hidden">
        <FloatingHero3D />
      </div>

      {/* Interactive Horizontal Category Switcher Bar */}
      <div className="w-full z-20">
        <ProductSwitcher />
      </div>
    </section>
  );
}
