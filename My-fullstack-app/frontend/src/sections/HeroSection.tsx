import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { heroSlides } from "../data/site";

export function HeroSection() {
  return (
    <div className="slider">
      <div className="container">
        <Swiper
          className="slide-swp"
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 2500 }}
          loop
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide}>
              <a href="#">
                <img src={slide} alt="Featured store banner" />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="banner_2">
          <a href="#">
            <img src="/img/banner_home3.png" alt="Special offer banner" />
          </a>
        </div>
      </div>
    </div>
  );
}