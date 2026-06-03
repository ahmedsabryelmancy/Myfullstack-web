import { useEffect, useState } from "react";
import { Product } from "../../../types/product";
import { api } from "../../../lib/api";

type ProductsState = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

type ProductsApiResponse = {
  success: boolean;
  products: Product[];
  total: number;
};

export function useProducts(): ProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    api
      .get<ProductsApiResponse>("/api/products?limit=100")
      .then((data) => {
        if (isActive && data.success) {
          setProducts(data.products);
        }
      })
      .catch((err: unknown) => {
        if (isActive) {
          setError(err instanceof Error ? err.message : "Failed to load products.");
        }
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

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