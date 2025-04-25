import { Layout } from "../Layout/Layout";
import s from "./BlogSection.module.css";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useRef, useState } from "react";

const items = [
  {
    id: 1,
    category: "СТАТТІ",
    title: "Як створити ідеальний набір для зимового догляду за шкірою",
    image: "/temporarily/Mask group-1.jpg",
    link: "/articles/winter-skincare-set",
  },
  {
    id: 2,
    category: "БРЕНДИ",
    title: "Секрети сяючого макіяжу для новорічних вечірок",
    image: "/temporarily/Mask group-2.jpg",
    link: "/brands/holiday-makeup-secrets",
  },
  {
    id: 3,
    category: "ДОБІРКИ",
    title:
      "Догляд за волоссям у зимовий період: топ-продукти для живлення та зволоження",
    image: "/temporarily/Mask group.jpg",
    link: "/collections/winter-haircare",
  },
];

export const BlogSection = () => {
  const { width } = useWindowSize();
  const isMobile = width < 1024;

  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const prevButtonRef = useRef<HTMLDivElement | null>(null);
  const nextButtonRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className={s.section}>
      <Layout>
        <div className={s.titleContainer}>
          <h2>
            <span>Наші</span>
            <span>новини</span>
          </h2>
          <Link to="/journal">
            <span>Перейти до журналу</span>
            <svg viewBox="0 0 25 25" fill="none">
              <path d="M17.9177 5.5L16.8487 6.55572L21.6059 11.2535H0.5V12.7465H21.6059L16.8487 17.4443L17.9177 18.5L24.5 12L17.9177 5.5Z" />
            </svg>
          </Link>
        </div>

        {isMobile ? (
          <div>
            <Swiper
              className={s.swiper}
              slidesPerView={1.1}
              spaceBetween={16}
              onSwiper={setSwiperInstance}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              navigation={{
                prevEl: prevButtonRef.current,
                nextEl: nextButtonRef.current,
              }}
              modules={[Navigation, Pagination]}
            >
              {items.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className={s.blogItem}>
                    <div className={s.blogImage}>
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className="px-[4.2vw]">
                      <h3>{item.category}</h3>
                      <p>{item.title}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {isMobile && (
              <div className="flex justify-between items-center mt-[9.6vw]">
                <div className={s.customPagination}>
                  {items.map((_, index) => (
                    <span
                      key={index}
                      onClick={() => swiperInstance?.slideTo(index)}
                      className={`${s.dot} ${
                        activeIndex === index ? s.activeDot : ""
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-[8vw]">
                  <div
                    ref={prevButtonRef}
                    className={`${s.prevBtn} ${s.navigationButton}`}
                  >
                    <svg
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_480_5408)">
                        <path d="M7.08228 5L8.15132 6.05572L3.39413 10.7535L24.5 10.7535V12.2465L3.39413 12.2465L8.15132 16.9443L7.08228 18L0.5 11.5L7.08228 5Z" />
                      </g>
                      <defs>
                        <clipPath id="clip0_480_5408">
                          <rect
                            width="24"
                            height="24"
                            fill="white"
                            transform="matrix(-1 0 0 1 24.5 0)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div
                    ref={nextButtonRef}
                    className={`${s.nextBtn} ${s.navigationButton}`}
                  >
                    <svg
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_480_5411)">
                        <path d="M17.9177 5L16.8487 6.05572L21.6059 10.7535H0.5V12.2465H21.6059L16.8487 16.9443L17.9177 18L24.5 11.5L17.9177 5Z" />
                      </g>
                      <defs>
                        <clipPath id="clip0_480_5411">
                          <rect
                            width="24"
                            height="24"
                            fill="white"
                            transform="translate(0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ul className={s.blogList}>
            {items.map((item) => (
              <li key={item.id}>
                <div className={s.blogImage}>
                  <img src={item.image} alt={item.title} />
                </div>
                <h3>{item.category}</h3>
                <p>{item.title}</p>
              </li>
            ))}
          </ul>
        )}
      </Layout>
    </section>
  );
};
