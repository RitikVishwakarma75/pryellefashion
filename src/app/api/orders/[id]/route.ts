import { NextResponse } from 'next/server';
import { getOrderById } from '@/services/orderService';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Authorization: only owner or admin
    const user = await getCurrentUser();
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'STAFF';
    const isOwner = user?.userId === order.userId;
    const isGuestOrder = !order.userId; // Guest orders viewable with direct link

    if (!isAdmin && !isOwner && !isGuestOrder) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
