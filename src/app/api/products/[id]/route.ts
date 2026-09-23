import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateProduct } from '@/services/productService';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const updated = await updateProduct(id, body);

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Duplicate product
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const original = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        images: true,
      },
    });

    if (!original) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const duplicated = await prisma.product.create({
      data: {
        name: `${original.name} (Copy)`,
        slug: `${original.slug}-copy-${randomSuffix}`,
        description: original.description,
        shortDescription: original.shortDescription,
        categoryId: original.categoryId,
        material: original.material,
        basePrice: original.basePrice,
        compareAtPrice: original.compareAtPrice,
        holdStrength: original.holdStrength,
        hairTypes: original.hairTypes,
        dimensions: original.dimensions,
        weight: original.weight,
        isActive: false, // draft by default
        variants: {
          create: original.variants.map((v) => ({
            name: v.name,
            sku: `${v.sku}-COPY-${randomSuffix}`,
            color: v.color,
            colorHex: v.colorHex,
            finish: v.finish,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            stockQuantity: v.stockQuantity,
          })),
        },
        images: {
          create: original.images.map((img) => ({
            mediaId: img.mediaId,
            type: img.type,
            sortOrder: img.sortOrder,
            isPrimary: img.isPrimary,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, product: duplicated });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
