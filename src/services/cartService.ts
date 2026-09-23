// PRAYELLE • Haute Hairwear — Cart Service
// Handles guest cart persistence, customer carts, and safe login merging

import prisma from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export const cartService = {
  /**
   * Get or create a cart for a session or user
   */
  async getOrCreateCart(sessionId: string, userId?: string) {
    try {
      let cart = await prisma.cart.findFirst({
        where: userId ? { userId } : { sessionId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  basePrice: true,
                },
              },
              variant: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  price: true,
                  color: true,
                  stockQuantity: true,
                },
              },
            },
          },
          coupon: true,
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            sessionId,
            userId,
            subtotal: new Decimal(0),
            discount: new Decimal(0),
            shipping: new Decimal(0),
            total: new Decimal(0),
          },
          include: {
            items: {
              include: {
                product: {
                  select: { id: true, name: true, slug: true, basePrice: true },
                },
                variant: {
                  select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                    color: true,
                    stockQuantity: true,
                  },
                },
              },
            },
            coupon: true,
          },
        });
      }

      return cart;
    } catch {
      return null;
    }
  },

  /**
   * Add an item to cart or increment quantity
   */
  async addItem(cartId: string, productId: string, variantId?: string, quantity = 1) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { variants: true },
      });

      if (!product) throw new Error('Product not found');

      const variant = variantId
        ? product.variants.find((v) => v.id === variantId)
        : product.variants[0];

      const unitPrice = variant ? variant.price : product.basePrice;

      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId, productId, variantId: variant?.id },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId,
            productId,
            variantId: variant?.id,
            quantity,
            unitPrice,
          },
        });
      }

      await this.recalculateCartTotals(cartId);
      return { success: true };
    } catch (e: unknown) {
      return { success: false, error: (e as Error).message };
    }
  },

  /**
   * Merge a guest cart with a user cart when a customer logs in
   */
  async mergeGuestCart(guestSessionId: string, userId: string) {
    try {
      const guestCart = await prisma.cart.findUnique({
        where: { sessionId: guestSessionId },
        include: { items: true },
      });

      if (!guestCart || guestCart.items.length === 0) return;

      const userCart = await prisma.cart.findFirst({
        where: { userId },
        include: { items: true },
      });

      if (!userCart) {
        // Transfer guest cart directly to user
        await prisma.cart.update({
          where: { id: guestCart.id },
          data: { userId },
        });
        return;
      }

      // Merge items from guest cart into user cart
      for (const item of guestCart.items) {
        const existing = userCart.items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );

        if (existing) {
          await prisma.cartItem.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity + item.quantity },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            },
          });
        }
      }

      // Delete the obsolete guest cart
      await prisma.cart.delete({ where: { id: guestCart.id } });
      await this.recalculateCartTotals(userCart.id);
    } catch {
      // Continue without breaking session
    }
  },

  /**
   * Recalculate totals including coupons and shipping rules
   */
  async recalculateCartTotals(cartId: string) {
    try {
      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { items: true, coupon: true },
      });

      if (!cart) return;

      let subtotal = new Decimal(0);
      for (const item of cart.items) {
        subtotal = subtotal.add(new Decimal(item.unitPrice).mul(item.quantity));
      }

      let discount = new Decimal(0);
      if (cart.coupon && cart.coupon.isActive) {
        if (cart.coupon.discountType === 'PERCENTAGE') {
          discount = subtotal.mul(cart.coupon.discountValue).div(100);
        } else {
          discount = cart.coupon.discountValue;
        }

        if (cart.coupon.maximumDiscount && discount.gt(cart.coupon.maximumDiscount)) {
          discount = cart.coupon.maximumDiscount;
        }
      }

      // Free shipping over ₹999, else ₹99
      const shipping = subtotal.gte(999) || subtotal.isZero() ? new Decimal(0) : new Decimal(99);
      const total = Decimal.max(new Decimal(0), subtotal.sub(discount).add(shipping));

      await prisma.cart.update({
        where: { id: cartId },
        data: { subtotal, discount, shipping, total },
      });
    } catch {
      // Ignore
    }
  },
};
