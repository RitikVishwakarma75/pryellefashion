import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us — PRAYELE Haute Hairwear',
  description: 'Get in touch with the PRAYELE team. We\'re here to help with orders, styling advice, and more.',
};

export default function ContactPage() {
  return <ContactClient />;
}
