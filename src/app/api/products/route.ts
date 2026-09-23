import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/services/productService';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const megaCategory = searchParams.get('megaCategory') || undefined;
    const subCategory = searchParams.get('subCategory') || undefined;
    const collection = searchParams.get('collection') || undefined;
    const mood = searchParams.get('mood') || undefined;
    const search = searchParams.get('search') || undefined;
    const sortByParam = searchParams.get('sortBy');
    const sortBy =
      sortByParam === 'featured' ||
      sortByParam === 'price-asc' ||
      sortByParam === 'price-desc' ||
      sortByParam === 'rating'
        ? sortByParam
        : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : undefined;
    const offset = page && limit ? (page - 1) * limit : undefined;

    const products = await getProducts({
      megaCategory,
      subCategory,
      collection,
      mood,
      search,
      sortBy,
      limit,
      offset,
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const createdProduct = await createProduct(body);

    return NextResponse.json({ success: true, product: createdProduct });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
