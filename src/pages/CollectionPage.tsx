import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { PageLoader } from "../components/ui/PageLoader";
import { categoryPageByPath } from "../data/site";
import { ProductCard } from "../features/products/components/ProductCard";
import { useProducts } from "../features/products/hooks/useProducts";

export function CollectionPage() {
  const location = useLocation();
  const { products, loading, error } = useProducts();
  const collection = categoryPageByPath[location.pathname];

  const filteredProducts = useMemo(() => {
    if (!collection) {
      return [];
    }

    return products.filter((product) => {
      const matchesCategory = collection.productCategories.includes(product.catetory);
      const matchesFeaturedRule = collection.featuredOnly ? Boolean(product.old_price) : true;
      return matchesCategory && matchesFeaturedRule;
    });
  }, [collection, products]);

  if (!collection) {
    return (
      <section className="page_state">
        <div className="container">
          <h1>Collection not found</h1>
          <p>The selected category page is not configured yet.</p>
          <Link to="/" className="btn">
            Return home
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <PageLoader
        title={`Loading ${collection.label}`}
        message="Preparing the collection grid and current product availability."
      />
    );
  }

  return (
    <section className="collection_page">
      <div className="container">
        <div className="collection_page_hero">
          <p className="content_page_eyebrow">Collection</p>
          <h1>{collection.label}</h1>
          <p>{collection.description}</p>
        </div>

        {error ? <p className="section_state error">{error}</p> : null}

        {!error && filteredProducts.length ? (
          <div className="products_grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}

        {!error && !filteredProducts.length ? (
          <div className="collection_empty_state">
            <h2>No products in this collection yet</h2>
            <p>This navbar route is ready, but the matching inventory has not been added.</p>
            <Link to="/" className="btn">
              Browse all products
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}