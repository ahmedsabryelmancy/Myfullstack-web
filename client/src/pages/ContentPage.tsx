import { Link } from "react-router-dom";
import { NavItem } from "../data/site";

type ContentPageProps = {
  page: NavItem;
};

export function ContentPage({ page }: ContentPageProps) {
  return (
    <section className="content_page">
      <div className="container">
        <div className="content_page_hero">
          <div className="content_page_intro">
            <p className="content_page_eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p>{page.description}</p>

            <div className="content_page_actions">
              <Link to="/" className="btn">
                Explore products
              </Link>
              <Link to="/cart" className="content_page_text_link">
                View cart
              </Link>
            </div>
          </div>

          <div className="content_page_panel">
            <h2>What this section supports</h2>
            <div className="content_page_highlights">
              {page.highlights.map((highlight) => (
                <div key={highlight}>
                  <i className="fa-solid fa-check" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}