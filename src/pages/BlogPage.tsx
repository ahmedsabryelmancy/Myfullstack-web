import { Link } from "react-router-dom";
import { blogPosts, navPageByPath } from "../data/site";

export function BlogPage() {
  const pageInfo = navPageByPath["/blog"];

  return (
    <section className="blog_page">
      <div className="container">
        <div className="content_page_hero">
          <p className="content_page_eyebrow">
            {pageInfo?.eyebrow || "Editorial"}
          </p>
          <h1>{pageInfo?.title || "Stories & Guidance"}</h1>
          <p>{pageInfo?.description}</p>
        </div>

        <div className="blog_grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog_card">
              <div className="blog_card_image">
                <img src={post.image} alt={post.title} />
                <span className="blog_card_badge">{post.category}</span>
              </div>
              <div className="blog_card_content">
                <div className="blog_card_meta">
                  <i className="fa-regular fa-calendar" />
                  <span>{post.date}</span>
                </div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <div className="blog_card_footer">
                  <Link to={`/blog/${post.id}`} className="blog_card_link">
                    Read article <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
