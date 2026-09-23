'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, X, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { PRODUCTS as allProducts } from '@/data/products';
import ProductCard from '@/components/showcase/ProductCard';
import type { Product, MegaCategory, SubCategory } from '@/types';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest Arrivals' },
] as const;

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹500', min: 0, max: 499 },
  { label: '₹500 – ₹999', min: 500, max: 999 },
  { label: '₹1,000 – ₹1,999', min: 1000, max: 1999 },
  { label: '₹2,000+', min: 2000, max: Infinity },
];

export default function ShopClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<MegaCategory | 'all'>('all');
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const selectedCategory = CATEGORIES.find((c) => c.id === activeCategory);

  const filtered = useMemo(() => {
    let result: Product[] = [...allProducts];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q)
      );
    }

    // Category
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.megaCategory === activeCategory);
    }

    // Sub-category
    if (activeSubCategory !== 'all') {
      result = result.filter((p) => p.subCategory === activeSubCategory);
    }

    // Price
    const range = PRICE_RANGES[priceRange];
    if (range && range.max !== Infinity) {
      result = result.filter((p) => p.price >= range.min && p.price <= range.max);
    } else if (range && range.min > 0) {
      result = result.filter((p) => p.price >= range.min);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.reverse();
        break;
      case 'featured':
      default:
        result.sort((a, b) => {
          if (a.badge === 'Bestseller') return -1;
          if (b.badge === 'Bestseller') return 1;
          return b.rating - a.rating;
        });
        break;
    }

    return result;
  }, [searchQuery, activeCategory, activeSubCategory, sortBy, priceRange]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setActiveSubCategory('all');
    setSortBy('featured');
    setPriceRange(0);
    setVisibleCount(12);
  };

  const activeFilterCount = [
    activeCategory !== 'all',
    activeSubCategory !== 'all',
    priceRange !== 0,
    searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  return (
    <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="caps-subtitle text-[#C5A059] mb-3">The Atelier</p>
          <h1 className="editorial-serif text-4xl md:text-5xl font-light text-white mb-3">
            Shop All Accessories
          </h1>
          <p className="text-stone-400 text-sm max-w-xl">
            {filtered.length} curated pieces across {CATEGORIES.length} collections.
            Every piece sculpted to transform your hair into a runway statement.
          </p>
        </motion.div>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(12);
              }}
              placeholder="Search claw clips, scrunchies, combs..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-stone-500 focus:outline-none focus:border-[#C5A059]/40 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-stone-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen((p) => !p)}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-medium transition-all ${
              isFilterOpen || activeFilterCount > 0
                ? 'bg-[#C5A059]/15 border-[#C5A059]/30 text-[#C5A059]'
                : 'bg-white/[0.06] border-white/10 text-stone-300 hover:border-white/20'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-[#C5A059] text-black text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen((p) => !p)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/[0.06] border border-white/10 text-stone-300 text-sm font-medium hover:border-white/20 transition-colors min-w-[180px] justify-between"
            >
              {SORT_OPTIONS.find((s) => s.value === sortBy)?.label || 'Sort'}
              <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full mt-2 right-0 w-full rounded-2xl bg-[#1A1918] border border-white/10 shadow-2xl overflow-hidden z-50"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                        sortBy === opt.value
                          ? 'bg-[#C5A059]/15 text-[#C5A059]'
                          : 'text-stone-300 hover:bg-white/5'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
                {/* Categories */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mb-3">
                    Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setActiveCategory('all');
                        setActiveSubCategory('all');
                        setVisibleCount(12);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                        activeCategory === 'all'
                          ? 'bg-[#C5A059] text-black'
                          : 'bg-white/[0.06] text-stone-400 hover:bg-white/10'
                      }`}
                    >
                      All
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setActiveSubCategory('all');
                          setVisibleCount(12);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                          activeCategory === cat.id
                            ? 'bg-[#C5A059] text-black'
                            : 'bg-white/[0.06] text-stone-400 hover:bg-white/10'
                        }`}
                      >
                        {cat.emoji} {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategories */}
                {selectedCategory && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mb-3">
                      Subcategory
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setActiveSubCategory('all');
                          setVisibleCount(12);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                          activeSubCategory === 'all'
                            ? 'bg-white/20 text-white'
                            : 'bg-white/[0.04] text-stone-500 hover:bg-white/10'
                        }`}
                      >
                        All
                      </button>
                      {selectedCategory.subFilters.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveSubCategory(sub.id);
                            setVisibleCount(12);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                            activeSubCategory === sub.id
                              ? 'bg-white/20 text-white'
                              : 'bg-white/[0.04] text-stone-500 hover:bg-white/10'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mb-3">
                    Price Range
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((range, i) => (
                      <button
                        key={range.label}
                        onClick={() => {
                          setPriceRange(i);
                          setVisibleCount(12);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                          priceRange === i
                            ? 'bg-[#C5A059] text-black'
                            : 'bg-white/[0.06] text-stone-400 hover:bg-white/10'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear All */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-[#C5A059] hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {visible.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles className="w-12 h-12 text-stone-600 mx-auto mb-4" />
            <h3 className="editorial-serif text-2xl text-white mb-2">No pieces found</h3>
            <p className="text-stone-500 text-sm mb-6">
              Try adjusting your filters or search query.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 rounded-full bg-[#C5A059] text-black text-sm font-semibold hover:bg-[#D4B068] transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {visible.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.4 }}
                >
                  <ProductCard product={product} index={i} />
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount((c) => c + 12)}
                  className="px-8 py-3.5 rounded-full border border-[#C5A059]/30 text-[#C5A059] text-sm font-semibold hover:bg-[#C5A059]/10 transition-colors"
                >
                  Load More ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
