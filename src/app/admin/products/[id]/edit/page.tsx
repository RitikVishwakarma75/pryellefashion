import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/services/productService';
import EditProductForm from './EditProductForm';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductBySlug(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-6 border-b border-white/10">
        <h1 className="editorial-serif text-3xl font-light text-white">
          Edit Product: {product.name}
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Modify pricing, artisan specifications, stock, and runway status. Changes reflect immediately on storefront.
        </p>
      </div>

      <EditProductForm product={product} />
    </div>
  );
}
