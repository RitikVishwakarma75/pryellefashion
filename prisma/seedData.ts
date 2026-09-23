// PRAYELLE • Haute Hairwear — 300 Realistic Luxury Products Generator
// Adheres strictly to Phase 3 Requirement #25 & #26

export interface SeedProductInput {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categorySlug: string;
  subCategorySlug: string;
  productType: string;
  material: string;
  basePrice: number;
  compareAtPrice?: number;
  weight: number;
  dimensions: string;
  holdStrength: string;
  hairTypes: string[];
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  collectionSlug: 'everyday' | 'after-dark' | 'soft-girl' | 'natural';
  moodSlug: 'romantic' | 'minimal' | 'party' | 'natural' | 'bold';
  seoTitle: string;
  seoDescription: string;
  variants: Array<{
    name: string;
    sku: string;
    color: string;
    colorHex: string;
    finish: string;
    price: number;
    compareAtPrice?: number;
    stockQuantity: number;
  }>;
  images: Array<{
    url: string;
    altText: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
}

const LUXURY_MODIFIERS = [
  'L’Étoile', 'Céleste', 'Vendôme', 'Riviera', 'Palais', 'Dauphine', 'Saint-Germain',
  'Montmartre', 'Élysée', 'Versailles', 'Marais', 'Opéra', 'Capucine', 'Chantilly',
  'Aura', 'Solstice', 'Lumière', 'Sérénité', 'Nocturne', 'Reine', 'Valois', 'Fontaine'
];

const FINISHES = ['Glossy Polished', 'Matte Silk', 'Brushed Gold', 'Pearlescent', 'Liquid Chrome', 'Satin Sheen'];

// Curated pool of high-res luxury hair accessory images
const CATEGORY_IMAGES: Record<string, string[]> = {
  'ties-bands': [
    '/images/products/silk-scrunchie.jpg',
    '/images/products/headbands.jpg',
    '/images/products/spiral-ties.jpg',
  ],
  'clips-clutches': [
    '/images/products/claw-clip.jpg',
    '/images/products/butterfly-clips.jpg',
  ],
  'decorative': [
    '/images/products/hair-bow.jpg',
    '/images/products/bridal-vine.jpg',
  ],
  'pins-sticks': [
    '/images/products/hair-pins.jpg',
    '/images/products/claw-clip.jpg',
  ],
  'combs-brushes': [
    '/images/products/wooden-comb.jpg',
    '/images/products/scalp-brush.jpg',
  ],
  'traditional': [
    '/images/products/maang-tikka.jpg',
    '/images/products/bridal-vine.jpg',
  ],
  'functional': [
    '/images/products/care-bonnet.jpg',
    '/images/products/spiral-ties.jpg',
  ],
  'travel-storage': [
    '/images/products/organizer-box.jpg',
  ],
};

interface SubcategoryDef {
  subCategory: string;
  nameTemplate: string;
  type: string;
  material: string;
  dimensions: string;
  hold: string;
  basePrice: number;
  collection: 'everyday' | 'after-dark' | 'soft-girl' | 'natural';
  mood: 'romantic' | 'minimal' | 'party' | 'natural' | 'bold';
  colors: Array<{ name: string; hex: string }>;
}

const CATEGORY_DEFINITIONS: Record<string, { target: number; subs: SubcategoryDef[] }> = {
  'ties-bands': {
    target: 60,
    subs: [
      {
        subCategory: 'silk-scrunchie',
        nameTemplate: 'Mulberry Silk Cloud Scrunchie',
        type: 'Silk Scrunchie',
        material: '100% 22-Momme Grade 6A Mulberry Silk',
        dimensions: '12 cm diameter',
        hold: 'Gentle',
        basePrice: 1499,
        collection: 'soft-girl',
        mood: 'romantic',
        colors: [
          { name: 'Rose Petal', hex: '#D78B99' },
          { name: 'Champagne Ivory', hex: '#F5EFEB' },
          { name: 'Noir Eclipse', hex: '#1C1917' },
        ],
      },
      {
        subCategory: 'satin-scrunchie',
        nameTemplate: 'Lustrous Liquid Satin Scrunchie',
        type: 'Satin Scrunchie',
        material: 'Double-Woven French Satin',
        dimensions: '10 cm diameter',
        hold: 'Gentle',
        basePrice: 1199,
        collection: 'after-dark',
        mood: 'party',
        colors: [
          { name: 'Bordeaux Noir', hex: '#3B1530' },
          { name: 'Liquid Gold', hex: '#E6B85C' },
        ],
      },
      {
        subCategory: 'spiral-tie',
        nameTemplate: 'Traceless Resilient Coil Ties Set',
        type: 'Spiral Hair Ties',
        material: 'Hypoallergenic Thermoplastic Resin',
        dimensions: '5 cm outer diameter',
        hold: 'Medium',
        basePrice: 799,
        collection: 'everyday',
        mood: 'minimal',
        colors: [
          { name: 'Smoky Amber', hex: '#92603C' },
          { name: 'Clear Crystal', hex: '#EAE6E1' },
        ],
      },
      {
        subCategory: 'padded-headband',
        nameTemplate: 'Couture Padded Velvet Band',
        type: 'Padded Headband',
        material: 'Italian Cotton Velvet & Memory Foam Core',
        dimensions: '3.5 cm width',
        hold: 'All-Day Ultra Hold',
        basePrice: 2299,
        collection: 'after-dark',
        mood: 'bold',
        colors: [
          { name: 'Midnight Onyx', hex: '#111012' },
          { name: 'Deep Emerald', hex: '#152C1E' },
          { name: 'Imperial Ruby', hex: '#4A1521' },
        ],
      },
      {
        subCategory: 'knotted-headband',
        nameTemplate: 'Draped Linen Knotted Crown',
        type: 'Knotted Headband',
        material: 'Organic Belgian Linen & Flexible Alloy Core',
        dimensions: '4 cm width',
        hold: 'Medium',
        basePrice: 1899,
        collection: 'natural',
        mood: 'natural',
        colors: [
          { name: 'Oatmeal Natural', hex: '#D8CDBE' },
          { name: 'Terracotta Clay', hex: '#A85741' },
        ],
      },
    ],
  },
  'clips-clutches': {
    target: 55,
    subs: [
      {
        subCategory: 'claw-clip',
        nameTemplate: 'Architectural Cellulose Claw Clip',
        type: 'Claw Clip',
        material: 'Hand-Polished Biodegradable Italian Acetate',
        dimensions: '11.5 cm x 4.8 cm',
        hold: 'All-Day Ultra Hold',
        basePrice: 2499,
        collection: 'everyday',
        mood: 'minimal',
        colors: [
          { name: 'Amber Tortoise', hex: '#C5A059' },
          { name: 'Onyx Noir', hex: '#191817' },
          { name: 'Blonde Horn', hex: '#E5D3B3' },
        ],
      },
      {
        subCategory: 'mini-claw',
        nameTemplate: 'Petite Half-Up Accent Clutches Set',
        type: 'Mini Claw Clip',
        material: 'Italian Acetate & High-Tension Steel Spring',
        dimensions: '3.5 cm x 2.2 cm',
        hold: 'Medium',
        basePrice: 1699,
        collection: 'soft-girl',
        mood: 'romantic',
        colors: [
          { name: 'Blush Mother of Pearl', hex: '#F3D7DC' },
          { name: 'Tortoise Classic', hex: '#875129' },
        ],
      },
      {
        subCategory: 'butterfly-clip',
        nameTemplate: 'Vapour Gilded Butterfly Clip',
        type: 'Butterfly Clip',
        material: '18K Gold Plated Brass & Pavé Crystals',
        dimensions: '5 cm x 3.8 cm',
        hold: 'Medium',
        basePrice: 2199,
        collection: 'after-dark',
        mood: 'party',
        colors: [
          { name: 'Polished 18K Gold', hex: '#E2C275' },
          { name: 'Rhodium Silver', hex: '#D9D9DF' },
        ],
      },
      {
        subCategory: 'french-barrette',
        nameTemplate: 'Sleek Minimalist French Barrette',
        type: 'French Barrette',
        material: 'Hand-Cut Italian Acetate & Secure French Clip Clasp',
        dimensions: '9 cm x 1.8 cm',
        hold: 'All-Day Ultra Hold',
        basePrice: 1999,
        collection: 'everyday',
        mood: 'minimal',
        colors: [
          { name: 'Caramel Tortoise', hex: '#9B5B2E' },
          { name: 'Piano Key Ivory', hex: '#FAF7F2' },
        ],
      },
    ],
  },
  'decorative': {
    target: 40,
    subs: [
      {
        subCategory: 'hair-bow',
        nameTemplate: 'Oversized Couture Velvet Bow Barrette',
        type: 'Velvet Hair Bow',
        material: 'Plush Silk Velvet & Steel Barrette Mechanism',
        dimensions: '18 cm ribbon span',
        hold: 'Medium',
        basePrice: 2699,
        collection: 'after-dark',
        mood: 'bold',
        colors: [
          { name: 'Obsidian Velvet', hex: '#141416' },
          { name: 'Wine Velvet', hex: '#4A1226' },
        ],
      },
      {
        subCategory: 'pearl-accessory',
        nameTemplate: 'Baroque Freshwater Pearl Hair Vine',
        type: 'Pearl Accessory',
        material: 'Genuine Cultured Freshwater Pearls & Gold Wire',
        dimensions: '28 cm flexible length',
        hold: 'Gentle',
        basePrice: 3499,
        collection: 'soft-girl',
        mood: 'romantic',
        colors: [
          { name: 'Iridescent Pearl / Gold', hex: '#F0E6D2' },
        ],
      },
      {
        subCategory: 'crystal-pin',
        nameTemplate: 'Constellation Crystal Bobby Pair',
        type: 'Crystal Pin',
        material: 'Austrian Crystal Pavé & Rhodium Plated Alloy',
        dimensions: '6.5 cm length',
        hold: 'Medium',
        basePrice: 1899,
        collection: 'after-dark',
        mood: 'party',
        colors: [
          { name: 'Starlight Diamond', hex: '#EAEBF0' },
          { name: 'Champagne Topaz', hex: '#D5B47B' },
        ],
      },
    ],
  },
  'pins-sticks': {
    target: 35,
    subs: [
      {
        subCategory: 'pearl-pin',
        nameTemplate: 'Baroque Luster U-Pin Duo',
        type: 'Pearl Hair Pin',
        material: 'Grade AAA Freshwater Pearls & 18K Gold Vermeil',
        dimensions: '7.5 cm pin length',
        hold: 'All-Day Ultra Hold',
        basePrice: 1799,
        collection: 'soft-girl',
        mood: 'romantic',
        colors: [
          { name: 'Warm Cream Pearl', hex: '#F8F3EA' },
        ],
      },
      {
        subCategory: 'hair-stick',
        nameTemplate: 'Sculpted Ebony & Brass Hair Stick',
        type: 'Hair Stick',
        material: 'Sustainably Harvested Ebony Wood & Polished Brass',
        dimensions: '16 cm tapered length',
        hold: 'All-Day Ultra Hold',
        basePrice: 1599,
        collection: 'natural',
        mood: 'natural',
        colors: [
          { name: 'Dark Ebony / Brass', hex: '#262220' },
          { name: 'Rosewood / Silver', hex: '#4D2926' },
        ],
      },
      {
        subCategory: 'bobby-pin',
        nameTemplate: 'Precision Grip Architectural Bobbies',
        type: 'Bobby Pin',
        material: 'Tempered Carbon Steel & Metallic PVD Finish',
        dimensions: '6 cm length',
        hold: 'All-Day Ultra Hold',
        basePrice: 899,
        collection: 'everyday',
        mood: 'minimal',
        colors: [
          { name: 'Matte Gilded Gold', hex: '#D2AC58' },
          { name: 'Satin Noir', hex: '#1A1817' },
        ],
      },
    ],
  },
  'combs-brushes': {
    target: 35,
    subs: [
      {
        subCategory: 'wide-tooth',
        nameTemplate: 'Sandalwood Sculpted Wide-Tooth Comb',
        type: 'Wide-Tooth Comb',
        material: 'Aromatic Mysore Green Sandalwood',
        dimensions: '15 cm x 5.5 cm',
        hold: 'Gentle',
        basePrice: 2199,
        collection: 'natural',
        mood: 'natural',
        colors: [
          { name: 'Natural Sandalwood Grain', hex: '#7A6B53' },
        ],
      },
      {
        subCategory: 'paddle-brush',
        nameTemplate: 'Botanical Bamboo Cushion Paddle Brush',
        type: 'Paddle Brush',
        material: 'FSC-Certified Bamboo & Natural Rubber Cushion',
        dimensions: '24 cm x 8.5 cm',
        hold: 'Gentle',
        basePrice: 2499,
        collection: 'natural',
        mood: 'natural',
        colors: [
          { name: 'Honey Bamboo', hex: '#CDB18B' },
        ],
      },
      {
        subCategory: 'scalp-massage',
        nameTemplate: 'Aura Scalp Acupressure Gua Sha Comb',
        type: 'Scalp Massage Comb',
        material: 'Solid Hand-Polished Xiuyan Green Jade',
        dimensions: '10 cm x 6 cm',
        hold: 'Gentle',
        basePrice: 1999,
        collection: 'natural',
        mood: 'natural',
        colors: [
          { name: 'Serpentine Jade', hex: '#587A64' },
        ],
      },
    ],
  },
  'traditional': {
    target: 30,
    subs: [
      {
        subCategory: 'maang-tikka',
        nameTemplate: 'Kundan Heirloom Maang Tikka',
        type: 'Maang Tikka',
        material: '22K Gold Plated Brass, Uncut Kundan & Seed Pearls',
        dimensions: '14 cm drop length',
        hold: 'Medium',
        basePrice: 3899,
        collection: 'after-dark',
        mood: 'bold',
        colors: [
          { name: 'Royal Gold & Emerald', hex: '#A8833B' },
          { name: 'Classic Pearl Kundan', hex: '#EFE7D8' },
        ],
      },
      {
        subCategory: 'bridal-vine',
        nameTemplate: 'Cascading Crystal & Gilded Blossom Vine',
        type: 'Bridal Vine',
        material: 'Hand-Wired Crystals, Ceramic Blooms & 18K Gold Plated Wire',
        dimensions: '35 cm cascading vine',
        hold: 'Medium',
        basePrice: 4299,
        collection: 'after-dark',
        mood: 'romantic',
        colors: [
          { name: 'Champagne Gilt & Opal', hex: '#ECDDBE' },
        ],
      },
      {
        subCategory: 'juda-pin',
        nameTemplate: 'Meenakari Hand-Painted Juda Pin',
        type: 'Juda Pin',
        material: 'Vibrant Meenakari Enamel & 22K Gold Plating',
        dimensions: '8 cm x 4.5 cm',
        hold: 'All-Day Ultra Hold',
        basePrice: 2499,
        collection: 'after-dark',
        mood: 'bold',
        colors: [
          { name: 'Crimson & Emerald Meena', hex: '#871D28' },
        ],
      },
    ],
  },
  'functional': {
    target: 25,
    subs: [
      {
        subCategory: 'satin-bonnet',
        nameTemplate: '22-Momme Mulberry Silk Reversible Sleep Bonnet',
        type: 'Silk Sleep Bonnet',
        material: '100% Pure Mulberry Silk & Soft Flat Tie Band',
        dimensions: '32 cm perimeter (adjustable)',
        hold: 'Gentle',
        basePrice: 2899,
        collection: 'soft-girl',
        mood: 'romantic',
        colors: [
          { name: 'Champagne / Blush Reversible', hex: '#EEDDD8' },
          { name: 'Noir / Midnight Reversible', hex: '#161517' },
        ],
      },
      {
        subCategory: 'heatless-rod',
        nameTemplate: 'Silk-Wrapped Heatless Curling Ribbon Set',
        type: 'Heatless Curling Rod',
        material: 'Mulberry Silk Exterior & Hypoallergenic Foam Core',
        dimensions: '95 cm ribbon length',
        hold: 'Gentle',
        basePrice: 2199,
        collection: 'soft-girl',
        mood: 'romantic',
        colors: [
          { name: 'Pastel Rose Silk', hex: '#E2B1B7' },
          { name: 'Champagne Gold Silk', hex: '#E5D1AC' },
        ],
      },
      {
        subCategory: 'sectioning-clip',
        nameTemplate: 'Ergonomic Salon Sectioning Grip Clamps',
        type: 'Salon Clip',
        material: 'Silicone-Coated Anodized Aluminum',
        dimensions: '11 cm length',
        hold: 'All-Day Ultra Hold',
        basePrice: 1299,
        collection: 'everyday',
        mood: 'minimal',
        colors: [
          { name: 'Matte Rose Gold', hex: '#C28F88' },
          { name: 'Stealth Black', hex: '#1F1E20' },
        ],
      },
    ],
  },
  'travel-storage': {
    target: 20,
    subs: [
      {
        subCategory: 'accessory-organizer',
        nameTemplate: 'Maison Quilted Velvet Jewelry & Hair Case',
        type: 'Accessory Organizer',
        material: 'Crushed Silk Velvet & Vegan Suede Lining',
        dimensions: '22 cm x 15 cm x 7 cm',
        hold: 'Gentle',
        basePrice: 3499,
        collection: 'everyday',
        mood: 'minimal',
        colors: [
          { name: 'Taupe Champagne Velvet', hex: '#9E8E7D' },
          { name: 'Emerald Velvet', hex: '#1C3B28' },
        ],
      },
      {
        subCategory: 'clip-holder',
        nameTemplate: 'L’Atelier Floating Acrylic Claw Clip Display Stand',
        type: 'Clip Holder',
        material: 'Laser-Cut Optically Clear Cast Acrylic',
        dimensions: '30 cm height x 12 cm cylinder',
        hold: 'Gentle',
        basePrice: 1999,
        collection: 'everyday',
        mood: 'minimal',
        colors: [
          { name: 'Crystal Clear', hex: '#F0F0F2' },
          { name: 'Smoked Obsidian Acrylic', hex: '#333235' },
        ],
      },
    ],
  },
};

export function generate300Products(): SeedProductInput[] {
  const products: SeedProductInput[] = [];
  let globalIndex = 1;

  for (const [megaCatSlug, config] of Object.entries(CATEGORY_DEFINITIONS)) {
    const imagesPool = CATEGORY_IMAGES[megaCatSlug] || ['/images/products/claw-clip.jpg'];
    let countInCat = 0;
    let subIdx = 0;

    while (countInCat < config.target) {
      const subDef = config.subs[subIdx % config.subs.length];
      const modifier = LUXURY_MODIFIERS[(globalIndex + countInCat) % LUXURY_MODIFIERS.length];
      const productName = `${modifier} ${subDef.nameTemplate}`;
      const skuBase = `PRY-${megaCatSlug.substring(0, 2).toUpperCase()}-${String(globalIndex).padStart(3, '0')}`;
      const slug = `${modifier.toLowerCase().replace(/[^a-z0-9]/g, '')}-${subDef.nameTemplate.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${globalIndex}`;

      const price = subDef.basePrice + ((countInCat % 5) * 100);
      const comparePrice = price + 400 + ((countInCat % 3) * 100);

      const variants = subDef.colors.map((c, cIdx) => ({
        name: c.name,
        sku: `${skuBase}-${c.name.split(' ')[0].toUpperCase()}`,
        color: c.name,
        colorHex: c.hex,
        finish: FINISHES[(cIdx + countInCat) % FINISHES.length],
        price: price,
        compareAtPrice: comparePrice,
        stockQuantity: 12 + ((countInCat * 7) % 35),
      }));

      const images = imagesPool.map((imgUrl, i) => ({
        url: imgUrl,
        altText: `${productName} — Angle ${i + 1}`,
        isPrimary: i === 0,
        sortOrder: i,
      }));

      products.push({
        name: productName,
        slug,
        description: `Handcrafted with meticulous artisanal excellence. ${subDef.material} sculpted to deliver flawless crown harmony without tension or follicle fatigue.`,
        shortDescription: `Artisanal ${subDef.type} in ${subDef.material}.`,
        categorySlug: megaCatSlug,
        subCategorySlug: subDef.subCategory,
        productType: subDef.type,
        material: subDef.material,
        basePrice: price,
        compareAtPrice: comparePrice,
        weight: 35 + ((countInCat * 3) % 80),
        dimensions: subDef.dimensions,
        holdStrength: subDef.hold,
        hairTypes: ['Fine', 'Medium', 'Thick', 'Curly'],
        isFeatured: countInCat % 7 === 0,
        isNew: countInCat % 5 === 0,
        isBestSeller: countInCat % 6 === 0,
        collectionSlug: subDef.collection,
        moodSlug: subDef.mood,
        seoTitle: `${productName} | PRAYELLE Haute Hairwear`,
        seoDescription: `Shop the ${productName}. Handcrafted ${subDef.type} in ${subDef.material}. Complimentary express shipping on luxury hair jewelry.`,
        variants,
        images,
      });

      countInCat++;
      globalIndex++;
      subIdx++;
    }
  }

  return products;
}
