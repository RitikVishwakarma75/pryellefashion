'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Warehouse,
  AlertTriangle,
  History,
  Search,
  Plus,
  Minus,
  RefreshCw,
} from 'lucide-react';

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  categoryName: string;
  variantName: string;
  sku: string;
  color: string;
  colorHex: string;
  stockQuantity: number;
  reservedQuantity: number;
  availableStock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  price: number;
}

interface TransactionLog {
  id: string;
  type: string;
  quantity: number;
  reference?: string;
  reason?: string;
  createdAt: string;
  variant?: {
    name: string;
    sku: string;
    product?: { name: string };
  };
}

export default function InventoryDashboardPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'ledger'>('inventory');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState('Quarterly stock audit');
  const [saving, setSaving] = useState(false);

  const fetchInventory = async () => {
    try {
      const res = await fetch(
        `/api/inventory?search=${encodeURIComponent(search)}${lowStockFilter ? '&lowStock=true' : ''}`
      );
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch {
      // Mock fallback
      setItems([
        {
          id: 'v1',
          productId: 'luna-claw',
          productName: 'Luna Grande Sculpted Claw',
          productSlug: 'luna-claw',
          categoryName: 'Clips & Clutches',
          variantName: 'Amber Tortoise',
          sku: 'PRY-CC-001-AMB',
          color: 'Amber Tortoise',
          colorHex: '#C5A059',
          stockQuantity: 28,
          reservedQuantity: 2,
          availableStock: 26,
          lowStockThreshold: 5,
          isLowStock: false,
          price: 2499,
        },
        {
          id: 'v2',
          productId: 'nuage-silk-scrunchie',
          productName: 'Nuage Mulberry Silk Scrunchie',
          productSlug: 'nuage-silk-scrunchie',
          categoryName: 'Ties & Bands',
          variantName: 'Rose Petal',
          sku: 'PRY-TB-001-ROSE',
          color: 'Rose Petal',
          colorHex: '#D78B99',
          stockQuantity: 3,
          reservedQuantity: 1,
          availableStock: 2,
          lowStockThreshold: 5,
          isLowStock: true,
          price: 1899,
        },
        {
          id: 'v3',
          productId: 'astra-pearl-pin',
          productName: 'Astra Baroque Pearl Pin',
          productSlug: 'astra-pearl-pin',
          categoryName: 'Pins & Sticks',
          variantName: '18K Gold Vermeil',
          sku: 'PRY-PS-001-GLD',
          color: '18K Gold / Pearl',
          colorHex: '#E2C275',
          stockQuantity: 15,
          reservedQuantity: 0,
          availableStock: 15,
          lowStockThreshold: 4,
          isLowStock: false,
          price: 1699,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/inventory/transactions');
      const data = await res.json();
      if (data.transactions) {
        setTransactions(data.transactions);
      }
    } catch {
      setTransactions([
        {
          id: 'tx-1',
          type: 'RESTOCK',
          quantity: 25,
          reference: 'INITIAL_ONBOARDING',
          reason: 'Initial atelier batch intake',
          createdAt: new Date().toISOString(),
          variant: {
            name: 'Amber Tortoise',
            sku: 'PRY-CC-001-AMB',
            product: { name: 'Luna Grande Sculpted Claw' },
          },
        },
        {
          id: 'tx-2',
          type: 'SALE',
          quantity: -2,
          reference: 'PRY-491024',
          reason: 'Customer purchase fulfillment',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          variant: {
            name: 'Rose Petal',
            sku: 'PRY-TB-001-ROSE',
            product: { name: 'Nuage Mulberry Silk Scrunchie' },
          },
        },
      ]);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const [invRes, txRes] = await Promise.all([
          fetch(
            `/api/inventory?search=${encodeURIComponent(search)}${lowStockFilter ? '&lowStock=true' : ''}`
          ),
          fetch('/api/inventory/transactions'),
        ]);
        const invData = await invRes.json();
        const txData = await txRes.json();
        if (!ignore) {
          if (invData.items) setItems(invData.items);
          if (txData.transactions) setTransactions(txData.transactions);
        }
      } catch {
        // fallback
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [search, lowStockFilter]);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;

    setSaving(true);
    try {
      await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: adjustingItem.id,
          quantity: newQuantity,
          reason: adjustmentReason,
        }),
      });

      setItems((prev) =>
        prev.map((i) =>
          i.id === adjustingItem.id
            ? {
                ...i,
                stockQuantity: newQuantity,
                availableStock: Math.max(0, newQuantity - i.reservedQuantity),
                isLowStock: newQuantity <= i.lowStockThreshold,
              }
            : i
        )
      );

      setAdjustingItem(null);
      fetchTransactions();
    } catch {
      setAdjustingItem(null);
    } finally {
      setSaving(false);
    }
  };

  const totalSKUs = items.length;
  const lowStockCount = items.filter((i) => i.isLowStock).length;
  const outOfStockCount = items.filter((i) => i.stockQuantity === 0).length;
  const totalStockUnits = items.reduce((acc, i) => acc + i.stockQuantity, 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium block mb-1">
            Atelier Stock & Fulfilment
          </span>
          <h1 className="editorial-serif text-3xl font-light text-white tracking-wide">
            Inventory Control
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Real-time stock units, safety thresholds, and immutable ledger movements.
          </p>
        </div>

        <button
          onClick={() => {
            fetchInventory();
            fetchTransactions();
          }}
          className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 text-xs flex items-center gap-1.5 transition-colors border border-white/10"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#161513] p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
            Total Units in Stock
          </span>
          <p className="text-2xl font-light text-white">{totalStockUnits}</p>
          <span className="text-[10px] text-stone-500">Across all catalog finishes</span>
        </div>

        <div className="bg-[#161513] p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
            Active SKUs
          </span>
          <p className="text-2xl font-light text-white">{totalSKUs}</p>
          <span className="text-[10px] text-stone-500">Variant-level tracking</span>
        </div>

        <div className="bg-[#161513] p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-amber-400 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Low Stock Watch
          </span>
          <p className="text-2xl font-light text-amber-300">{lowStockCount}</p>
          <span className="text-[10px] text-stone-500">Under reorder threshold</span>
        </div>

        <div className="bg-[#161513] p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-rose-400 font-medium">
            Out of Stock
          </span>
          <p className="text-2xl font-light text-rose-400">{outOfStockCount}</p>
          <span className="text-[10px] text-stone-500">Requires immediate restock</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 text-xs font-medium pb-2 border-b-2 transition-colors ${
            activeTab === 'inventory'
              ? 'border-[#C5A059] text-white font-semibold'
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <Warehouse className="w-4 h-4" />
          <span>Live Stock Management</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center gap-2 text-xs font-medium pb-2 border-b-2 transition-colors ${
            activeTab === 'ledger'
              ? 'border-[#C5A059] text-white font-semibold'
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Stock Movement Ledger</span>
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141311] p-4 rounded-2xl border border-white/5">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name or SKU..."
                className="w-full bg-[#1B1A17] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lowStockFilter}
                  onChange={(e) => setLowStockFilter(e.target.checked)}
                  className="rounded border-white/20 bg-stone-900 text-[#C5A059] focus:ring-0"
                />
                <span>Show Low Stock Only (&le; 5 units)</span>
              </label>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#141311] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-stone-400 uppercase tracking-wider text-[10px] bg-white/[0.02]">
                    <th className="py-4 px-6 font-semibold">Creation</th>
                    <th className="py-4 px-4 font-semibold">Finish / Color</th>
                    <th className="py-4 px-4 font-semibold">SKU</th>
                    <th className="py-4 px-4 font-semibold text-right">Physical Stock</th>
                    <th className="py-4 px-4 font-semibold text-right">Reserved</th>
                    <th className="py-4 px-4 font-semibold text-right">Available</th>
                    <th className="py-4 px-6 font-semibold text-center">Status</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-stone-500">
                        Loading inventory levels...
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-stone-500">
                        No inventory records matching your query.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6 font-medium text-white">
                          <Link
                            href={`/product/${item.productSlug}`}
                            target="_blank"
                            className="hover:text-[#C5A059] transition-colors"
                          >
                            {item.productName}
                          </Link>
                          <span className="block text-[10px] text-stone-500 font-normal">
                            {item.categoryName}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full border border-white/20"
                              style={{ backgroundColor: item.colorHex || '#999' }}
                            />
                            <span className="text-stone-300">{item.variantName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono text-[11px] text-stone-400">
                          {item.sku}
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-white">
                          {item.stockQuantity}
                        </td>
                        <td className="py-4 px-4 text-right text-stone-400 font-mono">
                          {item.reservedQuantity}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`font-bold ${
                              item.availableStock === 0
                                ? 'text-rose-400'
                                : item.isLowStock
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {item.availableStock}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {item.availableStock === 0 ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              Sold Out
                            </span>
                          ) : item.isLowStock ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Low Stock (&le; {item.lowStockThreshold})
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Healthy
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => {
                              setAdjustingItem(item);
                              setNewQuantity(item.stockQuantity);
                            }}
                            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#C5A059] hover:text-black text-stone-300 text-[11px] font-medium transition-colors border border-white/10"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Transaction Ledger View */
        <div className="bg-[#141311] rounded-3xl border border-white/10 overflow-hidden shadow-xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="editorial-serif text-xl font-normal text-white">
              Stock Movement Audit Trail
            </h3>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">
              Immutable Ledger
            </span>
          </div>

          <div className="overflow-x-auto no-scrollbar mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-stone-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 font-semibold">Timestamp</th>
                  <th className="py-3 font-semibold">Product &amp; Variant</th>
                  <th className="py-3 font-semibold">SKU</th>
                  <th className="py-3 font-semibold">Transaction Type</th>
                  <th className="py-3 font-semibold text-right">Delta Qty</th>
                  <th className="py-3 font-semibold">Reference</th>
                  <th className="py-3 font-semibold">Reason / Audit Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-500">
                      No stock movements recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 text-stone-400 text-[10px] font-mono">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5 font-medium text-white">
                        {tx.variant?.product?.name || 'Accessory'} — {tx.variant?.name}
                      </td>
                      <td className="py-3.5 font-mono text-[10px] text-stone-400">
                        {tx.variant?.sku}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                            tx.type === 'RESTOCK'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : tx.type === 'SALE'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-bold font-mono">
                        <span
                          className={tx.quantity > 0 ? 'text-emerald-400' : 'text-rose-400'}
                        >
                          {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono text-stone-300">{tx.reference || '—'}</td>
                      <td className="py-3.5 text-stone-400 text-[11px]">{tx.reason || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAdjustSubmit}
            className="bg-[#181715] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-5"
          >
            <div className="pb-3 border-b border-white/10">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium">
                Stock Adjustment
              </span>
              <h3 className="editorial-serif text-xl font-normal text-white mt-1">
                {adjustingItem.productName}
              </h3>
              <p className="text-xs text-stone-400">
                Finish: {adjustingItem.variantName} • SKU: {adjustingItem.sku}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-stone-300 block mb-1.5">
                  New Physical Stock Count:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNewQuantity(Math.max(0, newQuantity - 1))}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#121110] border border-white/10 rounded-xl py-2 text-center text-lg font-bold text-white focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={() => setNewQuantity(newQuantity + 1)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] text-stone-500 mt-1 block">
                  Current: {adjustingItem.stockQuantity} &rarr; Delta:{' '}
                  {newQuantity - adjustingItem.stockQuantity >= 0 ? '+' : ''}
                  {newQuantity - adjustingItem.stockQuantity}
                </span>
              </div>

              <div>
                <label className="text-xs text-stone-300 block mb-1.5">
                  Adjustment Reason / PO Reference:
                </label>
                <input
                  type="text"
                  required
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full bg-[#121110] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setAdjustingItem(null)}
                className="px-4 py-2 rounded-full text-xs text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-full bg-[#C5A059] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d6b26b] transition-all disabled:opacity-50"
              >
                {saving ? 'Recording...' : 'Save & Record Audit'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
