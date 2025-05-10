import { useSelector } from "react-redux";
import { Layout } from "../../components/Layout/Layout";
import s from "./BrandsPage.module.css";
import { RootState } from "../../store";
import { Link, useLocation } from "react-router";
import { Breadcrumbs } from "@mui/material";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useEffect } from "react";
import { API_URL } from "../../constants/api";
import { usePageData } from "../../hooks/usePageData";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const BrandsPage = () => {
  const brands = useSelector((state: RootState) => state.brands);
  const { width } = useWindowSize();
  const isMobile = width < 1024;
  const { t } = useTranslation();

  const breadcrumbs = [
    { name: t("breadCrumbs.main"), link: "/" },
    { name: t("breadCrumbs.brands"), link: "/brendy" },
  ];

  const groupedBrands = brands.items.reduce(
    (acc: Record<string, any[]>, brand) => {
      const firstLetter = brand.name[0].toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(brand);
      return acc;
    },
    {}
  );
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector(`.${s.alphabetNav}`);
      const scrollbar = document.querySelector(
        `.${s.scrollbar}`
      ) as HTMLElement;

      if (container && scrollbar) {
        const maxScroll = container.scrollWidth - container.clientWidth;

        const rawProgress =
          maxScroll > 0 ? (container.scrollLeft / maxScroll) * 100 : 0;

        const scrollProgress = Math.max(rawProgress, 15);

        scrollbar.style.width = `${scrollProgress}%`;
      }
    };

    const container = document.querySelector(`.${s.alphabetNav}`);
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll(); // 👉 виклик одразу для початкового значення
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [location]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const metaUrl = location.state || `${API_URL}/brendy`;

  const seoData = usePageData(metaUrl);

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
      <section>
        <Layout>
          <h1>{t("brands.title")}</h1>
          <span className={s.qty}>
            {t("brands.total", { count: brands.items.length })}
          </span>
        </Layout>

        {isMobile && (
          <>
            <div className={s.alphabetNav}>
              {["0-9", ...alphabet].map((char) => (
                <a
                  key={char}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(char);
                    if (element) {
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  className={`${s.navItem} ${
                    groupedBrands[char] ? "" : s.disabled
                  }`}
                >
                  {char}
                </a>
              ))}
            </div>

            <Layout>
              <div className={s.scroller}>
                <div className={s.scrollbarContainer}>
                  <div className={s.scrollbar}></div>
                </div>
              </div>
            </Layout>
          </>
        )}

        <Layout>
          {!isMobile && (
            <div className={s.alphabetNav}>
              {["0-9", ...alphabet].map((char) => (
                <a
                  key={char}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(char);
                    if (element) {
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  className={`${s.navItem} ${
                    groupedBrands[char] ? "" : s.disabled
                  }`}
                >
                  {char}
                </a>
              ))}
            </div>
          )}

          <div className={s.brandsList}>
            {Object.entries(groupedBrands).map(([letter, brands]) => (
              <div key={letter} id={letter} className={s.letterGroup}>
                <h2>{letter}</h2>
                <div className={s.brandItems}>
                  {brands.map((brand) => (
                    <Link
                      to={`/catalog?brand=${brand.id}`}
                      key={brand.id}
                      className={s.brandItem}
                    >
                      <div className={s.brandImageCircle}>
                        <div className="overflow-hidden rounded-full lg:w-[6.5vw] lg:h-[6.5vw] w-[22vw] h-[22vw]">
                          {brand.popular_product.image && (
                            <img
                              src={brand.popular_product.image}
                              alt={brand.name}
                            />
                          )}
                        </div>
                      </div>
                      <span>{brand.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Layout>
      </section>
    </main>
  );
};

export default BrandsPage;
