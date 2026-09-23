'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';

interface ReviewItem {
  id: string;
  rating: number;
  title?: string;
  content: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
  product: { id: string; name: string; slug: string };
  user?: { id: string; name: string; email: string };
}

const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    rating: 5,
    title: 'Exquisite hold & finish',
    content: 'Holds thick textured hair comfortably for 10+ hours without slip.',
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: new Date().toISOString(),
    product: { id: 'luna-claw', name: 'Luna Grande Sculpted Claw', slug: 'luna-claw' },
    user: { id: 'u1', name: 'Sophia R.', email: 'sophia@example.com' },
  },
  {
    id: 'rev-2',
    rating: 5,
    title: 'Pure silk cloud',
    content: 'Zero crease marks when waking up. Mulberry silk quality is genuine.',
    isVerifiedPurchase: true,
    isApproved: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    product: { id: 'nuage-silk-scrunchie', name: 'Nuage Mulberry Silk Scrunchie', slug: 'nuage-silk-scrunchie' },
    user: { id: 'u2', name: 'Priya K.', email: 'priya@example.com' },
  },
  {
    id: 'rev-3',
    rating: 4,
    title: 'Beautiful packaging',
    content: 'Arrived in velvet dust pouch with styling guide. Truly luxury experience.',
    isVerifiedPurchase: false,
    isApproved: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    product: { id: 'astra-pearl-pin', name: 'Astra Baroque Pearl Pin', slug: 'astra-pearl-pin' },
    user: { id: 'u3', name: 'Ananya D.', email: 'ananya@example.com' },
  },
];

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(FALLBACK_REVIEWS);
  const [loading, setLoading] = useState(true);
  const [filterApproved, setFilterApproved] = useState<'all' | 'approved' | 'pending'>('all');

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.items) {
        setReviews(data.items);
      }
    } catch {
      setReviews(FALLBACK_REVIEWS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        if (!ignore && data.items) {
          setReviews(data.items);
        }
      } catch {
        if (!ignore) setReviews(FALLBACK_REVIEWS);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const toggleApproval = async (reviewId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, isApproved: !currentStatus } : r))
      );
    } catch {
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, isApproved: !currentStatus } : r))
      );
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterApproved === 'approved') return r.isApproved;
    if (filterApproved === 'pending') return !r.isApproved;
    return true;
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium block mb-1">
            Community & Trust
          </span>
          <h1 className="editorial-serif text-3xl font-light text-white tracking-wide">
            Customer Reviews
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Moderate editorial feedback, verify purchases, and curate client testimonials.
          </p>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            fetchReviews();
          }}
          className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 text-xs flex items-center gap-1.5 transition-colors border border-white/10"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setFilterApproved('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filterApproved === 'all'
              ? 'bg-[#C5A059] text-black font-semibold'
              : 'text-stone-400 hover:text-white bg-white/5'
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setFilterApproved('approved')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filterApproved === 'approved'
              ? 'bg-[#C5A059] text-black font-semibold'
              : 'text-stone-400 hover:text-white bg-white/5'
          }`}
        >
          Published ({reviews.filter((r) => r.isApproved).length})
        </button>
        <button
          onClick={() => setFilterApproved('pending')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filterApproved === 'pending'
              ? 'bg-[#C5A059] text-black font-semibold'
              : 'text-stone-400 hover:text-white bg-white/5'
          }`}
        >
          Pending Review ({reviews.filter((r) => !r.isApproved).length})
        </button>
      </div>

      {/* Reviews Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-500">Loading reviews...</div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-white/10 rounded-3xl bg-[#141311]">
          <MessageSquare className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <p className="text-sm text-stone-300 font-medium">No reviews in this view</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((r) => (
            <div
              key={r.id}
              className="bg-[#161513] rounded-2xl border border-white/5 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-white/10 transition-colors"
            >
              <div className="space-y-2 flex-1">
                {/* Rating & Product */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1 text-[#C5A059]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating ? 'fill-current text-[#C5A059]' : 'text-stone-700'
                        }`}
                      />
                    ))}
                  </div>

                  <Link
                    href={`/product/${r.product.slug}`}
                    target="_blank"
                    className="text-xs text-[#C5A059] hover:underline font-medium"
                  >
                    {r.product.name}
                  </Link>

                  {r.isVerifiedPurchase && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Client</span>
                    </span>
                  )}

                  <span className="text-[10px] text-stone-500">
                    {new Date(r.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Review Text */}
                {r.title && (
                  <h4 className="editorial-serif text-base text-white font-medium">
                    “{r.title}”
                  </h4>
                )}
                <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
                  {r.content}
                </p>

                {/* Author Info */}
                <p className="text-[11px] text-stone-500">
                  By <strong className="text-stone-300">{r.user?.name || 'Anonymous Client'}</strong>{' '}
                  {r.user?.email && <span className="text-stone-600">({r.user.email})</span>}
                </p>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    r.isApproved
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {r.isApproved ? 'Approved' : 'Hidden'}
                </span>

                <button
                  onClick={() => toggleApproval(r.id, r.isApproved)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                    r.isApproved
                      ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                      : 'bg-[#C5A059] hover:bg-[#d6b26b] text-black'
                  }`}
                >
                  {r.isApproved ? 'Unpublish' : 'Approve'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
