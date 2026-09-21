import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getShopifyProductByHandle } from '@/lib/shopify';
import { shopifyProductToProduct } from '@/lib/shopifyAdapter';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;

  // Try Shopify first
  let title = 'Haute Hairwear Creation';
  let description = 'Handcrafted luxury hair accessory from Prayele Atelier.';

  try {
    const shopifyProduct = await getShopifyProductByHandle(handle);
    if (shopifyProduct) {
      title = `${shopifyProduct.title} • PRAYELE Haute Hairwear`;
      description = shopifyProduct.description || description;
    } else {
      const fallback = PRODUCTS.find((p) => p.id === handle);
      if (fallback) {
        title = `${fallback.name} • PRAYELE Haute Hairwear`;
        description = fallback.description;
      }
    }
  } catch {
    // Ignore fetch error in metadata
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;

  let product: Product | null = null;

  // 1. Attempt to fetch from real Shopify Storefront API
  try {
    const shopifyProduct = await getShopifyProductByHandle(handle);
    if (shopifyProduct) {
      product = shopifyProductToProduct(shopifyProduct);
    }
  } catch {
    // Graceful fallback to static catalog
  }

  // 2. Fallback to local catalog if not in Shopify
  if (!product) {
    const fallback = PRODUCTS.find(
      (p) => p.id === handle || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === handle
    );
    if (fallback) {
      product = fallback;
    }
  }

  // 3. Graceful handling of invalid product handles
  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-24 text-center">
        <span className="caps-subtitle text-xs text-[var(--theme-accent)] mb-2">
          PRAYELE ARCHIVE
        </span>
        <h1 className="editorial-serif text-3xl sm:text-5xl font-light text-[var(--theme-text)] mb-4">
          Creation Not Found
        </h1>
        <p className="text-sm text-[var(--theme-text-muted)] max-w-md mb-8 leading-relaxed">
          The accessory with handle &ldquo;{handle}&rdquo; could not be retrieved or is no longer available in the boutique.
        </p>
        <a
          href="/#product-showcase"
          className="px-8 py-3 rounded-full bg-[var(--theme-text)] text-[var(--theme-bg)] text-xs font-medium tracking-wider uppercase hover:opacity-90 transition-opacity shadow-md"
        >
          Explore Current Catalog
        </a>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
