import type { Metadata } from 'next';
import AddressesClient from './AddressesClient';

export const metadata: Metadata = {
  title: 'Saved Addresses — PRAYELE Haute Hairwear',
  description: 'Manage your saved delivery and billing addresses.',
};

export default function AddressesPage() {
  return <AddressesClient />;
}
