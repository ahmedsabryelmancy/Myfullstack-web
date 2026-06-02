import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Product } from "../types/product";
import { useAuth } from "./AuthContext";
import { api, ApiError } from "../lib/api";

// ── Types ─────────────────────────────────────────────────
type WishlistContextValue = {
  savedItems: Product[];
  savedCount: number;
  toggleSavedItem: (product: Product) => void;
  isSaved: (productId: number) => boolean;
  clearSavedItems: () => void;
};

// ── Backend response shape ────────────────────────────────
type WishlistApiResponse = {
  success: boolean;
  items: Product[];
  count: number;
  saved?: boolean;
};

// ── Guest wishlist (localStorage) helpers ─────────────────
const GUEST_SAVED_KEY = "ahmed-store-saved-items";

function readGuestWishlist(): Product[] {
  try {
    const stored = localStorage.getItem(GUEST_SAVED_KEY);
    return stored ? (JSON.parse(stored) as Product[]) : [];
  } catch {
    return [];
  }
}

function saveGuestWishlist(items: Product[]) {
  localStorage.setItem(GUEST_SAVED_KEY, JSON.stringify(items));
}

// ── Context ───────────────────────────────────────────────
const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [savedItems, setSavedItems] = useState<Product[]>([]);

  // Load wishlist when auth state changes
  useEffect(() => {
    if (user) {
      api
        .get<WishlistApiResponse>("/api/wishlist")
        .then((data) => {
          if (data.success) setSavedItems(data.items);
        })
        .catch(() => {
          // Backend unreachable — fall back to guest wishlist
          setSavedItems(readGuestWishlist());
        });
    } else {
      setSavedItems(readGuestWishlist());
    }
  }, [user]);

  // Persist guest wishlist to localStorage when not logged in
  useEffect(() => {
    if (!user) {
      saveGuestWishlist(savedItems);
    }
  }, [savedItems, user]);

  // ── Mutations ───────────────────────────────────────────

  const toggleSavedItem = (product: Product) => {
    // Optimistic local update
    setSavedItems((prev) => {
      const alreadySaved = prev.some((i) => i.id === product.id);
      return alreadySaved ? prev.filter((i) => i.id !== product.id) : [...prev, product];
    });

    if (user) {
      api
        .post<WishlistApiResponse>(`/api/wishlist/${product.id}`)
        .then((data) => {
          if (data.success) setSavedItems(data.items);
        })
        .catch((err: unknown) => {
          if (!(err instanceof ApiError && err.status === 401)) {
            console.error("Wishlist sync error:", err);
          }
        });
    }
  };

  const clearSavedItems = () => {
    setSavedItems([]);
    if (user) {
      api.delete("/api/wishlist").catch(console.error);
    }
  };

  const isSaved = (productId: number) => savedItems.some((i) => i.id === productId);

  return (
    <WishlistContext.Provider
      value={{
        savedItems,
        savedCount: savedItems.length,
        toggleSavedItem,
        isSaved,
        clearSavedItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}
