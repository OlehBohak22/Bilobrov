import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import s from "./HomeHero.module.css";
import { Layout } from "../Layout/Layout";
import { Pagination, Autoplay, Navigation } from "swiper/modules"; // ✅ додали Navigation
import "./HomeHero.css";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";

export const HomeHero = () => {
  const { items: banners } = useSelector((state: RootState) => state.banner);
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const isMobile = width < 1024;

  const prevRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className={s.sliderContainer}>
      <Swiper
        modules={[Pagination, Autoplay, Navigation]} // ✅ додали Navigation
        pagination={{
          clickable: true,
        }}
        loop
        autoplay={{ delay: 5000 }}
        slidesPerView={1}
        className="banners-swiper"
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          // ✅ фікс для кастомних кнопок
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          swiper.params.navigation.prevEl = prevRef.current;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          swiper.params.navigation.nextEl = nextRef.current;
        }}
      >
        {banners.map(
          (banner: {
            load_image_text_img_mobile: string;
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
                  backgroundImage: `url(${
                    isMobile
                      ? banner.load_image_text_img_mobile
                      : banner.load_image_text_img_desktop
                  })`,
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
                    <span>{t("details")}</span>
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

        {!isMobile && (
          <>
            <div ref={prevRef} className={s.navBtn + " " + s.prevBtn}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div ref={nextRef} className={s.navBtn + " " + s.nextBtn}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </>
        )}
      </Swiper>
    </section>
  );
};
