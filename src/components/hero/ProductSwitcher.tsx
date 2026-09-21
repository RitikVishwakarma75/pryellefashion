'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { CATEGORIES } from '@/data/categories';
import { MegaCategory } from '@/types';

export default function ProductSwitcher() {
  const { activeCategory, setActiveCategory, currentTheme } = useTheme();

  return (
    <div className="w-full max-w-5xl mx-auto px-1.5 min-[360px]:px-2 sm:px-4 mt-4 min-[400px]:mt-5 sm:mt-8 md:mt-10">
      <div className="relative glass-panel rounded-full p-1 min-[400px]:p-1.5 sm:p-2 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.08)] border border-white/60">
        {/* Right edge fade affordance for mobile touch scroll */}
        <div className="pointer-events-none absolute right-2 top-1.5 bottom-1.5 w-7 bg-gradient-to-l from-white/90 to-transparent rounded-r-full sm:hidden z-20" />

        {/* Horizontal scroll on small screens */}
        <div className="flex items-center overflow-x-auto no-scrollbar gap-0.5 min-[400px]:gap-1 sm:gap-1.5 px-0.5 min-[400px]:px-1 py-0.5 scroll-smooth overscroll-contain touch-pan-x pr-7 min-[400px]:pr-8 sm:pr-1">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as MegaCategory)}
                className={`relative flex-shrink-0 px-2 min-[400px]:px-2.5 sm:px-4 py-1.5 min-[400px]:py-2 sm:py-2.5 rounded-full text-[10px] min-[400px]:text-xs sm:text-sm font-medium transition-all duration-300 select-none active:scale-95 ${
                  isActive
                    ? 'text-[var(--theme-text)] font-semibold shadow-sm'
                    : 'text-[var(--theme-text)]/60 hover:text-[var(--theme-text)]'
                }`}
              >
                {/* Active Pill Slider Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                    className="absolute inset-0 rounded-full bg-white shadow-md border border-black/5"
                    style={{
                      boxShadow: '0 4px 15px -3px rgba(0,0,0,0.08)',
                    }}
                  />
                )}

                <span className="relative z-10 whitespace-nowrap tracking-wider text-[10px] sm:text-xs uppercase flex items-center gap-1 sm:gap-1.5">
                  <span className="text-sm sm:text-base">{category.emoji}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                  {/* Short name on mobile */}
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic mood caption below switcher */}
      <div className="text-center mt-2 min-[400px]:mt-3 sm:mt-4">
        <motion.p
          key={activeCategory}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[11px] tracking-widest uppercase font-medium text-[var(--theme-text-muted)]"
        >
          Active Aura: <span className="text-[var(--theme-accent)] font-semibold">{currentTheme.mood}</span>
        </motion.p>
      </div>
    </div>
  );
}
