'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-screen bg-[#0D0C0B] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-16 h-16 text-amber-500/60 mx-auto mb-6" />
        <h1 className="editorial-serif text-3xl text-white mb-3">Something Went Wrong</h1>
        <p className="text-stone-500 text-sm mb-2">
          We encountered an unexpected error. Our team has been notified.
        </p>
        {error.digest && (
          <p className="text-[10px] font-mono text-stone-700 mb-6">Error ID: {error.digest}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#C5A059] text-black text-sm font-semibold hover:bg-[#D4B068] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 text-stone-300 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </section>
  );
}
