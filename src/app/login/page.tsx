'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Eye, EyeOff, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || searchParams.get('callbackUrl') || '/account';

  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectUrl);
    }
  }, [isLoading, isAuthenticated, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || 'Invalid email or password');
      setIsSubmitting(false);
    } else {
      router.replace(redirectUrl);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0C0B] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0C0B] relative flex items-center justify-center px-4 py-32 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand crest */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/[0.04] border border-[#C5A059]/30 mb-4 shadow-[0_0_20px_rgba(197,160,89,0.15)]">
            <Sparkles className="w-5 h-5 text-[#C5A059]" />
          </div>
          <span className="block caps-subtitle text-[10px] tracking-[0.3em] text-[#C5A059] mb-1">
            PRAYELE MAISON
          </span>
          <h1 className="editorial-serif text-3xl sm:text-4xl text-white font-normal mb-2">
            Welcome Back
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm">
            Sign in to access your curated vault, orders, and bespoke styling recommendations.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1.5 font-medium">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059] transition-all"
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                />
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] uppercase tracking-wider text-stone-300 font-medium">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059] transition-all"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs leading-relaxed"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E6B85C] to-[#C5A059] text-black font-semibold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 shadow-[0_4px_20px_rgba(197,160,89,0.25)] flex items-center justify-center gap-2 group mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-stone-400">
              New to PRAYELE?{' '}
              <Link
                href={`/register${redirectUrl !== '/account' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
                className="text-[#C5A059] hover:underline font-medium ml-1"
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-stone-500 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Encrypted 256-bit luxury session security</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0D0C0B] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
