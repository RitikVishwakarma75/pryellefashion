import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { cartService } from '@/services/cartService';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('prayele_cart_session')?.value;
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    cookieStore.set('prayele_cart_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }
  return sessionId;
}

// GET — Fetch current cart
export async function GET() {
  try {
    const user = await getCurrentUser();
    const sessionId = await getSessionId();
    const cart = await cartService.getOrCreateCart(sessionId, user?.userId);

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST — Add item to cart
export async function POST(req: Request) {
  try {
    const { productId, variantId, quantity } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    const sessionId = await getSessionId();
    const cart = await cartService.getOrCreateCart(sessionId, user?.userId);

    if (!cart) {
      return NextResponse.json(
        { error: 'Failed to create cart' },
        { status: 500 }
      );
    }

    const result = await cartService.addItem(
      cart.id,
      productId,
      variantId,
      quantity || 1
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Return updated cart
    const updatedCart = await cartService.getOrCreateCart(
      sessionId,
      user?.userId
    );
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PATCH — Update item quantity
export async function PATCH(req: Request) {
  try {
    const { itemId, quantity } = await req.json();

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'itemId and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      // Remove item
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    // Recalculate
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId },
      select: { cartId: true },
    });

    if (item) {
      await cartService.recalculateCartTotals(item.cartId);
    }

    const user = await getCurrentUser();
    const sessionId = await getSessionId();
    const updatedCart = await cartService.getOrCreateCart(
      sessionId,
      user?.userId
    );

    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE — Remove item from cart
export async function DELETE(req: Request) {
  try {
    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json(
        { error: 'itemId is required' },
        { status: 400 }
      );
    }

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId },
      select: { cartId: true },
    });

    await prisma.cartItem.delete({ where: { id: itemId } });

    if (item) {
      await cartService.recalculateCartTotals(item.cartId);
    }

    const user = await getCurrentUser();
    const sessionId = await getSessionId();
    const updatedCart = await cartService.getOrCreateCart(
      sessionId,
      user?.userId
    );

    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
