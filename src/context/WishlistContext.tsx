'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  ReactNode,
} from 'react';
import { Product } from '@/types';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'prayele_wishlist';
const WISHLIST_EVENT = 'prayele-wishlist-change';

function subscribeToWishlist(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(WISHLIST_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(WISHLIST_EVENT, onStoreChange);
  };
}

function getWishlistSnapshot() {
  try {
    return localStorage.getItem(WISHLIST_STORAGE_KEY) ?? '[]';
  } catch {
    return '[]';
  }
}

function getServerWishlistSnapshot() {
  return '[]';
}

function writeWishlist(next: Product[]) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
  } catch {
    console.warn('Failed to save wishlist');
  }
  window.dispatchEvent(new Event(WISHLIST_EVENT));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const wishlistJson = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistSnapshot,
    getServerWishlistSnapshot
  );
  const wishlist = useMemo<Product[]>(() => {
    try {
      const parsed = JSON.parse(wishlistJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [wishlistJson]);

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    writeWishlist(
      exists ? wishlist.filter((p) => p.id !== product.id) : [...wishlist, product]
    );
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
