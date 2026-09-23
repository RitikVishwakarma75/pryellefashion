import React from 'react';
import prisma from '@/lib/prisma';

export const revalidate = 0;

interface NewsletterSubscriberItem {
  id: string;
  email: string;
  status: string;
  subscribedAt: Date;
}

export default async function AdminNewsletterPage() {
  let subscribers: NewsletterSubscriberItem[] = [];
  try {
    subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });
  } catch {
    subscribers = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="editorial-serif text-3xl font-light text-white">
            Prayele Journal Subscribers ({subscribers.length})
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Mailing list subscribers who opted in via the storefront footer for secret runway drops and discounts.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-[#141311] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 uppercase tracking-wider text-[10px] bg-white/[0.02]">
                <th className="py-4 px-6 font-semibold">Subscriber Email</th>
                <th className="py-4 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-stone-500">
                    No subscribers yet. Footer newsletter entries will sync here instantly.
                  </td>
                </tr>
              ) : (
                subscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-mono text-white text-xs">{s.email}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-stone-400">
                      {new Date(s.subscribedAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
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
