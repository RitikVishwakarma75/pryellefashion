'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@prayele.com');
  const [password, setPassword] = useState('Admin@Prayele2026!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#F7F4EF] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full blur-[140px] bg-[#C5A059]/12 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/70 font-medium">
              Atelier Management Portal
            </span>
          </div>
          <h1 className="editorial-serif text-3xl sm:text-4xl font-light tracking-[0.14em] uppercase text-white">
            PRAYELE
          </h1>
          <p className="text-xs text-stone-400 mt-1">Haute Hairwear • Administration Console</p>
        </div>

        <div className="bg-[#1A1816]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-stone-300 block mb-1.5 uppercase tracking-wider text-[10px]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors"
                placeholder="admin@prayele.com"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-300 block mb-1.5 uppercase tracking-wider text-[10px]">
                Secret Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors"
                placeholder="••••••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#C5A059] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Enter Atelier Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Role-Based Access Control • 256-Bit SSL</span>
            </div>
            <p className="text-[10px] text-stone-500 mt-2">
              Default credentials prefilled for initial local evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
