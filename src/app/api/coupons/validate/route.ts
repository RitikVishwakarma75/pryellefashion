import { NextResponse } from 'next/server';
import { validateCoupon } from '@/services/couponService';

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const result = await validateCoupon(code, subtotal || 0);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
