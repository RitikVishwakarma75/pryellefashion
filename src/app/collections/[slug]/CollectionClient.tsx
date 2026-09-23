'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { PRODUCTS as allProducts } from '@/data/products';
import { COLLECTIONS } from '@/data/collections';
import ProductCard from '@/components/showcase/ProductCard';
import type { CollectionType } from '@/types';

const COLLECTION_THEMES: Record<string, { gradient: string; accent: string; description: string }> = {
  everyday: {
    gradient: 'from-amber-900/40 via-stone-900/60 to-[#0D0C0B]',
    accent: '#E6B85C',
    description: 'Effortless luxury for your daily rituals. Pieces that elevate the mundane into the magnificent.',
  },
  'after-dark': {
    gradient: 'from-purple-950/40 via-stone-900/60 to-[#0D0C0B]',
    accent: '#B68CF0',
    description: 'Nocturnal glamour for evenings that demand attention. Let your hair catch the light.',
  },
  'soft-girl': {
    gradient: 'from-pink-900/40 via-stone-900/60 to-[#0D0C0B]',
    accent: '#F5A0B8',
    description: 'Delicate, dreamy, and irresistibly feminine. Soft textures meet gentle silhouettes.',
  },
  natural: {
    gradient: 'from-emerald-900/40 via-stone-900/60 to-[#0D0C0B]',
    accent: '#7DD3A0',
    description: 'Earth-inspired pieces crafted with sustainable materials. Beauty that honors nature.',
  },
};

export default function CollectionClient({ slug }: { slug: string }) {
  const collection = COLLECTIONS.find((c) => c.id === slug);
  const theme = COLLECTION_THEMES[slug] || COLLECTION_THEMES.everyday;

  const collectionProducts = useMemo(() => {
    return allProducts.filter((p) => p.collection === slug as CollectionType);
  }, [slug]);

  const title = collection?.name || slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <section className="min-h-screen bg-[#0D0C0B]">
      {/* Hero Banner */}
      <div className={`relative pt-28 pb-16 px-4 bg-gradient-to-b ${theme.gradient}`}>
        <div className="max-w-5xl mx-auto">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-stone-400 text-sm hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="caps-subtitle mb-4" style={{ color: theme.accent }}>
              Collection
            </p>
            <h1 className="editorial-serif text-5xl md:text-6xl font-light text-white mb-4">
              {title}
            </h1>
            <p className="text-stone-400 text-base max-w-lg leading-relaxed">
              {collection?.ethos || theme.description}
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-stone-500">
              <Sparkles className="w-4 h-4" style={{ color: theme.accent }} />
              <span>{collectionProducts.length} curated pieces</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {collectionProducts.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-12 h-12 text-stone-600 mx-auto mb-4" />
            <h3 className="editorial-serif text-2xl text-white mb-2">Coming Soon</h3>
            <p className="text-stone-500 text-sm mb-6">
              This collection is being curated. Check back soon.
            </p>
            <Link
              href="/shop"
              className="px-6 py-3 rounded-full bg-[#C5A059] text-black text-sm font-semibold hover:bg-[#D4B068] transition-colors inline-block"
            >
              Browse All Pieces
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {collectionProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.5), duration: 0.4 }}
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
