'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { PRODUCTS as allProducts } from '@/data/products';
import ProductCard from '@/components/showcase/ProductCard';
import type { Product } from '@/types';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback((q: string) => {
    if (!q.trim() || q.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const lower = q.toLowerCase();
    const found = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.material.toLowerCase().includes(lower) ||
        p.subtitle.toLowerCase().includes(lower) ||
        p.megaCategory.toLowerCase().includes(lower) ||
        p.subCategory.toLowerCase().includes(lower)
    );
    setResults(found);
    setIsSearching(false);
  }, []);

  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  return (
    <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Search Header */}
        <div className="mb-10">
          <p className="caps-subtitle text-[#C5A059] mb-3">Search</p>
          <div className="relative max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              placeholder="Search for claw clips, scrunchies, combs..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-base placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059]/40 transition-colors"
            />
          </div>
          {query.trim().length >= 2 && (
            <p className="text-stone-500 text-sm mt-3">
              {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>

        {/* Results */}
        {isSearching ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin mx-auto" />
          </div>
        ) : query.trim().length < 2 ? (
          <div className="text-center py-20">
            <Sparkles className="w-12 h-12 text-stone-700 mx-auto mb-4" />
            <h3 className="editorial-serif text-2xl text-white mb-2">Discover Your Perfect Piece</h3>
            <p className="text-stone-500 text-sm mb-6">Type at least 2 characters to search.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-[#C5A059] hover:underline"
            >
              Browse All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-stone-700 mx-auto mb-4" />
            <h3 className="editorial-serif text-2xl text-white mb-2">No Results Found</h3>
            <p className="text-stone-500 text-sm mb-6">
              Try a different search term or browse our collection.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C5A059] text-black text-sm font-semibold"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {results.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
              >
                <ProductCard product={product} index={i} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
