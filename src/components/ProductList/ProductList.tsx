import { useState, useEffect, useRef, ReactNode } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchProducts } from "../../store/slices/productsSlice"; // API-запит
import { ProductItem } from "../ProductItem/ProductItem";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import s from "./ProductList.module.css";
import { ProductInfo } from "../../types/productTypes";
import { Layout } from "../Layout/Layout";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface ProductListProps {
  categories?: string[]; // categories можуть бути відсутні
  defaultCategory?: string; // параметр для категорії за замовчуванням
  children?: ReactNode;
}

export const ProductList = ({
  categories = [], // Якщо categories немає, це буде порожній масив
  defaultCategory = "Новинки",
  children,
}: ProductListProps) => {
  const dispatch = useAppDispatch();

  // Ініціалізація активної категорії
  const activeCategory = defaultCategory;
  const [activeTab, setActiveTab] = useState(activeCategory);

  const products = useSelector((state: RootState) => state.products.items);

  useEffect(() => {
    console.log("Fetching products...");
    if (!products.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const prevButtonRef = useRef<HTMLDivElement | null>(null);
  const nextButtonRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={s.section}>
      <Layout>
        <div className={s.navigationContainer}>
          <div className={s.swiperController}>
            {children || (
              <ul className={s.tabsController}>
                {(categories.length ? categories : [defaultCategory]).map(
                  (tab) => (
                    <li
                      key={tab}
                      className={`${s.tabItem} ${
                        activeTab === tab ? s.activeTab : ""
                      }`}
                      onClick={() => setActiveTab(tab)} // Тепер можемо змінювати tab
                      style={{
                        cursor: categories.length ? "pointer" : "default",
                      }}
                    >
                      {tab}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          <div className="flex">
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

        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={5}
          navigation={{
            prevEl: prevButtonRef.current,
            nextEl: nextButtonRef.current,
          }}
          className={s.productListSwiper}
        >
          {products.map((product: ProductInfo) => (
            <SwiperSlide className="h-auto!" key={product.id}>
              <ProductItem info={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Layout>
    </div>
  );
};
