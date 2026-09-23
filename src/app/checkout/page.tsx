import type { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout — PRAYELE Haute Hairwear',
  description: 'Complete your luxury hair accessories order with secure payment.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
