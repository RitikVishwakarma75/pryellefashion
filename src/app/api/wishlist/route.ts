import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

function getGuestSessionId(cookieStore: Awaited<ReturnType<typeof cookies>>): string | null {
  return cookieStore.get('prayele_cart_session')?.value || null;
}

// GET — Fetch wishlist items strictly isolated by user
export async function GET() {
  try {
    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const sessionId = getGuestSessionId(cookieStore);

    const where = user
      ? { userId: user.userId }
      : sessionId
        ? { sessionId, userId: null }
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

// POST — Add product to wishlist or merge on login
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const sessionId = getGuestSessionId(cookieStore);
    const body = await req.json();

    // Support merging guest wishlist on login
    if (body.action === 'merge' && user && sessionId) {
      const guestItems = await prisma.wishlistItem.findMany({
        where: { sessionId, userId: null },
      });

      for (const item of guestItems) {
        const exists = await prisma.wishlistItem.findFirst({
          where: { userId: user.userId, productId: item.productId },
        });

        if (!exists) {
          await prisma.wishlistItem.update({
            where: { id: item.id },
            data: { userId: user.userId, sessionId: null },
          });
        } else {
          await prisma.wishlistItem.delete({ where: { id: item.id } });
        }
      }

      return NextResponse.json({ success: true, action: 'merged' });
    }

    const { productId } = body;
    if (!productId) {
      return NextResponse.json({ error: 'productId required' }, { status: 400 });
    }

    // Check for existing
    const existing = await prisma.wishlistItem.findFirst({
      where: user
        ? { userId: user.userId, productId }
        : sessionId
          ? { sessionId, userId: null, productId }
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

// DELETE — Remove from wishlist with strict owner verification
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
          ? { sessionId, userId: null, productId }
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
