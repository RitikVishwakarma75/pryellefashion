'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, Heart, LogOut, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AccountClient() {
  const { user, isLoading, isAuthenticated, login, register, logout } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (mode === 'login') {
      const result = await login(form.email, form.password);
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
    } else {
      if (!form.name.trim()) {
        setError('Name is required');
        setIsSubmitting(false);
        return;
      }
      if (form.password.length < 8) {
        setError('Password must be at least 8 characters');
        setIsSubmitting(false);
        return;
      }
      const result = await register(form);
      if (!result.success) {
        setError(result.error || 'Registration failed');
      }
    }
    setIsSubmitting(false);
  };

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin" />
      </section>
    );
  }

  // Authenticated Dashboard
  if (isAuthenticated && user) {
    const navItems = [
      { icon: Package, label: 'My Orders', href: '/account/orders', desc: 'Track and manage your orders' },
      { icon: MapPin, label: 'Addresses', href: '/account/addresses', desc: 'Manage delivery addresses' },
      { icon: Heart, label: 'Wishlist', href: '/shop', desc: 'Your saved pieces' },
    ];

    return (
      <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <p className="caps-subtitle text-[#C5A059] mb-3">Welcome Back</p>
            <h1 className="editorial-serif text-4xl font-light text-white mb-2">{user.name}</h1>
            <p className="text-stone-500 text-sm">{user.email}</p>
          </motion.div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="block p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#C5A059]/30 hover:bg-white/[0.06] transition-all group"
                  >
                    <Icon className="w-6 h-6 text-[#C5A059] mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-sm font-semibold text-white mb-1">{item.label}</h3>
                    <p className="text-[11px] text-stone-500">{item.desc}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Account Info */}
          <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 mb-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#C5A059]" />
              Account Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Name</p>
                <p className="text-white">{user.name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Email</p>
                <p className="text-white font-mono text-xs">{user.email}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Account Type</p>
                <p className="text-[#C5A059] font-medium">{user.role === 'ADMIN' ? 'Administrator' : 'Customer'}</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </section>
    );
  }

  // Login / Register Form
  return (
    <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4"
      >
        <div className="text-center mb-8">
          <Sparkles className="w-8 h-8 text-[#C5A059] mx-auto mb-4" />
          <h1 className="editorial-serif text-3xl text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-stone-500 text-sm">
            {mode === 'login'
              ? 'Sign in to access your orders and wishlist.'
              : 'Join the PRAYELE community.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] text-stone-400 mb-1.5 font-medium">
                Full Name <span className="text-[#C5A059]">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059]/40 transition-colors"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] text-stone-400 mb-1.5 font-medium">
              Email <span className="text-[#C5A059]">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059]/40 transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] text-stone-400 mb-1.5 font-medium">
              Password <span className="text-[#C5A059]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-10 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059]/40 transition-colors"
                placeholder={mode === 'register' ? 'Min. 8 characters' : 'Enter password'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] text-stone-400 mb-1.5 font-medium">
                Phone (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059]/40 transition-colors"
                placeholder="+91 98765 43210"
              />
            </div>
          )}

          {error && (
            <p className="text-red-400 text-xs p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#E6B85C] text-black text-sm font-bold hover:brightness-110 disabled:opacity-60 transition-all"
          >
            {isSubmitting
              ? 'Processing...'
              : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-stone-500">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-[#C5A059] hover:underline font-medium"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
