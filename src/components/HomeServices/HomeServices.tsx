import { Layout } from "../Layout/Layout";
import s from "./HomeServices.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";

const services = [
  {
    icon: "icon-free-shipping",
    title: "Безкоштовна доставка по Україні",
    description:
      "Ваші улюблені продукти Bilobrov з доставкою без зайвих витрат у будь-який куточок України.",
  },
  {
    icon: "icon-psychiatry",
    title: "Підтримка та консультація",
    description:
      "Наші менеджери завжди готові допомогти підібрати потрібний засіб та відповісти на ваші запитання.",
  },
  {
    icon: "icon-gift-card",
    title: "Накопичуваний кешбек на покупки",
    description:
      "З кожної покупки в Bilobrov ви накопичуєте кешбек, який робить ваші майбутні замовлення вигіднішими.",
  },
  {
    icon: "icon-return-box",
    title: "Легкий обмін та повернення товарів",
    description:
      "Ми цінуємо вашу довіру та гарантуємо легкий обмін і повернення. Якщо продукт не підійшов, ми швидко замінимо його на інший",
  },
];

export const HomeServices = () => {
  const { width } = useWindowSize();
  const isMobile = width < 1024;
  const [progress, setProgress] = useState(0);

  const handleSlideChange = (swiper: any) => {
    const total = swiper.slides.length;
    const current = swiper.realIndex;
    setProgress((current + 1) / total);
  };

  return (
    <section className={s.section}>
      <Layout>
        {isMobile ? (
          <>
            <Swiper
              slidesPerView={1.3}
              spaceBetween={16}
              onSlideChange={handleSlideChange}
              onSwiper={(swiper) =>
                setTimeout(() => handleSlideChange(swiper), 0)
              }
              className={s.swiper}
            >
              {services.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className={s.slide}>
                    <div className={s.iconContainer}>
                      <svg>
                        <use href={`/icons/services-icons.svg#${item.icon}`} />
                      </svg>
                    </div>

                    <div className={s.descContainer}>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className={s.progressBar}>
              <div
                className={s.progressBarFill}
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
          </>
        ) : (
          <ul className={s.list}>
            {services.map((item, index) => (
              <li key={index}>
                <div className={s.iconContainer}>
                  <svg>
                    <use href={`/icons/services-icons.svg#${item.icon}`} />
                  </svg>
                </div>
                <div className={s.descContainer}>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Layout>
    </section>
  );
};
