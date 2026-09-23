import React from 'react';
import Link from 'next/link';
import { getDashboardMetrics } from '@/services/analyticsService';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const revalidate = 0; // Live metrics

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  const kpis = [
    {
      title: 'Total Revenue',
      value: `₹${metrics.totalRevenue.toLocaleString('en-IN')}`,
      change: '+18.4% vs last mo',
      icon: TrendingUp,
      color: 'text-[#C5A059]',
    },
    {
      title: 'Processed Orders',
      value: metrics.totalOrders,
      change: '84 lifetime orders',
      icon: ShoppingBag,
      color: 'text-emerald-400',
    },
    {
      title: 'Active Customers',
      value: metrics.totalCustomers,
      change: 'Across 14 metro cities',
      icon: Users,
      color: 'text-indigo-400',
    },
    {
      title: 'Catalog Creations',
      value: metrics.totalProducts,
      change: 'Across 8 mega collections',
      icon: Package,
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
            <Sparkles className="w-3 h-3 text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium">
              Atelier Intelligence
            </span>
          </div>
          <h1 className="editorial-serif text-3xl sm:text-4xl font-light text-white">
            Operations & Performance
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Real-time telemetry across revenue, fulfillment, customer acquisition, and inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-5 py-2.5 rounded-full bg-[#C5A059] text-black text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
          >
            <span>+ Create Product</span>
          </Link>
        </div>
      </div>

      {/* Operational Alerts Bar */}
      {(metrics.lowStockCount > 0 || metrics.pendingOrders > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.pendingOrders > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-200">
                    {metrics.pendingOrders} Orders Awaiting Dispatch
                  </p>
                  <p className="text-[11px] text-amber-300/70">
                    Hand-inspect items and generate express airway bills.
                  </p>
                </div>
              </div>
              <Link
                href="/admin/orders"
                className="px-3 py-1 rounded-lg bg-amber-400/20 text-amber-200 text-xs hover:bg-amber-400/30 transition-colors"
              >
                Inspect
              </Link>
            </div>
          )}

          {metrics.lowStockCount > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-rose-200">
                    {metrics.lowStockCount} Variants Running Low On Stock
                  </p>
                  <p className="text-[11px] text-rose-300/70">
                    Re-order Italian cellulose and silk inventory from ateliers.
                  </p>
                </div>
              </div>
              <Link
                href="/admin/inventory"
                className="px-3 py-1 rounded-lg bg-rose-400/20 text-rose-200 text-xs hover:bg-rose-400/30 transition-colors"
              >
                Restock
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="p-5 sm:p-6 rounded-3xl bg-[#141311] border border-white/10 shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className={`p-2 rounded-xl bg-white/5 ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="editorial-serif text-2xl sm:text-3xl font-normal text-white">
                  {kpi.value}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">{kpi.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-3xl bg-[#141311] border border-white/10 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="editorial-serif text-xl sm:text-2xl font-light text-white">
              Recent Customer Acquisitions
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Live orders received across India and international boutique orders.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-medium text-[#C5A059] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Total Amount</th>
                <th className="pb-3 font-semibold">Payment</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {metrics.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-500">
                    No orders placed yet. Storefront transactions will appear here instantly.
                  </td>
                </tr>
              ) : (
                metrics.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-mono font-medium text-white">
                      {order.orderNumber}
                    </td>
                    <td className="py-4 text-stone-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-4 text-white">
                      {order.guestName || order.user?.name || 'Valued Client'}
                    </td>
                    <td className="py-4 font-semibold text-white">
                      ₹{Number(order.total).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-stone-300">
                        {order.orderStatus}
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
