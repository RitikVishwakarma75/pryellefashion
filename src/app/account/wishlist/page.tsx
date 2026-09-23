import type { Metadata } from 'next';
import WishlistClient from './WishlistClient';

export const metadata: Metadata = {
  title: 'My Favorites & Saved Looks — PRAYELE Haute Hairwear',
  description: 'Your private collection of saved luxury hair creations and bespoke accessories.',
};

export default function WishlistPage() {
  return <WishlistClient />;
}
