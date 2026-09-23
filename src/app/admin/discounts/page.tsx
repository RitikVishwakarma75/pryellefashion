import React from 'react';
import { getAllCoupons } from '@/services/couponService';

export const revalidate = 0;

export default async function AdminDiscountsPage() {
  const coupons = await getAllCoupons();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="editorial-serif text-3xl font-light text-white">
            Promotional Coupons & Privileges ({coupons.length})
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Configure secret runway discount codes, VIP incentives, and cart threshold discounts.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-[#141311] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 uppercase tracking-wider text-[10px] bg-white/[0.02]">
                <th className="py-4 px-6 font-semibold">Promo Code</th>
                <th className="py-4 font-semibold">Description</th>
                <th className="py-4 font-semibold">Discount Type</th>
                <th className="py-4 font-semibold">Benefit Value</th>
                <th className="py-4 font-semibold">Min. Order</th>
                <th className="py-4 font-semibold">Times Used</th>
                <th className="py-4 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    No active discount codes. Seed or create your maiden promo code.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#C5A059] text-sm">
                      {c.code}
                    </td>
                    <td className="py-4 text-stone-300">{c.description || '—'}</td>
                    <td className="py-4 text-stone-400">{c.discountType}</td>
                    <td className="py-4 font-semibold text-white">
                      {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    </td>
                    <td className="py-4 text-stone-400">
                      {c.minimumOrder ? `₹${c.minimumOrder}` : 'No Minimum'}
                    </td>
                    <td className="py-4 text-stone-300 font-medium">
                      {c.usedCount} redemptions
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
