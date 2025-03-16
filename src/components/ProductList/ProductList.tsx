import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { RootState } from "../../store/index";
import { fetchProducts } from "../../store/slices/productsSlice"; // API-запит
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
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState(defaultCategory);

  const { items: products = [] } = useSelector(
    (state: RootState) => state.products
  );

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();

    switch (activeTab) {
      case "Новинки":
        params.append("orderby", "date");
        params.append("order", "desc");
        break;
      case "Бестселлери":
        params.append("orderby", "popularity");
        break;
      case "Акції":
        params.append("on_sale", "true");
        params.append("orderby", "date");
        params.append("order", "desc");
        break;
    }

    return params.toString();
  }, [activeTab]); // ✅ queryParams змінюється тільки коли змінюється activeTab

  useEffect(() => {
    console.log("🔍 Query Params:", queryParams);
    dispatch(fetchProducts({ queryParams }));
  }, [dispatch, queryParams]);

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
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={5}
          navigation={{
            prevEl: `.${s.prevButton}`,
            nextEl: `.${s.nextButton}`,
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
