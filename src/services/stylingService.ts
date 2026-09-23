import prisma from '@/lib/prisma';
import { HAIRSTYLES, STYLING_MATRIX } from '@/data/stylingMatrix';

export async function getHairstylesWithCombinations() {
  try {
    const hairstyles = await prisma.hairstyle.findMany({
      where: { isActive: true },
      include: {
        combinations: {
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

    if (hairstyles.length > 0) return hairstyles;
  } catch (error) {
    console.warn('Database query failed in getHairstylesWithCombinations, using fallback:', (error as Error).message);
  }

  // Local fallback
  return HAIRSTYLES.map((h) => ({
    id: h.id,
    name: h.name,
    slug: h.id,
    description: `Signature editorial ${h.name} technique.`,
    image: null,
    stylingTime: '1 minute',
    difficulty: 'Effortless',
    stylistTip: '',
    isActive: true,
    combinations: Object.keys(STYLING_MATRIX)
      .filter((k) => STYLING_MATRIX[k].hairstyle === h.id)
      .map((k) => ({
        id: k,
        hairstyleId: h.id,
        productId: STYLING_MATRIX[k].recommendedProductId,
        accessoryName: STYLING_MATRIX[k].accessory,
        image: STYLING_MATRIX[k].modelImage,
        stylingTime: STYLING_MATRIX[k].timeToStyle,
        difficulty: STYLING_MATRIX[k].difficulty,
        stylistTip: STYLING_MATRIX[k].stylistSecret,
        product: null,
      })),
  }));
}
