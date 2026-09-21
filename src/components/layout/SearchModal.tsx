'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { shopifyProductToProduct } from '@/lib/shopifyAdapter';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, Sparkles, Loader2, ExternalLink } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectProduct }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'RELEVANCE' | 'PRICE' | 'BEST_SELLING'>('RELEVANCE');
  const [shopifyResults, setShopifyResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { addToCart } = useCart();

  // Debounced live search to Shopify API
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setShopifyResults([]);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          query: query.trim(),
          limit: '12',
          sortKey: sortBy,
        });
        const res = await fetch(`/api/shopify-products?${params.toString()}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        if (isMounted && data.status === 'success' && Array.isArray(data.products)) {
          setShopifyResults(data.products.map(shopifyProductToProduct));
        }
      } catch {
        // Graceful fallback to local catalog
        if (isMounted) setShopifyResults([]);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query, sortBy]);

  // Merge results: Shopify first, then complementary local matches
  const mergedResults = useMemo(() => {
    if (!query.trim()) return PRODUCTS.slice(0, 5);

    const localMatches = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        p.material.toLowerCase().includes(query.toLowerCase()) ||
        p.megaCategory.toLowerCase().includes(query.toLowerCase()) ||
        p.subCategory.toLowerCase().includes(query.toLowerCase())
    );

    if (shopifyResults.length === 0) return localMatches;

    const shopifyNames = new Set(shopifyResults.map((p) => p.name.toLowerCase()));
    const remainingLocal = localMatches.filter((p) => !shopifyNames.has(p.name.toLowerCase()));

    return [...shopifyResults, ...remainingLocal];
  }, [query, shopifyResults]);

  if (!isOpen) return null;

  const quickTags = [
    'Claw Clips',
    'Silk Scrunchies',
    'Bridal',
    'Pearl Pins',
    'Combs',
    'Hair Sticks',
    'Headbands',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 border border-white/60 p-6 sm:p-8"
        >
          {/* Search Input Bar */}
          <div className="relative flex items-center border-b border-black/10 pb-4">
            {isSearching ? (
              <Loader2 className="w-5 h-5 text-stone-400 mr-3 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-stone-400 mr-3" />
            )}
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search claw clips, pearls, silk scrunchies, combs..."
              className="w-full text-base sm:text-lg focus:outline-none placeholder:text-stone-400 font-normal"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs text-stone-400 hover:text-stone-700 px-2 py-1 mr-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center ml-2 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Filter Tags & Sorting */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-4 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                Popular:
              </span>
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Live Sorting Selector */}
            {query.trim() && (
              <div className="flex items-center gap-1 text-[11px] text-stone-500">
                <span>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-medium text-stone-800 focus:outline-none cursor-pointer"
                >
                  <option value="RELEVANCE">Relevance</option>
                  <option value="PRICE">Price</option>
                  <option value="BEST_SELLING">Bestselling</option>
                </select>
              </div>
            )}
          </div>

          {/* Results List */}
          <div className="pt-3">
            <div className="flex items-center justify-between mb-3">
              <span className="caps-subtitle text-[10px] tracking-widest text-stone-400">
                {query.trim()
                  ? `Found ${mergedResults.length} Creations`
                  : 'Recommended Curations'}
              </span>
              {shopifyResults.length > 0 && (
                <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Shopify Live Results
                </span>
              )}
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {mergedResults.length === 0 ? (
                <div className="text-center py-10 text-stone-500">
                  <p className="text-sm">No hair accessories found matching &ldquo;{query}&rdquo;.</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Try searching for &ldquo;Claw&rdquo;, &ldquo;Silk&rdquo;, or &ldquo;Pearl&rdquo;.
                  </p>
                </div>
              ) : (
                mergedResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(item);
                      onClose();
                    }}
                    className="p-3 rounded-2xl hover:bg-stone-50 flex items-center justify-between gap-4 cursor-pointer transition-colors border border-transparent hover:border-black/5 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                        <Image
                          src={item.colors[0]?.image || '/images/products/claw-clip.jpg'}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="editorial-serif text-base font-medium text-stone-900 group-hover:text-[var(--theme-accent)] transition-colors">
                            {item.name}
                          </h4>
                          {item.id.startsWith('gid://') && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-mono">
                              Live
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 line-clamp-1">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="editorial-serif text-base font-semibold text-stone-900">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item, item.colors[0], 1, e);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-black text-white text-[11px] font-medium uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
