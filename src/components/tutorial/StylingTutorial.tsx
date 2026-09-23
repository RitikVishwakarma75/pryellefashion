'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Scissors } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';

export default function StylingTutorial() {
  const [activeStep, setActiveStep] = useState(0);
  const { addToCart } = useCart();
  const lunaProduct = PRODUCTS.find((p) => p.id === 'luna-claw') || PRODUCTS[0];

  const steps = [
    {
      number: '01',
      title: 'Twist your hair.',
      subtitle: 'Gather & Contour',
      instruction:
        'Gather your hair at the nape of your neck like a low ponytail. Gently twist the hair upwards toward the crown of your head, keeping medium tension for a relaxed yet intentional foundation.',
      proTip: 'For fine hair, backcomb the roots gently or add a spritz of dry texturizing spray to give the clip extra grip.',
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=80',
    },
    {
      number: '02',
      title: 'Secure with the Luna Clip.',
      subtitle: 'Anchor the Seam',
      instruction:
        'Fold the twisted tail back down against the twist seam. Press the Luna Sculpted Claw open, straddle both sides of the twist, and clamp firmly against your occipital bone.',
      proTip: 'Ensure the clip’s double-row teeth catch both the twist and the anchor hairs directly against your scalp.',
      image: '/images/products/claw-clip.jpg',
    },
    {
      number: '03',
      title: 'Pull a few strands loose.',
      subtitle: 'Effortless Dimension',
      instruction:
        'Gently pinch and tug two or three face-framing tendrils around your cheekbones and ears. Softly loosen the crown of the twist to create natural lift and Parisian nonchalance.',
      proTip: 'Never rush this step: asymmetry is the hallmark of modern luxury styling.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    },
    {
      number: '04',
      title: 'Finish the look.',
      subtitle: 'Liquid Luster & Hold',
      instruction:
        'Lightly mist with a botanical shine spray or hair oil through the mid-lengths. Your French twist is now locked for the next 14 hours with zero tension headache.',
      proTip: 'Pair with the Astra Pearl Pin slipped right beside the claw for formal evening glamour.',
      image: '/images/products/hair-pins.jpg',
    },
  ];

  const currentStep = steps[activeStep];

  return (
    <section id="styling-tutorial" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill mb-3">
          <Scissors className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
          <span className="caps-subtitle text-[10px] tracking-[0.22em] text-[var(--theme-text)]/80">
            Editorial Masterclass
          </span>
        </div>
        <h2 className="editorial-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--theme-text)] mb-3">
          How To Style It
        </h2>
        <p className="text-sm sm:text-base text-[var(--theme-text-muted)] max-w-xl mx-auto">
          Four effortless steps to transform untamed morning hair into a high-fashion statement.
        </p>
      </div>

      {/* Main Interactive Tutorial Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/70 shadow-2xl overflow-hidden">
        {/* Step Progress Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-2xl text-left transition-all duration-300 border ${
                  isActive
                    ? 'bg-white border-black shadow-md scale-[1.02]'
                    : 'bg-white/40 border-black/5 hover:bg-white/70 text-[var(--theme-text-muted)]'
                }`}
              >
                <span className="caps-subtitle text-[11px] font-bold text-[var(--theme-accent)] block mb-1">
                  Step {step.number}
                </span>
                <span className="editorial-serif text-base sm:text-lg font-medium text-[var(--theme-text)] block truncate">
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Step View Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Step Details */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="editorial-serif text-5xl sm:text-6xl font-light text-[var(--theme-accent)]">
                    {currentStep.number}
                  </span>
                  <div>
                    <span className="caps-subtitle text-[10px] tracking-widest text-[var(--theme-accent)] font-semibold">
                      {currentStep.subtitle}
                    </span>
                    <h3 className="editorial-serif text-2xl sm:text-4xl font-normal text-[var(--theme-text)]">
                      {currentStep.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[var(--theme-text)]/80 leading-relaxed my-6 font-normal">
                  {currentStep.instruction}
                </p>

                {/* Pro Tip Box */}
                <div className="p-4 rounded-2xl bg-white/80 border border-black/5 text-xs text-[var(--theme-text-muted)] leading-relaxed shadow-sm mb-6">
                  <strong className="text-[var(--theme-text)] font-semibold block mb-1">
                    Pro-Stylist Secret:
                  </strong>
                  {currentStep.proTip}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stepper Navigation & Bag CTA */}
            <div className="pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-full glass-pill text-xs font-medium uppercase tracking-wider disabled:opacity-30"
                >
                  Previous
                </button>
                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  className="px-5 py-2 rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] text-xs font-medium uppercase tracking-wider disabled:opacity-30 flex items-center gap-1.5"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={(e) => addToCart(lunaProduct, lunaProduct.colors[0], 1, e)}
                className="px-6 py-2 rounded-full glass-panel text-xs font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors flex items-center gap-2"
              >
                <span>Shop Tutorial Tool (Luna Claw)</span>
              </button>
            </div>
          </div>

          {/* Right: Step Visual Stage */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-stone-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentStep.image}
                    alt={currentStep.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 460px"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="caps-subtitle text-[9px] tracking-widest text-white/80">
                      Phase {currentStep.number}
                    </span>
                    <p className="editorial-serif text-2xl font-light">
                      {currentStep.title}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
