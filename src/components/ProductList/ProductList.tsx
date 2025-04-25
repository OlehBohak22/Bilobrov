import { useState, useEffect, useRef, ReactNode } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import s from "./ProductList.module.css";
import { ProductItem } from "../ProductItem/ProductItem";
import { ProductInfo } from "../../types/productTypes";
import { Layout } from "../Layout/Layout";
import { Loader } from "../Loader/Loader";
import {
  API_URL,
  consumerKey,
  consumerSecret,
} from "../../store/slices/productsSlice";
import { useWindowSize } from "../../hooks/useWindowSize";

interface ProductListProps {
  categories?: string[];
  defaultCategory?: string;
  children?: ReactNode;
  mini?: boolean;
}

export const ProductList = ({
  categories = [],
  defaultCategory,
  children,
  mini,
}: ProductListProps) => {
  const [activeTab, setActiveTab] = useState(defaultCategory);
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowSize();
  const isMobile = width < 1024;
  const prevButtonRef = useRef<HTMLDivElement | null>(null);
  const nextButtonRef = useRef<HTMLDivElement | null>(null);

  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!activeTab) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          per_page: "10",
        });

        if (activeTab === "Акції") {
          params.set("on_sale", "true");
        } else if (activeTab === "Новинки") {
          params.set("orderby", "date");
          params.set("order", "desc");
        } else if (activeTab === "Бестселлери") {
          params.set("orderby", "popularity");
        } else {
          params.set("category", activeTab); // Можна передавати slug
        }

        const res = await axios.get(`${API_URL}products?${params.toString()}`, {
          headers: {
            Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
          },
        });

        setProducts(res.data);
      } catch (error) {
        console.error("Помилка завантаження товарів:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]);

  return (
    <div className={`${s.section} ${mini ? s.mini : ""}`}>
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
                      onClick={() => setActiveTab(tab)}
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

          {!isMobile && (
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
          )}
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div>
            <Swiper
              onSwiper={setSwiperInstance}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={isMobile ? 2 : mini ? 7 : 5}
              navigation={{
                prevEl: prevButtonRef.current,
                nextEl: nextButtonRef.current,
              }}
              className={s.productListSwiper}
            >
              {products.map((product: ProductInfo) => (
                <SwiperSlide className="h-auto!" key={product.id}>
                  <ProductItem mini={mini} info={product} />
                </SwiperSlide>
              ))}
            </Swiper>

            {isMobile && (
              <div className="flex justify-between items-center mt-[9.6vw]">
                <div className={s.customPagination}>
                  {products.map((_, index) => (
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
        )}
      </Layout>
    </div>
  );
};
