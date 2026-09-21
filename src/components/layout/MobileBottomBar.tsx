'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Compass, Box, Sparkles, LayoutGrid } from 'lucide-react';

export default function MobileBottomBar() {
  const { totalItems, setIsCartOpen } = useCart();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-3 inset-x-2 min-[360px]:inset-x-3 z-40 md:hidden">
      <nav
        aria-label="Mobile quick actions"
        className="glass-panel-dark text-white rounded-full py-1.5 min-[360px]:py-2 px-1 min-[360px]:px-2.5 sm:px-3 flex items-center justify-around shadow-[0_10px_35px_-5px_rgba(0,0,0,0.4)] border border-white/15 backdrop-blur-2xl"
      >
        {/* Shop */}
        <button
          onClick={() => scrollToSection('product-showcase')}
          className="flex flex-col items-center gap-0.5 py-1 px-1.5 min-[360px]:px-2.5 rounded-full text-white/75 hover:text-white active:scale-90 transition-all focus:outline-none"
        >
          <LayoutGrid className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4" />
          <span className="text-[8px] min-[360px]:text-[9px] uppercase tracking-wider font-medium">Shop</span>
        </button>

        {/* 3D Studio */}
        <button
          onClick={() => scrollToSection('interactive-3d')}
          className="flex flex-col items-center gap-0.5 py-1 px-1.5 min-[360px]:px-2.5 rounded-full text-white/75 hover:text-white active:scale-90 transition-all focus:outline-none"
        >
          <Box className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 text-[var(--theme-accent)]" />
          <span className="text-[8px] min-[360px]:text-[9px] uppercase tracking-wider font-medium">3D Studio</span>
        </button>

        {/* Styling */}
        <button
          onClick={() => scrollToSection('virtual-styling')}
          className="flex flex-col items-center gap-0.5 py-1 px-1.5 min-[360px]:px-2.5 rounded-full text-white/75 hover:text-white active:scale-90 transition-all focus:outline-none"
        >
          <Sparkles className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4" />
          <span className="text-[8px] min-[360px]:text-[9px] uppercase tracking-wider font-medium">Styling</span>
        </button>

        {/* Moods */}
        <button
          onClick={() => scrollToSection('find-your-look')}
          className="flex flex-col items-center gap-0.5 py-1 px-1.5 min-[360px]:px-2.5 rounded-full text-white/75 hover:text-white active:scale-90 transition-all focus:outline-none"
        >
          <Compass className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4" />
          <span className="text-[8px] min-[360px]:text-[9px] uppercase tracking-wider font-medium">Moods</span>
        </button>

        {/* Bag */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 py-1 px-1.5 min-[360px]:px-2.5 rounded-full text-white/90 hover:text-white active:scale-90 transition-all focus:outline-none"
        >
          <div className="relative">
            <ShoppingBag className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 text-[var(--theme-accent)]" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-[var(--theme-accent)] text-black text-[8px] font-bold flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[8px] min-[360px]:text-[9px] uppercase tracking-wider font-medium">Bag</span>
        </button>
      </nav>
    </div>
  );
}
