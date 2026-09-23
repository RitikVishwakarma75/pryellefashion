'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Search,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  Eye,
  FileImage,
  RefreshCw,
} from 'lucide-react';

interface MediaItem {
  id: string;
  url: string;
  fileName: string;
  altText?: string;
  size?: number;
  width?: number;
  height?: number;
  usageCount: number;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMedia = async (q = '') => {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/media?search=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.items) {
        setMediaList(data.items);
      }
    } catch {
      // Mock fallback
      setMediaList([
        {
          id: 'm-claw',
          url: '/images/products/claw-clip.jpg',
          fileName: 'claw-clip.jpg',
          altText: 'Luna Sculpted Claw Clip',
          size: 696000,
          width: 1200,
          height: 1500,
          usageCount: 4,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'm-scrunchie',
          url: '/images/products/silk-scrunchie.jpg',
          fileName: 'silk-scrunchie.jpg',
          altText: 'Nuage Silk Scrunchie Rose Petal',
          size: 763000,
          width: 1200,
          height: 1500,
          usageCount: 3,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'm-pins',
          url: '/images/products/hair-pins.jpg',
          fileName: 'hair-pins.jpg',
          altText: 'Astra Baroque Hair Pins',
          size: 846000,
          width: 1200,
          height: 1500,
          usageCount: 2,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'm-comb',
          url: '/images/products/wooden-comb.jpg',
          fileName: 'wooden-comb.jpg',
          altText: 'Santal Wide Tooth Sandalwood Comb',
          size: 845000,
          width: 1200,
          height: 1500,
          usageCount: 2,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch(`/api/media?search=`);
        const data = await res.json();
        if (!ignore && data.items) {
          setMediaList(data.items);
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
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMsg(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('altText', file.name.replace(/\.[^/.]+$/, ''));

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Upload failed');
        }
      }
      await fetchMedia(search);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, usageCount: number) => {
    if (usageCount > 0) {
      if (
        !confirm(
          `Warning: This image is used in ${usageCount} places across products and categories. Are you sure you want to force delete it?`
        )
      ) {
        return;
      }
    } else {
      if (!confirm('Are you sure you want to delete this media asset?')) return;
    }

    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || 'Failed to delete');
        return;
      }
      setMediaList((prev) => prev.filter((m) => m.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch {
      setMediaList((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium block mb-1">
            Digital Asset Management
          </span>
          <h1 className="editorial-serif text-3xl font-light text-white tracking-wide">
            Media Library
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Central repository for luxury photography, product gallery stills, and editorial assets.
          </p>
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer px-5 py-2.5 rounded-full bg-[#C5A059] text-black text-xs font-semibold uppercase tracking-wider hover:bg-[#d6b26b] transition-all flex items-center gap-2 shadow-lg active:scale-95">
          <UploadCloud className="w-4 h-4" />
          <span>{uploading ? 'Ingesting...' : 'Upload Media'}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141311] p-4 rounded-2xl border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchMedia(e.target.value);
            }}
            placeholder="Search by filename or alt text..."
            className="w-full bg-[#1B1A17] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-400">
          <span>Total Assets: <strong className="text-white">{mediaList.length}</strong></span>
          <button
            onClick={() => fetchMedia(search)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 transition-colors"
            title="Refresh assets"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Media Cards */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-500">Loading media assets...</div>
      ) : mediaList.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-white/10 rounded-3xl bg-[#141311]">
          <FileImage className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <p className="text-sm text-stone-300 font-medium">No media assets found</p>
          <p className="text-xs text-stone-500 mt-1">Upload high-resolution photography above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[#161513] rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-between hover:border-[#C5A059]/40 transition-all shadow-md"
            >
              {/* Thumbnail Stage */}
              <div className="relative aspect-square w-full bg-stone-900 overflow-hidden">
                <Image
                  src={item.url}
                  alt={item.altText || item.fileName}
                  fill
                  sizes="200px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge if in use */}
                {item.usageCount > 0 ? (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                    In use ({item.usageCount})
                  </span>
                ) : (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-medium bg-stone-800/80 text-stone-400 border border-white/5 backdrop-blur-md">
                    Unused
                  </span>
                )}

                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    onClick={() => copyToClipboard(item.url, item.id)}
                    className="p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-black transition-colors"
                    title="View details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.usageCount)}
                    className="p-2 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors"
                    title="Delete asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Caption */}
              <div className="p-3">
                <p className="text-[11px] font-medium text-stone-300 truncate" title={item.fileName}>
                  {item.fileName}
                </p>
                <div className="flex items-center justify-between text-[9px] text-stone-500 mt-1">
                  <span>{item.size ? `${Math.round(item.size / 1024)} KB` : 'Local'}</span>
                  <span>{item.width && item.height ? `${item.width}×${item.height}` : 'HD'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#181715] border border-white/10 rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="editorial-serif text-xl font-normal text-white">Asset Details</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-stone-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black">
              <Image
                src={selectedItem.url}
                alt={selectedItem.altText || selectedItem.fileName}
                fill
                className="object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 p-4 rounded-2xl">
              <div>
                <span className="text-stone-500 block text-[10px]">Filename:</span>
                <span className="text-white font-mono">{selectedItem.fileName}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Usage Count:</span>
                <span className="text-white">{selectedItem.usageCount} associations</span>
              </div>
              <div className="col-span-2">
                <span className="text-stone-500 block text-[10px]">URL:</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    readOnly
                    value={selectedItem.url}
                    className="w-full bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg text-stone-300 font-mono text-[10px]"
                  />
                  <button
                    onClick={() => copyToClipboard(selectedItem.url, selectedItem.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#C5A059] text-black font-semibold text-[10px] whitespace-nowrap"
                  >
                    {copiedId === selectedItem.id ? 'Copied!' : 'Copy URL'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
