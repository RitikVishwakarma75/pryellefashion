'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Feather, Shield, Leaf, Gem } from 'lucide-react';

export default function MaterialStory() {
  const materials = [
    {
      id: 'acetate',
      title: 'ACETATE',
      subtitle: 'Smooth. Durable. Beautiful.',
      icon: Gem,
      description:
        'Crafted from Italian cotton linters and wood pulp. Unlike petroleum-derived injection plastics, our plant-based acetate is hand-buffed for 72 hours, resulting in rich, organic marbling that feels warm to the touch and will never snap brittle.',
      specs: '100% Biodegradable • Hand-Tumbled 72 Hrs • High-Depth Amber & Pearl Glow',
      image: '/images/products/claw-clip.jpg',
    },
    {
      id: 'cellulose',
      title: 'CELLULOSE',
      subtitle: 'Lightweight and refined.',
      icon: Leaf,
      description:
        'Engineered for weightless wear and zero static tension. Plant-derived cellulose mimics the natural moisture barrier of hair fibers, sliding through dense curls or fragile strands with zero cuticle friction or split-end snagging.',
      specs: 'Anti-Static Formulation • Frictionless Teeth • Featherlight Weight Profile',
      image: '/images/products/wooden-comb.jpg',
    },
    {
      id: 'metal',
      title: 'METAL',
      subtitle: 'Designed for a polished finish.',
      icon: Shield,
      description:
        'Surgical-grade stainless steel coated in 18K warm gold via physical vapor deposition (PVD). Hypoallergenic, tarnish-proof, and engineered with calibrated spring torque that cradles hair without scalp tension headaches.',
      specs: 'PVD 18K Gold Coating • Hypoallergenic • Calibrated Spring Torque',
      image: '/images/products/hair-pins.jpg',
    },
    {
      id: 'fabric',
      title: 'FABRIC',
      subtitle: 'Soft textures for everyday comfort.',
      icon: Feather,
      description:
        'Grade 6A 22-Momme pure Mulberry silk and decadent Italian cotton velvet. Designed to preserve your hair’s natural moisture and prevent blowout denting, protecting delicate hair cuticles throughout sleep and daytime wear.',
      specs: 'Grade 6A 22-Momme Silk • Zero Crease Retention • Hydration Preserving',
      image: '/images/products/silk-scrunchie.jpg',
    },
  ];

  return (
    <section id="materials" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
          <span className="caps-subtitle text-[10px] tracking-[0.22em] text-[var(--theme-text)]/80">
            Material Sourcing & Philosophy
          </span>
        </div>
        <h2 className="editorial-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--theme-text)] mb-3">
          The Material Story
        </h2>
        <p className="text-sm sm:text-base text-[var(--theme-text-muted)] max-w-xl mx-auto">
          We reject brittle injection plastics. Every Prayele piece is sculpted from heirloom-grade plant cellulose, hypoallergenic 18K gold, and pure Mulberry silk.
        </p>
      </div>

      {/* 4 Storytelling Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {materials.map((mat, idx) => {
          const IconComponent = mat.icon;
          return (
            <motion.div
              key={mat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              className="group relative glass-panel rounded-3xl p-6 sm:p-8 border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden bg-white/75"
            >
              {/* Macro Image Preview Strip */}
              <div className="relative w-full h-[200px] sm:h-[240px] rounded-2xl overflow-hidden mb-6 bg-stone-100 shadow-inner">
                <Image
                  src={mat.image}
                  alt={mat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-106"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 glass-pill p-2 rounded-full text-[var(--theme-accent)] shadow-sm">
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="absolute bottom-3 left-4 text-white">
                  <span className="caps-subtitle text-[9px] tracking-widest text-white/80">
                    Artisan Sourcing
                  </span>
                  <p className="editorial-serif text-xl sm:text-2xl font-light">
                    {mat.title}
                  </p>
                </div>
              </div>

              {/* Text Description */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="editorial-serif text-2xl font-medium text-[var(--theme-text)]">
                    {mat.title}
                  </h3>
                  <span className="text-xs text-[var(--theme-accent)] font-semibold uppercase tracking-wider">
                    — {mat.subtitle}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] leading-relaxed mb-4">
                  {mat.description}
                </p>
              </div>

              {/* Specs Badge */}
              <div className="pt-3 border-t border-black/5 flex items-center justify-between text-[11px] text-[var(--theme-text)]/70">
                <span className="font-medium text-[var(--theme-accent)]">
                  {mat.specs}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
