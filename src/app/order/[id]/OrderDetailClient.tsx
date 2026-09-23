'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, Package, Truck, MapPin, CreditCard, Clock, ArrowRight, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderData {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  orderStatus: string;
  paymentStatus: string;
  shippingAddressSnapshot?: string;
  guestName?: string;
  guestEmail?: string;
  trackingNumber?: string;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    variantName?: string;
    colorName?: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  payments: Array<{
    provider: string;
    status: string;
    amount: number;
    paidAt?: string;
  }>;
}

export default function OrderDetailClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
          // Celebration confetti on first visit
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.5 },
              colors: ['#C5A059', '#D98B94', '#E6B85C', '#181716'],
            });
          } catch {}
        } else {
          setError(data.error || 'Order not found');
        }
      } catch {
        setError('Unable to load order details');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#C5A059] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-stone-400 text-sm">Loading order details...</p>
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20 flex items-center justify-center">
        <div className="text-center px-4">
          <Package className="w-16 h-16 text-stone-700 mx-auto mb-6" />
          <h1 className="editorial-serif text-3xl text-white mb-3">Order Not Found</h1>
          <p className="text-stone-500 text-sm mb-8">{error || 'This order does not exist or you do not have access.'}</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#C5A059] text-black text-sm font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  const statusSteps = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentStepIdx = statusSteps.indexOf(order.orderStatus);

  return (
    <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
          </motion.div>
          <p className="caps-subtitle text-[#C5A059] mb-3">Order Confirmed</p>
          <h1 className="editorial-serif text-4xl font-light text-white mb-3">
            Thank You!
          </h1>
          <p className="text-stone-400 text-sm">
            Your order <span className="font-mono text-white font-semibold">{order.orderNumber}</span> has been placed successfully.
          </p>
        </motion.div>

        {/* Order Status Timeline */}
        <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 mb-6">
          <div className="flex items-center justify-between mb-6">
            {statusSteps.map((statusStep, i) => {
              const isActive = i <= currentStepIdx;
              const icons = [CheckCircle2, Package, Truck, MapPin];
              const Icon = icons[i];
              return (
                <React.Fragment key={statusStep}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-white/5 text-stone-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-stone-600'}`}>
                      {statusStep.charAt(0) + statusStep.slice(1).toLowerCase()}
                    </span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={`flex-1 h-px mx-2 ${i < currentStepIdx ? 'bg-[#C5A059]' : 'bg-white/10'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {order.trackingNumber && (
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Tracking Number</p>
                <p className="text-sm font-mono text-white">{order.trackingNumber}</p>
              </div>
              <Truck className="w-5 h-5 text-[#C5A059]" />
            </div>
          )}
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Shipping */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">Shipping Address</p>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed whitespace-pre-line">
              {order.shippingAddressSnapshot || 'Address on file'}
            </p>
          </div>

          {/* Payment */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-[#C5A059]" />
              <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">Payment</p>
            </div>
            {order.payments.map((p, i) => (
              <div key={i} className="text-sm">
                <p className="text-white font-medium">{p.provider}</p>
                <p className="text-xs text-stone-400">
                  Status: <span className={p.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}>{p.status}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Line Items */}
        <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm text-white font-medium">{item.productName}</p>
                  <p className="text-[11px] text-stone-500">
                    {item.colorName || item.variantName || 'Standard'} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-white">₹{Number(item.subtotal).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-sm">
            <div className="flex justify-between text-stone-400">
              <span>Subtotal</span>
              <span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>−₹{Number(order.discount).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-400">
              <span>Shipping</span>
              <span>{Number(order.shippingFee) === 0 ? 'Free' : `₹${Number(order.shippingFee)}`}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10 text-white font-semibold">
              <span>Total</span>
              <span className="editorial-serif text-lg text-[#C5A059]">₹{Number(order.total).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Order Meta */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-8">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Placed {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <span className="font-mono">{order.orderNumber}</span>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#C5A059] text-black text-sm font-semibold hover:bg-[#D4B068] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 text-stone-300 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            View All Orders
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
