import { NextResponse } from 'next/server';
import { inventoryService } from '@/services/inventoryService';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { variantId, quantity, reason } = body;

    if (!variantId || quantity === undefined) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const updated = await inventoryService.adjustStock({
      variantId,
      quantity: Number(quantity),
      reason,
      reference: `Admin-${user.name || 'User'}`,
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
