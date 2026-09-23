import React from 'react';
import { getOrders } from '@/services/orderService';

export const revalidate = 0; // Live orders

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="editorial-serif text-3xl font-light text-white">
            Orders & Fulfillment ({orders.length})
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Track luxury client orders, authorize deliveries, and update shipment tracking statuses.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-[#141311] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 uppercase tracking-wider text-[10px] bg-white/[0.02]">
                <th className="py-4 px-6 font-semibold">Order ID</th>
                <th className="py-4 font-semibold">Client</th>
                <th className="py-4 font-semibold">Shipping Address</th>
                <th className="py-4 font-semibold">Items</th>
                <th className="py-4 font-semibold">Total</th>
                <th className="py-4 font-semibold">Payment</th>
                <th className="py-4 px-6 font-semibold">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    No orders recorded in database yet. Live client orders will populate here immediately.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-mono font-semibold text-white">
                      {order.orderNumber}
                      <span className="block text-[10px] font-normal text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>

                    <td className="py-4 text-white">
                      <p className="font-semibold">
                        {order.guestName || order.user?.name || 'Valued Client'}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {order.guestEmail || order.user?.email || '—'}
                      </p>
                    </td>

                    <td className="py-4 text-stone-300 max-w-xs truncate">
                      {order.shippingAddressSnapshot || 'Standard Express Courier Delivery'}
                    </td>

                    <td className="py-4">
                      <span className="font-semibold text-white">
                        {order.items?.length || 1} items
                      </span>
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

                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-stone-300">
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
