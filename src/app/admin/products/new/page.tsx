'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  CheckCircle,
  Trash2,
  Plus,
  Layers,
  Tag,
  DollarSign,
  Palette,
  Warehouse,
  ImageIcon,
  Sliders,
  Compass,
  Scissors,
  Globe,
  Eye,
  Send,
  MoveLeft,
  MoveRight,
} from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { COLLECTIONS } from '@/data/collections';
import { MOODS } from '@/data/moods';
import { HAIRSTYLES } from '@/data/stylingMatrix';

interface VariantForm {
  name: string;
  sku: string;
  color: string;
  colorHex: string;
  finish: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  lowStockThreshold: number;
}

interface ImageUploadItem {
  url: string;
  publicId?: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

const STEPS = [
  { num: 1, title: 'Basic Info', icon: Tag, desc: 'Title, slug & descriptions' },
  { num: 2, title: 'Categories', icon: Layers, desc: 'Mega & subcategory taxonomy' },
  { num: 3, title: 'Collections', icon: Sparkles, desc: 'Editorial universes' },
  { num: 4, title: 'Pricing', icon: DollarSign, desc: 'Base & compare price' },
  { num: 5, title: 'Variants', icon: Palette, desc: 'Colors, swatches & SKUs' },
  { num: 6, title: 'Inventory', icon: Warehouse, desc: 'Stock & thresholds' },
  { num: 7, title: 'Images', icon: ImageIcon, desc: 'Asset gallery & order' },
  { num: 8, title: 'Details', icon: Sliders, desc: 'Materials & hair hold' },
  { num: 9, title: 'Moods', icon: Compass, desc: 'Vibe & styling aesthetic' },
  { num: 10, title: 'Hairstyles', icon: Scissors, desc: 'Virtual simulator matrix' },
  { num: 11, title: 'SEO', icon: Globe, desc: 'Search engine metadata' },
  { num: 12, title: 'Preview', icon: Eye, desc: 'Live storefront card' },
  { num: 13, title: 'Publish', icon: Send, desc: 'Review & launch' },
];

export default function NewProductWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // STEP 1: Basic Info
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [productType, setProductType] = useState('Claw Clip');

  // STEP 2: Category & Subcategory
  const [category, setCategory] = useState<string>('clips-clutches');
  const [subCategory, setSubCategory] = useState<string>('claw-clip');

  // STEP 3: Collections
  const [selectedCollections, setSelectedCollections] = useState<string[]>(['everyday']);

  // STEP 4: Pricing
  const [basePrice, setBasePrice] = useState<number>(2499);
  const [compareAtPrice, setCompareAtPrice] = useState<number>(2899);

  // STEP 5: Variants
  const [variants, setVariants] = useState<VariantForm[]>([
    {
      name: 'Amber Tortoise',
      sku: 'PRY-CC-AMB',
      color: 'Amber Tortoise',
      colorHex: '#C5A059',
      finish: 'Hand-buffed Italian Acetate',
      price: 2499,
      compareAtPrice: 2899,
      stock: 25,
      lowStockThreshold: 4,
    },
  ]);

  // STEP 7: Images
  const [images, setImages] = useState<ImageUploadItem[]>([
    {
      url: '/images/products/claw-clip.jpg',
      publicId: 'local/claw-clip',
      altText: 'Primary editorial perspective',
      isPrimary: true,
      sortOrder: 0,
    },
  ]);

  // STEP 8: Product Details
  const [material, setMaterial] = useState('100% Biodegradable Italian Cellulose Acetate');
  const [dimensions, setDimensions] = useState('10.5 cm x 4.8 cm');
  const [weight, setWeight] = useState('28 grams');
  const [holdStrength, setHoldStrength] = useState('All-Day Ultra Hold');
  const [hairTypes, setHairTypes] = useState<string[]>(['All Hair Types', 'Thick', 'Wavy', 'Curly']);

  // STEP 9: Moods
  const [selectedMoods, setSelectedMoods] = useState<string[]>(['minimal', 'romantic']);

