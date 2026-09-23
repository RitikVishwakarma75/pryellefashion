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

// GET — Fetch current isolated cart
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

// POST — Add item or merge carts
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const sessionId = await getSessionId();
    const body = await req.json();

    // Handle guest-to-member cart merge
    if (body.action === 'merge' && user) {
      const guestSessionId = body.guestSessionId || sessionId;
      if (guestSessionId) {
        await cartService.mergeGuestCart(guestSessionId, user.userId);
      }
      const mergedCart = await cartService.getOrCreateCart(sessionId, user.userId);
      return NextResponse.json({ success: true, cart: mergedCart });
    }

    const { productId, variantId, quantity } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

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

    const updatedCart = await cartService.getOrCreateCart(sessionId, user?.userId);
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PATCH — Update item quantity with ownership verification
export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    const sessionId = await getSessionId();
    const cart = await cartService.getOrCreateCart(sessionId, user?.userId);

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const { itemId, quantity } = await req.json();

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'itemId and quantity are required' },
        { status: 400 }
      );
    }

    // Verify item belongs strictly to THIS cart
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    await cartService.recalculateCartTotals(cart.id);

    const updatedCart = await cartService.getOrCreateCart(sessionId, user?.userId);
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE — Remove item or clear cart with ownership verification
export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    const sessionId = await getSessionId();
    const cart = await cartService.getOrCreateCart(sessionId, user?.userId);

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));

    if (body.clearAll) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
      await cartService.recalculateCartTotals(cart.id);
      const updatedCart = await cartService.getOrCreateCart(sessionId, user?.userId);
      return NextResponse.json({ success: true, cart: updatedCart });
    }

    const { itemId } = body;
    if (!itemId) {
      return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
    }

    // Verify item belongs strictly to this user's cart
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });
    await cartService.recalculateCartTotals(cart.id);

    const updatedCart = await cartService.getOrCreateCart(sessionId, user?.userId);
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
