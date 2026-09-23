import prisma from '@/lib/prisma';
import { MOODS } from '@/data/moods';

export async function getMoods() {
  try {
    const moods = await prisma.mood.findMany({
      where: { isActive: true },
      include: {
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

    if (moods.length > 0) return moods;
  } catch (error) {
    console.warn('Database query failed in getMoods, using fallback:', (error as Error).message);
  }

  return MOODS.map((m) => ({
    id: m.id,
    name: m.name,
    slug: m.id,
    emoji: m.emoji,
    tagline: m.tagline,
    description: m.description,
    image: m.editorialImage,
    stylingTip: m.hairstyleTip,
    discountPercent: 0.2,
    isActive: true,
    products: [],
  }));
}

export async function createMood(data: {
  name: string;
  slug?: string;
  emoji?: string;
  tagline?: string;
  description: string;
  image?: string;
  stylingTip?: string;
  discountPercent?: number;
}) {
  const slug = (data.slug || data.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return prisma.mood.create({
    data: {
      name: data.name,
      slug,
      emoji: data.emoji,
      tagline: data.tagline,
      description: data.description,
      image: data.image,
      stylingTip: data.stylingTip,
      discountPercent: data.discountPercent ?? 0.2,
    },
  });
}
