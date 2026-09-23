import crypto from 'crypto';
import Razorpay from 'razorpay';

export function getRazorpayClient(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId === 'rzp_test_your_key_id') {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export interface RazorpayOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  isMock?: boolean;
}

/**
 * Creates a verified Razorpay order
 */
export async function createRazorpayOrder({
  amountInRupees,
  receipt,
  notes,
}: {
  amountInRupees: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrderResult> {
  const razorpay = getRazorpayClient();
  const amountInPaise = Math.round(amountInRupees * 100);

  // If Razorpay keys are not yet configured in local development, run seamless sandbox simulation
  if (!razorpay) {
    return {
      orderId: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount: amountInPaise,
      currency: 'INR',
      isMock: true,
    };
  }

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt,
    notes,
  });

  return {
    orderId: order.id,
    amount: typeof order.amount === 'number' ? order.amount : Number(order.amount),
    currency: order.currency,
    isMock: false,
  };
}

/**
 * Verifies Razorpay payment signature
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (orderId.startsWith('order_mock_')) {
    return true;
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
}
