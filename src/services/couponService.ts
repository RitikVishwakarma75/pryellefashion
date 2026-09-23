import prisma from '@/lib/prisma';
import { Coupon, DiscountType, Prisma } from '@prisma/client';

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Partial<Coupon> | null;
  discountAmount: number;
  message?: string;
}

/**
 * Validate promo code against database
 */
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  const normalized = code.trim().toUpperCase();

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: normalized },
    });

    if (coupon && coupon.isActive) {
      const now = new Date();
      if (coupon.startsAt && now < coupon.startsAt) {
        return { isValid: false, discountAmount: 0, message: 'This promotion has not started yet.' };
      }
      if (coupon.expiresAt && now > coupon.expiresAt) {
        return { isValid: false, discountAmount: 0, message: 'This promo code has expired.' };
      }
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return { isValid: false, discountAmount: 0, message: 'This coupon usage limit has been reached.' };
      }
      if (coupon.minimumOrder && subtotal < Number(coupon.minimumOrder)) {
        return {
          isValid: false,
          discountAmount: 0,
          message: `Minimum order of ₹${coupon.minimumOrder} required for this code.`,
        };
      }

      let discountAmount = 0;
      if (coupon.discountType === 'PERCENTAGE') {
        discountAmount = Math.round(subtotal * (Number(coupon.discountValue) / 100));
        if (coupon.maximumDiscount && discountAmount > Number(coupon.maximumDiscount)) {
          discountAmount = Number(coupon.maximumDiscount);
        }
      } else {
        discountAmount = Number(coupon.discountValue);
      }

      return {
        isValid: true,
        coupon,
        discountAmount: Math.min(discountAmount, subtotal),
      };
    }
  } catch (error) {
    console.warn('Database coupon lookup failed, checking static codes:', (error as Error).message);
  }

  // Fallback for default codes
  if (normalized === 'ENDLESSLOOKS' || normalized === 'PRAYELE15') {
    return {
      isValid: true,
      coupon: { code: normalized, discountType: 'PERCENTAGE', discountValue: new Prisma.Decimal(15) },
      discountAmount: Math.round(subtotal * 0.15),
    };
  } else if (normalized === 'FIRSTLOOK' || normalized === 'HAUTE10') {
    return {
      isValid: true,
      coupon: { code: normalized, discountType: 'PERCENTAGE', discountValue: new Prisma.Decimal(10) },
      discountAmount: Math.round(subtotal * 0.1),
    };
  }

  return {
    isValid: false,
    discountAmount: 0,
    message: 'Invalid promo code. Try "ENDLESSLOOKS" for 15% off.',
  };
}

export async function createCoupon(data: {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrder?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  startsAt?: Date;
  expiresAt?: Date;
}) {
  return prisma.coupon.create({
    data: {
      code: data.code.trim().toUpperCase(),
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minimumOrder: data.minimumOrder,
      maximumDiscount: data.maximumDiscount,
      usageLimit: data.usageLimit,
      startsAt: data.startsAt,
      expiresAt: data.expiresAt,
    },
  });
}

export async function getAllCoupons() {
  try {
    return await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}
