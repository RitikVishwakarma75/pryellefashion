'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  Heart,
  ShoppingBag,
  Sparkles,
  Truck,
  RefreshCw,
  ShieldCheck,
  Star,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Product as StorefrontProduct } from '@/types';
import ProductCard from '@/components/showcase/ProductCard';
import type { Prisma } from '@prisma/client';

interface ClientProductVariant {
  id: string;
  name: string;
  sku?: string | null;
  color?: string | null;
  colorHex?: string | null;
  price: number | Prisma.Decimal;
  compareAtPrice?: number | Prisma.Decimal | null;
  stock?: number;
  stockQuantity?: number;
}

interface ClientProductImage {
  id?: string;
  url?: string;
  altText?: string | null;
  media?: {
    url: string;
    altText?: string | null;
  } | null;
}

interface ClientProductData {
  id: string;
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  basePrice: number | Prisma.Decimal;
  compareAtPrice?: number | Prisma.Decimal | null;
  material?: string | null;
  holdStrength?: string | null;
  hairTypes?: string[];
  dimensions?: string | null;
  brand?: string | null;
  isFeatured?: boolean;
  category?: { name?: string; slug?: string; parent?: { slug?: string } | null } | null;
  collections?: Array<{ collection?: { slug?: string } }>;
  variants?: ClientProductVariant[];
  images?: ClientProductImage[];
}

interface ProductPageClientProps {
  product: ClientProductData;
  relatedProducts: ClientProductData[];
}

