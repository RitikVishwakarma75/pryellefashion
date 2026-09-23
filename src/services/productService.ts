import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { PRODUCTS } from '@/data/products';

export interface ProductFilters {
  megaCategory?: string;
  subCategory?: string;
  collection?: string;
  mood?: string;
  search?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  limit?: number;
  offset?: number;
  isActive?: boolean;
}

/**
 * Fetch products from database with automatic fallback to static data if database is offline
 */
export async function getProducts(filters: ProductFilters = {}) {
  try {
    const where: Prisma.ProductWhereInput = {};

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    } else {
      where.isActive = true;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { material: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.subCategory && filters.subCategory !== 'all') {
      where.category = { slug: filters.subCategory };
    } else if (filters.megaCategory && filters.megaCategory !== 'all') {
      where.OR = [
        { category: { slug: filters.megaCategory } },
        { category: { parent: { slug: filters.megaCategory } } },
      ];
    }

    if (filters.collection) {
      where.collections = {
        some: { collection: { slug: filters.collection } },
      };
    }

    if (filters.mood) {
      where.moods = {
        some: { mood: { slug: filters.mood } },
      };
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (filters.sortBy === 'price-asc') orderBy = { basePrice: 'asc' };
    else if (filters.sortBy === 'price-desc') orderBy = { basePrice: 'desc' };

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: { where: { isActive: true } },
        images: { include: { media: true }, orderBy: { sortOrder: 'asc' } },
        collections: { include: { collection: true } },
        moods: { include: { mood: true } },
      },
      orderBy,
      take: filters.limit,
      skip: filters.offset,
    });

    if (products.length > 0) {
      return products;
    }
  } catch (error) {
    console.warn('Database query failed in getProducts, using local fallback:', (error as Error).message);
  }

  // Graceful local fallback for local development without DB provisioned
  let localFiltered = [...PRODUCTS];

  if (filters.megaCategory && filters.megaCategory !== 'all') {
    localFiltered = localFiltered.filter((p) => p.megaCategory === filters.megaCategory);
  }
  if (filters.subCategory && filters.subCategory !== 'all') {
    localFiltered = localFiltered.filter((p) => p.subCategory === filters.subCategory);
  }
  if (filters.collection) {
    localFiltered = localFiltered.filter((p) => p.collection === filters.collection);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    localFiltered = localFiltered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
    );
  }

  if (filters.sortBy === 'price-asc') {
    localFiltered.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price-desc') {
    localFiltered.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'rating') {
    localFiltered.sort((a, b) => b.rating - a.rating);
  }

  // Transform local products into compatible shape
  return localFiltered.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.id,
    description: p.description,
    shortDescription: p.subtitle,
    basePrice: p.price,
    compareAtPrice: p.originalPrice || null,
    material: p.material,
    holdStrength: p.holdStrength,
    hairTypes: p.hairTypes,
    dimensions: p.dimensions,
    isFeatured: p.badge === 'Bestseller' || p.badge === 'Editorial Pick',
    isNew: p.badge === 'New Runway',
    isBestSeller: p.badge === 'Bestseller',
    isActive: true,
    brand: 'PRAYELE',
    category: { name: p.megaCategory, slug: p.megaCategory },
    variants: p.colors.map((c) => ({
      id: `${p.id}-${c.name}`,
      name: c.name,
      sku: `${p.id}-${c.name.toLowerCase().replace(/\s+/g, '-')}`,
      color: c.name,
      colorHex: c.hex,
      price: p.price,
      compareAtPrice: p.originalPrice || null,
      stock: 20,
    })),
    images: p.colors.map((c, i) => ({
      id: `${p.id}-img-${i}`,
      url: c.image,
      altText: p.name,
      isPrimary: i === 0,
      sortOrder: i,
    })),
  }));
}

/**
 * Fetch a single product by slug or ID
 */
export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        category: { include: { parent: true } },
        variants: { where: { isActive: true } },
        images: { include: { media: true }, orderBy: { sortOrder: 'asc' } },
        collections: { include: { collection: true } },
        moods: { include: { mood: true } },
        styleCombinations: { include: { hairstyle: true } },
      },
    });

    if (product) return product;
  } catch (error) {
    console.warn('Database query failed in getProductBySlug, checking local fallback:', (error as Error).message);
  }

  // Local fallback
  const local = PRODUCTS.find((p) => p.id === slug);
  if (!local) return null;

  return {
    id: local.id,
    name: local.name,
    slug: local.id,
    description: local.description,
    shortDescription: local.subtitle,
    basePrice: local.price,
    compareAtPrice: local.originalPrice || null,
    material: local.material,
    holdStrength: local.holdStrength,
    hairTypes: local.hairTypes,
    dimensions: local.dimensions,
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    isActive: true,
    brand: 'PRAYELE',
    category: { name: local.megaCategory, slug: local.megaCategory, parent: null },
    variants: local.colors.map((c) => ({
      id: `${local.id}-${c.name}`,
      name: c.name,
      sku: `${local.id}-${c.name.toLowerCase().replace(/\s+/g, '-')}`,
      color: c.name,
      colorHex: c.hex,
      price: local.price,
      compareAtPrice: local.originalPrice || null,
      stock: 20,
    })),
    images: local.colors.map((c, i) => ({
      id: `${local.id}-img-${i}`,
      url: c.image,
      altText: local.name,
      isPrimary: i === 0,
      sortOrder: i,
    })),
    collections: [],
    moods: [],
    styleCombinations: [],
  };
}

