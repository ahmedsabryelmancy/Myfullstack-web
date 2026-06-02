import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { ProductCard } from "../features/products/components/ProductCard";

export function SavedItemsPage() {
  const { clearSavedItems, savedItems } = useWishlist();

  if (!savedItems.length) {
    return (
      <section className="saved_items_page">
        <div className="container">
          <div className="saved_items_empty_state">
            <p className="cart_page_eyebrow">Saved items</p>
            <h1>No saved items yet</h1>
            <p>Use the heart button on product cards or product pages to keep items for later.</p>
            <Link to="/" className="btn">
              Browse products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="saved_items_page">
      <div className="container">
        <div className="saved_items_header">
          <div>
            <p className="cart_page_eyebrow">Saved items</p>
            <h1>Your wishlist</h1>
            <p>Items you marked to review later stay here until you remove them.</p>
          </div>

          <button type="button" className="cart_clear_button" onClick={clearSavedItems}>
            Clear saved items
          </button>
        </div>

        <div className="products_grid saved_items_grid">
          {savedItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}