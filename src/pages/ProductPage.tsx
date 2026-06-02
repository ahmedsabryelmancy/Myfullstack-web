import { Link, useParams } from "react-router-dom";
import { PageLoader } from "../components/ui/PageLoader";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { ProductCard } from "../features/products/components/ProductCard";
import {
  getDiscountPercent,
  getProductImagePath,
  useProducts,
} from "../features/products/hooks/useProducts";

export function ProductPage() {
  const { addToCart, getProductQuantity, isInCart } = useCart();
  const { isSaved, toggleSavedItem } = useWishlist();
  const { productId } = useParams();
  const { products, loading, error } = useProducts();
  const product = products.find((item) => String(item.id) === productId);
  const relatedProducts = product
    ? products
        .filter((item) => item.id !== product.id && item.catetory === product.catetory)
        .slice(0, 4)
    : [];
  const discount = product ? getDiscountPercent(product) : null;
  const quantityInCart = product ? getProductQuantity(product.id) : 0;
  const inCart = product ? isInCart(product.id) : false;
  const saved = product ? isSaved(product.id) : false;

  if (loading) {
    return <PageLoader title="Loading product details" message="Preparing the gallery, pricing, and recommendations for this item." />;
  }

  if (error) {
    return (
      <section className="page_state">
        <div className="container">
          <p>{error}</p>
          <Link to="/" className="btn">
            Back to home
          </Link>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="page_state">
        <div className="container">
          <h1>Hey Product not found</h1>
          <p>That product is not available or the link is invalid.</p>
          <Link to="/" className="btn">
            Back to home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="product_page">
      <div className="container">
        <nav className="product_breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{product.catetory}</span>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product_hero">
          <div className="product_gallery_card">
            {discount ? <span className="product_badge">Save {discount}%</span> : null}
            <div className="product_image_wrap">
              <img src={getProductImagePath(product.img)} alt={product.name} />
            </div>

            <div className="product_glance_grid">
              <div>
                <strong>Fast Delivery</strong>
                <p>Same-week shipping on featured stock.</p>
              </div>
              <div>
                <strong>Warranty</strong>
                <p>Protected support for eligible electronics.</p>
              </div>
              <div>
                <strong>Easy Returns</strong>
                <p>Simple return flow with tracked orders.</p>
              </div>
            </div>
          </div>

          <div className="product_summary_card">
            <p className="product_eyebrow">{product.catetory}</p>
            <h1>{product.name}</h1>

            <div className="product_rating_row">
              <div className="stars" aria-hidden="true">
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
              </div>
              <span>4.9 rating</span>
              <span>128 reviews</span>
            </div>

            <div className="product_price_panel">
              <div>
                <span className="product_price_label">Now</span>
                <strong>${product.price}</strong>
              </div>
              {product.old_price ? (
                <div>
                  <span className="product_price_label">Before</span>
                  <p>${product.old_price}</p>
                </div>
              ) : null}
            </div>

            <p className="product_description">
              Built for shoppers who want dependable performance without sacrificing design,
              this product page is now routed in React and ready for real catalog data,
              cart actions, and richer merchandising.
            </p>

            <div className="product_feature_list">
              <div>
                <i className="fa-solid fa-bolt" />
                <span>Optimized for everyday use and premium presentation.</span>
              </div>
              <div>
                <i className="fa-solid fa-shield-heart" />
                <span>Secure checkout flow can be connected next.</span>
              </div>
              <div>
                <i className="fa-solid fa-box-open" />
                <span>Inventory, variants, and delivery rules can layer onto this screen.</span>
              </div>
            </div>

            <div className="product_cta_row">
              <button
                type="button"
                className={`btn product_primary_cta ${inCart ? "product_primary_cta_active" : ""}`}
                onClick={() => addToCart(product)}
              >
                <i className="fa-solid fa-cart-shopping" />
                {inCart ? `Add another (${quantityInCart} in cart)` : "Add to cart"}
              </button>
              <button
                type="button"
                className={`product_secondary_cta ${saved ? "product_secondary_cta_active" : ""}`}
                onClick={() => toggleSavedItem(product)}
              >
                <i className={saved ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
                {saved ? "Saved item" : "Save item"}
              </button>
            </div>

            <div className="product_meta_strip">
              <div>
                <span>SKU</span>
                <strong>AHM-{product.id.toString().padStart(4, "0")}</strong>
              </div>
              <div>
                <span>In cart</span>
                <strong>{quantityInCart}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>In stock</strong>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length ? (
          <div className="related_products_section">
            <div className="related_products_heading">
              <p>You may also like</p>
              <h2>Related picks from the same category</h2>
            </div>

            <div className="related_products_grid">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}