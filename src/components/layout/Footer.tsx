'use client';

import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Truck, RefreshCw } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch {}
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-[#141312] text-[#F3EFEA] pt-20 pb-12 overflow-hidden border-t border-white/10">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1000px] h-[350px] rounded-full blur-[140px] bg-[var(--theme-accent)]/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Brand Promise Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-16 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--theme-accent)] flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="editorial-serif text-base font-normal text-white">
                Biodegradable Acetate
              </h4>
              <p className="text-xs text-stone-400">Plant-based Italian cellulose</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--theme-accent)] flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="editorial-serif text-base font-normal text-white">
                Zero Tension Hold
              </h4>
              <p className="text-xs text-stone-400">Headache-free calibrated springs</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--theme-accent)] flex-shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="editorial-serif text-base font-normal text-white">
                Complimentary Courier
              </h4>
              <p className="text-xs text-stone-400">Free Express Air over ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--theme-accent)] flex-shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="editorial-serif text-base font-normal text-white">
                14-Day Concierge Care
              </h4>
              <p className="text-xs text-stone-400">Effortless exchanges & fit advice</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-16">
          {/* Brand Manifesto Column */}
          <div className="lg:col-span-4">
            <span className="editorial-serif text-3xl font-light tracking-[0.18em] uppercase text-white block">
              PRAYELE
            </span>
            <span className="caps-subtitle text-[9px] tracking-[0.35em] text-[var(--theme-accent)] block mb-4">
              HAUTE HAIRWEAR • PARIS / MUMBAI
            </span>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm mb-6">
              “One Hair. Endless Looks.” We engineer everyday hair accessories with jewelry-level precision, celebrating your hair’s organic textures without tension or breakage.
            </p>
            <p className="text-xs text-stone-500">
              Bespoke ateliers in Oyonnax, France & Jaipur, India.
            </p>
          </div>

          {/* Nav Columns */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <span className="caps-subtitle text-[10px] tracking-widest text-stone-300 block mb-4">
                Creations
              </span>
              <ul className="space-y-2.5 text-xs text-stone-400">
                <li><a href="#product-showcase" className="hover:text-white transition-colors">Luna Sculpted Claws</a></li>
                <li><a href="#product-showcase" className="hover:text-white transition-colors">Baroque Pearl Pins</a></li>
                <li><a href="#product-showcase" className="hover:text-white transition-colors">Botanical Wide Combs</a></li>
                <li><a href="#product-showcase" className="hover:text-white transition-colors">22-Momme Silk Clouds</a></li>
                <li><a href="#product-showcase" className="hover:text-white transition-colors">Velvet Crown Headbands</a></li>
              </ul>
            </div>

            <div>
              <span className="caps-subtitle text-[10px] tracking-widest text-stone-300 block mb-4">
                Experience
              </span>
              <ul className="space-y-2.5 text-xs text-stone-400">
                <li><a href="#interactive-3d" className="hover:text-white transition-colors">3D Product Studio</a></li>
                <li><a href="#virtual-styling" className="hover:text-white transition-colors">Virtual Stylist Simulator</a></li>
                <li><a href="#find-your-look" className="hover:text-white transition-colors">Find Your Hair Mood</a></li>
                <li><a href="#collections" className="hover:text-white transition-colors">Four Collections</a></li>
                <li><a href="#styling-tutorial" className="hover:text-white transition-colors">Masterclass Tutorial</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4">
            <span className="caps-subtitle text-[10px] tracking-widest text-stone-300 block mb-2">
              The Prayele Journal
            </span>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              Subscribe to receive secret runway drop access, master hairstylist tutorials, and 15% off your maiden order.
            </p>

            {isSubscribed ? (
              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-xs text-stone-200">
                <span className="font-semibold text-[var(--theme-accent)] block mb-1">
                  Bienvenue to the Salon.
                </span>
                Use code <strong className="font-mono text-white">ENDLESSLOOKS</strong> for 15% off at checkout.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/5 border border-white/15 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[var(--theme-accent)]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[var(--theme-accent)] text-black text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} PRAYELE Haute Hairwear. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <a href="#" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-300 transition-colors">Terms of Atelier</a>
            <a href="#" className="hover:text-stone-300 transition-colors">Shipping & Returns</a>
            <a href="#" className="hover:text-stone-300 transition-colors">Stockists</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
