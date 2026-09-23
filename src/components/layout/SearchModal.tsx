'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { Search, X } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectProduct }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const results = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.material.toLowerCase().includes(query.toLowerCase()) ||
          p.megaCategory.toLowerCase().includes(query.toLowerCase()) ||
          p.subCategory.toLowerCase().includes(query.toLowerCase())
      )
    : PRODUCTS.slice(0, 4);

  const quickTags = ['Claw Clips', 'Silk Scrunchies', 'Bridal', 'Pearl Pins', 'Brushes', 'Hair Sticks', 'Headbands'];

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
            <Search className="w-5 h-5 text-stone-400 mr-3" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search claw clips, pearls, silk scrunchies, combs..."
              className="w-full text-base sm:text-lg focus:outline-none placeholder:text-stone-400 font-normal"
            />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex items-center gap-2 flex-wrap pt-4 pb-6">
            <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
              Popular:
            </span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div>
            <span className="caps-subtitle text-[10px] tracking-widest text-stone-400 block mb-3">
              {query.trim() ? `Search Results (${results.length})` : 'Recommended Curations'}
            </span>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {results.length === 0 ? (
                <p className="text-sm text-stone-500 py-8 text-center">
                  No accessories found matching &ldquo;{query}&rdquo;.
                </p>
              ) : (
                results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(item);
                      onClose();
                    }}
                    className="p-3 rounded-2xl hover:bg-stone-50 flex items-center justify-between gap-4 cursor-pointer transition-colors border border-transparent hover:border-black/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                        <Image
                          src={item.colors[0].image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="editorial-serif text-base font-medium text-stone-900">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-stone-500">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="editorial-serif text-base font-semibold text-stone-900">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item, item.colors[0], 1, e);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-black text-white text-[11px] font-medium uppercase tracking-wider hover:opacity-90"
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
