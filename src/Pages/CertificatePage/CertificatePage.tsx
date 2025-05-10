import { useSelector } from "react-redux";
import { Layout } from "../../components/Layout/Layout";
import s from "./CertificatePage.module.css";
import { RootState } from "../../store";
import { ProductItem } from "../../components/ProductItem/ProductItem";
import { Breadcrumbs } from "@mui/material";
import { Link, useLocation } from "react-router";
import { useRef, useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { API_URL } from "../../constants/api";
import { usePageData } from "../../hooks/usePageData";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const CertificatePage = () => {
  const { state } = useLocation();

  const metaUrl = state || `${API_URL}/certificate`;

  const seoData = usePageData(metaUrl);

  const prevButtonRef = useRef<HTMLDivElement | null>(null);
  const nextButtonRef = useRef<HTMLDivElement | null>(null);

  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { certificates } = useSelector((state: RootState) => state.filters);
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const isMobile = width < 1024;

  const breadcrumbs = [
    { name: t("breadCrumbs.main"), link: "/" },
    {
      name: t("breadCrumbs.certificates"),
      link: "/podarunkovi-sertyfikaty-20",
    },
  ];

  return (
    <main className={s.page}>
      <Helmet>
        <title>{seoData.title || "Bilobrov"}</title>
        <link
          rel="canonical"
          href={seoData.canonical || window.location.href}
        />

        {seoData.og_title && (
          <meta property="og:title" content={seoData.og_title} />
        )}
        {seoData.og_description && (
          <meta property="og:description" content={seoData.og_description} />
        )}
        {seoData.og_url && <meta property="og:url" content={seoData.og_url} />}
        {seoData.og_locale && (
          <meta property="og:locale" content={seoData.og_locale} />
        )}
        {seoData.og_type && (
          <meta property="og:type" content={seoData.og_type} />
        )}
        {seoData.og_site_name && (
          <meta property="og:site_name" content={seoData.og_site_name} />
        )}
        {seoData.twitter_card && (
          <meta name="twitter:card" content={seoData.twitter_card} />
        )}

        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
      </Helmet>

      <Layout>
        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
          {breadcrumbs.map((breadcrumb, index) => (
            <Link key={index} to={breadcrumb.link}>
              {breadcrumb.name}
            </Link>
          ))}
        </Breadcrumbs>
      </Layout>

      {isMobile && (
        <div className={s.hero}>
          <img src="/images/mobile-certificate-hero.avif" alt="" />
        </div>
      )}
      <Layout>
        {!isMobile && (
          <div className={s.hero}>
            <img src="/images/certificate-hero.avif" alt="" />
          </div>
        )}

        <div className={s.certificates}>
          <h2>
            <span>{t("certificatePage.titleLine1")}</span>
            <span>{t("certificatePage.titleLine2")}</span>
          </h2>

          {isMobile ? (
            <div>
              <Swiper
                onSwiper={setSwiperInstance}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={2}
                navigation={{
                  prevEl: prevButtonRef.current,
                  nextEl: nextButtonRef.current,
                }}
                className={s.productListSwiper}
              >
                {certificates.map((item) => (
                  <SwiperSlide className="h-auto!" key={item.id}>
                    <ProductItem certificate={true} info={item} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {isMobile && (
                <div className="flex justify-between items-center mt-[9.6vw]">
                  <div className={s.customPagination}>
                    {certificates.map((_, index) => (
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
            <ul className={s.list}>
              {certificates.map((item) => (
                <ProductItem certificate={true} info={item} />
              ))}
            </ul>
          )}
        </div>
      </Layout>
    </main>
  );
};

export default CertificatePage;
