import { useEffect, useState } from "react";
import { Product } from "../../../types/product";

type ProductsState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

export function useProducts(): ProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
    const response = await fetch("/products.json");
        if (!response.ok) {
          throw new Error("Failed to load products.");
        }

        const data = (await response.json()) as Product[];
        if (isActive) {
          setProducts(data);
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, []);

  return { products, loading, error };
}

export function getDiscountPercent(product: Product) {
  if (!product.old_price) {
    return null;
  }

  return Math.floor(((product.old_price - product.price) / product.old_price) * 100);
}

export function getProductImagePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}