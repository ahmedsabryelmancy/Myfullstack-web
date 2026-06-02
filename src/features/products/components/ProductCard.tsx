import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { Product } from "../../../types/product";
import { getDiscountPercent, getProductImagePath } from "../hooks/useProducts";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, getProductQuantity, isInCart } = useCart();
  const { isSaved, toggleSavedItem } = useWishlist();
  const discount = getDiscountPercent(product);
  const quantityInCart = getProductQuantity(product.id);
  const inCart = isInCart(product.id);
  const saved = isSaved(product.id);

  return (
    <div className="product">
      {discount ? <span className="sale_present">%{discount}</span> : null}

      <div className="img_product">
        <Link to={`/products/${product.id}`}>
          <img src={getProductImagePath(product.img)} alt={product.name} />
        </Link>
      </div>

      <div className="stars" aria-hidden="true">
        <i className="fa-solid fa-star" />
        <i className="fa-solid fa-star" />
        <i className="fa-solid fa-star" />
        <i className="fa-solid fa-star" />
        <i className="fa-solid fa-star" />
      </div>

      <p className="name_product">
        <Link to={`/products/${product.id}`}>{product.name}</Link>
      </p>

      <div className="price">
        <p>
          <span>${product.price}</span>
        </p>
        {product.old_price ? <p className="old_price">${product.old_price}</p> : null}
      </div>

      <div className="icons">
        <button
          type="button"
          className={`btn_add_cart ${inCart ? "active" : ""}`}
          onClick={() => addToCart(product)}
        >
          <i className="fa-solid fa-cart-shopping" />
          {inCart ? ` in cart (${quantityInCart})` : " add to cart"}
        </button>
        <button
          type="button"
          className={`icon_product ${saved ? "saved" : ""}`}
          aria-label={saved ? "Remove from saved items" : "Add to saved items"}
          onClick={() => toggleSavedItem(product)}
        >
          <i className={saved ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
        </button>
      </div>
    </div>
  );
}