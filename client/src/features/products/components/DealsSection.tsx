import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard } from "./ProductCard";
import { useProducts } from "../hooks/useProducts";

export function DealsSection() {
  const { products, loading, error } = useProducts();
  const saleProducts = products.filter((product) => product.old_price);

  return (
    <div className="slider_products slide">
      <div className="container">
        <div className="top_slide">
          <h2>
            <i className="fa-solid fa-tags" /> Hot Deals
          </h2>
        </div>

        {loading ? <p className="section_state">Loading deals...</p> : null}
        {error ? <p className="section_state error">{error}</p> : null}

        {!loading && !error ? (
          <Swiper
            className="slide_product myswiper"
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{ delay: 2500 }}
            loop={saleProducts.length > 4}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1.15 },
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
          >
            {saleProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}
      </div>
    </div>
  );
}