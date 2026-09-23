import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

function getGuestSessionId(cookieStore: Awaited<ReturnType<typeof cookies>>): string | null {
  return cookieStore.get('prayele_cart_session')?.value || null;
}

// GET — Fetch wishlist items
export async function GET() {
  try {
    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const sessionId = getGuestSessionId(cookieStore);

    const where = user
      ? { userId: user.userId }
      : sessionId
        ? { sessionId }
        : { userId: '__none__' };

    const items = await prisma.wishlistItem.findMany({
      where,
      include: {
        product: {
          include: {
            images: {
              include: { media: true },
              where: { isPrimary: true },
              take: 1,
            },
            variants: {
              where: { isActive: true },
              take: 4,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// POST — Add product to wishlist
export async function POST(req: Request) {
  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400 });
    }

    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const sessionId = getGuestSessionId(cookieStore);

    // Check for existing
    const existing = await prisma.wishlistItem.findFirst({
      where: user
        ? { userId: user.userId, productId }
        : sessionId
          ? { sessionId, productId }
          : { userId: '__none__', productId },
    });

    if (existing) {
      return NextResponse.json({ success: true, action: 'already_exists' });
    }

    await prisma.wishlistItem.create({
      data: {
        userId: user?.userId || null,
        sessionId: user ? null : sessionId,
        productId,
      },
    });

    return NextResponse.json({ success: true, action: 'added' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE — Remove from wishlist
export async function DELETE(req: Request) {
  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400 });
    }

    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const sessionId = getGuestSessionId(cookieStore);

    const item = await prisma.wishlistItem.findFirst({
      where: user
        ? { userId: user.userId, productId }
        : sessionId
          ? { sessionId, productId }
          : { userId: '__none__', productId },
    });

    if (item) {
      await prisma.wishlistItem.delete({ where: { id: item.id } });
    }

    return NextResponse.json({ success: true, action: 'removed' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
