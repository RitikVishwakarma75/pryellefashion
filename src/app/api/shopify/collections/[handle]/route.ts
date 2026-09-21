import { NextRequest, NextResponse } from 'next/server';
import { fetchProductsByCollection } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  const { searchParams } = new URL(request.url);

  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam, 10) || 24), 50) : 24;
  const sortKey = searchParams.get('sortKey') || 'BEST_SELLING';
  const reverse = searchParams.get('reverse') === 'true';

  try {
    const result = await fetchProductsByCollection(handle, {
      first: limit,
      sortKey,
      reverse,
    });

    return NextResponse.json({
      status: 'success',
      collectionHandle: handle,
      totalReturned: result.totalReturned,
      products: result.products,
      pageInfo: result.pageInfo,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Failed to fetch collection products';
    return NextResponse.json(
      {
        status: 'error',
        message: `Could not fetch products for collection "${handle}"`,
        error,
      },
      { status: 500 }
    );
  }
}
