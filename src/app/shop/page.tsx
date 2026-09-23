import type { Metadata } from 'next';
import ShopClient from './ShopClient';

export const metadata: Metadata = {
  title: 'Shop All — PRAYELE Haute Hairwear',
  description:
    'Browse our entire collection of luxury hair accessories. Sculpted claw clips, pearl hair pins, silk scrunchies, botanical combs, and more.',
};

export default function ShopPage() {
  return <ShopClient />;
}
