// PRAYELLE • Haute Hairwear — Complete Phase 3 Database Seed
// PostgreSQL Single Source of Truth: 300 Luxury Products, Media, Inventory, Nested Categories, Collections, Moods, Hairstyles

import { PrismaClient, Role, ImageType, DiscountType, InventoryTransactionType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CATEGORIES } from '../src/data/categories';
import { COLLECTIONS } from '../src/data/collections';
import { MOODS } from '../src/data/moods';
import { HAIRSTYLES, STYLING_MATRIX } from '../src/data/stylingMatrix';
import { generate300Products } from './seedData';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function retry<T>(fn: () => Promise<T>, retries = 5, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    console.warn(`⚠️ Network hiccup during seed, retrying (${retries} attempts left)...`);
    await new Promise((r) => setTimeout(r, delay));
    return retry(fn, retries - 1, delay * 1.5);
  }
}

async function main() {
  console.log('✨ Starting PRAYELLE V2 Phase 3 Database Ingestion...');

  // 1. Clean existing records in reverse dependency order
  console.log('🧹 Cleaning existing records...');
  await prisma.inventoryTransaction.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.styleCombination.deleteMany();
  await prisma.hairstyle.deleteMany();
  await prisma.productMood.deleteMany();
  await prisma.mood.deleteMany();
  await prisma.productCollection.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.media.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Default Users (Admin, Staff, Customer)
  console.log('👤 Seeding Admin, Staff, and Customer accounts...');
  const adminPassword = await bcrypt.hash('Prayelle@Admin2026', 10);
  const staffPassword = await bcrypt.hash('Staff@Prayelle2026', 10);
  const customerPassword = await bcrypt.hash('Customer@Prayelle2026', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Prayelle Atelier Admin',
      email: 'admin@prayele.com',
      password: adminPassword,
      role: Role.ADMIN,
      phone: '+91 98765 00001',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Inventory Manager',
      email: 'staff@prayele.com',
      password: staffPassword,
      role: Role.STAFF,
      phone: '+91 98765 00002',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Aanya Sen',
      email: 'aanya.sen@example.com',
      password: customerPassword,
      role: Role.CUSTOMER,
      phone: '+91 98765 43210',
      addresses: {
        create: {
          name: 'Aanya Sen',
          phone: '+91 98765 43210',
          addressLine1: '42, Boulevard Heights, Bandra West',
          addressLine2: 'Near Pali Hill',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India',
          isDefault: true,
          type: 'SHIPPING',
        },
      },
    },
  });

  console.log(`✅ Created Admin: ${admin.email} and Customer: ${customer.email}`);

  // 3. Seed Nested Categories (Mega Categories + Subcategories)
  console.log('🏷️ Seeding 8 Mega-Categories and 60+ Subcategories with unlimited nesting...');
  const categoryMap = new Map<string, string>(); // slug -> categoryId

  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    const mega = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.id,
        description: `${cat.tagline} — ${cat.headline}. ${cat.supportingText}`,
        sortOrder: i,
        isActive: true,
      },
    });
    categoryMap.set(cat.id, mega.id);

    if (cat.subFilters && cat.subFilters.length > 0) {
      for (let j = 0; j < cat.subFilters.length; j++) {
        const sub = cat.subFilters[j];
        const subCat = await prisma.category.create({
          data: {
            name: sub.label,
            slug: sub.id,
            parentId: mega.id,
            sortOrder: j,
            isActive: true,
          },
        });
        categoryMap.set(sub.id, subCat.id);
      }
    }
  }

  // 4. Seed Collections
  console.log('✨ Seeding 4 Curated Collections...');
  const collectionMap = new Map<string, string>(); // slug -> id

  for (let i = 0; i < COLLECTIONS.length; i++) {
    const col = COLLECTIONS[i];
    const createdCol = await prisma.collection.create({
      data: {
        name: col.name,
        slug: col.id,
        description: `${col.tagline} — ${col.ethos}`,
        isFeatured: true,
        sortOrder: i,
        isActive: true,
      },
    });
    collectionMap.set(col.id, createdCol.id);
  }

  // 5. Seed Moods
  console.log('🌸 Seeding 5 Mood Engines...');
  const moodMap = new Map<string, string>(); // slug -> id

  for (let i = 0; i < MOODS.length; i++) {
    const m = MOODS[i];
    const createdMood = await prisma.mood.create({
      data: {
        name: m.name,
        slug: m.id,
        emoji: m.emoji,
        tagline: m.tagline,
        description: m.description,
        stylingTip: m.hairstyleTip,
        discountPercent: 0.20,
        sortOrder: i,
        isActive: true,
      },
    });
    moodMap.set(m.id, createdMood.id);
  }

  // 6. Seed Hairstyles & Matrix Combinations
  console.log('💇‍♀️ Seeding Hairstyles and 25 Style Combinations...');
  const hairstyleMap = new Map<string, string>();

  for (const h of HAIRSTYLES) {
    const createdH = await prisma.hairstyle.create({
      data: {
        name: h.name,
        slug: h.id,
        description: `Haute styling architecture for ${h.name}.`,
        stylingTime: '2 minutes',
        difficulty: 'Effortless',
        isActive: true,
      },
    });
    hairstyleMap.set(h.id, createdH.id);
  }

  // 7. Seed 300 Realistic Luxury Products
  console.log('💎 Generating and seeding 300 Realistic Luxury Demo Products...');
  const demoProducts = generate300Products();
  const createdProductsMap = new Map<string, string>();

  // Process in batches of 25 for optimal performance
  const batchSize = 25;
  for (let i = 0; i < demoProducts.length; i += batchSize) {
    const batch = demoProducts.slice(i, i + batchSize);

    for (const p of batch) {
      await retry(async () => {
        // Determine category ID: preferred subcategory, fallback to mega category
        const catId = categoryMap.get(p.subCategorySlug) || categoryMap.get(p.categorySlug);

        // Create product
        const product = await prisma.product.create({
          data: {
            name: p.name,
            slug: p.slug,
            description: p.description,
            shortDescription: p.shortDescription,
            categoryId: catId,
            productType: p.productType,
            material: p.material,
            basePrice: p.basePrice,
            compareAtPrice: p.compareAtPrice,
            weight: p.weight,
            dimensions: p.dimensions,
            holdStrength: p.holdStrength,
            hairTypes: p.hairTypes,
            isFeatured: p.isFeatured,
            isNew: p.isNew,
            isBestSeller: p.isBestSeller,
            isActive: true,
            seoTitle: p.seoTitle,
            seoDescription: p.seoDescription,
          },
        });

        createdProductsMap.set(p.slug, product.id);

        // Create Variants with initial RESTOCK transactions
        for (const v of p.variants) {
          const variant = await prisma.productVariant.create({
            data: {
              productId: product.id,
              name: v.name,
              sku: v.sku,
              color: v.color,
              colorHex: v.colorHex,
              finish: v.finish,
              price: v.price,
              compareAtPrice: v.compareAtPrice,
              stockQuantity: v.stockQuantity,
              reservedQuantity: 0,
              lowStockThreshold: 4,
              isActive: true,
            },
          });

          // Record initial InventoryTransaction
          await prisma.inventoryTransaction.create({
            data: {
              variantId: variant.id,
              type: InventoryTransactionType.RESTOCK,
              quantity: v.stockQuantity,
              reference: 'INITIAL_ONBOARDING',
              reason: 'Opening catalog stock ingestion',
            },
          });
        }

        // Create Media & ProductImage records
        for (const img of p.images) {
          const media = await prisma.media.create({
            data: {
              url: img.url,
              fileName: `${p.slug}-img-${img.sortOrder}`,
              altText: img.altText,
            },
          });

          await prisma.productImage.create({
            data: {
              productId: product.id,
              mediaId: media.id,
              isPrimary: img.isPrimary,
              sortOrder: img.sortOrder,
              type: ImageType.PRODUCT,
            },
          });
        }

        // Link Collection
        const colId = collectionMap.get(p.collectionSlug);
        if (colId) {
          await prisma.productCollection.create({
            data: {
              productId: product.id,
              collectionId: colId,
            },
          });
        }

        // Link Mood
        const moodId = moodMap.get(p.moodSlug);
        if (moodId) {
          await prisma.productMood.create({
            data: {
              productId: product.id,
              moodId: moodId,
            },
          });
        }
      });
    }

    console.log(`📦 Seeded ${Math.min(i + batchSize, demoProducts.length)} / ${demoProducts.length} products...`);
  }

  // 8. Seed Style Combinations linked to distinct products
  console.log('🎀 Linking Style Combinations to products...');
  const allProductIds = Array.from(createdProductsMap.values());
  if (allProductIds.length > 0) {
    let comboIdx = 0;
    for (const combo of Object.values(STYLING_MATRIX)) {
      const hId = hairstyleMap.get(combo.hairstyle);
      const assignedProductId = allProductIds[comboIdx % allProductIds.length];
      comboIdx++;
      if (hId && assignedProductId) {
        await retry(async () => {
          await prisma.styleCombination.upsert({
            where: {
              hairstyleId_productId: {
                hairstyleId: hId,
                productId: assignedProductId,
              },
            },
            update: {},
            create: {
              hairstyleId: hId,
              productId: assignedProductId,
              accessoryName: combo.title,
              image: combo.modelImage,
              stylingTime: combo.timeToStyle,
              difficulty: combo.difficulty,
              stylistTip: combo.stylistSecret,
            },
          });
        });
      }
    }
  }

  // 9. Seed Luxury Coupons
  console.log('🎟️ Seeding Luxury Coupons...');
  const coupons = [
    {
      code: 'WELCOME10',
      description: '10% Welcome gift on your inaugural haute hairwear acquisition',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minimumOrder: 999,
      maximumDiscount: 1000,
      usageLimit: 1000,
      isActive: true,
    },
    {
      code: 'LUXE15',
      description: '15% Privilège discount on curated atelier orders above ₹2,000',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15,
      minimumOrder: 2000,
      maximumDiscount: 2500,
      usageLimit: 500,
      isActive: true,
    },
    {
      code: 'HAUTE500',
      description: 'Flat ₹500 Atelier courtesy on orders above ₹2,500',
      discountType: DiscountType.FIXED,
      discountValue: 500,
      minimumOrder: 2500,
      usageLimit: 250,
      isActive: true,
    },
    {
      code: 'VIPHAUTE',
      description: '20% Exclusive Runway invitation discount',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      minimumOrder: 3000,
      maximumDiscount: 5000,
      usageLimit: 100,
      isActive: true,
    },
  ];

  for (const c of coupons) {
    await retry(async () => {
      await prisma.coupon.upsert({
        where: { code: c.code },
        update: {},
        create: c,
      });
    });
  }

  console.log('🎉 PRAYELLE V2 Phase 3 Database Ingestion Complete!');
  console.log(`✨ 300 Products seeded with independent inventory transactions, media records, and category trees.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