/**
 * Create a new product in the database (Admin wizard)
 */
export async function createProduct(data: {
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  categoryId?: string;
  basePrice: number;
  compareAtPrice?: number;
  material: string;
  holdStrength?: string;
  hairTypes?: string[];
  dimensions?: string;
  weight?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isActive?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  variants: Array<{
    name: string;
    sku: string;
    color: string;
    colorHex?: string;
    finish?: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
  }>;
  images: Array<{
    url: string;
    publicId?: string;
    altText?: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
  category?: string;
  collections?: string[];
  moods?: string[];
  collectionIds?: string[];
  moodIds?: string[];
}) {
  const generatedSlug = (data.slug || data.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let resolvedCategoryId = data.categoryId;
  const categoryIdentifier = data.categoryId || data.category;
  if (categoryIdentifier) {
    try {
      const cat = await prisma.category.findFirst({
        where: { OR: [{ id: categoryIdentifier }, { slug: categoryIdentifier }] },
      });
      if (cat) resolvedCategoryId = cat.id;
    } catch {
      // Ignore
    }
  }

  const collIdentifiers = data.collectionIds || data.collections || [];
  let resolvedCollIds: string[] = [];
  if (collIdentifiers.length > 0) {
    try {
      const cols = await prisma.collection.findMany({
        where: { OR: [{ id: { in: collIdentifiers } }, { slug: { in: collIdentifiers } }] },
      });
      resolvedCollIds = cols.map((c) => c.id);
    } catch {
      resolvedCollIds = collIdentifiers;
    }
  }

  const moodIdentifiers = data.moodIds || data.moods || [];
  let resolvedMoodIds: string[] = [];
  if (moodIdentifiers.length > 0) {
    try {
      const mds = await prisma.mood.findMany({
        where: { OR: [{ id: { in: moodIdentifiers } }, { slug: { in: moodIdentifiers } }] },
      });
      resolvedMoodIds = mds.map((m) => m.id);
    } catch {
      resolvedMoodIds = moodIdentifiers;
    }
  }

  return prisma.product.create({
    data: {
      name: data.name,
      slug: generatedSlug,
      description: data.description,
      shortDescription: data.shortDescription,
      categoryId: resolvedCategoryId,
      basePrice: data.basePrice,
      compareAtPrice: data.compareAtPrice,
      material: data.material,
      holdStrength: data.holdStrength,
      hairTypes: data.hairTypes || [],
      dimensions: data.dimensions,
      weight: data.weight,
      isFeatured: data.isFeatured ?? false,
      isNew: data.isNew ?? true,
      isBestSeller: data.isBestSeller ?? false,
      isActive: data.isActive ?? true,
      seoTitle: data.seoTitle || `${data.name} | PRAYELE`,
      seoDescription: data.seoDescription || data.description.substring(0, 160),
      variants: {
        create: data.variants.map((v) => ({
          name: v.name,
          sku: v.sku,
          color: v.color,
          colorHex: v.colorHex,
          finish: v.finish,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stockQuantity: v.stock || 15,
          reservedQuantity: 0,
          inventoryTransactions: {
            create: {
              type: 'RESTOCK',
              quantity: v.stock || 15,
              reference: 'INITIAL_ONBOARDING',
              reason: 'Initial variant inventory creation',
            },
          },
        })),
      },
      images: {
        create: data.images.map((img) => ({
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
          media: {
            create: {
              url: img.url,
              publicId: img.publicId,
              fileName: `${generatedSlug}-asset`,
              altText: img.altText || data.name,
            },
          },
        })),
      },
      collections: resolvedCollIds.length > 0
        ? {
            create: resolvedCollIds.map((cId) => ({
              collectionId: cId,
            })),
          }
        : undefined,
      moods: resolvedMoodIds.length > 0
        ? {
            create: resolvedMoodIds.map((mId) => ({
              moodId: mId,
            })),
          }
        : undefined,
    },
    include: {
      variants: true,
      images: true,
    },
  });
}

/**
 * Update an existing product
 */
export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    shortDescription: string;
    categoryId: string;
    basePrice: number;
    compareAtPrice: number;
    material: string;
    holdStrength: string;
    hairTypes: string[];
    dimensions: string;
    isActive: boolean;
    isFeatured: boolean;
    isBestSeller: boolean;
    seoTitle: string;
    seoDescription: string;
  }>
) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

/**
 * Toggle product active status
 */
export async function toggleProductActive(id: string, isActive: boolean) {
  return prisma.product.update({
    where: { id },
    data: { isActive },
  });
}

/**
 * Get low stock products
 */
export async function getLowStockProducts(threshold = 5) {
  try {
    return await prisma.productVariant.findMany({
      where: {
        stockQuantity: { lte: threshold },
        isActive: true,
      },
      include: {
        product: { select: { name: true, slug: true, basePrice: true } },
      },
      orderBy: { stockQuantity: 'asc' },
    });
  } catch {
    return [];
  }
}
