import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Product } from "../types/product";
import { useAuth } from "./AuthContext";
import { api, ApiError } from "../lib/api";

// ── Types ─────────────────────────────────────────────────
export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getProductQuantity: (productId: number) => number;
  isInCart: (productId: number) => boolean;
};

// ── Backend response shape ────────────────────────────────
type BackendCartItem = {
  productSnapshot: Product;
  quantity: number;
};

type CartApiResponse = {
  success: boolean;
  items: BackendCartItem[];
  count: number;
  total: number;
};

// ── Guest cart (localStorage) helpers ────────────────────
const GUEST_CART_KEY = "ahmed-store-cart";

function readGuestCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items: CartItem[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

function fromBackend(items: BackendCartItem[]): CartItem[] {
  return items.map((item) => ({
    product: item.productSnapshot,
    quantity: item.quantity,
  }));
}

// ── Context ───────────────────────────────────────────────
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart when auth state changes
  useEffect(() => {
    if (user) {
      api
        .get<CartApiResponse>("/api/cart")
        .then((data) => {
          if (data.success) setCartItems(fromBackend(data.items));
        })
        .catch(() => {
          // Backend unreachable — fall back to guest cart
          setCartItems(readGuestCart());
        });
    } else {
      setCartItems(readGuestCart());
    }
  }, [user]);

  // Persist guest cart to localStorage when not logged in
  useEffect(() => {
    if (!user) {
      saveGuestCart(cartItems);
    }
  }, [cartItems, user]);

  // ── Mutations ───────────────────────────────────────────

  const addToCart = (product: Product) => {
    // Optimistic local update
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    if (user) {
      api
        .post<CartApiResponse>("/api/cart", { productId: product.id })
        .then((data) => {
          if (data.success) setCartItems(fromBackend(data.items));
        })
        .catch((err: unknown) => {
          if (!(err instanceof ApiError && err.status === 401)) {
            console.error("Cart sync error:", err);
          }
        });
    }
  };

  const decreaseQuantity = (productId: number) => {
    // Read current qty before updating (closure captures current render value)
    const currentItem = cartItems.find((i) => i.product.id === productId);
    const targetQty = (currentItem?.quantity ?? 1) - 1;

    setCartItems((prev) =>
      prev
        .map((i) => (i.product.id === productId ? { ...i, quantity: targetQty } : i))
        .filter((i) => i.quantity > 0),
    );

    if (user) {
      api
        .patch<CartApiResponse>(`/api/cart/${productId}`, { quantity: targetQty })
        .then((data) => {
          if (data.success) setCartItems(fromBackend(data.items));
        })
        .catch(console.error);
    }
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));

    if (user) {
      api
        .delete<CartApiResponse>(`/api/cart/${productId}`)
        .then((data) => {
          if (data.success) setCartItems(fromBackend(data.items));
        })
        .catch(console.error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      api.delete("/api/cart").catch(console.error);
    }
  };

  const getProductQuantity = (productId: number) =>
    cartItems.find((i) => i.product.id === productId)?.quantity ?? 0;

  const isInCart = (productId: number) => getProductQuantity(productId) > 0;

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getProductQuantity,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
