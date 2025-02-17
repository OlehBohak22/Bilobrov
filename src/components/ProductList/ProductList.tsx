import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import { ProductItem } from "../ProductItem/ProductItem";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import s from "./ProductList.module.css";
import { ProductInfo } from "../../types/productTypes";
import { Layout } from "../Layout/Layout";

interface ProductListProps {
  categories: string[];
  defaultCategory?: string;
  children?: React.ReactNode;
}

export const ProductList = ({
  categories,
  defaultCategory = "Новинки",
  children,
}: ProductListProps) => {
  const [activeTab, setActiveTab] = useState(defaultCategory);

  const { items: products = [] } = useSelector(
    (state: RootState) => state.products
  );

  const filterProducts = (
    products: ProductInfo[],
    tab: string
  ): ProductInfo[] => {
    let filteredProducts: ProductInfo[] = [];

    switch (tab) {
      case "Новинки":
        filteredProducts = [...products].sort(
          (a, b) =>
            new Date(b.date_created).getTime() -
            new Date(a.date_created).getTime()
        );
        break;
      case "Бестселлери":
        filteredProducts = [...products].sort(
          (a, b) => Number(b.total_sales) - Number(a.total_sales)
        );
        break;
      case "Акції":
        filteredProducts = products
          .filter((product) => product.sale_price && product.sale_price !== "0")
          .sort(
            (a, b) =>
              new Date(b.date_created).getTime() -
              new Date(a.date_created).getTime()
          );
        break;
      default:
        filteredProducts = [...products];
        break;
    }

    return filteredProducts.slice(0, 10); // Return first 10 products
  };

  const filteredProducts = filterProducts(products, activeTab);

  return (
    <div className={s.section}>
      <Layout>
        <div className={s.swiperController}>
          {children || (
            <ul className={s.tabsController}>
              {categories.map((tab) => (
                <li
                  key={tab}
                  className={`${s.tabItem} ${
                    activeTab === tab ? s.activeTab : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </li>
              ))}
            </ul>
          )}

          <div className={s.navigationContainer}>
            <button className={s.prevButton}>
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
            </button>
            <button className={s.nextButton}>
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
            </button>
          </div>
        </div>

        <Swiper
          key={activeTab} // This ensures that Swiper will reinitialize when the tab changes
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={5}
          navigation={{
            prevEl: `.${s.prevButton}`,
            nextEl: `.${s.nextButton}`,
          }}
          className={s.productListSwiper}
        >
          {filteredProducts.map((product: ProductInfo) => (
            <SwiperSlide key={product.id}>
              <ProductItem info={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Layout>
    </div>
  );
};
