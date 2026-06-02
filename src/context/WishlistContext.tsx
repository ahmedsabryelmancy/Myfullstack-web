import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Product } from "../types/product";

type WishlistContextValue = {
  savedItems: Product[];
  savedCount: number;
  toggleSavedItem: (product: Product) => void;
  isSaved: (productId: number) => boolean;
  clearSavedItems: () => void;
};

const SAVED_ITEMS_STORAGE_KEY = "ahmed-store-saved-items";

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [savedItems, setSavedItems] = useState<Product[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const storedItems = window.localStorage.getItem(SAVED_ITEMS_STORAGE_KEY);
    if (!storedItems) {
      setHasHydrated(true);
      return;
    }

    try {
      setSavedItems(JSON.parse(storedItems) as Product[]);
    } catch {
      window.localStorage.removeItem(SAVED_ITEMS_STORAGE_KEY);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(savedItems));
  }, [hasHydrated, savedItems]);

  const toggleSavedItem = (product: Product) => {
    setSavedItems((currentItems) => {
      const alreadySaved = currentItems.some((item) => item.id === product.id);

      if (alreadySaved) {
        return currentItems.filter((item) => item.id !== product.id);
      }

      return [...currentItems, product];
    });
  };

  const isSaved = (productId: number) => {
    return savedItems.some((item) => item.id === productId);
  };

  const clearSavedItems = () => {
    setSavedItems([]);
  };

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

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
}