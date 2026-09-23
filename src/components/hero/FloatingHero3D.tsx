'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { PRODUCTS } from '@/data/products';
import { Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function FloatingHero3D() {
  const { currentTheme } = useTheme();
  const { addToCart } = useCart();
  const [activeCallout, setActiveCallout] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Find the featured product for the current category
  const product =
    PRODUCTS.find((p) => p.id === currentTheme.featuredProductId) || PRODUCTS[0];
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  // When category changes, reset color index
  const currentColor = product.colors[selectedColorIdx] || product.colors[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x: x * 22, y: -y * 22 });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setActiveCallout(null);
  };

  const callouts = [
    {
      id: 1,
      title: 'Hand-Polished Italian Cellulose',
      desc: 'Plant-based, hypoallergenic acetate with deep natural marbling.',
      x: '22%',
      y: '28%',
    },
    {
      id: 2,
      title: '18K Gold Plated Spring',
      desc: 'High-tensile alloy calibrated for zero-snag, headache-free grip.',
      x: '78%',
      y: '35%',
    },
    {
      id: 3,
      title: 'Double-Row Ergonomic Teeth',
      desc: 'Contours perfectly to your occipital bone with seamless hold.',
      x: '50%',
      y: '78%',
    },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[580px] h-[280px] min-[360px]:h-[310px] min-[400px]:h-[350px] sm:h-[420px] md:h-[500px] lg:h-[540px] mx-auto flex items-center justify-center select-none perspective-[1200px]"
    >
      {/* Studio Ambient Glow */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.5, 0.35],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[200px] h-[200px] min-[360px]:w-[240px] min-[360px]:h-[240px] min-[400px]:w-[280px] min-[400px]:h-[280px] sm:w-[360px] sm:h-[360px] md:w-[440px] md:h-[440px] rounded-full blur-[60px] min-[400px]:blur-[80px] sm:blur-[90px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${currentTheme.accentSoft} 0%, rgba(255,255,255,0) 75%)`,
        }}
      />

      {/* Realistic Ground Shadow */}
      <motion.div
        animate={{
          scaleX: [1, 0.92, 1],
          opacity: [0.4, 0.25, 0.4],
          y: [0, 4, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-4 min-[400px]:bottom-6 sm:bottom-10 w-[180px] min-[400px]:w-[220px] sm:w-[320px] h-[16px] min-[400px]:h-[20px] sm:h-[24px] rounded-[100%] blur-[12px] min-[400px]:blur-[16px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(18, 16, 14, 0.45) 0%, rgba(18, 16, 14, 0) 70%)',
        }}
      />

      {/* Floating 3D Product Container with Tilt Physics */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${product.id}-${currentColor.name}`}
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            rotateY: mousePosition.x,
            rotateX: mousePosition.y,
          }}
          exit={{ opacity: 0, scale: 0.92, y: -20 }}
          transition={{
            type: 'spring',
            stiffness: 140,
            damping: 18,
            mass: 0.8,
          }}
          className="relative w-[200px] min-[320px]:w-[220px] min-[360px]:w-[250px] min-[400px]:w-[280px] sm:w-[340px] md:w-[390px] lg:w-[410px] h-[200px] min-[320px]:h-[220px] min-[360px]:h-[250px] min-[400px]:h-[280px] sm:h-[340px] md:h-[390px] lg:h-[410px] cursor-grab active:cursor-grabbing transform-gpu z-10"
        >
          {/* Main Levitating Product Image */}
          <motion.div
            animate={{
              y: [-8, 8, -8],
              rotateZ: [-1, 1, -1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-full h-full drop-shadow-2xl rounded-3xl overflow-hidden border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] bg-gradient-to-b from-white/30 to-black/5"
          >
            <Image
              src={currentColor.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 320px, 420px"
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
            />

            {/* Specular Shimmer Layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />

            {/* Floating Tag */}
            <div className="absolute top-2.5 left-2.5 min-[400px]:top-3 min-[400px]:left-3 sm:top-4 sm:left-4 glass-pill px-2 min-[400px]:px-2.5 sm:px-3 py-0.5 min-[400px]:py-1 rounded-full flex items-center gap-1 min-[400px]:gap-1.5 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 min-[400px]:w-3 min-[400px]:h-3 text-[var(--theme-accent)]" />
              <span className="text-[10px] tracking-widest uppercase font-medium">
                {product.badge || 'Haute Couture'}
              </span>
            </div>

            {/* Quick action button overlay */}
            <div className="absolute bottom-2.5 right-2.5 min-[400px]:bottom-3 min-[400px]:right-3 sm:bottom-4 sm:right-4 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, currentColor, 1, e);
                }}
                className="glass-pill px-2.5 min-[400px]:px-3 sm:px-3.5 py-1 min-[400px]:py-1.5 rounded-full text-[10px] min-[400px]:text-xs font-medium tracking-wider uppercase transition-all duration-300 hover:bg-black hover:text-white shadow-md flex items-center gap-1 min-[400px]:gap-1.5"
                title="Quick Add to Bag"
              >
                <span>Add • ₹{product.price}</span>
              </button>
            </div>
          </motion.div>

          {/* Interactive Feature Callout Pins */}
          {callouts.map((callout) => {
            const isActive = activeCallout === callout.id;
            return (
              <div
                key={callout.id}
                style={{ left: callout.x, top: callout.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
              >
                <button
                  onClick={() => setActiveCallout(isActive ? null : callout.id)}
                  onMouseEnter={() => setActiveCallout(callout.id)}
                  className="relative group w-5 h-5 min-[400px]:w-6 min-[400px]:h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 shadow-lg border border-black/10 flex items-center justify-center transition-transform duration-300 hover:scale-115 focus:outline-none"
                  aria-label={callout.title}
                >
                  <span className="w-2 h-2 rounded-full bg-[var(--theme-accent)] animate-ping absolute" />
                  <span className="w-2 h-2 rounded-full bg-[var(--theme-accent)] relative z-10" />
                </button>

                {/* Callout Tooltip */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 min-[400px]:mb-3 w-40 min-[400px]:w-48 sm:w-56 p-2 min-[400px]:p-2.5 sm:p-3 rounded-xl min-[400px]:rounded-2xl glass-panel-dark text-white text-[10px] min-[400px]:text-xs shadow-2xl z-40 pointer-events-none"
                    >
                      <p className="font-semibold text-white/90 text-[11px] tracking-wide mb-1">
                        {callout.title}
                      </p>
                      <p className="text-white/70 text-[10px] leading-relaxed">
                        {callout.desc}
                      </p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#121113]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Floating Color Swatch Selector for Hero Product */}
      <div className="absolute -bottom-2 min-[400px]:-bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 min-[400px]:gap-2 glass-pill px-2.5 py-1 min-[400px]:px-3 min-[400px]:py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg border border-white/40 max-w-[88vw] min-[400px]:max-w-[92vw] overflow-x-auto no-scrollbar">
        <span className="text-[10px] tracking-widest uppercase font-medium opacity-60 mr-1 hidden sm:inline">
          Finish:
        </span>
        {product.colors.map((c, idx) => (
          <button
            key={c.name}
            onClick={() => setSelectedColorIdx(idx)}
            className={`group relative w-4 h-4 min-[360px]:w-5 min-[360px]:h-5 min-[400px]:w-6 min-[400px]:h-6 rounded-full border transition-all duration-300 flex items-center justify-center shrink-0 ${
              selectedColorIdx === idx
                ? 'scale-115 border-black ring-2 ring-[var(--theme-accent)]/50'
                : 'border-black/20 hover:scale-105'
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.name}
          >
            {selectedColorIdx === idx && (
              <span className="w-1.5 h-1.5 rounded-full bg-black/70" />
            )}
            <span className="absolute -top-7 min-[400px]:-top-8 left-1/2 -translate-x-1/2 px-1.5 min-[400px]:px-2 py-0.5 rounded bg-black/85 text-white text-[8px] min-[400px]:text-[9px] tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {c.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
