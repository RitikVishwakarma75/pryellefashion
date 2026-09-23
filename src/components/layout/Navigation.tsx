'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import SearchModal from './SearchModal';
import WishlistDrawer from './WishlistDrawer';
import {
  Search,
  Heart,
  ShoppingBag,
  Volume2,
  VolumeX,
  Menu,
  X,
  User,
  LogOut,
  Package,
  MapPin,
  Shield,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const { isSoundEnabled, toggleSound } = useTheme();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist, setIsWishlistOpen } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

              {/* Account Dropdown Trigger */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full glass-pill flex items-center justify-center text-[var(--theme-text)] hover:scale-105 active:scale-95 transition-all ${
                    isUserMenuOpen ? 'ring-2 ring-[var(--theme-accent)]' : ''
                  }`}
                  title={isAuthenticated ? `Account: ${user?.name}` : 'Maison Client Portal'}
                  aria-label="Account"
                >
                  {isAuthenticated && user ? (
                    <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#E6B85C] text-black text-[10px] font-bold flex items-center justify-center uppercase shadow-sm">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  ) : (
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#141312] border border-white/15 p-3 shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl z-50 text-white"
                    >
                      {isAuthenticated && user ? (
                        <>
                          <div className="px-3 py-2.5 mb-2 rounded-xl bg-white/[0.04] border border-white/5">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-medium">
                                Signed In
                              </span>
                              <span className="text-[9px] uppercase tracking-widest text-stone-400 px-1.5 py-0.5 rounded bg-white/10">
                                {user.role}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-[11px] text-stone-400 truncate font-mono">{user.email}</p>
                          </div>

                          <div className="space-y-1">
                            <Link
                              href="/account"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-stone-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                            >
                              <User className="w-3.5 h-3.5 text-[#C5A059]" />
                              <span>My Account</span>
                            </Link>

                            <Link
                              href="/account/orders"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-stone-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                            >
                              <Package className="w-3.5 h-3.5 text-[#C5A059]" />
                              <span>My Orders</span>
                            </Link>

                            <Link
                              href="/account/addresses"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-stone-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                            >
                              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                              <span>Saved Addresses</span>
                            </Link>

                            <Link
                              href="/account/wishlist"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-stone-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                            >
                              <span className="flex items-center gap-2.5">
                                <Heart className="w-3.5 h-3.5 text-[#C5A059]" />
                                <span>My Favorites</span>
                              </span>
                              {wishlist.length > 0 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] font-medium">
                                  {wishlist.length}
                                </span>
                              )}
                            </Link>

                            {(user.role === 'ADMIN' || user.role === 'STAFF') && (
                              <Link
                                href="/admin"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#C5A059] bg-[#C5A059]/10 hover:bg-[#C5A059]/20 transition-colors"
                              >
                                <span className="flex items-center gap-2">
                                  <Shield className="w-3.5 h-3.5" />
                                  <span>Admin Atelier</span>
                                </span>
                                <ChevronRight className="w-3 h-3 opacity-60" />
                              </Link>
                            )}

                            <div className="pt-1.5 mt-1 border-t border-white/10">
                              <button
                                onClick={async () => {
                                  setIsUserMenuOpen(false);
                                  await logout();
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                              >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Sign Out</span>
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="p-2 text-center">
                          <div className="w-8 h-8 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mx-auto mb-2 text-[#C5A059]">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <h4 className="editorial-serif text-base text-white mb-1">Maison Portal</h4>
                          <p className="text-[11px] text-stone-400 mb-4">
                            Sign in to access your curated orders, addresses, and wishlist.
                          </p>

                          <div className="space-y-2">
                            <Link
                              href="/login"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="block w-full py-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E6B85C] text-black text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all text-center"
                            >
                              Sign In
                            </Link>
                            <Link
                              href="/register"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="block w-full py-2 rounded-xl bg-white/[0.05] border border-white/15 text-stone-300 hover:text-white text-xs font-medium uppercase tracking-wider transition-all text-center"
                            >
                              Create Account
                            </Link>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
              className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl z-10 p-6 flex flex-col justify-between overflow-y-auto"
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

                <div className="py-6 flex flex-col gap-4">
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

                {/* Mobile Client Authentication Card */}
                <div className="py-4 border-t border-black/5">
                  {isAuthenticated && user ? (
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-stone-900">{user.name}</p>
                          <p className="text-[10px] text-stone-500 font-mono">{user.email}</p>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-medium px-2 py-0.5 rounded-full bg-[#C5A059]/10">
                          {user.role}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          href="/account"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-2 text-center rounded-xl bg-white border border-stone-200 text-stone-800 text-xs font-medium shadow-xs"
                        >
                          Account
                        </Link>
                        <button
                          onClick={async () => {
                            setIsMobileMenuOpen(false);
                            await logout();
                          }}
                          className="py-2 text-center rounded-xl bg-rose-50 text-rose-600 text-xs font-medium"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-2.5 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider text-center"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-2.5 rounded-full border border-black text-black text-xs font-semibold uppercase tracking-wider text-center"
                      >
                        Register
                      </Link>
                    </div>
                  )}
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

