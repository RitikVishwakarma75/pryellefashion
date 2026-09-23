import type { Metadata } from 'next';
import SearchClient from './SearchClient';

export const metadata: Metadata = {
  title: 'Search — PRAYELE Haute Hairwear',
  description: 'Search our collection of luxury hair accessories.',
};

export default function SearchPage() {
  return <SearchClient />;
}
