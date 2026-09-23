import { NextResponse } from 'next/server';
import { createOrder, getOrders } from '@/services/orderService';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST — Create a new order
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await getCurrentUser();

    const order = await createOrder({
      userId: user?.userId,
      guestEmail: body.guestEmail,
      guestPhone: body.guestPhone,
      guestName: body.guestName,
      shippingAddressText: body.shippingAddress || '',
      shippingAddressId: body.shippingAddressId,
      couponCode: body.couponCode,
      items: body.items || [],
      paymentProvider: body.paymentProvider || 'COD',
      razorpayPaymentId: body.razorpayPaymentId,
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// GET — List orders for current user or all (admin)
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (user.role === 'ADMIN' || user.role === 'STAFF') {
      const orders = await getOrders();
      return NextResponse.json({ success: true, orders });
    }

    // Customer: only their own orders
    const orders = await prisma.order.findMany({
      where: { userId: user.userId },
      include: {
        items: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
