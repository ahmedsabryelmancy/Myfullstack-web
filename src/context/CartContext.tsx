import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Product } from "../types/product";

type CartItem = {
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

const CART_STORAGE_KEY = "ahmed-store-cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) {
      setHasHydrated(true);
      return;
    }

    try {
      const parsedCart = JSON.parse(storedCart) as CartItem[];
      setCartItems(parsedCart);
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, hasHydrated]);

  const addToCart = (product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id);

      if (!existingItem) {
        return [...currentItems, { product, quantity: 1 }];
      }

      return currentItems.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    });
  };

  const decreaseQuantity = (productId: number) => {
    setCartItems((currentItems) => {
      return currentItems
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getProductQuantity = (productId: number) => {
    return cartItems.find((item) => item.product.id === productId)?.quantity ?? 0;
  };

  const isInCart = (productId: number) => {
    return getProductQuantity(productId) > 0;
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
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

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}