import { NextResponse } from 'next/server';
import { inventoryService } from '@/services/inventoryService';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const variantId = searchParams.get('variantId') || undefined;

    const ledger = await inventoryService.getTransactionLedger(variantId);
    return NextResponse.json({ transactions: ledger });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
