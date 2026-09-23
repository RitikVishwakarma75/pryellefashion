import type { Metadata } from 'next';
import OrderDetailClient from './OrderDetailClient';

export const metadata: Metadata = {
  title: 'Order Confirmation — PRAYELE Haute Hairwear',
  description: 'Your order has been confirmed. View your order details and tracking.',
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetailClient orderId={id} />;
}
