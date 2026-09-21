import { NextRequest, NextResponse } from 'next/server';
import { fetchShopifyCollections } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam, 10) || 20), 50) : 20;

  try {
    const result = await fetchShopifyCollections(limit);
    return NextResponse.json({
      status: 'success',
      totalReturned: result.totalReturned,
      collections: result.collections,
      pageInfo: result.pageInfo,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Failed to fetch collections';
    return NextResponse.json(
      {
        status: 'error',
        message: 'Could not fetch Shopify collections',
        error,
      },
      { status: 500 }
    );
  }
}
