import { useSelector } from "react-redux";
import { Layout } from "../../components/Layout/Layout";
import s from "./BrandsPage.module.css";
import { RootState } from "../../store";
import { Link } from "react-router";
import { Breadcrumbs } from "@mui/material";

export const BrandsPage = () => {
  const brands = useSelector((state: RootState) => state.brands);

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
          <div className={s.alphabetNav}>
            {["0-9", ...alphabet].map((char) => (
              <a
                key={char}
                href={`#${char}`}
                className={`${s.navItem} ${
                  groupedBrands[char] ? "" : s.disabled
                }`}
              >
                {char}
              </a>
            ))}
          </div>
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
                        <div className="overflow-hidden rounded-full w-[6.5vw] h-[6.5vw]">
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
