import { Link } from "react-router-dom";
import { catalogCategoryLinks, navLinks } from "../../data/site";

const featuredCategories = catalogCategoryLinks.slice(1, 5);

export function Footer() {
  return (
    <footer className="site_footer">
      <div className="container">
        <div className="site_footer_grid">
          <div className="site_footer_brand">
            <p className="site_footer_kicker">Ahmed Store</p>
            <h2>Reliable tech, daily essentials, and sharper deals in one storefront.</h2>
            <p>
              Shop curated electronics, mobile devices, and home upgrades with a cleaner browsing
              flow from homepage discovery to checkout.
            </p>

            <div className="site_footer_contact">
              <a href="tel:+201223835394">+201223835394</a>
              <a href="tel:+201044538772">+201044538772</a>
              <a href="mailto:support@ahmedstore.com">support@ahmedstore.com</a>
            </div>
          </div>

          <div>
            <p className="site_footer_heading">Explore</p>
            <div className="site_footer_links">
              {navLinks.map((item) => (
                <Link key={item.path} to={item.path}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="site_footer_heading">Categories</p>
            <div className="site_footer_links">
              {featuredCategories.map((item) => (
                <Link key={item.path} to={item.path}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="site_footer_heading">Shop With Confidence</p>
            <div className="site_footer_points">
              <div>
                <strong>Fast search</strong>
                <span>Jump from the homepage to matching products in a few keystrokes.</span>
              </div>
              <div>
                <strong>Saved picks</strong>
                <span>Keep shortlisted products ready for later comparison.</span>
              </div>
              <div>
                <strong>Clean checkout flow</strong>
                <span>Review cart totals clearly before placing an order.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="site_footer_bottom">
          <p>© {new Date().getFullYear()} Ahmed Store. Built for faster product discovery.</p>
          <div className="site_footer_bottom_links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/saved-items">Saved items</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}