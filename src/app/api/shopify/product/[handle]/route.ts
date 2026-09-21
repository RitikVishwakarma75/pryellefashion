import { NextRequest, NextResponse } from 'next/server';
import { getShopifyProductByHandle } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ handle: string }> }
) {
  const { handle } = await context.params;

  if (!handle) {
    return NextResponse.json(
      { status: 'error', message: 'Product handle is required' },
      { status: 400 }
    );
  }

  try {
    const product = await getShopifyProductByHandle(handle);

    if (!product) {
      return NextResponse.json(
        {
          status: 'error',
          message: `Product with handle "${handle}" not found in Shopify store`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      product,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Unknown error fetching product';
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch product from Shopify Storefront API',
        error,
      },
      { status: 502 }
    );
  }
}