  // STEP 10: Hairstyles
  const [selectedHairstyles, setSelectedHairstyles] = useState<string[]>(['french-twist', 'bun']);

  // STEP 11: SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Auto-slug generator
  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  // Upload image handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setErrorMessage('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        setImages((prev) => [
          ...prev,
          {
            url: data.url,
            publicId: data.publicId,
            altText: name ? `${name} Angle ${prev.length + 1}` : 'Product image',
            isPrimary: prev.length === 0,
            sortOrder: prev.length,
          },
        ]);
      }
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Variant helpers
  const addVariant = () => {
    const newIdx = variants.length + 1;
    setVariants((prev) => [
      ...prev,
      {
        name: `Finish ${newIdx}`,
        sku: `${(slug || 'PRY').toUpperCase()}-VAR-0${newIdx}`,
        color: `Tone ${newIdx}`,
        colorHex: '#181716',
        finish: 'Glossy Acetate',
        price: basePrice,
        compareAtPrice: compareAtPrice || undefined,
        stock: 20,
        lowStockThreshold: 4,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantForm, value: string | number) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  // Image helpers
  const setPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((img, i) => ({ ...img, sortOrder: i }));
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered.map((img, i) => ({ ...img, sortOrder: i }));
    });
  };

  // Submit product creation
  const handlePublish = async (isActive = true) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (!name.trim()) throw new Error('Product title is required in Step 1');
      if (!description.trim()) throw new Error('Product description is required in Step 1');
      if (variants.length === 0) throw new Error('At least one variant is required in Step 5');

      const payload = {
        name,
        slug,
        description,
        shortDescription,
        basePrice,
        compareAtPrice,
        material,
        dimensions,
        weight,
        holdStrength,
        hairTypes,
        isActive,
        seoTitle: seoTitle || `${name} | PRAYELLE Haute Hairwear`,
        seoDescription: seoDescription || shortDescription || description.substring(0, 160),
        variants: variants.map((v) => ({
          name: v.name,
          sku: v.sku,
          color: v.color,
          colorHex: v.colorHex,
          finish: v.finish,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
        })),
        images,
        category: subCategory || category,
        collections: selectedCollections,
        moods: selectedMoods,
        hairstyles: selectedHairstyles,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish creation');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === category);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium">
              Product Atelier Studio • 13-Phase Creation
            </span>
          </div>
          <h1 className="editorial-serif text-3xl sm:text-4xl font-light text-white">
            Create New Hairwear Product
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Step {currentStep} of 13: {STEPS[currentStep - 1].title} — {STEPS[currentStep - 1].desc}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handlePublish(false)}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-full border border-white/20 text-xs font-semibold uppercase tracking-wider text-stone-300 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handlePublish(true)}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-full bg-[#C5A059] text-black text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Publish Creation</span>
          </button>
        </div>
      </div>

      {/* 13-Step Horizontal Stepper Bar */}
      <div className="overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center gap-1.5 min-w-max p-2 bg-[#141311] rounded-2xl border border-white/10">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isCurrent = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`py-2 px-3 rounded-xl text-left text-xs transition-all flex items-center gap-2 ${
                  isCurrent
                    ? 'bg-[#C5A059] text-black font-semibold shadow-md'
                    : isCompleted
                    ? 'bg-white/10 text-white hover:bg-white/15'
                    : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-black' : isCompleted ? 'text-[#C5A059]' : 'text-stone-500'}`} />
                <span className="font-mono text-[10px]">{String(s.num).padStart(2, '0')}.</span>
                <span className="whitespace-nowrap">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          {errorMessage}
        </div>
      )}

      {/* STEP 1: Basic Information */}
      {currentStep === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141311] border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="editorial-serif text-2xl text-white font-normal">Step 1: Basic Information</h2>
            <p className="text-xs text-stone-400 mt-1">Define the accessory headline, type, and editorial story.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Luna Grande Sculpted Claw in Italian Amber"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="luna-sculpted-claw"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                Accessory Type
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1C1B19] border border-white/15 text-xs text-white focus:outline-none"
              >
                <option value="Claw Clip">Claw Clip</option>
                <option value="Hair Pin">Baroque Hair Pin</option>
                <option value="Silk Scrunchie">Mulberry Silk Scrunchie</option>
                <option value="Headband">Velvet Crown Headband</option>
                <option value="Botanical Comb">Botanical Styling Comb</option>
                <option value="Hair Bow">Velvet Hair Bow</option>
                <option value="Bridal Vine">Heirloom Bridal Vine</option>
                <option value="Travel Organizer">Travel Storage Case</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                Short Subtitle
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="e.g. Sculpted Italian acetate claw clip with zero-slip hold"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                Detailed Editorial Description *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe craftsmanship, materials, hand-buffed finishes, and crown ergonomics..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059] leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Category & Subcategory */}
      {currentStep === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141311] border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="editorial-serif text-2xl text-white font-normal">Step 2: Category & Subcategory</h2>
            <p className="text-xs text-stone-400 mt-1">
              Select the mega category and specific subcategory chip defined in the PRAYELLE taxonomy.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-2">
              Primary Mega-Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id);
                    if (cat.subFilters && cat.subFilters.length > 0) {
                      setSubCategory(cat.subFilters[0].id);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    category === cat.id
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-white font-semibold'
                      : 'border-white/10 bg-white/5 text-stone-400 hover:border-white/20'
                  }`}
                >
                  <span className="text-lg block mb-1">{cat.emoji}</span>
                  <span className="text-xs block text-white font-medium">{cat.name}</span>
                  <span className="text-[10px] text-stone-500 block truncate">{cat.tagline}</span>
                </button>
              ))}
            </div>
          </div>

          {activeCategoryObj?.subFilters && (
            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-2">
                Subcategory ({activeCategoryObj.name})
              </label>
              <div className="flex flex-wrap gap-2">
                {activeCategoryObj.subFilters.map((sub) => (
                  <button
                    type="button"
                    key={sub.id}
                    onClick={() => setSubCategory(sub.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-all border ${
                      subCategory === sub.id
                        ? 'bg-[#C5A059] text-black font-semibold border-[#C5A059]'
                        : 'bg-white/5 text-stone-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Collections */}
      {currentStep === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141311] border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="editorial-serif text-2xl text-white font-normal">Step 3: Collections Assignment</h2>
            <p className="text-xs text-stone-400 mt-1">
              Select one or multiple curated editorial collections for this creation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COLLECTIONS.map((col) => {
              const isSelected = selectedCollections.includes(col.id);
              return (
                <button
                  type="button"
                  key={col.id}
                  onClick={() => {
                    setSelectedCollections((prev) =>
                      isSelected ? prev.filter((id) => id !== col.id) : [...prev, col.id]
                    );
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#C5A059] bg-[#C5A059]/10 shadow-lg'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white tracking-wide">{col.name}</span>
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: col.accent }}
                    />
                  </div>
                  <span className="text-xs text-[#C5A059] block mb-1">{col.tagline}</span>
                  <p className="text-xs text-stone-400 leading-relaxed">{col.ethos}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: Pricing */}
      {currentStep === 4 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141311] border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="editorial-serif text-2xl text-white font-normal">Step 4: Pricing & Currency</h2>
            <p className="text-xs text-stone-400 mt-1">
              Set standard retail price, compare-at promotional price, and examine margin preview.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                Base Selling Price (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">₹</span>
                <input
                  type="number"
                  required
                  min={0}
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-lg text-white font-medium focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                Compare-at Price (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">₹</span>
                <input
                  type="number"
                  min={0}
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-lg text-stone-400 font-medium focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {compareAtPrice > basePrice && (
              <div className="sm:col-span-2 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
                <span>Calculated Promotional Discount:</span>
                <span className="font-semibold text-sm">
                  {Math.round(((compareAtPrice - basePrice) / compareAtPrice) * 100)}% OFF (Save ₹{compareAtPrice - basePrice})
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 5: Variants */}
      {currentStep === 5 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141311] border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="editorial-serif text-2xl text-white font-normal">Step 5: Product Variants</h2>
              <p className="text-xs text-stone-400 mt-1">Configure independent color finishes, swatches, and SKUs.</p>
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs text-stone-200 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Variant</span>
            </button>
          </div>

          <div className="space-y-4">
            {variants.map((v, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider">
                    Variant #{i + 1}: {v.name}
                  </span>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="text-stone-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Color Name</label>
                    <input
                      type="text"
                      value={v.color}
                      onChange={(e) => updateVariant(i, 'color', e.target.value)}
                      placeholder="Amber Tortoise"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Hex Swatch</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={v.colorHex}
                        onChange={(e) => updateVariant(i, 'colorHex', e.target.value)}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={v.colorHex}
                        onChange={(e) => updateVariant(i, 'colorHex', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white uppercase font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">SKU</label>
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                      placeholder="PRY-CC-001"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white font-mono uppercase"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Finish Style</label>
                    <input
                      type="text"
                      value={v.finish}
                      onChange={(e) => updateVariant(i, 'finish', e.target.value)}
                      placeholder="Hand-buffed Italian Acetate"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Variant Price (₹)</label>
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => updateVariant(i, 'price', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 6: Inventory */}
      {currentStep === 6 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141311] border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="editorial-serif text-2xl text-white font-normal">Step 6: Inventory & Ledger</h2>
            <p className="text-xs text-stone-400 mt-1">
              Set stock counts and alert thresholds. An initial RESTOCK ledger transaction will be safely created.
            </p>
          </div>

          <div className="space-y-4">
            {variants.map((v, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: v.colorHex }} />
                  <div>
                    <span className="text-xs text-white font-semibold block">{v.name} ({v.color})</span>
                    <span className="text-[10px] text-stone-400 font-mono">SKU: {v.sku}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Initial Stock</label>
                    <input
                      type="number"
                      min={0}
                      value={v.stock}
                      onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))}
                      className="w-24 px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-xs text-white font-semibold text-center"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Low Stock Alert</label>
                    <input
                      type="number"
                      min={1}
                      value={v.lowStockThreshold}
                      onChange={(e) => updateVariant(i, 'lowStockThreshold', Number(e.target.value))}
                      className="w-24 px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-xs text-white text-center"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-stone-400 leading-relaxed">
            <strong className="text-white block mb-1">Zero-Oversell Protection Enabled</strong>
            Each variant stock quantity is protected by database ledger transactions. Customer checkouts atomically deduct stock and write an immutable SALE record.
          </div>
        </div>
      )}

      {/* STEP 7: Images */}
      {currentStep === 7 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141311] border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="editorial-serif text-2xl text-white font-normal">Step 7: Product Images & Media</h2>
            <p className="text-xs text-stone-400 mt-1">
              Upload multiple editorial angles, reorder, designate primary image, and add SEO alt text.
            </p>
          </div>

          {/* Upload Dropzone */}
          <label className="border-2 border-dashed border-white/15 hover:border-[#C5A059] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/[0.02]">
            <UploadCloud className="w-8 h-8 text-[#C5A059] mb-2" />
            <span className="text-xs font-semibold text-white">Click or drag & drop luxury hairwear images</span>
            <span className="text-[10px] text-stone-400 mt-1">Supports High-Res JPG, PNG, WEBP via Object Storage</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageFileChange}
              disabled={uploadingImage}
              className="hidden"
            />
          </label>

          {uploadingImage && (
            <div className="text-center py-4 text-xs text-[#C5A059] animate-pulse">
              Uploading asset to storage...
            </div>
          )}

          {/* Gallery List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {images.map((img, i) => (
              <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40">
                  <Image src={img.url} alt={img.altText} fill className="object-cover" />
                  {img.isPrimary && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#C5A059] text-black text-[9px] font-semibold uppercase tracking-wider">
                      Primary
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  value={img.altText}
                  onChange={(e) => {
                    const text = e.target.value;
                    setImages((prev) =>
                      prev.map((item, idx) => (idx === i ? { ...item, altText: text } : item))
                    );
                  }}
                  placeholder="Image Alt Text"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-[11px] text-white"
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(i, 'left')}
                      disabled={i === 0}
                      className="p-1 rounded hover:bg-white/10 text-stone-400 disabled:opacity-30"
                    >
                      <MoveLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(i, 'right')}
                      disabled={i === images.length - 1}
                      className="p-1 rounded hover:bg-white/10 text-stone-400 disabled:opacity-30"
                    >
                      <MoveRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(i)}
                        className="text-[10px] text-[#C5A059] hover:underline"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="text-stone-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 8: Product Details */}
      {currentStep === 8 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141311] border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="editorial-serif text-2xl text-white font-normal">Step 8: Product Specifications</h2>
            <p className="text-xs text-stone-400 mt-1">Material composition, physical dimensions, and hair hold strength.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                Material Composition *
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="100% Biodegradable Italian Cellulose Acetate"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                Hold Strength
              </label>
              <select
                value={holdStrength}
                onChange={(e) => setHoldStrength(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1C1B19] border border-white/15 text-xs text-white"
              >
                <option value="Gentle">Gentle Tension-Free</option>
                <option value="Medium">Medium Flexible Hold</option>
                <option value="All-Day Ultra Hold">All-Day Ultra Hold</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                Physical Dimensions
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="10.5 cm x 4.8 cm"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                Weight (grams)
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="28 grams"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-2">
                Suitable Hair Textures
              </label>
              <div className="flex flex-wrap gap-2">
                {['Fine Hair', 'Medium Hair', 'Thick Hair', 'Curly Textures', 'Coily Textures', 'All Hair Types'].map(
                  (type) => {
                    const isSelected = hairTypes.includes(type);
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() => {
                          setHairTypes((prev) =>
                            isSelected ? prev.filter((t) => t !== type) : [...prev, type]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all border ${
                          isSelected
                            ? 'bg-[#C5A059] text-black font-semibold border-[#C5A059]'
                            : 'bg-white/5 text-stone-300 border-white/10'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 9: Moods */}
      {currentStep === 9 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141311] border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="editorial-serif text-2xl text-white font-normal">Step 9: Mood Engine Tagging</h2>
            <p className="text-xs text-stone-400 mt-1">Connect this creation to the storefront &ldquo;Find Your Look&rdquo; interactive mood selector.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MOODS.map((m) => {
              const isSelected = selectedMoods.includes(m.id);
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => {
                    setSelectedMoods((prev) =>
                      isSelected ? prev.filter((id) => id !== m.id) : [...prev, m.id]
                    );
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#C5A059] bg-[#C5A059]/10 shadow-lg'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl block mb-2">{m.emoji}</span>
                  <span className="text-sm font-semibold text-white block">{m.name}</span>
                  <span className="text-[10px] text-[#C5A059] block mb-1">{m.tagline}</span>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">{m.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 10: Hairstyles */}
      {currentStep === 10 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141311] border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="editorial-serif text-2xl text-white font-normal">Step 10: Virtual Hairstyle Simulator</h2>
            <p className="text-xs text-stone-400 mt-1">Assign hairstyles for &ldquo;See It In Your Hair&rdquo; styling recommendations.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {HAIRSTYLES.map((h) => {
              const isSelected = selectedHairstyles.includes(h.id);
              return (
                <button
                  type="button"
                  key={h.id}
                  onClick={() => {
                    setSelectedHairstyles((prev) =>
                      isSelected ? prev.filter((id) => id !== h.id) : [...prev, h.id]
                    );
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-white font-semibold'
                      : 'border-white/10 bg-white/5 text-stone-400 hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl">{h.icon}</span>
                  <div>
                    <span className="text-xs text-white font-medium block">{h.name}</span>
                    <span className="text-[10px] text-stone-500 font-mono">/{h.id}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 11: SEO */}
      {currentStep === 11 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141311] border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="editorial-serif text-2xl text-white font-normal">Step 11: Search Engine Optimization</h2>
            <p className="text-xs text-stone-400 mt-1">Configure metadata and review Google search results preview.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={`${name || 'Accessory'} | PRAYELLE Haute Hairwear`}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
                SEO Meta Description
              </label>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Shop the handcrafted luxury hairpiece. Complimentary express shipping and atelier gift packaging on orders above ₹999."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
              />
            </div>

            {/* Google SERP Snippet Preview */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">
                Google Search Engine Result Snippet Preview
              </span>
              <span className="text-xs text-blue-400 font-medium block truncate">
                https://prayele.com/product/{slug || 'luna-sculpted-claw'}
              </span>
              <span className="text-sm text-amber-200/90 font-medium block">
                {seoTitle || `${name || 'Product Title'} | PRAYELLE Haute Hairwear`}
              </span>
              <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                {seoDescription || shortDescription || description || 'Luxury handcrafted hair accessories made with premium Italian acetate and mulberry silk.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 12: Preview */}
      {currentStep === 12 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141311] border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="editorial-serif text-2xl text-white font-normal">Step 12: Live Editorial Preview</h2>
            <p className="text-xs text-stone-400 mt-1">Review the product presentation exactly as customers will see it on the storefront.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10">
              <Image
                src={images[0]?.url || '/images/products/claw-clip.jpg'}
                alt={name || 'Product'}
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#C5A059] text-black text-[10px] font-semibold uppercase tracking-wider">
                New Runway
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium block">
                  {category} • {subCategory}
                </span>
                <h3 className="editorial-serif text-3xl font-light text-white mt-1">
                  {name || 'Product Title Preview'}
                </h3>
                <p className="text-xs text-stone-400 mt-1">{shortDescription || 'Artisanal haute hairwear piece'}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl font-light text-white">₹{basePrice}</span>
                {compareAtPrice > basePrice && (
                  <span className="text-sm text-stone-500 line-through">₹{compareAtPrice}</span>
                )}
              </div>

              {/* Swatches */}
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1.5">
                  Available Color Finishes ({variants.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                      <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: v.colorHex }} />
                      <span className="text-stone-300 text-[11px]">{v.color}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                <div className="flex justify-between text-stone-400">
                  <span>Material:</span>
                  <strong className="text-white font-medium">{material}</strong>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Hold Strength:</span>
                  <strong className="text-white font-medium">{holdStrength}</strong>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Stock Status:</span>
                  <strong className="text-emerald-400 font-medium">In Stock ({variants.reduce((s, v) => s + v.stock, 0)} units)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 13: Publish */}
      {currentStep === 13 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141311] border border-white/10 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center mx-auto text-[#C5A059]">
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <h2 className="editorial-serif text-3xl text-white font-normal">Step 13: Ready to Launch</h2>
            <p className="text-xs text-stone-400 mt-2 max-w-md mx-auto leading-relaxed">
              Your creation has been verified across all 12 stages. Publishing immediately writes the record to PostgreSQL, initializes inventory transactions, and showcases the product on the storefront.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handlePublish(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/20 text-xs font-semibold uppercase tracking-wider text-stone-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Save as Atelier Draft
            </button>
            <button
              onClick={() => handlePublish(true)}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#C5A059] text-black text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Launch Live on Runway</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Step Navigation Bar */}
      <div className="flex items-center justify-between p-4 bg-[#141311] rounded-2xl border border-white/10 sticky bottom-4 shadow-2xl z-30">
        <button
          type="button"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 rounded-full border border-white/10 text-xs font-medium text-stone-300 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <span className="text-xs text-stone-400 font-mono">
          Phase {currentStep} / {STEPS.length}
        </span>

        {currentStep < 13 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.min(13, prev + 1))}
            className="px-5 py-2 rounded-full bg-[#C5A059] text-black text-xs font-semibold uppercase tracking-wider hover:opacity-90 flex items-center gap-1.5 transition-all shadow-md"
          >
            <span>Next: {STEPS[currentStep].title}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handlePublish(true)}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-full bg-[#C5A059] text-black text-xs font-semibold uppercase tracking-wider hover:opacity-90 flex items-center gap-1.5 transition-all shadow-md"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Launch Now</span>
          </button>
        )}
      </div>
    </div>
  );
}
