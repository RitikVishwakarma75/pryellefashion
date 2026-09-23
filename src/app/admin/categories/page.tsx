'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  FolderPlus,
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  subCategories?: CategoryItem[];
}

const FALLBACK_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-tb',
    name: 'Ties & Bands',
    slug: 'ties-bands',
    description: 'Pure Silk Cloud: Zero crease. Zero friction. All grace.',
    subCategories: [
      { id: 'sub-1', name: 'Silk Scrunchies', slug: 'silk-scrunchie' },
      { id: 'sub-2', name: 'Satin Scrunchies', slug: 'satin-scrunchie' },
      { id: 'sub-3', name: 'Spiral Hair Ties', slug: 'spiral-tie' },
      { id: 'sub-4', name: 'Padded Headbands', slug: 'padded-headband' },
    ],
  },
  {
    id: 'cat-cc',
    name: 'Clips & Clutches',
    slug: 'clips-clutches',
    description: 'The Everyday Edit: Made for every version of you.',
    subCategories: [
      { id: 'sub-5', name: 'Claw Clips', slug: 'claw-clip' },
      { id: 'sub-6', name: 'Mini Claw Clips', slug: 'mini-claw' },
      { id: 'sub-7', name: 'Butterfly Clips', slug: 'butterfly-clip' },
      { id: 'sub-8', name: 'French Barrettes', slug: 'french-barrette' },
    ],
  },
  {
    id: 'cat-dec',
    name: 'Fashion & Bows',
    slug: 'decorative',
    description: 'Statement Artistry: Jewelry sculpted for your hair.',
    subCategories: [
      { id: 'sub-9', name: 'Hair Bows', slug: 'hair-bow' },
      { id: 'sub-10', name: 'Pearl Hair Accessories', slug: 'pearl-accessory' },
      { id: 'sub-11', name: 'Crystal Hair Pins', slug: 'crystal-pin' },
    ],
  },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch {
      setCategories(FALLBACK_CATEGORIES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (!ignore && data.categories) {
          setCategories(data.categories);
        }
      } catch {
        if (!ignore) {
          setCategories(FALLBACK_CATEGORIES);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim(),
          parentId: selectedParentId || null,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setName('');
        setSlug('');
        setDescription('');
        setSelectedParentId('');
        fetchCategories();
      }
    } catch {
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium block mb-1">
            Catalog Taxonomy
          </span>
          <h1 className="editorial-serif text-3xl font-light text-white tracking-wide">
            Categories &amp; Subcategories
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Unlimited nested taxonomy powering the storefront mega switcher and filtering chips.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedParentId('');
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-full bg-[#C5A059] text-black text-xs font-semibold uppercase tracking-wider hover:bg-[#d6b26b] transition-all flex items-center gap-2 shadow-lg active:scale-95"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Grid of Categories */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-500">Loading taxonomy...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-[#141311] rounded-3xl border border-white/10 p-6 space-y-4 shadow-lg hover:border-white/20 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center">
                      <FolderTree className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="editorial-serif text-xl font-medium text-white">{cat.name}</h3>
                      <span className="text-[10px] font-mono text-[#C5A059] block">
                        /{cat.slug}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-white/5 text-[10px] font-semibold text-stone-300">
                    {cat.subCategories?.length || 0} Subcategories
                  </span>
                </div>

                {cat.description && (
                  <p className="text-xs text-stone-400 mt-3 leading-relaxed">
                    {cat.description}
                  </p>
                )}

                {/* Subcategories list */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                      Nested Subcategories:
                    </span>
                    <button
                      onClick={() => {
                        setSelectedParentId(cat.id);
                        setIsModalOpen(true);
                      }}
                      className="text-[10px] text-[#C5A059] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Subcategory</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {cat.subCategories && cat.subCategories.length > 0 ? (
                      cat.subCategories.map((sub) => (
                        <span
                          key={sub.id}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1C1A17] text-[11px] text-stone-300 border border-white/5"
                        >
                          <span>{sub.name}</span>
                          <span className="text-[9px] font-mono text-stone-500">({sub.slug})</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-stone-600 italic">
                        No child subcategories yet.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-[#181715] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4"
          >
            <div className="pb-3 border-b border-white/10">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium">
                Taxonomy Editor
              </span>
              <h3 className="editorial-serif text-xl font-normal text-white mt-1">
                {selectedParentId ? 'Create Nested Subcategory' : 'Create Top-Level Mega Category'}
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-stone-300 block mb-1">Parent Category:</label>
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full bg-[#121110] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="">None (Top-Level Mega Category)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (/{c.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-stone-300 block mb-1">Category Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) {
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '')
                      );
                    }
                  }}
                  placeholder="e.g. Silk Scrunchies or Crystal Combs"
                  className="w-full bg-[#121110] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 block mb-1">URL Slug:</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. silk-scrunchie"
                  className="w-full bg-[#121110] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 block mb-1">Description / Tagline:</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief editorial positioning for the storefront..."
                  className="w-full bg-[#121110] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-full text-xs text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-full bg-[#C5A059] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d6b26b] transition-all disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
