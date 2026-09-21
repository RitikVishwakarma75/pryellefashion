import {
  ShopifyGraphQLResponse,
  ShopifyShopInfo,
  ShopifyProduct,
  ShopifyCollection,
  ShopifyPageInfo,
  NormalizedShopifyProduct,
  NormalizedProductImage,
  NormalizedProductVariant,
  NormalizedProductOption,
  ShopifyProductsResult,
  ShopifyCart,
  ShopifyCartUserError,
  NormalizedShopifyCollection,
  ShopifyCollectionsResult,
} from '@/types/shopify';

/**
 * Currently supported stable Shopify Storefront API version.
 * Can be overridden via SHOPIFY_API_VERSION env var.
 */
export const DEFAULT_SHOPIFY_API_VERSION = '2025-01';

const FALLBACK_IMAGE_URL = '/images/products/claw-clip.jpg';

/**
 * Formats monetary amounts with safe currency formatting.
 */
export function formatPrice(amount: number, currency = 'INR'): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Normalizes store domain by removing protocols and trailing slashes.
 * e.g., "https://my-store.myshopify.com/" -> "my-store.myshopify.com"
 */
function normalizeDomain(rawDomain: string): string {
  return rawDomain
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')
    .trim();
}

/**
 * Retrieves and validates the Shopify configuration from server-side environment variables.
 * Keeps credentials secure on the server without exposure to client bundles.
 */
function getShopifyConfig() {
  const rawDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.SHOPIFY_API_VERSION || DEFAULT_SHOPIFY_API_VERSION;

  if (!rawDomain) {
    throw new Error(
      'Shopify configuration error: SHOPIFY_STORE_DOMAIN is not set in environment variables.'
    );
  }

  if (!token) {
    throw new Error(
      'Shopify configuration error: SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set in environment variables.'
    );
  }

  const domain = normalizeDomain(rawDomain);
  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  return { domain, token, apiVersion, endpoint };
}

export interface ShopifyFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
}

/**
 * Reusable, type-safe Storefront API GraphQL fetch helper.
 * - Handles HTTP status validation
 * - Handles GraphQL response error parsing
 * - Ensures zero token leakage in error messages or logs
 */
export async function shopifyFetch<T>({
  query,
  variables = {},
  cache = 'default',
  revalidate,
  tags,
}: ShopifyFetchOptions): Promise<T> {
  const { endpoint, token } = getShopifyConfig();

  const fetchOptions: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    cache,
  };

  if (typeof revalidate === 'number' || tags) {
    fetchOptions.next = {};
    if (typeof revalidate === 'number') fetchOptions.next.revalidate = revalidate;
    if (tags) fetchOptions.next.tags = tags;
  }

  let response: Response;
  try {
    response = await fetch(endpoint, fetchOptions);
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Unknown network error';
    throw new Error(`Shopify Storefront API network request failed: ${error}`);
  }

  if (!response.ok) {
    let errorDetails = '';
    try {
      const errorText = await response.text();
      errorDetails = errorText ? ` - ${errorText.slice(0, 300)}` : '';
    } catch {
      // Ignore text parse errors
    }
    throw new Error(
      `Shopify Storefront API HTTP error ${response.status} (${response.statusText})${errorDetails}`
    );
  }

  const json: ShopifyGraphQLResponse<T> = await response.json();

  if (json.errors && json.errors.length > 0) {
    const messages = json.errors.map((e) => e.message).join('; ');
    throw new Error(`Shopify Storefront GraphQL error: ${messages}`);
  }

  if (!json.data) {
    throw new Error('Shopify Storefront API returned an empty response body without data or errors.');
  }

  return json.data;
}

/**
 * Normalizes raw Shopify Storefront product data with safe fallbacks:
 * - Empty/missing images fallback gracefully
 * - Missing prices default to 0 with safe currency formatting
 * - Flattens edges/nodes for clean developer ergonomics
 */
