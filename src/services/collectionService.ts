import prisma from '@/lib/prisma';
import { COLLECTIONS } from '@/data/collections';

export async function getCollections() {
  try {
    const collections = await prisma.collection.findMany({
      where: { isActive: true },
      include: {
        imageMedia: true,
        bannerMedia: true,
        products: {
          include: {
            product: {
              include: {
                variants: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (collections.length > 0) {
      return collections.map((col) => ({
        ...col,
        image: col.imageMedia?.url || null,
        bannerImage: col.bannerMedia?.url || null,
      }));
    }
  } catch (error) {
    console.warn('Database query failed in getCollections, using fallback:', (error as Error).message);
  }

  return COLLECTIONS.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.id,
    description: `${c.tagline} — ${c.ethos}`,
    image: c.heroImage,
    bannerImage: c.heroImage,
    isFeatured: true,
    isActive: true,
    products: [],
  }));
}

export async function createCollection(data: {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  bannerImage?: string;
  isFeatured?: boolean;
}) {
  const slug = (data.slug || data.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return prisma.collection.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      isFeatured: data.isFeatured ?? false,
    },
  });
}
