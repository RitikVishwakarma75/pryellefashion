import type { Metadata } from 'next';
import CollectionClient from './CollectionClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${title} Collection — PRAYELE Haute Hairwear`,
    description: `Explore our ${title} collection. Curated luxury hair accessories for every mood and occasion.`,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CollectionClient slug={slug} />;
}