export function normalizeShopifyProduct(product: ShopifyProduct): NormalizedShopifyProduct {
  // 1. Safe Price Extraction
  const minPriceAmount = parseFloat(product.priceRange?.minVariantPrice?.amount || '0');
  const currency = product.priceRange?.minVariantPrice?.currencyCode || 'INR';
  const price = isNaN(minPriceAmount) ? 0 : minPriceAmount;

  let compareAtPrice: number | null = null;
  const rawCompareAt = product.compareAtPriceRange?.minVariantPrice?.amount;
  if (rawCompareAt) {
    const parsedCompare = parseFloat(rawCompareAt);
    if (!isNaN(parsedCompare) && parsedCompare > price) {
      compareAtPrice = parsedCompare;
    }
  }

  // 2. Safe Images Normalization (Fallback if images are absent)
  const rawImages = (product.images?.edges || [])
    .map((edge) => edge.node)
    .filter((img) => Boolean(img?.url));

  const images: NormalizedProductImage[] =
    rawImages.length > 0
      ? rawImages.map((img) => ({
          url: img.url,
          altText: img.altText || product.title,
          width: img.width,
          height: img.height,
        }))
      : [
          {
            url: product.featuredImage?.url || FALLBACK_IMAGE_URL,
            altText: product.featuredImage?.altText || product.title,
            width: product.featuredImage?.width,
            height: product.featuredImage?.height,
          },
        ];

  const featuredImage: NormalizedProductImage = product.featuredImage?.url
    ? {
        url: product.featuredImage.url,
        altText: product.featuredImage.altText || product.title,
        width: product.featuredImage.width,
        height: product.featuredImage.height,
      }
    : images[0];

  // 3. Product Options Normalization
  const options: NormalizedProductOption[] = (product.options || [])
    .filter((opt) => opt && opt.name)
    .map((opt) => ({
      name: opt.name,
      values: opt.values || [],
    }));

  // 4. Product Variants Normalization
  const variants: NormalizedProductVariant[] = (product.variants?.edges || [])
    .map((edge) => edge.node)
    .filter(Boolean)
    .map((v) => {
      const vPrice = parseFloat(v.price?.amount || '0');
      const vCompare = v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : null;
      const selectedOptions: Record<string, string> = {};
      (v.selectedOptions || []).forEach((opt) => {
        if (opt.name) selectedOptions[opt.name] = opt.value;
      });

      return {
        id: v.id,
        title: v.title || 'Default Title',
        availableForSale: Boolean(v.availableForSale),
        price: isNaN(vPrice) ? 0 : vPrice,
        formattedPrice: formatPrice(isNaN(vPrice) ? 0 : vPrice, currency),
        compareAtPrice: vCompare && !isNaN(vCompare) ? vCompare : null,
        formattedCompareAtPrice:
          vCompare && !isNaN(vCompare) ? formatPrice(vCompare, currency) : null,
        selectedOptions,
        image: v.image?.url
          ? {
              url: v.image.url,
              altText: v.image.altText || v.title,
            }
          : null,
      };
    });

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description || '',
    availableForSale: Boolean(product.availableForSale),
    price,
    formattedPrice: formatPrice(price, currency),
    compareAtPrice,
    currency,
    featuredImage,
    images,
    options,
    variants,
    tags: product.tags || [],
    productType: product.productType || '',
    vendor: product.vendor || '',
  };
}

/* ─────────────────────────────────────────────────────────────
   Pre-built GraphQL Queries for Verification & Product Retrieval
   ───────────────────────────────────────────────────────────── */

/**
 * Diagnostic query to verify store connectivity and credentials.
 * Does not depend on any products existing in the store.
 */
export async function getShopInfo(): Promise<ShopifyShopInfo> {
  const query = `
    query getShopInfo {
      shop {
        name
        description
        primaryDomain {
          host
          url
        }
        paymentSettings {
          countryCode
          currencyCode
        }
      }
    }
  `;

  const data = await shopifyFetch<{ shop: ShopifyShopInfo }>({
    query,
    cache: 'no-store',
  });

  return data.shop;
}

export interface FetchShopifyProductsOptions {
  first?: number;
  after?: string | null;
  query?: string | null;
  sortKey?: 'TITLE' | 'PRICE' | 'BEST_SELLING' | 'CREATED_AT' | 'RELEVANCE';
  reverse?: boolean;
}

/**
 * Reusable function to fetch and paginate products from Shopify Storefront API.
 * Includes complete product metadata: ID, title, handle, description, images,
 * prices, currencies, variants, availability, and product options.
 */
