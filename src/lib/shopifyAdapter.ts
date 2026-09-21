import { Product, ProductColor, MegaCategory, SubCategory } from '@/types';
import { NormalizedShopifyProduct } from '@/types/shopify';

/**
 * Intelligent color hex mapping based on common finish names.
 */
const COLOR_HEX_MAP: Record<string, string> = {
  amber: '#C5A059',
  gold: '#D8B167',
  tortoise: '#4A2A1A',
  black: '#181716',
  noir: '#121113',
  obsidian: '#1C1A18',
  pearl: '#F6F3EE',
  white: '#FFFFFF',
  ivory: '#F5EDE3',
  cream: '#ECE0CE',
  rose: '#DCAEAE',
  pink: '#EFCFD4',
  blush: '#E8C4B8',
  emerald: '#2D5A3F',
  green: '#5A8062',
  silver: '#C0C0C0',
  champagne: '#E6C687',
  caramel: '#C69C6D',
  brown: '#5D4037',
  sand: '#D5C4B1',
};

function inferColorHex(title: string): string {
  const lower = title.toLowerCase();
  for (const [key, hex] of Object.entries(COLOR_HEX_MAP)) {
    if (lower.includes(key)) return hex;
  }
  return '#C5A059'; // Default luxury gold
}

/**
 * Infers MegaCategory and SubCategory from Shopify productType and tags.
 */
function inferCategory(sp: NormalizedShopifyProduct): {
  megaCategory: MegaCategory;
  subCategory: SubCategory;
} {
  const text = `${sp.productType} ${sp.tags.join(' ')} ${sp.title}`.toLowerCase();

  if (text.includes('scrunchie') || text.includes('hair tie') || text.includes('headband') || text.includes('band')) {
    const sub: SubCategory = text.includes('silk')
      ? 'silk-scrunchie'
      : text.includes('satin')
      ? 'satin-scrunchie'
      : text.includes('headband')
      ? 'headband'
      : 'scrunchie';
    return { megaCategory: 'ties-bands', subCategory: sub };
  }

  if (text.includes('pin') || text.includes('stick') || text.includes('bobby')) {
    const sub: SubCategory = text.includes('pearl')
      ? 'pearl-pin'
      : text.includes('stick')
      ? 'hair-stick'
      : 'hair-pin';
    return { megaCategory: 'pins-sticks', subCategory: sub };
  }

  if (text.includes('comb') || text.includes('brush')) {
    const sub: SubCategory = text.includes('wide')
      ? 'wide-tooth'
      : text.includes('paddle')
      ? 'paddle-brush'
      : 'wooden-comb';
    return { megaCategory: 'combs-brushes', subCategory: sub };
  }

  if (text.includes('bridal') || text.includes('gajra') || text.includes('tiara') || text.includes('tikka')) {
    return { megaCategory: 'traditional', subCategory: 'bridal-comb' };
  }

  if (text.includes('bow') || text.includes('statement') || text.includes('barrette')) {
    return { megaCategory: 'decorative', subCategory: 'hair-bow' };
  }

  // Default to claw clips
  const sub: SubCategory = text.includes('mini')
    ? 'mini-claw'
    : text.includes('butterfly')
    ? 'butterfly-clip'
    : 'claw-clip';
  return { megaCategory: 'clips-clutches', subCategory: sub };
}

/**
 * Transforms a normalized Shopify Storefront product into the application's
 * internal Product model, ensuring 100% compatibility with ProductCard, QuickViewModal,
 * and CartContext.
 */
export function shopifyProductToProduct(sp: NormalizedShopifyProduct): Product {
  const { megaCategory, subCategory } = inferCategory(sp);

  // Extract color options or variant swatches
  let colors: ProductColor[] = (sp.variants || []).map((v, i) => {
    const colorName =
      v.title === 'Default Title'
        ? sp.options?.[0]?.values[i] || 'Signature Finish'
        : v.title;
    return {
      name: colorName,
      hex: inferColorHex(colorName),
      image: v.image?.url || sp.featuredImage?.url || '/images/products/claw-clip.jpg',
      variantId: v.id,
    };
  });

  // Deduplicate color variations
  colors = colors.filter(
    (c, idx, arr) => arr.findIndex((x) => x.name === c.name) === idx
  );

  if (colors.length === 0) {
    colors = [
      {
        name: 'Signature Finish',
        hex: '#C5A059',
        image: sp.featuredImage?.url || '/images/products/claw-clip.jpg',
      },
    ];
  }

  return {
    id: sp.id,
    name: sp.title,
    subtitle: sp.vendor ? `${sp.vendor} • Haute Hairwear` : 'PRAYELE Haute Hairwear',
    megaCategory,
    subCategory,
    collection: 'everyday',
    price: sp.price,
    originalPrice: sp.compareAtPrice ?? undefined,
    description:
      sp.description ||
      'Hand-finished luxury hairwear sculpted for frictionless, headache-free elegance.',
    editorialNote:
      'Engineered with jewelry-level precision to celebrate your hair’s natural movement.',
    material:
      sp.tags.find((t) => t.toLowerCase().startsWith('material:'))?.replace(/^material:\s*/i, '') ||
      'Plant-Derived Cellulose & 18K Gold PVD',
    dimensions: 'Calibrated Atelier Proportions',
    holdStrength: 'All-Day Ultra Hold',
    hairTypes: ['All Hair Types', 'Fine to Thick Hair'],
    colors,
    rating: 4.9,
    reviewsCount: 38,
    badge: !sp.availableForSale
      ? 'Sold Out'
      : sp.tags.includes('Bestseller')
      ? 'Bestseller'
      : sp.tags.includes('Editorial Pick')
      ? 'Editorial Pick'
      : sp.tags.includes('New')
      ? 'New Runway'
      : undefined,
    availableForSale: sp.availableForSale,
  };
}
