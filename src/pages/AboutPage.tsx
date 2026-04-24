import { navPageByPath } from "../data/site";

export function AboutPage() {
  const page = navPageByPath["/about"];

  if (!page) return null;

  return (
    <section className="about_page">
      <div className="container">
        <div className="content_page_hero">
          <p className="content_page_eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>

        <div className="about_grid">
          <div className="about_card">
            <div className="about_card_icon">
              <i className="fa-solid fa-microchip" />
            </div>
            <h3>Curated Tech</h3>
            <p>
              We handpick every device to ensure it meets our standards for
              performance and reliability.
            </p>
          </div>
          <div className="about_card">
            <div className="about_card_icon">
              <i className="fa-solid fa-truck-fast" />
            </div>
            <h3>Fast Discovery</h3>
            <p>
              Our storefront is optimized for speed, helping you find what you
              need without the clutter.
            </p>
          </div>
          <div className="about_card">
            <div className="about_card_icon">
              <i className="fa-solid fa-headset" />
            </div>
            <h3>Human Support</h3>
            <p>
              Real people ready to help with your orders and technical
              questions, every day.
            </p>
          </div>
        </div>

        <div className="about_story">
          <h2>Our Story</h2>
          <p>
            Founded on the principle of reliable shopping, Ahmed Store aims to
            bridge the gap between high-end technology and everyday
            accessibility. We believe that buying tech should be as simple as
            using it.
          </p>
        </div>
      </div>
    </section>
  );
}
