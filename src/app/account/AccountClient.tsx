'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Sparkles,
  Eye,
  EyeOff,
  Edit3,
  KeyRound,
  Shield,
  Phone,
  Mail,
  CheckCircle2,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';

export default function AccountClient() {
  const { user, isLoading, isAuthenticated, login, register, updateProfile, changePassword, logout } = useAuth();
  const { wishlist } = useWishlist();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [modalFeedback, setModalFeedback] = useState<{ error?: string; success?: string }>({});

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
    router.push('/login');
  };

  const openProfileModal = () => {
    setProfileForm({
      name: user?.name || '',
      phone: user?.phone || '',
    });
    setModalFeedback({});
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalFeedback({});

    const res = await updateProfile(profileForm);
    if (!res.success) {
      setModalFeedback({ error: res.error || 'Could not update profile' });
    } else {
      setModalFeedback({ success: 'Profile updated successfully.' });
      setTimeout(() => {
        setIsEditProfileOpen(false);
        setModalFeedback({});
      }, 1200);
    }
    setIsSubmitting(false);
  };

  const openPasswordModal = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setModalFeedback({});
    setIsChangePasswordOpen(true);
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalFeedback({});

    if (passwordForm.newPassword.length < 8) {
      setModalFeedback({ error: 'New password must be at least 8 characters long.' });
      setIsSubmitting(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setModalFeedback({ error: 'New passwords do not match.' });
      setIsSubmitting(false);
      return;
    }

    const res = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    if (!res.success) {
      setModalFeedback({ error: res.error || 'Failed to change password' });
    } else {
      setModalFeedback({ success: 'Password changed successfully.' });
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setModalFeedback({});
      }, 1200);
    }
    setIsSubmitting(false);
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
      {
        icon: Package,
        label: 'My Orders',
        href: '/account/orders',
        desc: 'Track deliveries and view purchase invoices',
        badge: user.ordersCount !== undefined && user.ordersCount > 0 ? `${user.ordersCount} orders` : undefined,
      },
      {
        icon: MapPin,
        label: 'Saved Addresses',
        href: '/account/addresses',
        desc: 'Manage your primary and shipping destinations',
        badge: user.addressesCount !== undefined && user.addressesCount > 0 ? `${user.addressesCount} saved` : undefined,
      },
      {
        icon: Heart,
        label: 'My Favorites',
        href: '/account/wishlist',
        desc: 'Explore your curated and saved runway pieces',
        badge: wishlist.length > 0 ? `${wishlist.length} saved` : undefined,
      },
    ];

    return (
      <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-24 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Top Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-8 border-b border-white/10"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="caps-subtitle text-[10px] tracking-[0.28em] text-[#C5A059]">
                  MAISON CLIENT PORTAL
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[9px] uppercase tracking-wider text-[#C5A059] font-medium">
                  {user.role}
                </span>
              </div>
              <h1 className="editorial-serif text-3xl sm:text-5xl font-light text-white mb-2">
                {user.name}
              </h1>
              <p className="text-stone-400 text-xs sm:text-sm font-light">
                {user.email} {user.phone && `• ${user.phone}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {(user.role === 'ADMIN' || user.role === 'STAFF') && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-[#C5A059]/40 text-xs text-[#C5A059] font-medium transition-all"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Atelier</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 hover:border-rose-500/40 hover:text-rose-400 text-stone-400 text-xs transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>

          {/* Quick Hub Navigation Cards */}
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
                    className="block h-full p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#C5A059]/40 hover:bg-white/[0.05] transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#C5A059] group-hover:scale-110 group-hover:border-[#C5A059]/40 transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      {item.badge && (
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C5A059] px-2.5 py-0.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-medium text-white mb-1.5 flex items-center gap-1 group-hover:text-[#C5A059] transition-colors">
                      {item.label}
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Account Profile Details Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 mb-8">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
              <h3 className="text-base font-medium text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#C5A059]" />
                Personal Profile & Credentials
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={openProfileModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs text-stone-300 hover:text-white transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={openPasswordModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs text-stone-300 hover:text-white transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Change Password</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-stone-600" />
                  Full Name
                </p>
                <p className="text-white font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-stone-600" />
                  Email Address
                </p>
                <p className="text-white font-mono text-xs">{user.email}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-stone-600" />
                  Contact Phone
                </p>
                <p className="text-white">{user.phone || <span className="text-stone-600 italic">Not set</span>}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Edit Profile Details */}
        <AnimatePresence>
          {isEditProfileOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditProfileOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-[#141312] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10"
              >
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                  <div>
                    <span className="caps-subtitle text-[9px] tracking-[0.25em] text-[#C5A059] block">
                      PERSONAL DETAILS
                    </span>
                    <h2 className="editorial-serif text-2xl text-white">Edit Profile</h2>
                  </div>
                  <button
                    onClick={() => setIsEditProfileOpen(false)}
                    className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {modalFeedback.error && (
                  <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                    {modalFeedback.error}
                  </div>
                )}
                {modalFeedback.success && (
                  <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{modalFeedback.success}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1.5 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1.5 font-medium">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsEditProfileOpen(false)}
                      className="px-4 py-2 rounded-xl text-stone-400 text-xs hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E6B85C] text-black text-xs font-semibold uppercase tracking-wider hover:brightness-110 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Change Password */}
        <AnimatePresence>
          {isChangePasswordOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsChangePasswordOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-[#141312] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10"
              >
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                  <div>
                    <span className="caps-subtitle text-[9px] tracking-[0.25em] text-[#C5A059] block">
                      SECURITY
                    </span>
                    <h2 className="editorial-serif text-2xl text-white">Change Password</h2>
                  </div>
                  <button
                    onClick={() => setIsChangePasswordOpen(false)}
                    className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {modalFeedback.error && (
                  <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                    {modalFeedback.error}
                  </div>
                )}
                {modalFeedback.success && (
                  <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{modalFeedback.success}</span>
                  </div>
                )}

                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1.5 font-medium">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                      required
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1.5 font-medium">
                      New Password (Min. 8 characters)
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                      required
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1.5 font-medium">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      required
                      placeholder="Repeat new password"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsChangePasswordOpen(false)}
                      className="px-4 py-2 rounded-xl text-stone-400 text-xs hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E6B85C] text-black text-xs font-semibold uppercase tracking-wider hover:brightness-110 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>
    );
  }

  // Unauthenticated Fallback View
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
