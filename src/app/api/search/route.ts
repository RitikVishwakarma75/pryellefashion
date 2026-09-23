import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, products: [], categories: [], collections: [] });
    }

    const [products, categories, collections] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { material: { contains: q, mode: 'insensitive' } },
            { productType: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          basePrice: true,
          compareAtPrice: true,
          productType: true,
          material: true,
          isFeatured: true,
          isNew: true,
          images: {
            include: { media: true },
            where: { isPrimary: true },
            take: 1,
          },
        },
        take: 12,
        orderBy: { isFeatured: 'desc' },
      }),
      prisma.category.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, slug: true },
        take: 5,
      }),
      prisma.collection.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, slug: true },
        take: 5,
      }),
    ]);

    return NextResponse.json({ success: true, products, categories, collections });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
