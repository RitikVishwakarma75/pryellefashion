import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/services/productService';
import ProductPageClient from './ProductPageClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

interface ProductImageRef {
  isPrimary?: boolean;
  url?: string;
  media?: { url?: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Accessory Not Found | PRAYELE Haute Hairwear',
    };
  }

  const images = (product.images || []) as ProductImageRef[];
  const findPrimary = images.find((img) => img.isPrimary);
  const firstImage = images[0];
  const primaryImage =
    findPrimary?.media?.url ||
    findPrimary?.url ||
    firstImage?.media?.url ||
    firstImage?.url ||
    '/images/products/claw-clip.jpg';

  return {
    title: `${product.name} • PRAYELE Haute Hairwear`,
    description: product.shortDescription || product.description.substring(0, 160),
    openGraph: {
      title: `${product.name} | PRAYELE`,
      description: product.description.substring(0, 160),
      images: [{ url: primaryImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | PRAYELE`,
      description: product.description.substring(0, 160),
      images: [primaryImage],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch complementary related products from the same category
  const relatedProducts = await getProducts({
    megaCategory: product.category?.parent?.slug || product.category?.slug,
    limit: 4,
  });

  return (
    <ProductPageClient
      product={product}
      relatedProducts={relatedProducts.filter((p: { id: string }) => p.id !== product.id)}
    />
  );
}
