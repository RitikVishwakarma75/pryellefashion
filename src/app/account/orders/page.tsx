import type { Metadata } from 'next';
import OrderHistoryClient from './OrderHistoryClient';

export const metadata: Metadata = {
  title: 'My Orders — PRAYELE Haute Hairwear',
  description: 'View your order history and track your deliveries.',
};

export default function OrderHistoryPage() {
  return <OrderHistoryClient />;
}
