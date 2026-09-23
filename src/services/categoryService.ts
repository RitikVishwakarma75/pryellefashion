import prisma from '@/lib/prisma';
import { CATEGORIES } from '@/data/categories';

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null, isActive: true },
      include: {
        subCategories: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    if (categories.length > 0) return categories;
  } catch (error) {
    console.warn('Database query failed in getCategories, using local categories:', (error as Error).message);
  }

  // Local fallback
  return CATEGORIES.map((c, idx) => ({
    id: c.id,
    name: c.name,
    slug: c.id,
    description: c.supportingText,
    image: null,
    parentId: null,
    sortOrder: idx,
    isActive: true,
    subCategories: c.subFilters.map((sub, sIdx) => ({
      id: sub.id,
      name: sub.label,
      slug: sub.id,
      description: null,
      image: null,
      parentId: c.id,
      sortOrder: sIdx,
      isActive: true,
    })),
    _count: { products: 0 },
  }));
}

export async function createCategory(data: {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId?: string;
  sortOrder?: number;
}) {
  const slug = (data.slug || data.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      parentId: data.parentId,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}
