'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Prisma } from '@prisma/client';

export interface EditableProduct {
  id: string;
  name: string;
  basePrice: number | string | Prisma.Decimal;
  compareAtPrice?: number | string | Prisma.Decimal | null;
  material?: string | null;
  holdStrength?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
}

export default function EditProductForm({ product }: { product: EditableProduct }) {
  const router = useRouter();
  const [name, setName] = useState(product.name || '');
  const [basePrice, setBasePrice] = useState(Number(product.basePrice) || 0);
  const [compareAtPrice, setCompareAtPrice] = useState(product.compareAtPrice ? Number(product.compareAtPrice) : 0);
  const [material, setMaterial] = useState(product.material || '');
  const [holdStrength, setHoldStrength] = useState(product.holdStrength || 'All-Day Ultra Hold');
  const [description, setDescription] = useState(product.description || '');
  const [shortDescription, setShortDescription] = useState(product.shortDescription || '');
  const [isActive, setIsActive] = useState(product.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(product.isFeatured ?? false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          basePrice: Number(basePrice),
          compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
          material,
          holdStrength,
          description,
          shortDescription,
          isActive,
          isFeatured,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update product');
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-[#141311] border border-white/10 space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Product updated successfully. Changes are live on the storefront.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
            Product Title
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
            Storefront Price (₹)
          </label>
          <input
            type="number"
            required
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
            Compare-at Price (₹)
          </label>
          <input
            type="number"
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
            Short Subtitle
          </label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
            Editorial Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white leading-relaxed"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
            Material Sourcing
          </label>
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
            Hold Strength
          </label>
          <select
            value={holdStrength}
            onChange={(e) => setHoldStrength(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#1C1B19] border border-white/15 text-xs text-white"
          >
            <option value="Gentle">Gentle Tension</option>
            <option value="Medium">Medium Balanced Hold</option>
            <option value="All-Day Ultra Hold">All-Day Ultra Hold</option>
          </select>
        </div>

        <div className="sm:col-span-2 flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-[#C5A059]"
            />
            <span>Active on Storefront</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-[#C5A059]"
            />
            <span>Featured Badge</span>
          </label>
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
        <Link
          href="/admin/products"
          className="px-5 py-2.5 rounded-full border border-white/20 text-xs text-stone-300 hover:text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-full bg-[#C5A059] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg disabled:opacity-50"
        >
          {saving ? 'Saving Changes...' : 'Save Product Updates'}
        </button>
      </div>
    </form>
  );
}
