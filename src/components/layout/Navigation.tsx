'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import SearchModal from './SearchModal';
import WishlistDrawer from './WishlistDrawer';
import { Search, Heart, ShoppingBag, Volume2, VolumeX, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const { currentTheme, isSoundEnabled, toggleSound } = useTheme();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist, setIsWishlistOpen } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leftNavLinks = [
    { label: 'Shop', href: '#product-showcase' },
    { label: 'Collections', href: '#collections' },
    { label: '3D Studio', href: '#interactive-3d' },
  ];

  const rightNavLinks = [
    { label: 'Styling', href: '#virtual-styling' },
    { label: 'Moods', href: '#find-your-look' },
    { label: 'Materials', href: '#materials' },
  ];

  const mobileNavLinks = [
    { label: 'Shop', href: '#product-showcase' },
    { label: 'Collections', href: '#collections' },
    { label: '3D Studio', href: '#interactive-3d' },
    { label: 'Virtual Styling', href: '#virtual-styling' },
    { label: 'Find Your Mood', href: '#find-your-look' },
    { label: 'Materials', href: '#materials' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'py-2.5 sm:py-3.5 bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)]'
            : 'py-4 sm:py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-2 min-[360px]:px-3 min-[400px]:px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-1 min-[360px]:gap-2 sm:gap-4">
          {/* Left: Mobile Menu Toggle & Left Desktop Links */}
          <div className="flex-1 flex items-center justify-start gap-2 min-[360px]:gap-3 lg:gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 min-[360px]:p-2 rounded-full glass-pill text-[var(--theme-text)] focus:outline-none active:scale-95 transition-transform"
              aria-label="Open navigation menu"
            >
              <Menu className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4" />
            </button>

            <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
              {leftNavLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="caps-subtitle text-[10px] xl:text-[11px] tracking-[0.18em] xl:tracking-[0.2em] text-[var(--theme-text)]/75 hover:text-[var(--theme-text)] transition-colors relative py-1 group whitespace-nowrap"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--theme-accent)] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>
          </div>

          {/* Center: Maison Brand Wordmark */}
          <div className="shrink-0 text-center px-0.5 min-[360px]:px-1 sm:px-2">
            <Link href="/" className="inline-block group">
              <span className="editorial-serif text-lg min-[360px]:text-xl min-[400px]:text-2xl sm:text-3xl lg:text-4xl font-normal tracking-[0.14em] min-[360px]:tracking-[0.16em] uppercase text-[var(--theme-text)] transition-transform duration-300 group-hover:scale-102">
                PRAYELE
              </span>
              <span className="block caps-subtitle text-[7px] min-[360px]:text-[8px] sm:text-[9px] tracking-[0.28em] min-[360px]:tracking-[0.32em] sm:tracking-[0.38em] text-[var(--theme-text-muted)] group-hover:text-[var(--theme-accent)] transition-colors">
                HAUTE HAIRWEAR
              </span>
            </Link>
          </div>

          {/* Right: Right Desktop Links & Action Buttons */}
          <div className="flex-1 flex items-center justify-end gap-1.5 sm:gap-4">
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 mr-1 xl:mr-2">
              {rightNavLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="caps-subtitle text-[10px] xl:text-[11px] tracking-[0.18em] xl:tracking-[0.2em] text-[var(--theme-text)]/75 hover:text-[var(--theme-text)] transition-colors relative py-1 group whitespace-nowrap"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--theme-accent)] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-1 min-[360px]:gap-1.5 sm:gap-2.5 shrink-0">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-7 h-7 min-[360px]:w-8 min-[360px]:h-8 sm:w-9 sm:h-9 rounded-full glass-pill flex items-center justify-center text-[var(--theme-text)] hover:scale-105 active:scale-95 transition-all"
                title="Search catalog"
                aria-label="Search"
              >
                <Search className="w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Ambient Sound Mode */}
              <button
                onClick={toggleSound}
                className={`w-9 h-9 rounded-full glass-pill hidden sm:flex items-center justify-center transition-all ${
                  isSoundEnabled
                    ? 'text-[var(--theme-accent)] bg-white/90 shadow-sm'
                    : 'text-[var(--theme-text)] hover:scale-105'
                }`}
                title={isSoundEnabled ? 'Mute Boutique Atmosphere' : 'Enable Boutique Soundscape'}
                aria-label="Toggle sound"
              >
                {isSoundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4 opacity-60" />
                )}
              </button>

              {/* Wishlist Drawer Trigger */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full glass-pill flex items-center justify-center text-[var(--theme-text)] hover:scale-105 active:scale-95 transition-all"
                title="Saved Favorites"
                aria-label="Favorites"
              >
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Bag Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative px-2.5 min-[360px]:px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] flex items-center gap-1.5 sm:gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md hover:shadow-lg"
                title="Shopping Bag"
                aria-label="Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="caps-subtitle text-[10px] tracking-wider hidden sm:inline">
                  Bag
                </span>
                <span className="w-4 h-4 rounded-full bg-[var(--theme-accent)] text-black text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl z-10 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-black/5">
                  <div>
                    <span className="editorial-serif text-2xl font-semibold tracking-wider text-black">
                      PRAYELE
                    </span>
                    <span className="block text-[9px] uppercase tracking-widest text-stone-400">
                      Haute Hairwear
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-8 flex flex-col gap-5">
                  {mobileNavLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="editorial-serif text-2xl font-normal text-stone-800 hover:text-[var(--theme-accent)] transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-black/5">
                <p className="text-xs text-stone-500 mb-3">
                  Complimentary Express Shipping across India over ₹999.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="flex-1 py-2.5 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold uppercase tracking-wider text-center"
                  >
                    Search
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="flex-1 py-2.5 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider text-center"
                  >
                    Bag ({totalItems})
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Global Wishlist Drawer */}
      <WishlistDrawer />
    </>
  );
}
