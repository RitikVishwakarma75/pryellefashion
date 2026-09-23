import { MetadataRoute } from 'next';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { getCollections } from '@/services/collectionService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://prayele.com';

  const [products, categories, collections] = await Promise.all([
    getProducts({ limit: 100 }),
    getCategories(),
    getCollections(),
  ]);

  const productUrls = products.map((p: { slug?: string }) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((c: { slug?: string }) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const collectionUrls = collections.map((col: { slug?: string }) => ({
    url: `${baseUrl}/collection/${col.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...productUrls,
    ...categoryUrls,
    ...collectionUrls,
  ];
}
