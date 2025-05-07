import { Layout } from "../Layout/Layout";
import s from "./HomeServices.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useTranslation } from "react-i18next";

export const HomeServices = () => {
  const { width } = useWindowSize();
  const { t } = useTranslation();
  const services = t("homeServices.services", { returnObjects: true }) as {
    icon: string;
    title: string;
    description: string;
  }[];

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
