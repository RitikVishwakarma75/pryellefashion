import { NextRequest, NextResponse } from 'next/server';
import {
  createShopifyCart,
  getShopifyCart,
  addLinesToShopifyCart,
  updateShopifyCartLines,
  removeShopifyCartLines,
} from '@/lib/shopify';

/**
 * Proxy API endpoint for Shopify Storefront Cart operations.
 * Keeping this on the server avoids exposing tokens or handling raw GraphQL queries in the browser.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, cartId, lines, lineIds } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Missing action parameter in request body.' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'create': {
        // lines: Array<{ merchandiseId: string; quantity: number }>
        const cart = await createShopifyCart(lines || []);
        return NextResponse.json({ success: true, cart });
      }

      case 'get': {
        if (!cartId) {
          return NextResponse.json(
            { success: false, error: 'cartId is required to fetch cart.' },
            { status: 400 }
          );
        }
        const cart = await getShopifyCart(cartId);
        return NextResponse.json({ success: true, cart });
      }

      case 'add': {
        if (!cartId || !Array.isArray(lines) || lines.length === 0) {
          return NextResponse.json(
            { success: false, error: 'cartId and non-empty lines array required.' },
            { status: 400 }
          );
        }
        const cart = await addLinesToShopifyCart(cartId, lines);
        return NextResponse.json({ success: true, cart });
      }

      case 'update': {
        if (!cartId || !Array.isArray(lines) || lines.length === 0) {
          return NextResponse.json(
            { success: false, error: 'cartId and non-empty lines array required.' },
            { status: 400 }
          );
        }
        const cart = await updateShopifyCartLines(cartId, lines);
        return NextResponse.json({ success: true, cart });
      }

      case 'remove': {
        if (!cartId || !Array.isArray(lineIds) || lineIds.length === 0) {
          return NextResponse.json(
            { success: false, error: 'cartId and non-empty lineIds array required.' },
            { status: 400 }
          );
        }
        const cart = await removeShopifyCartLines(cartId, lineIds);
        return NextResponse.json({ success: true, cart });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported cart action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('[API /api/shopify/cart] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Shopify Cart API operation failed.',
      },
      { status: 500 }
    );
  }
}
