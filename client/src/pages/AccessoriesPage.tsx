import { useMemo } from "react";
import { navPageByPath } from "../data/site";
import { ProductCard } from "../features/products/components/ProductCard";
import { useProducts } from "../features/products/hooks/useProducts";
import { PageLoader } from "../components/ui/PageLoader";

export function AccessoriesPage() {
  const page = navPageByPath["/accessories"];
  const { products, loading } = useProducts();

  const accessoryProducts = useMemo(() => {
    // Filtering for items typically considered accessories
    return products.filter((p) => ["jewelry", "toys"].includes(p.catetory));
  }, [products]);

  if (!page) return null;

  if (loading) {
    return (
      <PageLoader
        title="Finding essentials"
        message="Scanning our catalog for the best accessory matches."
      />
    );
  }

  return (
    <section className="accessories_page">
      <div className="container">
        <div className="content_page_hero">
          <p className="content_page_eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>

        <div className="products_grid">
          {accessoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