export async function fetchShopifyProducts(
  options: FetchShopifyProductsOptions = {}
): Promise<ShopifyProductsResult> {
  const {
    first = 24,
    after = null,
    query = null,
    sortKey = 'BEST_SELLING',
    reverse = false,
  } = options;

  const graphqlQuery = `
    query getProducts(
      $first: Int!
      $after: String
      $query: String
      $sortKey: ProductSortKeys
      $reverse: Boolean
    ) {
      products(
        first: $first
        after: $after
        query: $query
        sortKey: $sortKey
        reverse: $reverse
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            id
            handle
            title
            description
            descriptionHtml
            availableForSale
            productType
            vendor
            tags
            options {
              id
              name
              values
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              url
              altText
              width
              height
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 25) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: {
      pageInfo: ShopifyPageInfo;
      edges: Array<{ cursor: string; node: ShopifyProduct }>;
    };
  }>({
    query: graphqlQuery,
    variables: { first, after, query, sortKey, reverse },
    revalidate: 60,
    tags: ['shopify-products'],
  });

  const rawEdges = data?.products?.edges || [];
  const pageInfo: ShopifyPageInfo = data?.products?.pageInfo || {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  };

  const normalizedProducts = rawEdges.map((edge) => normalizeShopifyProduct(edge.node));

  return {
    products: normalizedProducts,
    pageInfo,
    totalReturned: normalizedProducts.length,
  };
}

/**
 * Retrieves a single product by handle with normalized properties.
 */
export async function getShopifyProductByHandle(
  handle: string
): Promise<NormalizedShopifyProduct | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        description
        descriptionHtml
        availableForSale
        productType
        vendor
        tags
        options {
          id
          name
          values
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
          width
          height
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 25) {
          edges {
            node {
              id
              title
              availableForSale
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query,
    variables: { handle },
    revalidate: 60,
    tags: [`shopify-product-${handle}`],
  });

  return data.product ? normalizeShopifyProduct(data.product) : null;
}

/**
 * Retrieves collections from Shopify Storefront API.
 */
export async function getShopifyCollections(
  first = 10
): Promise<ShopifyCollection[]> {
  const query = `
    query getCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            handle
            title
            description
            image {
              url
              altText
            }
            products(first: 12) {
              edges {
                node {
                  id
                  handle
                  title
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  featuredImage {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    collections: { edges: Array<{ node: ShopifyCollection }> };
  }>({
    query,
    variables: { first },
    revalidate: 120,
    tags: ['shopify-collections'],
  });

  return data.collections.edges.map((edge) => edge.node);
}

/* ─────────────────────────────────────────────────────────────
   Modern Shopify Storefront Cart API (Non-deprecated)
   ───────────────────────────────────────────────────────────── */

const CART_FRAGMENT = `
  fragment CartDetails on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
            amountPerQuantity {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              product {
                id
                title
                handle
              }
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Creates a new Shopify cart with optional initial line items.
 */
export async function createShopifyCart(
  lines: Array<{ merchandiseId: string; quantity: number }> = []
): Promise<ShopifyCart> {
  const query = `
    mutation createCart($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart {
          ...CartDetails
        }
        userErrors {
          code
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const data = await shopifyFetch<{
    cartCreate: {
      cart: ShopifyCart | null;
      userErrors: ShopifyCartUserError[];
    };
  }>({
    query,
    variables: { lines },
    cache: 'no-store',
  });

  if (data.cartCreate.userErrors && data.cartCreate.userErrors.length > 0) {
    const errorMsg = data.cartCreate.userErrors.map((e) => e.message).join('; ');
    throw new Error(`Shopify cart creation error: ${errorMsg}`);
  }

  if (!data.cartCreate.cart) {
    throw new Error('Shopify failed to return a valid cart object.');
  }

  return data.cartCreate.cart;
}

/**
 * Adds items to an existing Shopify cart.
 */
export async function addLinesToShopifyCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<ShopifyCart> {
  const query = `
    mutation addLinesToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartDetails
        }
        userErrors {
          code
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart: ShopifyCart | null;
      userErrors: ShopifyCartUserError[];
    };
  }>({
    query,
    variables: { cartId, lines },
    cache: 'no-store',
  });

  if (data.cartLinesAdd.userErrors && data.cartLinesAdd.userErrors.length > 0) {
    const errorMsg = data.cartLinesAdd.userErrors.map((e) => e.message).join('; ');
    throw new Error(`Shopify cart item add error: ${errorMsg}`);
  }

  if (!data.cartLinesAdd.cart) {
    throw new Error('Shopify failed to update cart lines.');
  }

  return data.cartLinesAdd.cart;
}

/**
 * Updates item quantities in an existing Shopify cart.
 */
export async function updateShopifyCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<ShopifyCart> {
  const query = `
    mutation updateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartDetails
        }
        userErrors {
          code
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const data = await shopifyFetch<{
    cartLinesUpdate: {
      cart: ShopifyCart | null;
      userErrors: ShopifyCartUserError[];
    };
  }>({
    query,
    variables: { cartId, lines },
    cache: 'no-store',
  });

  if (data.cartLinesUpdate.userErrors && data.cartLinesUpdate.userErrors.length > 0) {
    const errorMsg = data.cartLinesUpdate.userErrors.map((e) => e.message).join('; ');
    throw new Error(`Shopify cart line update error: ${errorMsg}`);
  }

  if (!data.cartLinesUpdate.cart) {
    throw new Error('Shopify failed to update cart quantities.');
  }

  return data.cartLinesUpdate.cart;
}

/**
 * Removes items from an existing Shopify cart.
 */
export async function removeShopifyCartLines(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const query = `
    mutation removeCartLines($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartDetails
        }
        userErrors {
          code
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `;

  const data = await shopifyFetch<{
    cartLinesRemove: {
      cart: ShopifyCart | null;
      userErrors: ShopifyCartUserError[];
    };
  }>({
    query,
    variables: { cartId, lineIds },
    cache: 'no-store',
  });

  if (data.cartLinesRemove.userErrors && data.cartLinesRemove.userErrors.length > 0) {
    const errorMsg = data.cartLinesRemove.userErrors.map((e) => e.message).join('; ');
    throw new Error(`Shopify cart line removal error: ${errorMsg}`);
  }

  if (!data.cartLinesRemove.cart) {
    throw new Error('Shopify failed to remove line from cart.');
  }

  return data.cartLinesRemove.cart;
}

/**
 * Retrieves an existing Shopify cart by ID.
 */
export async function getShopifyCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartDetails
      }
    }
    ${CART_FRAGMENT}
  `;

  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query,
    variables: { cartId },
    cache: 'no-store',
  });

  return data.cart;
}

/**
 * Fetches public collections from Shopify Storefront API.
 */
export async function fetchShopifyCollections(
  first: number = 20
): Promise<ShopifyCollectionsResult> {
  const query = `
    query getCollections($first: Int!) {
      collections(first: $first) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            handle
            title
            description
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    collections: {
      pageInfo: ShopifyPageInfo;
      edges: Array<{
        node: {
          id: string;
          handle: string;
          title: string;
          description: string;
          image: { url: string; altText: string | null; width?: number; height?: number } | null;
        };
      }>;
    };
  }>({
    query,
    variables: { first },
    cache: 'no-store',
  });

  const collections: NormalizedShopifyCollection[] = (
    data.collections?.edges || []
  ).map((edge) => ({
    id: edge.node.id,
    handle: edge.node.handle,
    title: edge.node.title,
    description: edge.node.description || '',
    image: edge.node.image?.url
      ? {
          url: edge.node.image.url,
          altText: edge.node.image.altText || edge.node.title,
          width: edge.node.image.width,
          height: edge.node.image.height,
        }
      : null,
  }));

  return {
    collections,
    pageInfo: data.collections?.pageInfo || {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
    totalReturned: collections.length,
  };
}

/**
 * Fetches products belonging to a specific collection handle.
 */
export async function fetchProductsByCollection(
  handle: string,
  options: { first?: number; sortKey?: string; reverse?: boolean } = {}
): Promise<ShopifyProductsResult> {
  const { first = 24, sortKey = 'BEST_SELLING', reverse = false } = options;

  const query = `
    query getCollectionProducts($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
      collection(handle: $handle) {
        id
        title
        handle
        products(first: $first, sortKey: $sortKey, reverse: $reverse) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              handle
              title
              description
              descriptionHtml
              availableForSale
              productType
              vendor
              tags
              featuredImage {
                url
                altText
                width
                height
              }
              images(first: 10) {
                edges {
                  node {
                    url
                    altText
                    width
                    height
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              options {
                id
                name
                values
              }
              variants(first: 25) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    selectedOptions {
                      name
                      value
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    collection: {
      id: string;
      title: string;
      handle: string;
      products: {
        pageInfo: ShopifyPageInfo;
        edges: Array<{ node: ShopifyProduct }>;
      };
    } | null;
  }>({
    query,
    variables: { handle, first, sortKey, reverse },
    cache: 'no-store',
  });

  if (!data.collection?.products) {
    return {
      products: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
      totalReturned: 0,
    };
  }

  const rawProducts = data.collection.products.edges.map((e) => e.node);
  const normalized = rawProducts.map(normalizeShopifyProduct);

  return {
    products: normalized,
    pageInfo: data.collection.products.pageInfo,
    totalReturned: normalized.length,
  };
}

