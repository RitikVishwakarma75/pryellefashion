export interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyMoney;
  maxVariantPrice: ShopifyMoney;
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: ShopifySelectedOption[];
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  image?: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  productType: string;
  vendor: string;
  tags: string[];
  options?: ShopifyProductOption[];
  priceRange: ShopifyPriceRange;
  compareAtPriceRange?: ShopifyPriceRange;
  featuredImage: ShopifyImage | null;
  images: {
    edges: Array<{ node: ShopifyImage }>;
  };
  variants: {
    edges: Array<{ node: ShopifyProductVariant }>;
  };
}

export interface ShopifyPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    edges: Array<{ node: ShopifyProduct }>;
  };
}

export interface ShopifyShopInfo {
  name: string;
  description: string;
  primaryDomain: {
    host: string;
    url: string;
  };
  paymentSettings: {
    countryCode: string;
    currencyCode: string;
  };
}

export interface ShopifyGraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
}

export interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: ShopifyGraphQLError[];
}

/* ─── Normalized Application Types with Safe Fallbacks ─── */

export interface NormalizedProductImage {
  url: string;
  altText: string;
  width?: number;
  height?: number;
}

export interface NormalizedProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: number;
  formattedPrice: string;
  compareAtPrice: number | null;
  formattedCompareAtPrice: string | null;
  selectedOptions: Record<string, string>;
  image: NormalizedProductImage | null;
}

export interface NormalizedProductOption {
  name: string;
  values: string[];
}

export interface NormalizedShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  price: number;
  formattedPrice: string;
  compareAtPrice: number | null;
  currency: string;
  featuredImage: NormalizedProductImage;
  images: NormalizedProductImage[];
  options: NormalizedProductOption[];
  variants: NormalizedProductVariant[];
  tags: string[];
  productType: string;
  vendor: string;
}

export interface ShopifyProductsResult {
  products: NormalizedShopifyProduct[];
  pageInfo: ShopifyPageInfo;
  totalReturned: number;
}

export interface ShopifyCartUserError {
  code: string;
  field: string[];
  message: string;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: ShopifyMoney;
    amountPerQuantity: ShopifyMoney;
    compareAtAmountPerQuantity?: ShopifyMoney | null;
  };
  merchandise: {
    id: string;
    title: string;
    availableForSale: boolean;
    product: {
      id: string;
      title: string;
      handle: string;
    };
    price: ShopifyMoney;
    compareAtPrice?: ShopifyMoney | null;
    image?: ShopifyImage | null;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
    totalTaxAmount?: ShopifyMoney | null;
    totalDutyAmount?: ShopifyMoney | null;
  };
  lines: {
    edges: Array<{ node: ShopifyCartLine }>;
  };
}

export interface NormalizedShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: NormalizedProductImage | null;
}

export interface ShopifyCollectionsResult {
  collections: NormalizedShopifyCollection[];
  pageInfo: ShopifyPageInfo;
  totalReturned: number;
}

