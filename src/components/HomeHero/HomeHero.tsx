import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import s from "./HomeHero.module.css";
import { Layout } from "../Layout/Layout";
import { Pagination, Autoplay } from "swiper/modules";
import "./HomeHero.css";

export const HomeHero = () => {
  const { items: banners } = useSelector((state: RootState) => state.banner);

  return (
    <section className={s.sliderContainer}>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{
          clickable: true,
        }}
        loop
        autoplay={{ delay: 5000 }}
        slidesPerView={1}
        className="banners-swiper"
      >
        {banners.map(
          (banner: {
            id: number;
            load_image_text_img_desktop: string;
            input_title: string;
            input_description: string;
            input_link: string;
          }) => (
            <SwiperSlide key={banner.id}>
              <div
                className={s.slide}
                style={{
                  backgroundImage: `url(${banner.load_image_text_img_desktop})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Layout className={s.slideContent}>
                  <div>
                    <h3>{banner.input_title}</h3>
                    <p>{banner.input_description}</p>
                  </div>
                  <a href={banner.input_link}>
                    <span>Детальніше</span>
                    <svg
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_691_3833)">
                        <path d="M17.9177 5L16.8487 6.05572L21.6059 10.7535H0.5V12.2465H21.6059L16.8487 16.9443L17.9177 18L24.5 11.5L17.9177 5Z" />
                      </g>
                      <defs>
                        <clipPath id="clip0_691_3833">
                          <rect
                            width="24"
                            height="24"
                            fill="white"
                            transform="translate(0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                </Layout>
              </div>
            </SwiperSlide>
          )
        )}
      </Swiper>
    </section>
  );
};
