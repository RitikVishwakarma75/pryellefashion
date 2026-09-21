import { NextRequest, NextResponse } from 'next/server';
import { fetchShopifyProducts } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam, 10) || 20), 100) : 20;
  const cursor = searchParams.get('cursor') || null;
  const query = searchParams.get('query') || null;
  const sortKey = (searchParams.get('sortKey') as any) || 'BEST_SELLING';
  const reverse = searchParams.get('reverse') === 'true';

  // Environment validation
  if (!process.env.SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Shopify environment variables are not configured in .env.local',
        tip: 'Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in your local .env.local',
      },
      { status: 500 }
    );
  }

  try {
    const result = await fetchShopifyProducts({
      first: limit,
      after: cursor,
      query,
      sortKey,
      reverse,
    });

    return NextResponse.json({
      status: 'success',
      totalReturned: result.totalReturned,
      pageInfo: result.pageInfo,
      products: result.products,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Unknown error while fetching Shopify products';

    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch products from Shopify Storefront API',
        error,
      },
      { status: 502 }
    );
  }
}
