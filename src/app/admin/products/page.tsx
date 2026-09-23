'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  ExternalLink,
  Edit,
  Copy,
  Trash2,
  RefreshCw,
} from 'lucide-react';

interface ProductTableItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryName: string;
  collectionName: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  status: boolean;
  updatedAt: string;
  imageUrl: string;
}

interface ApiProductVariant {
  sku?: string;
  stockQuantity?: number;
  stock?: number;
}

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  basePrice?: number;
  price?: number;
  compareAtPrice?: number | null;
  isActive?: boolean;
  updatedAt?: string;
  category?: { name?: string };
  collections?: Array<{ collection?: { name?: string } }>;
  collection?: string;
  variants?: ApiProductVariant[];
  images?: Array<{ url?: string; media?: { url?: string } }>;
  colors?: Array<{ image?: string }>;
}

const FALLBACK_ADMIN_PRODUCTS: ProductTableItem[] = [
  {
    id: 'luna-claw',
    name: 'Luna Grande Sculpted Claw',
    slug: 'luna-claw',
    sku: 'PRY-CC-001',
    categoryName: 'Clips & Clutches',
    collectionName: 'The Everyday',
    price: 2499,
    compareAtPrice: 2899,
    stock: 28,
    status: true,
    updatedAt: new Date().toISOString(),
    imageUrl: '/images/products/claw-clip.jpg',
  },
  {
    id: 'nuage-silk-scrunchie',
    name: 'Nuage Mulberry Silk Scrunchie',
    slug: 'nuage-silk-scrunchie',
    sku: 'PRY-TB-001',
    categoryName: 'Ties & Bands',
    collectionName: 'Soft Girl',
    price: 1899,
    compareAtPrice: 2299,
    stock: 4,
    status: true,
    updatedAt: new Date().toISOString(),
    imageUrl: '/images/products/silk-scrunchie.jpg',
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductTableItem[]>(FALLBACK_ADMIN_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'updated'>('updated');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=300');
      const data = await res.json();
      if (data.products) {
        const formatted: ProductTableItem[] = data.products.map((p: ApiProduct) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          sku: p.variants?.[0]?.sku || `${p.slug}-std`,
          categoryName: p.category?.name || 'Accessories',
          collectionName: p.collections?.[0]?.collection?.name || p.collection || 'Atelier',
          price: Number(p.basePrice || p.price || 0),
          compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
          stock: p.variants?.reduce(
            (sum: number, v: ApiProductVariant) => sum + (v.stockQuantity ?? v.stock ?? 15),
            0
          ) || 15,
          status: p.isActive ?? true,
          updatedAt: p.updatedAt || new Date().toISOString(),
          imageUrl:
            p.images?.[0]?.media?.url ||
            p.images?.[0]?.url ||
            p.colors?.[0]?.image ||
            '/images/products/claw-clip.jpg',
        }));
        setProducts(formatted);
      }
    } catch {
      setProducts(FALLBACK_ADMIN_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch('/api/products?limit=300');
        const data = await res.json();
        if (!ignore && data.products) {
          const formatted: ProductTableItem[] = data.products.map((p: ApiProduct) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            sku: p.variants?.[0]?.sku || `${p.slug}-std`,
            categoryName: p.category?.name || 'Accessories',
            collectionName: p.collections?.[0]?.collection?.name || p.collection || 'Atelier',
            price: Number(p.basePrice || p.price || 0),
            compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
            stock: p.variants?.reduce(
              (sum: number, v: ApiProductVariant) => sum + (v.stockQuantity ?? v.stock ?? 15),
              0
            ) || 15,
            status: p.isActive ?? true,
            updatedAt: p.updatedAt || new Date().toISOString(),
            imageUrl:
              p.images?.[0]?.media?.url ||
              p.images?.[0]?.url ||
              p.colors?.[0]?.image ||
              '/images/products/claw-clip.jpg',
          }));
          setProducts(formatted);
        }
      } catch {
        if (!ignore) setProducts(FALLBACK_ADMIN_PRODUCTS);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: !currentStatus } : p))
      );
    } catch {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: !currentStatus } : p))
      );
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'POST' });
      if (res.ok) {
        fetchProducts();
      }
    } catch {
      // Ignore
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Filter & Search Logic
  const filtered = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === 'all' || p.categoryName.toLowerCase().includes(categoryFilter.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && p.status) ||
        (statusFilter === 'draft' && !p.status);

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'stock') return a.stock - b.stock;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = Array.from(new Set(products.map((p) => p.categoryName))).filter(Boolean);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium block mb-1">
            Catalog Management
          </span>
          <h1 className="editorial-serif text-3xl font-light text-white tracking-wide">
            Product Catalog ({filtered.length} items)
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Complete inventory overview with SKU variants, live pricing, stock indicators, and instant publishing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 transition-colors border border-white/10"
            title="Refresh Catalog"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            href="/admin/products/new"
            className="px-5 py-2.5 rounded-full bg-[#C5A059] text-black text-xs font-semibold uppercase tracking-wider hover:bg-[#d6b26b] transition-all shadow-lg flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Creation</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#141311] p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by title, SKU, or category..."
            className="w-full bg-[#1B1A17] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#1B1A17] border border-white/10 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-[#C5A059]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as 'all' | 'active' | 'draft');
              setCurrentPage(1);
            }}
            className="bg-[#1B1A17] border border-white/10 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-[#C5A059]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="draft">Draft Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'stock' | 'updated')}
            className="bg-[#1B1A17] border border-white/10 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-[#C5A059]"
          >
            <option value="updated">Recently Updated</option>
            <option value="name">Product Name (A-Z)</option>
            <option value="price">Highest Price</option>
            <option value="stock">Lowest Stock First</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="rounded-3xl bg-[#141311] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 uppercase tracking-wider text-[10px] bg-white/[0.02]">
                <th className="py-4 px-6 font-semibold">Product</th>
                <th className="py-4 px-4 font-semibold">SKU</th>
                <th className="py-4 px-4 font-semibold">Category</th>
                <th className="py-4 px-4 font-semibold">Collection</th>
                <th className="py-4 px-4 font-semibold text-right">Price</th>
                <th className="py-4 px-4 font-semibold text-right">Stock</th>
                <th className="py-4 px-4 font-semibold text-center">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-stone-500">
                    Loading product catalog...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-stone-500">
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Product */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-xs line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-stone-500 font-mono">
                            /{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3.5 px-4 font-mono text-stone-400 text-[11px]">
                      {product.sku}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-stone-300">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] uppercase font-medium">
                        {product.categoryName}
                      </span>
                    </td>

                    {/* Collection */}
                    <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                      {product.collectionName}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 text-right font-medium text-white">
                      ₹{product.price}
                      {product.compareAtPrice && (
                        <span className="block text-[10px] text-stone-500 line-through">
                          ₹{product.compareAtPrice}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`font-semibold ${
                          product.stock <= 5 ? 'text-amber-400 font-bold' : 'text-stone-300'
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(product.id, product.status)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                          product.status
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-stone-500/20 text-stone-400 hover:bg-stone-500/30'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {product.status ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-[#C5A059] transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(product.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
                          title="Duplicate Product"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-stone-400">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} products
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold ${
                    currentPage === i + 1
                      ? 'bg-[#C5A059] text-black'
                      : 'bg-white/5 text-stone-300 hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
