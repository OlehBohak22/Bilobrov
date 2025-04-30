import { useSelector } from "react-redux";
import { Layout } from "../../components/Layout/Layout";
import s from "./BrandsPage.module.css";
import { RootState } from "../../store";
import { Link } from "react-router";
import { Breadcrumbs } from "@mui/material";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useEffect } from "react";

export const BrandsPage = () => {
  const brands = useSelector((state: RootState) => state.brands);
  const { width } = useWindowSize();
  const isMobile = width < 1024;

  const breadcrumbs = [
    { name: "Головна", link: "/" },
    { name: "Бренди", link: "/brendy" },
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

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector(`.${s.alphabetNav}`);
      const scrollbar = document.querySelector(
        `.${s.scrollbar}`
      ) as HTMLElement;

      if (container && scrollbar) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const scrollProgress = (container.scrollLeft / maxScroll) * 100;
        scrollbar.style.width = `${scrollProgress}%`;
      }
    };

    const container = document.querySelector(`.${s.alphabetNav}`);
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <main className={s.page}>
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
          <h1>Бренди</h1>
          <span className={s.qty}>{brands.items.length} брендів</span>
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
                  <div className={s.scrollbar}></div>і
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
