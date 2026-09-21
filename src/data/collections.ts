export interface CollectionInfo {
  id: 'everyday' | 'after-dark' | 'soft-girl' | 'natural';
  name: string;
  tagline: string;
  ethos: string;
  heroImage: string;
  accent: string;
  productCount: number;
  featuredItems: string[];
}

export const COLLECTIONS: CollectionInfo[] = [
  {
    id: 'everyday',
    name: 'THE EVERYDAY',
    tagline: 'Effortless Essentialism',
    ethos: 'Accessories engineered to seamlessly transition from early morning meetings to late evening dinners with zero scalp fatigue.',
    heroImage: '/images/products/claw-clip.jpg',
    accent: '#C5A059',
    productCount: 25,
    featuredItems: ['luna-claw', 'solstice-grand-claw'],
  },
  {
    id: 'after-dark',
    name: 'AFTER DARK',
    tagline: 'Nocturne Metallic Radiance',
    ethos: '18K gold vapor deposition, liquid chrome, and opulent velvet designed to reflect candlelight across evening horizons.',
    heroImage: '/images/products/hair-bow.jpg',
    accent: '#E6B85C',
    productCount: 18,
    featuredItems: ['oversized-velvet-hair-bow', 'riviera-padded-headband'],
  },
  {
    id: 'soft-girl',
    name: 'SOFT GIRL',
    tagline: 'Pearls, Silk & Romantic Luster',
    ethos: 'Baroque freshwater pearls, powdered blush silk, and scalloped edges inspired by vintage boudoirs and romantic daydreaming.',
    heroImage: '/images/products/silk-scrunchie.jpg',
    accent: '#D98B94',
    productCount: 16,
    featuredItems: ['astra-pearl-pin', 'nuage-silk-scrunchie'],
  },
  {
    id: 'natural',
    name: 'NATURAL ESSENCE',
    tagline: 'Botanical Cellulose & Warm Timber',
    ethos: 'Plant-derived Italian acetate and sustainably harvested FSC woods that honor your hair’s organic texture without petroleum plastics.',
    heroImage: '/images/products/wooden-comb.jpg',
    accent: '#5F8265',
    productCount: 15,
    featuredItems: ['santal-wide-tooth-comb', 'botanical-bamboo-paddle-brush'],
  },
];
