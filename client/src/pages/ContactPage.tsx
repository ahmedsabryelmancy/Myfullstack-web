import { navPageByPath } from "../data/site";

export function ContactPage() {
  const page = navPageByPath["/contact"];

  if (!page) return null;

  return (
    <section className="contact_page">
      <div className="container">
        <div className="content_page_hero">
          <p className="content_page_eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>

        <div className="contact_layout">
          <div className="contact_info">
            <div className="contact_method">
              <i className="fa-solid fa-phone" />
              <div>
                <strong>Call us</strong>
                <p>+20 122 383 5394</p>
                <p>+20 104 453 8772</p>
              </div>
            </div>
            <div className="contact_method">
              <i className="fa-solid fa-envelope" />
              <div>
                <strong>Email support</strong>
                <p>support@ahmedstore.com</p>
              </div>
            </div>
            <div className="contact_method">
              <i className="fa-solid fa-location-dot" />
              <div>
                <strong>Main Office</strong>
                <p>Cairo, Egypt</p>
              </div>
            </div>
          </div>

          <div className="contact_form_panel">
            <h2>Send us a message</h2>
            <form className="contact_form" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Your name" required />
              <input type="email" placeholder="Email address" required />
              <textarea
                placeholder="How can we help you today?"
                rows={5}
                required
              />
              <button type="submit" className="btn">
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
