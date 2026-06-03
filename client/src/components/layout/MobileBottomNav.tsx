import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export function MobileBottomNav() {
  const { cartCount } = useCart();
  const { savedCount } = useWishlist();

  return (
    <nav className="mobile_bottom_nav" aria-label="Mobile navigation">
      <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
        <i className="fa-solid fa-house" />
        <span>Home</span>
      </NavLink>

      <NavLink to="/search" className={({ isActive }) => (isActive ? "active" : "")}>
        <i className="fa-solid fa-magnifying-glass" />
        <span>Search</span>
      </NavLink>

      <NavLink to="/cart" className={({ isActive }) => (isActive ? "active" : "")}>
        <span className="mobile_bottom_nav_badge_wrap">
          <i className="fa-solid fa-cart-arrow-down" />
          {cartCount > 0 && <span className="mobile_bottom_nav_badge">{cartCount}</span>}
        </span>
        <span>Cart</span>
      </NavLink>

      <NavLink to="/saved-items" className={({ isActive }) => (isActive ? "active" : "")}>
        <span className="mobile_bottom_nav_badge_wrap">
          <i className="fa-regular fa-heart" />
          {savedCount > 0 && <span className="mobile_bottom_nav_badge">{savedCount}</span>}
        </span>
        <span>Saved</span>
      </NavLink>
    </nav>
  );
}
