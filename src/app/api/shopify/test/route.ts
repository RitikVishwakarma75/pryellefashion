import { NextResponse } from 'next/server';
import { getShopInfo, fetchShopifyProducts, DEFAULT_SHOPIFY_API_VERSION } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET() {
  const domainConfigured = Boolean(process.env.SHOPIFY_STORE_DOMAIN);
  const tokenConfigured = Boolean(process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);
  const apiVersion = process.env.SHOPIFY_API_VERSION || DEFAULT_SHOPIFY_API_VERSION;

  if (!domainConfigured || !tokenConfigured) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Shopify environment variables are missing in .env.local',
        configCheck: {
          SHOPIFY_STORE_DOMAIN: domainConfigured ? 'Configured' : 'Missing',
          SHOPIFY_STOREFRONT_ACCESS_TOKEN: tokenConfigured ? 'Configured' : 'Missing',
          SHOPIFY_API_VERSION: apiVersion,
        },
      },
      { status: 500 }
    );
  }

  try {
    // 1. Verify shop credentials and connectivity via diagnostic query
    const shop = await getShopInfo();

    // 2. Fetch sample products count
    let productsCount = 0;
    try {
      const { products } = await fetchShopifyProducts({ first: 5 });
      productsCount = products.length;
    } catch {
      // Non-critical if no products are published yet
    }

    return NextResponse.json({
      status: 'success',
      message: 'Successfully connected to Shopify Storefront API',
      connection: {
        shopName: shop.name,
        primaryDomain: shop.primaryDomain?.host || process.env.SHOPIFY_STORE_DOMAIN,
        currency: shop.paymentSettings?.currencyCode,
        country: shop.paymentSettings?.countryCode,
        apiVersion,
        productsFound: productsCount,
      },
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Unknown error during Shopify verification';
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to connect to Shopify Storefront API',
        error,
        configCheck: {
          domain: process.env.SHOPIFY_STORE_DOMAIN,
          tokenConfigured: true,
          apiVersion,
        },
      },
      { status: 502 }
    );
  }
}
