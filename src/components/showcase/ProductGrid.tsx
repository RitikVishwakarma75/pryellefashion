'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { PRODUCTS } from '@/data/products';
import { CATEGORIES } from '@/data/categories';
import { Product, MegaCategory, SubCategory } from '@/types';
import { shopifyProductToProduct } from '@/lib/shopifyAdapter';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';
import { Sparkles, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductGrid() {
  const [activeMega, setActiveMega] = useState<string>('all');
  const [activeSub, setActiveSub] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [shopifyProducts, setShopifyProducts] = useState<Product[]>([]);
  const [isShopifyLive, setIsShopifyLive] = useState(false);

  // Fetch real Shopify products
  useEffect(() => {
    let isMounted = true;
    async function loadShopify() {
      try {
        const res = await fetch('/api/shopify-products?limit=50');
        if (!res.ok) return;
        const data = await res.json();
        if (data?.status === 'success' && Array.isArray(data.products) && data.products.length > 0) {
          const mapped = data.products.map(shopifyProductToProduct);
          if (isMounted) {
            setShopifyProducts(mapped);
            setIsShopifyLive(true);
          }
        }
      } catch {
        // Silently preserve catalog with fallback products
      }
    }
    loadShopify();
    return () => {
      isMounted = false;
    };
  }, []);

  // Prioritize live Shopify products; merge remaining curated catalog
  const allProducts = useMemo(() => {
    if (shopifyProducts.length === 0) return PRODUCTS;
    const shopifyNames = new Set(shopifyProducts.map((p) => p.name.toLowerCase()));
    const remaining = PRODUCTS.filter((p) => !shopifyNames.has(p.name.toLowerCase()));
    return [...shopifyProducts, ...remaining];
  }, [shopifyProducts]);

  // Get active mega-category config for sub-filters
  const activeMegaConfig = CATEGORIES.find((c) => c.id === activeMega);

  // Build mega-category tabs with product counts
  const megaTabs = useMemo(() => {
    const tabs = [
      { id: 'all', emoji: '✨', label: 'All Creations', count: allProducts.length },
    ];
    CATEGORIES.forEach((cat) => {
      const count = allProducts.filter((p) => p.megaCategory === cat.id).length;
      tabs.push({ id: cat.id, emoji: cat.emoji, label: cat.name, count });
    });
    return tabs;
  }, [allProducts]);

  // Filter items
  let filtered = allProducts.filter((p) => {
    if (activeMega !== 'all' && p.megaCategory !== activeMega) return false;
    if (activeSub !== 'all' && p.subCategory !== activeSub) return false;
    return true;
  });

  // Sort items
  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  // Limit displayed products unless "show all" is active
  const INITIAL_LIMIT = 12;
  const visibleProducts = showAllProducts ? filtered : filtered.slice(0, INITIAL_LIMIT);
  const hasMore = filtered.length > INITIAL_LIMIT && !showAllProducts;

  // Reset sub-filter when mega changes
  const handleMegaChange = (id: string) => {
    setActiveMega(id);
    setActiveSub('all');
    setShowAllProducts(false);
  };

  return (
    <section
      id="product-showcase"
      className="py-16 sm:py-24 lg:py-28 px-3.5 min-[360px]:px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full max-w-full overflow-hidden"
    >
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 lg:mb-16 gap-4 sm:gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 rounded-full glass-pill mb-2.5 sm:mb-3">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--theme-accent)]" />
            <span className="caps-subtitle text-[9px] min-[360px]:text-[10px] tracking-[0.16em] sm:tracking-[0.22em] text-[var(--theme-text)]/80">
              Curated Hairwear Catalog
            </span>
            {isShopifyLive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[8px] font-semibold tracking-wider uppercase border border-emerald-200/60 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Shopify Live
              </span>
            )}
          </div>
          <h2 className="editorial-serif text-2xl min-[360px]:text-3xl min-[480px]:text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--theme-text)]">
            The Product Showcase
          </h2>
          <p className="text-xs min-[360px]:text-sm sm:text-base text-[var(--theme-text-muted)] mt-1.5 sm:mt-2 max-w-lg leading-relaxed">
            {filtered.length} premium accessories across {CATEGORIES.length} collections — designed to elevate everyday routines.
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center justify-between min-[420px]:justify-start gap-2 self-stretch min-[420px]:self-start md:self-auto pt-1 md:pt-0">
          <div className="flex items-center gap-1.5 text-[var(--theme-text-muted)]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" />
            <span className="text-[11px] font-medium min-[420px]:hidden">Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="glass-pill px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-[11px] min-[360px]:text-xs font-medium text-[var(--theme-text)] focus:outline-none cursor-pointer bg-white/70"
          >
            <option value="featured">Featured Curations</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* ═══ Mega-Category Tabs (Edge-bleeding horizontal scroll on mobile) ═══ */}
      <div className="-mx-3.5 px-3.5 min-[360px]:-mx-4 min-[360px]:px-4 sm:mx-0 sm:px-0 flex items-center overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 pb-3 sm:pb-4 mb-2 sm:mb-4 touch-pan-x overscroll-x-contain">
        {megaTabs.map((tab) => {
          const isActive = activeMega === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleMegaChange(tab.id)}
              className={`group relative shrink-0 flex items-center gap-1 min-[360px]:gap-1.5 px-3 min-[360px]:px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] min-[360px]:text-[11px] sm:text-xs font-medium tracking-wider uppercase transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[var(--theme-text)] text-[var(--theme-bg)] shadow-md'
                  : 'glass-pill text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:shadow-sm'
              }`}
            >
              <span className="text-xs min-[360px]:text-sm">{tab.emoji}</span>
              <span>{tab.label}</span>
              <span
                className={`text-[8.5px] min-[360px]:text-[9px] px-1.5 py-0.5 rounded-full ml-0.5 font-semibold ${
                  isActive
                    ? 'bg-[var(--theme-bg)]/20 text-[var(--theme-bg)]'
                    : 'bg-black/5 text-[var(--theme-text-muted)]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ═══ Sub-Category Chip Bar (when a mega is selected) ═══ */}
      <AnimatePresence mode="wait">
        {activeMega !== 'all' && activeMegaConfig && (
          <motion.div
            key={activeMega}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="-mx-3.5 px-3.5 min-[360px]:-mx-4 min-[360px]:px-4 sm:mx-0 sm:px-0 flex items-center overflow-x-auto no-scrollbar gap-1.5 pb-4 sm:pb-6 sm:pb-8 border-b border-black/5 mb-6 sm:mb-8 sm:mb-12 touch-pan-x overscroll-x-contain">
              <button
                onClick={() => setActiveSub('all')}
                className={`shrink-0 px-3 min-[360px]:px-3.5 py-1.5 rounded-full text-[9px] min-[360px]:text-[10px] font-medium tracking-wider uppercase transition-all whitespace-nowrap ${
                  activeSub === 'all'
                    ? 'bg-[var(--theme-accent)] text-white shadow-sm'
                    : 'bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/20'
                }`}
              >
                All {activeMegaConfig.name}
              </button>
              {activeMegaConfig.subFilters.map((sub) => {
                const count = allProducts.filter(
                  (p) => p.megaCategory === activeMega && p.subCategory === sub.id
                ).length;
                if (count === 0) return null;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSub(sub.id)}
                    className={`shrink-0 px-3 min-[360px]:px-3.5 py-1.5 rounded-full text-[9px] min-[360px]:text-[10px] font-medium tracking-wider uppercase transition-all whitespace-nowrap flex items-center gap-1 ${
                      activeSub === sub.id
                        ? 'bg-[var(--theme-accent)] text-white shadow-sm'
                        : 'bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/20'
                    }`}
                  >
                    {sub.label}
                    <span className="text-[8px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ No-sub border when "all" is selected ═══ */}
      {activeMega === 'all' && (
        <div className="border-b border-black/5 mb-6 sm:mb-8 sm:mb-12" />
      )}

      {/* Editorial Product Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full max-w-full"
      >
        <AnimatePresence>
          {visibleProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-10 sm:mt-14 sm:mt-16">
          <button
            onClick={() => setShowAllProducts(true)}
            className="w-full min-[400px]:w-auto inline-flex items-center justify-center gap-2 px-6 min-[360px]:px-8 py-3 sm:py-3.5 rounded-full glass-pill text-xs min-[360px]:text-sm font-medium tracking-wider uppercase text-[var(--theme-text)] hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-black/5"
          >
            <span>View All {filtered.length} Products</span>
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-16 sm:py-20">
          <p className="editorial-serif text-xl sm:text-2xl text-[var(--theme-text-muted)]">No accessories found</p>
          <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] mt-1.5 sm:mt-2">Try a different category or sub-filter</p>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
