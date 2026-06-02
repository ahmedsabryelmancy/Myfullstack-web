import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductImagePath } from "../features/products/hooks/useProducts";

export function CartPage() {
  const {
    addToCart,
    cartItems,
    cartTotal,
    clearCart,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (!cartItems.length) {
    return (
      <section className="cart_page">
        <div className="container">
          <div className="cart_empty_state">
            <p className="cart_page_eyebrow">Your basket</p>
            <h1>Your cart is empty</h1>
            <p>Add products from the home page or any product screen to build your order.</p>
            <Link to="/" className="btn">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cart_page">
      <div className="container">
        <div className="cart_page_header">
          <div>
            <p className="cart_page_eyebrow">Your basket</p>
            <h1>Review your cart</h1>
            <p>{cartItems.length} unique products ready for checkout.</p>
          </div>

          <button type="button" className="cart_clear_button" onClick={clearCart}>
            Clear cart
          </button>
        </div>

        <div className="cart_layout">
          <div className="cart_items_list">
            {cartItems.map((item) => (
              <article className="cart_item_card" key={item.product.id}>
                <Link to={`/products/${item.product.id}`} className="cart_item_media">
                  <img
                    src={getProductImagePath(item.product.img)}
                    alt={item.product.name}
                  />
                </Link>

                <div className="cart_item_content">
                  <div className="cart_item_head">
                    <div>
                      <p className="cart_item_category">{item.product.catetory}</p>
                      <Link to={`/products/${item.product.id}`} className="cart_item_name">
                        {item.product.name}
                      </Link>
                    </div>

                    <button
                      type="button"
                      className="cart_remove_button"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="cart_item_footer">
                    <div className="cart_quantity_control">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.product.id)}
                        aria-label={`Decrease quantity of ${item.product.name}`}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => addToCart(item.product)}
                        aria-label={`Increase quantity of ${item.product.name}`}
                      >
                        +
                      </button>
                    </div>

                    <div className="cart_price_block">
                      <strong>${item.product.price * item.quantity}</strong>
                      <span>${item.product.price} each</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart_summary_card">
            <p className="cart_page_eyebrow">Order summary</p>
            <h2>Total</h2>

            <div className="cart_summary_rows">
              <div>
                <span>Items</span>
                <strong>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>Free</strong>
              </div>
              <div>
                <span>Subtotal</span>
                <strong>${cartTotal}</strong>
              </div>
            </div>

            <button type="button" className="btn cart_checkout_button">
              Proceed to checkout
            </button>

            <Link to="/" className="cart_continue_link">
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}