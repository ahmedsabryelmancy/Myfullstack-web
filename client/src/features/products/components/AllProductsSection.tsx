import { PageLoader } from "../../../components/ui/PageLoader";
import { ProductCard } from "./ProductCard";
import { useProducts } from "../hooks/useProducts";

export function AllProductsSection() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <PageLoader
        title="Loading more products"
        message="Gathering the full catalog so every item can be added to the cart."
      />
    );
  }

  return (
    <section className="all_products_section slide">
      <div className="container">
        <div className="top_slide">
          <h2>
            <i className="fa-solid fa-store" /> All Products
          </h2>
        </div>

        {error ? <p className="section_state error">{error}</p> : null}

        {!error ? (
          <div className="products_grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}