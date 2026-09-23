import type { Metadata } from 'next';
import CartPageClient from './CartPageClient';

export const metadata: Metadata = {
  title: 'Your Bag — PRAYELE Haute Hairwear',
  description: 'Review your selected luxury hair accessories before checkout.',
};

export default function CartPage() {
  return <CartPageClient />;
}
