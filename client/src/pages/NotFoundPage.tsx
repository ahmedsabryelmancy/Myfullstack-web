import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="page_state">
      <div className="container">
        <h1>Page not found</h1>
        <h2>Check the product ID</h2>
        <p>The page you requested does not exist in the current storefront build.</p>
        <Link to="/" className="btn">
          Return home
        </Link>
      </div>
    </section>
  );
}