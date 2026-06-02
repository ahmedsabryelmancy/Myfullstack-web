import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useProducts } from "../../features/products/hooks/useProducts";
import { filterProductsBySearch } from "../../features/products/search";
import { CategoryNavItem, getCategoryRouteByLabel, headerCategoryLinks, navLinks } from "../../data/site";

type HeaderProps = {
  categories: CategoryNavItem[];
};

export function Header({ categories }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout, user } = useAuth();
  const { cartCount } = useCart();
  const { savedCount } = useWishlist();
  const { products } = useProducts();
  const searchBoxRef = useRef<HTMLFormElement | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(categories[0]?.label ?? "All categories");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (location.pathname === "/search") {
      setSearch(searchParams.get("q") ?? "");
      setCategory(searchParams.get("category") ?? (categories[0]?.label ?? "All categories"));
      return;
    }

    setSearch("");
    setCategory(categories[0]?.label ?? "All categories");
    setShowSuggestions(false);
  }, [categories, location.pathname, searchParams]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!searchBoxRef.current?.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const suggestions = useMemo(() => {
    if (search.trim().length < 2) {
      return [];
    }

    return filterProductsBySearch(products, search, category).slice(0, 5);
  }, [category, products, search]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      params.set("q", trimmedSearch);
    }

    if (category !== "All categories") {
      params.set("category", category);
    }

    setShowSuggestions(false);

    if (!trimmedSearch && category !== "All categories") {
      const categoryRoute = getCategoryRouteByLabel(category);
      if (categoryRoute) {
        navigate(categoryRoute);
        return;
      }
    }

    navigate(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <header>
      <div className="top_header">
        <div className="container">
          <Link to="/" className="logo" aria-label="Ahmed store home">
            <img src="/img/ahmed.jpg" alt="Ahmed store" />
          </Link>

          <form
            action=""
            className="search_box search_box_enhanced"
            onSubmit={handleSubmit}
            ref={searchBoxRef}
          >
            <div className="select_box">
              <select
                id="category"
                name="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item.path} value={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search for products"
              value={search}
              autoComplete="off"
              onChange={(event) => {
                setSearch(event.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setShowSuggestions(false);
                }
              }}
            />

            <button type="submit" aria-label="Search products">
              <i className="fa-solid fa-magnifying-glass" />
            </button>

            {showSuggestions && suggestions.length ? (
              <div className="search_suggestions" role="listbox" aria-label="Product suggestions">
                {suggestions.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="search_suggestion_item"
                    onClick={() => setShowSuggestions(false)}
                  >
                    <img src={product.img.startsWith("/") ? product.img : `/${product.img}`} alt={product.name} />
                    <div>
                      <strong>{product.name}</strong>
                      <span>${product.price}</span>
                    </div>
                  </Link>
                ))}
                <button type="submit" className="search_suggestion_action">
                  View all matching products
                </button>
              </div>
            ) : null}
          </form>

          <div className="header_icons">
            <div className="icon">
              <Link to="/saved-items" aria-label="Wishlist">
                <i className="fa-regular fa-heart" />
                <span className="count count_favourite">{savedCount}</span>
              </Link>
            </div>

            <Link to="/cart" className="icon" aria-label="Cart">
              <i className="fa-solid fa-cart-arrow-down" />
              <span className="count count_item_header">{cartCount}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bottom_header">
        <div className="container">
          <nav className="nav" aria-label="Main navigation">
            <div className="category_nav">
              <button
                type="button"
                className="category_btn"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={isMenuOpen}
              >
                <i className="fa-solid fa-bars" />
                <p>Browse Category</p>
                <i className="fa-solid fa-angle-down" />
              </button>

              <div className={`category_nav_list ${isMenuOpen ? "active" : ""}`}>
                {headerCategoryLinks.map((item) => (
                  <Link to={item.path} key={item.path} onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <ul className="nav_links">
              {navLinks.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    end={item.path === "/"}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="login_signup btns">
            {user ? (
              <>
                <div className="auth_user_chip" aria-label="Signed in user">
                  <span>Hello</span>
                  <strong>{user.name}</strong>
                </div>
                <button type="button" className="btn auth_logout_btn" onClick={logout}>
                  Logout <i className="fa-solid fa-arrow-right-from-bracket" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn">
                  Login <i className="fa-solid fa-right-to-bracket" />
                </Link>
                <Link to="/signup" className="btn">
                  Sign up <i className="fa-solid fa-user-plus" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}