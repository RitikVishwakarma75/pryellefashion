'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Plus,
  Trash2,
  Check,
  ChevronLeft,
  X,
  Phone,
  User,
  Building,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  type: string;
  isDefault: boolean;
}

export default function AddressesClient() {
  const { isAuthenticated, isLoading, refreshUser } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form state
  const [form, setForm] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    type: 'SHIPPING',
    isDefault: false,
  });

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/addresses');
      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses || []);
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login?redirect=/account/addresses');
      } else {
        fetchAddresses();
      }
    }
  }, [isLoading, isAuthenticated, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setActionError('');

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Failed to save address.');
      } else {
        setIsModalOpen(false);
        setForm({
          name: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India',
          type: 'SHIPPING',
          isDefault: false,
        });
        setSuccessMsg('Address added successfully.');
        setTimeout(() => setSuccessMsg(''), 4000);
        await fetchAddresses();
        await refreshUser();
      }
    } catch {
      setActionError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch('/api/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isDefault: true }),
      });
      if (res.ok) {
        await fetchAddresses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you wish to delete this address?')) return;
    try {
      const res = await fetch('/api/addresses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchAddresses();
        await refreshUser();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || loadingAddresses) {
    return (
      <div className="min-h-screen bg-[#0D0C0B] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0C0B] pt-28 pb-24 text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-[#C5A059] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Account
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="caps-subtitle text-[10px] tracking-[0.25em] text-[#C5A059] mb-1 block">
              ADDRESS DIRECTORY
            </span>
            <h1 className="editorial-serif text-3xl sm:text-4xl font-normal text-white">
              Saved Addresses
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E6B85C] text-black text-xs font-semibold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_20px_rgba(197,160,89,0.2)]"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 mb-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {/* Addresses Grid */}
        {addresses.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10">
            <MapPin className="w-10 h-10 text-stone-600 mx-auto mb-4" />
            <h3 className="editorial-serif text-xl text-white mb-2">No Saved Addresses</h3>
            <p className="text-stone-400 text-xs max-w-sm mx-auto mb-6">
              You haven&apos;t added any delivery addresses yet. Add your preferred destination for swift, 1-click checkout.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#C5A059]/40 text-[#C5A059] text-xs font-medium hover:bg-[#C5A059]/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <motion.div
                key={addr.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                  addr.isDefault
                    ? 'bg-gradient-to-b from-[#C5A059]/10 to-transparent border-[#C5A059]/40 shadow-[0_4px_30px_rgba(197,160,89,0.1)]'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-white/[0.06] text-[#C5A059]">
                        {addr.type === 'BILLING' ? (
                          <Building className="w-3.5 h-3.5" />
                        ) : (
                          <Home className="w-3.5 h-3.5" />
                        )}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                        {addr.type}
                      </span>
                    </div>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-[#C5A059] px-2.5 py-0.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30">
                        <Check className="w-3 h-3" />
                        Default
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-medium text-white mb-1 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    {addr.name}
                  </h3>
                  <p className="text-xs text-stone-400 mb-3 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    {addr.phone}
                  </p>

                  <div className="text-xs text-stone-300 space-y-0.5 leading-relaxed pt-2 border-t border-white/5">
                    <p>{addr.addressLine1}</p>
                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                    <p>
                      {addr.city}, {addr.state} — {addr.postalCode}
                    </p>
                    <p className="text-stone-500 text-[11px]">{addr.country}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 mt-4 border-t border-white/10">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs text-[#C5A059] hover:underline font-medium"
                    >
                      Make Default
                    </button>
                  ) : (
                    <span className="text-[11px] text-stone-500">Primary delivery address</span>
                  )}

                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal — Add Address */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#141312] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div>
                  <span className="caps-subtitle text-[9px] tracking-[0.25em] text-[#C5A059] block">
                    DESTINATION
                  </span>
                  <h2 className="editorial-serif text-2xl text-white">Add Delivery Address</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {actionError && (
                <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {actionError}
                </div>
              )}

              <form onSubmit={handleCreateAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1.5 font-medium">
                      Recipient Name <span className="text-[#C5A059]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Full Name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1.5 font-medium">
                      Phone Number <span className="text-[#C5A059]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1.5 font-medium">
                    Address Line 1 <span className="text-[#C5A059]">*</span>
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleInputChange}
                    required
                    placeholder="House / Flat No., Building Name, Street"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1.5 font-medium">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={form.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Apartment, Suite, Landmark"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1.5 font-medium">
                      City <span className="text-[#C5A059]">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Mumbai"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1.5 font-medium">
                      State <span className="text-[#C5A059]">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Maharashtra"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059] transition-colors"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1.5 font-medium">
                      PIN Code <span className="text-[#C5A059]">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleInputChange}
                      required
                      placeholder="400050"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1.5 font-medium">
                      Address Type
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="SHIPPING">Shipping (Home / Delivery)</option>
                      <option value="BILLING">Billing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-300 mb-1.5 font-medium">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={form.isDefault}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-white/20 accent-[#C5A059] bg-white/10"
                    />
                    <span className="text-xs text-stone-300">Set as my primary default delivery address</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-stone-400 text-xs hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E6B85C] text-black text-xs font-semibold uppercase tracking-wider hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    {isSubmitting ? 'Saving Address...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
