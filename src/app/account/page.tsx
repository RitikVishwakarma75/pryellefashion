import type { Metadata } from 'next';
import AccountClient from './AccountClient';

export const metadata: Metadata = {
  title: 'My Account — PRAYELE Haute Hairwear',
  description: 'Manage your PRAYELE account, orders, and address book.',
};

export default function AccountPage() {
  return <AccountClient />;
}