export default function ProductPageClient({
  product,
  relatedProducts,
}: ProductPageClientProps) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, setIsCheckoutOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWished = isInWishlist(product.id);
  const activeVariant: ClientProductVariant = product.variants?.[selectedVariantIdx] || product.variants?.[0] || {
    id: `${product.id}-default`,
    name: 'Standard',
    color: 'Standard',
    colorHex: '#C5A059',
    price: product.basePrice,
    stock: 20,
  };

  const images: ClientProductImage[] = product.images && product.images.length > 0
    ? product.images
    : [{ url: '/images/products/claw-clip.jpg', altText: product.name }];

  const currentImage = images[selectedImageIdx] || images[0];

  const getImageUrl = (img?: ClientProductImage) =>
    img?.url || img?.media?.url || '/images/products/claw-clip.jpg';

  const currentImageUrl = getImageUrl(currentImage);
  const currentImageAlt = currentImage.altText || currentImage.media?.altText || product.name;

  const adaptedProduct: StorefrontProduct = {
    id: product.id,
    name: product.name,
    subtitle: product.shortDescription || '',
    megaCategory: (product.category?.parent?.slug || product.category?.slug || 'clips-clutches') as StorefrontProduct['megaCategory'],
    subCategory: (product.category?.slug || 'claw-clip') as StorefrontProduct['subCategory'],
    collection: (product.collections?.[0]?.collection?.slug || 'everyday') as StorefrontProduct['collection'],
    price: Number(activeVariant.price || product.basePrice),
    originalPrice: activeVariant.compareAtPrice ? Number(activeVariant.compareAtPrice) : product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
    description: product.description || '',
    editorialNote: 'Hand-sculpted in our heritage atelier.',
    material: product.material || 'Artisanal Cellulose Acetate',
    dimensions: product.dimensions || '10.5 cm',
    holdStrength: (product.holdStrength || 'Medium') as StorefrontProduct['holdStrength'],
    hairTypes: product.hairTypes || ['All Hair Types'],
    colors: product.variants?.map((v) => ({
      name: v.color || v.name,
      hex: v.colorHex || '#C5A059',
      image: currentImageUrl,
    })) || [{ name: 'Standard', hex: '#C5A059', image: currentImageUrl }],
    rating: 4.9,
    reviewsCount: 148,
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    const color = {
      name: activeVariant.color || activeVariant.name,
      hex: activeVariant.colorHex || '#C5A059',
      image: currentImageUrl,
    };

    addToCart(adaptedProduct, color, quantity, e);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    handleAddToCart(e);
    setTimeout(() => {
      setIsCheckoutOpen(true);
    }, 500);
  };

  const basePriceNum = Number(product.basePrice) || 0;
  const compareAtPriceNum = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const discountPercent =
    compareAtPriceNum && compareAtPriceNum > basePriceNum
      ? Math.round(((compareAtPriceNum - basePriceNum) / compareAtPriceNum) * 100)
      : 0;

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Editorial Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[11px] text-[var(--theme-text-muted)] uppercase tracking-wider mb-8">
        <Link href="/" className="hover:text-[var(--theme-text)] transition-colors">
          Atelier
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/#product-showcase" className="hover:text-[var(--theme-text)] transition-colors">
          {product.category?.name || 'Collections'}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--theme-text)] font-semibold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Vertical Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto no-scrollbar shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIdx === idx
                      ? 'border-[var(--theme-accent)] shadow-md scale-105'
                      : 'border-black/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={getImageUrl(img)}
                    alt={img.altText || img.media?.altText || product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image Display */}
          <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-gradient-to-b from-stone-100 to-stone-200/50">
            <Image
              src={currentImageUrl}
              alt={currentImageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 650px"
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isFeatured && (
                <span className="glass-pill px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase text-[var(--theme-text)] shadow-sm">
                  Runway Bestseller
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Floating Wishlist Button */}
            <button
              onClick={() => toggleWishlist(adaptedProduct)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full glass-pill flex items-center justify-center transition-all ${
                isWished ? 'bg-rose-50 text-rose-500 shadow-md' : 'text-stone-800 hover:scale-110'
              }`}
              aria-label="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right Column: Artisan Details & Action */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
              <span className="caps-subtitle text-xs text-[var(--theme-accent)] font-semibold tracking-widest">
                {product.brand || 'PRAYELE'} • Haute Edition
              </span>
            </div>

            <h1 className="editorial-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--theme-text)] leading-tight mb-2">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="text-sm text-[var(--theme-accent)] font-medium mb-4">
                {product.shortDescription}
              </p>
            )}

            {/* Rating Stars */}
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-black/5">
              <div className="flex items-center text-[var(--theme-accent)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[var(--theme-text)]">4.9 / 5.0</span>
              <span className="text-xs text-[var(--theme-text-muted)]">
                (Based on 148 verified client evaluations)
              </span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="editorial-serif text-3xl sm:text-4xl font-semibold text-[var(--theme-text)]">
                ₹{Number(activeVariant.price || product.basePrice).toLocaleString('en-IN')}
              </span>
              {(activeVariant.compareAtPrice || product.compareAtPrice) && (
                <span className="text-base line-through text-[var(--theme-text-muted)]">
                  ₹{Number(activeVariant.compareAtPrice || product.compareAtPrice).toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                In Stock • Dispatches in 24h
              </span>
            </div>

            {/* Color Finish Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-semibold uppercase tracking-wider text-[var(--theme-text)]">
                    Color Finish: <strong className="font-normal text-[var(--theme-accent)]">{activeVariant.color || activeVariant.name}</strong>
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {(activeVariant.stock ?? activeVariant.stockQuantity ?? 10) > 0
                      ? `${activeVariant.stock ?? activeVariant.stockQuantity ?? 10} available`
                      : 'Sold out'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => {
                    const isSelected = selectedVariantIdx === idx;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantIdx(idx)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs transition-all ${
                          isSelected
                            ? 'border-black bg-white shadow-md font-semibold text-[var(--theme-text)]'
                            : 'border-black/15 hover:border-black/40 text-[var(--theme-text-muted)]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: v.colorHex || '#C5A059' }}
                        />
                        <span>{v.color || v.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & CTA Bar */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-black/15 rounded-full px-3 py-2 gap-3 bg-stone-50/80">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-stone-500 hover:text-black font-semibold text-sm w-5 h-5 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-xs font-semibold w-4 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-stone-500 hover:text-black font-semibold text-sm w-5 h-5 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] text-xs font-semibold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • ₹{(Number(activeVariant.price || product.basePrice) * quantity).toLocaleString('en-IN')}</span>
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 rounded-full bg-[#C5A059] text-black text-xs font-semibold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Express Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Editorial Description */}
            <div className="space-y-4 pt-4 border-t border-black/5">
              <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] leading-relaxed font-normal">
                {product.description}
              </p>

              {/* Specifications Box */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50/70 border border-black/5 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                    Material Composition
                  </span>
                  <strong className="text-stone-800 font-medium">{product.material}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                    Hold Strength
                  </span>
                  <strong className="text-stone-800 font-medium">{product.holdStrength || 'Medium'}</strong>
                </div>
                {product.dimensions && (
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                      Dimensions
                    </span>
                    <strong className="text-stone-800 font-medium">{product.dimensions}</strong>
                  </div>
                )}
                {product.hairTypes && product.hairTypes.length > 0 && (
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                      Suitable Hair Textures
                    </span>
                    <strong className="text-stone-800 font-medium">
                      {product.hairTypes.join(', ')}
                    </strong>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-[11px] text-stone-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
                  <span>Free Courier over ₹999</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
                  <span>14-Day Easy Exchange</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--theme-accent)] shrink-0" />
                  <span>Atelier Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-24 pt-16 border-t border-black/5">
          <div className="text-center mb-10">
            <span className="caps-subtitle text-[10px] tracking-widest text-[var(--theme-accent)] font-semibold">
              Complete Your Styling Wardrobe
            </span>
            <h2 className="editorial-serif text-3xl sm:text-4xl font-normal text-[var(--theme-text)] mt-1">
              Complementary Runway Pieces
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <ProductCard
                key={rel.id}
                product={{
                  id: rel.id,
                  name: rel.name,
                  subtitle: rel.shortDescription || '',
                  megaCategory: (rel.category?.parent?.slug || 'clips-clutches') as StorefrontProduct['megaCategory'],
                  subCategory: (rel.category?.slug || 'claw-clip') as StorefrontProduct['subCategory'],
                  collection: 'everyday',
                  price: Number(rel.basePrice),
                  originalPrice: rel.compareAtPrice ? Number(rel.compareAtPrice) : undefined,
                  description: rel.description || '',
                  editorialNote: '',
                  material: rel.material || 'Artisanal Cellulose Acetate',
                  dimensions: rel.dimensions || '',
                  holdStrength: (rel.holdStrength || 'Medium') as StorefrontProduct['holdStrength'],
                  hairTypes: rel.hairTypes || [],
                  colors: rel.variants?.map((v) => ({
                    name: v.color || v.name,
                    hex: v.colorHex || '#C5A059',
                    image: getImageUrl(rel.images?.[0]),
                  })) || [{ name: 'Standard', hex: '#C5A059', image: getImageUrl(rel.images?.[0]) }],
                  rating: 4.9,
                  reviewsCount: 110,
                }}
                onQuickView={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
