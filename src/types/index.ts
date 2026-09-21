/* ─── Mega‑Category (8 top‑level groups shown in the hero switcher) ─── */
export type MegaCategory =
  | 'ties-bands'
  | 'clips-clutches'
  | 'decorative'
  | 'pins-sticks'
  | 'combs-brushes'
  | 'traditional'
  | 'functional'
  | 'travel-storage';

/* ─── Sub‑category used for filtering inside the product grid ─── */
export type SubCategory =
  /* ties-bands */
  | 'scrunchie' | 'satin-scrunchie' | 'silk-scrunchie' | 'elastic-tie' | 'spiral-tie' | 'coiled-tie'
  | 'ribbon-tie' | 'bow-tie' | 'no-slip-band' | 'headband' | 'padded-headband' | 'knotted-headband' | 'wide-headband'
  /* clips-clutches */
  | 'claw-clip' | 'mini-claw' | 'large-claw' | 'butterfly-clip' | 'flower-clip' | 'bow-clip'
  | 'french-barrette' | 'snap-clip' | 'tic-tac-clip' | 'alligator-clip' | 'duckbill-clip'
  | 'banana-clip' | 'hair-claw' | 'pearl-clip' | 'rhinestone-clip' | 'acrylic-clip' | 'metal-clip'
  /* decorative */
  | 'hair-bow' | 'ribbon-bow' | 'pearl-accessory' | 'rhinestone-accessory' | 'crystal-pin'
  | 'floral-accessory' | 'butterfly-accessory' | 'beaded-accessory' | 'charm-clip' | 'statement-piece'
  /* pins-sticks */
  | 'bobby-pin' | 'decorative-bobby' | 'u-pin' | 'hair-pin' | 'pearl-pin' | 'crystal-pin-stick'
  | 'floral-pin' | 'hair-stick' | 'wooden-stick' | 'japanese-stick' | 'bun-pin'
  /* combs-brushes */
  | 'wide-tooth' | 'fine-tooth' | 'detangling-comb' | 'rat-tail' | 'tail-comb'
  | 'pocket-comb' | 'folding-comb' | 'wooden-comb' | 'bamboo-comb' | 'anti-static-comb'
  | 'scalp-massage' | 'detangling-brush' | 'paddle-brush' | 'round-brush' | 'vent-brush'
  | 'teasing-brush' | 'wet-brush'
  /* traditional */
  | 'gajra' | 'juda-accessory' | 'juda-pin' | 'maang-tikka' | 'bridal-comb'
  | 'bridal-vine' | 'tiara' | 'matha-patti' | 'floral-crown' | 'bun-net' | 'hair-chain'
  /* functional */
  | 'shower-cap' | 'satin-bonnet' | 'hair-roller' | 'velcro-roller' | 'heatless-rod'
  | 'sectioning-clip' | 'salon-clip' | 'drying-wrap' | 'microfiber-towel' | 'hair-net'
  /* travel-storage */
  | 'accessory-organizer' | 'clip-holder' | 'scrunchie-holder' | 'band-organizer'
  | 'travel-pouch' | 'jewelry-box';

/* Legacy alias so existing code doesn't break */
export type ProductCategory = MegaCategory;

export type CollectionType = 'everyday' | 'after-dark' | 'soft-girl' | 'natural';

export type MoodType = 'romantic' | 'minimal' | 'party' | 'natural' | 'bold';

export type HairstyleType = 'ponytail' | 'bun' | 'half-up' | 'open-hair' | 'french-twist';

export type StylingAccessoryType = 'claw-clip' | 'hair-pin' | 'comb' | 'scrunchie' | 'headband';

export interface ProductColor {
  name: string;
  hex: string;
  image: string;
  materialType?: 'acetate' | 'metal' | 'silk' | 'pearl' | 'tortoise' | 'fabric' | 'wood' | 'crystal' | 'satin';
  variantId?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  megaCategory: MegaCategory;
  subCategory: SubCategory;
  /** kept for backward compat with collections/moods */
  collection: CollectionType;
  price: number;
  originalPrice?: number;
  description: string;
  editorialNote: string;
  material: string;
  dimensions: string;
  holdStrength: 'Gentle' | 'Medium' | 'All-Day Ultra Hold';
  hairTypes: string[];
  colors: ProductColor[];
  rating: number;
  reviewsCount: number;
  badge?: 'Bestseller' | 'Editorial Pick' | 'New Runway' | 'Limited Edition' | 'Bridal' | 'Travel Essential' | 'Sold Out' | string;
  is3DSupported?: boolean;
  threeDType?: 'claw' | 'pin' | 'comb' | 'scrunchie';
  availableForSale?: boolean;
}

export interface MegaCategoryTheme {
  id: MegaCategory;
  emoji: string;
  name: string;
  tagline: string;
  headline: string;
  supportingText: string;
  bgLight: string;
  bgDark: string;
  accent: string;
  accentSoft: string;
  textColor: string;
  textMuted: string;
  mood: string;
  animationStyle: string;
  particleType: 'gold-dust' | 'metallic-sparkle' | 'botanical-drift' | 'silk-flow' | 'champagne-aura' | 'noir-glimmer' | 'bridal-glow' | 'crystal-shimmer';
  featuredProductId: string;
  subFilters: Array<{ id: SubCategory; label: string }>;
}

/* kept for backward compat with ThemeContext */
export type CategoryTheme = MegaCategoryTheme;

export interface MoodLook {
  id: MoodType;
  name: string;
  emoji: string;
  tagline: string;
  accent: string;
  bgGradient: string;
  description: string;
  hairstyle: string;
  hairstyleTip: string;
  recommendedProductIds: string[];
  bundlePrice: number;
  bundleOriginalPrice: number;
  editorialImage: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: ProductColor;
  quantity: number;
  shopifyLineId?: string;
  variantId?: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  hairType: string;
  rating: number;
  title: string;
  comment: string;
  productName: string;
  avatarUrl: string;
  verified: boolean;
  date: string;
}

export interface InstagramPost {
  id: string;
  image: string;
  handle: string;
  likes: string;
  taggedProduct: {
    id: string;
    name: string;
    price: number;
  };
}
