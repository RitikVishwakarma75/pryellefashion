'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function FlyToCartEffect() {
  const { flyItem } = useCart();

  if (!flyItem) return null;

  // Target cart button in the top right navbar
  const targetX = typeof window !== 'undefined' ? window.innerWidth - 60 : 1000;
  const targetY = 32;

  return (
    <AnimatePresence>
      <motion.div
        key={flyItem.id}
        initial={{
          position: 'fixed',
          left: flyItem.startX - 24,
          top: flyItem.startY - 24,
          width: 48,
          height: 48,
          opacity: 1,
          scale: 1,
          zIndex: 9999,
          borderRadius: 9999,
        }}
        animate={{
          left: targetX,
          top: targetY,
          width: 20,
          height: 20,
          opacity: 0.2,
          scale: 0.3,
        }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.2, 0.8, 0.2, 1],
        }}
        className="pointer-events-none rounded-full overflow-hidden shadow-2xl border-2 border-white ring-2 ring-[var(--theme-accent)]"
      >
        <Image
          src={flyItem.image}
          alt="Fly to bag item"
          width={48}
          height={48}
          className="object-cover w-full h-full"
        />
      </motion.div>
    </AnimatePresence>
  );
}
