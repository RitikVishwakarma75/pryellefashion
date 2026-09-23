import { NextResponse } from 'next/server';
import { reviewService } from '@/services/reviewService';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (productId) {
      const reviews = await reviewService.getProductReviews(productId);
      return NextResponse.json({ reviews });
    }

    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await reviewService.getAllReviews();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, rating, title, content, orderId } = body;

    if (!productId || !rating || !content) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 });
    }

    const user = await getCurrentUser();

    const review = await reviewService.submitReview({
      productId,
      userId: user?.userId,
      orderId,
      rating: Number(rating),
      title,
      content,
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
