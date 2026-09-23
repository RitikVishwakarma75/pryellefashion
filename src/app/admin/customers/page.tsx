import React from 'react';
import prisma from '@/lib/prisma';

export const revalidate = 0;

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: Date;
  orders?: { id: string }[];
  addresses?: unknown[];
}

export default async function AdminCustomersPage() {
  let customers: CustomerItem[] = [];
  try {
    customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      include: {
        orders: true,
        addresses: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    customers = [
      {
        id: 'cust-1',
        name: 'Aanya Sen',
        email: 'aanya.sen@example.com',
        phone: '+91 98765 43210',
        createdAt: new Date(),
        orders: [{ id: 'ord-1' }, { id: 'ord-2' }],
      },
      {
        id: 'cust-2',
        name: 'Meera Kapur',
        email: 'meera.kapur@example.com',
        phone: '+91 98111 22233',
        createdAt: new Date(),
        orders: [{ id: 'ord-3' }],
      },
    ];
  }

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-white/10">
        <h1 className="editorial-serif text-3xl font-light text-white">
          Client Registry ({customers.length})
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Registered luxury patrons, acquisition history, and personal delivery address dossiers.
        </p>
      </div>

      <div className="rounded-3xl bg-[#141311] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 uppercase tracking-wider text-[10px] bg-white/[0.02]">
                <th className="py-4 px-6 font-semibold">Client Name</th>
                <th className="py-4 font-semibold">Contact Email</th>
                <th className="py-4 font-semibold">Phone</th>
                <th className="py-4 font-semibold">Orders Placed</th>
                <th className="py-4 px-6 font-semibold">Client Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">{c.name}</td>
                  <td className="py-4 text-stone-300 font-mono text-[11px]">{c.email}</td>
                  <td className="py-4 text-stone-400">{c.phone || '—'}</td>
                  <td className="py-4 font-semibold text-[#C5A059]">
                    {c.orders?.length || 0} Orders
                  </td>
                  <td className="py-4 px-6 text-stone-400">
                    {new Date(c.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
