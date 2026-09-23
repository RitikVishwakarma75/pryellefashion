'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function getWishlistStorageKey(userId?: string | null): string {
  return userId ? `prayele_wishlist_${userId}` : 'prayele_wishlist_guest';
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [wishlist, setWishlistState] = useState<Product[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null | undefined>(undefined);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Helper to persist wishlist to isolated storage
  const persistWishlist = useCallback((items: Product[], uid?: string | null) => {
    try {
      const key = getWishlistStorageKey(uid);
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save isolated wishlist', e);
    }
  }, []);

  // Handle User Switching & Isolated Wishlist Hydration
  useEffect(() => {
    if (isAuthLoading) return;

    const currentUid = user?.userId || null;

    // Discard any obsolete un-scoped legacy wishlist
    try {
      localStorage.removeItem('prayele_wishlist');
    } catch {}

    if (activeUserId !== currentUid) {
      // Transitioning: Guest -> Logged In
      if (!activeUserId && currentUid) {
        let guestItems: Product[] = [];
        try {
          const rawGuest = localStorage.getItem('prayele_wishlist_guest');
          if (rawGuest) guestItems = JSON.parse(rawGuest);
        } catch {}

        let userItems: Product[] = [];
        try {
          const rawUser = localStorage.getItem(`prayele_wishlist_${currentUid}`);
          if (rawUser) userItems = JSON.parse(rawUser);
        } catch {}

        // Merge without duplicating products
        const mergedMap = new Map<string, Product>();
        userItems.forEach((p) => mergedMap.set(p.id, p));
        guestItems.forEach((p) => mergedMap.set(p.id, p));
        const merged = Array.from(mergedMap.values());

        // Clear guest wishlist
        try {
          localStorage.removeItem('prayele_wishlist_guest');
        } catch {}

        // Trigger server merge
        fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'merge' }),
        }).catch(() => {});

        persistWishlist(merged, currentUid);
        setWishlistState(merged);
      }
      // Transitioning: Logged In -> Logged Out (Logout)
      else if (activeUserId && !currentUid) {
        // Clear active favorites immediately so User A's items vanish
        setWishlistState([]);
        // Re-initialize clean guest wishlist
        try {
          const rawGuest = localStorage.getItem('prayele_wishlist_guest');
          const guestItems = rawGuest ? JSON.parse(rawGuest) : [];
          setWishlistState(Array.isArray(guestItems) ? guestItems : []);
        } catch {
          setWishlistState([]);
        }
      }
      // Initial mount or switching between accounts
      else {
        try {
          const raw = localStorage.getItem(getWishlistStorageKey(currentUid));
          const parsed = raw ? JSON.parse(raw) : [];
          setWishlistState(Array.isArray(parsed) ? parsed : []);
        } catch {
          setWishlistState([]);
        }
      }

      setActiveUserId(currentUid);
    }
  }, [user, activeUserId, isAuthLoading, persistWishlist]);

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    const next = exists
      ? wishlist.filter((p) => p.id !== product.id)
      : [...wishlist, product];

    setWishlistState(next);
    persistWishlist(next, user?.userId);

    // Sync to backend DB if authenticated
    if (isAuthenticated) {
      if (exists) {
        fetch('/api/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        }).catch(() => {});
      } else {
        fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        }).catch(() => {});
      }
    }
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
