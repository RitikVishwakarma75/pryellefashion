import { NextResponse } from 'next/server';
import { createRazorpayOrder, verifyRazorpaySignature } from '@/lib/razorpay';
import { createOrder } from '@/services/orderService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    // Action 1: Create Order
    if (action === 'create_order') {
      const { amount, receipt, notes } = body;
      const order = await createRazorpayOrder({
        amountInRupees: amount,
        receipt: receipt || `rec_${Date.now()}`,
        notes,
      });

      return NextResponse.json({ success: true, order });
    }

    // Action 2: Verify and Confirm Payment
    if (action === 'verify_payment') {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderInput } = body;

      const isValid = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });

      if (!isValid) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
      }

      // Record confirmed order in database
      const confirmedOrder = await createOrder({
        ...orderInput,
        paymentProvider: 'RAZORPAY',
        razorpayPaymentId: razorpay_payment_id,
      });

      return NextResponse.json({ success: true, order: confirmedOrder });
    }

    // Action 3: Cash on Delivery
    if (action === 'cod_order') {
      const { orderInput } = body;
      const confirmedOrder = await createOrder({
        ...orderInput,
        paymentProvider: 'COD',
      });
      return NextResponse.json({ success: true, order: confirmedOrder });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Payment API error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
