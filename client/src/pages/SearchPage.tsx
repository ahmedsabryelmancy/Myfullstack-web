import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageLoader } from "../components/ui/PageLoader";
import { ProductCard } from "../features/products/components/ProductCard";
import { filterProductsBySearch } from "../features/products/search";
import { useProducts } from "../features/products/hooks/useProducts";

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const { products, loading, error } = useProducts();

  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "All categories";

  const results = useMemo(() => {
    return filterProductsBySearch(products, query, category);
  }, [category, products, query]);

  if (loading) {
    return (
      <PageLoader
        title="Searching products"
        message="Scanning the catalog for matching names and selected categories."
      />
    );
  }

  return (
    <section className="search_page">
      <div className="container">
        <div className="search_page_hero">
          <p className="content_page_eyebrow">Search results</p>
          <h1>Find products across the storefront</h1>
          <p>
            {query
              ? `Showing matches for "${query}"`
              : "Showing products for the selected search filters."}
          </p>

          <div className="search_filter_summary">
            <span>Query: {query || "Any product"}</span>
            <span>Category: {category}</span>
            <span>Matches: {results.length}</span>
          </div>
        </div>

        {error ? <p className="section_state error">{error}</p> : null}

        {!error && results.length ? (
          <div className="products_grid search_results_grid">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}

        {!error && !results.length ? (
          <div className="search_empty_state">
            <h2>No products matched this search</h2>
            <p>Try a different product name, remove the category filter, or return to the main catalog.</p>
            <div className="search_empty_actions">
              <Link to="/" className="btn">
                Browse home
              </Link>
              <Link to="/collections/electronics" className="content_page_text_link">
                Open electronics collection
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}