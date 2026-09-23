'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, ArrowRight, ShoppingBag, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface OrderSummary {
  id: string;
  orderNumber: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  items: Array<{ productName: string; quantity: number }>;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-500/20 text-amber-400',
  CONFIRMED: 'bg-blue-500/20 text-blue-400',
  PROCESSING: 'bg-indigo-500/20 text-indigo-400',
  SHIPPED: 'bg-purple-500/20 text-purple-400',
  DELIVERED: 'bg-emerald-500/20 text-emerald-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
  REFUNDED: 'bg-stone-500/20 text-stone-400',
};

export default function OrderHistoryClient() {
  const { isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchOrders();
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading || loading) {
    return (
      <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin" />
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20 flex items-center justify-center">
        <div className="text-center px-4">
          <Package className="w-16 h-16 text-stone-700 mx-auto mb-6" />
          <h1 className="editorial-serif text-3xl text-white mb-3">Sign In Required</h1>
          <p className="text-stone-500 text-sm mb-6">Please sign in to view your order history.</p>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#C5A059] text-black text-sm font-semibold"
          >
            Sign In
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Account
          </Link>
          <h1 className="editorial-serif text-3xl font-light text-white">My Orders</h1>
          <p className="text-stone-500 text-sm mt-1">{orders.length} orders placed</p>
        </div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ShoppingBag className="w-16 h-16 text-stone-700 mx-auto mb-6" />
            <h3 className="editorial-serif text-2xl text-white mb-3">No Orders Yet</h3>
            <p className="text-stone-500 text-sm mb-8">
              Your order history will appear here once you make a purchase.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#C5A059] text-black text-sm font-semibold"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={`/order/${order.orderNumber}`}
                  className="block p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#C5A059]/30 hover:bg-white/[0.06] transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-sm font-semibold text-white">{order.orderNumber}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${STATUS_COLORS[order.orderStatus] || 'bg-white/10 text-stone-400'}`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-stone-400">
                      {order.items.slice(0, 2).map((item) => item.productName).join(', ')}
                      {order.items.length > 2 && ` +${order.items.length - 2} more`}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-[#C5A059]">
                        ₹{Number(order.total).toLocaleString('en-IN')}
                      </span>
                      <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-[#C5A059] transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
