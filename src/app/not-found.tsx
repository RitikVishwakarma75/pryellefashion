import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="min-h-screen bg-[#0D0C0B] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Sparkles className="w-16 h-16 text-[#C5A059]/30 mx-auto mb-6" />
        <p className="caps-subtitle text-[#C5A059] mb-4">Page Not Found</p>
        <h1 className="editorial-serif text-5xl text-white mb-4">404</h1>
        <p className="text-stone-500 text-sm mb-8">
          This page seems to have wandered off the runway. Let&apos;s get you back to somewhere fabulous.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#C5A059] text-black text-sm font-semibold hover:bg-[#D4B068] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 text-stone-300 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </section>
  );
}
