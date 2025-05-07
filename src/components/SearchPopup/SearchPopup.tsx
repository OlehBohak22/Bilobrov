import { useEffect, useRef } from "react";
import s from "./SearchPopup.module.css"; // Створи файл стилів
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  setSearchQuery,
  fetchProducts,
  resetPage,
} from "../../store/slices/filterSlice";
import { ProductList } from "../ProductList/ProductList";
import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import { Loader } from "../Loader/Loader";
import { useTranslation } from "react-i18next";

interface SearchPopupProps {
  close: () => void;
}

export const SearchPopup: React.FC<SearchPopupProps> = ({ close }) => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.filters.products);
  const location = useLocation();
  const initialPathname = useRef(location.pathname);
  const loading = useSelector((state: RootState) => state.filters.loading);

  useEffect(() => {
    if (location.pathname !== initialPathname.current) {
      close();
    }
  }, [location.pathname]);

  const searchQuery = useSelector(
    (state: RootState) => state.filters.searchQuery
  );

  useEffect(() => {
    dispatch(resetPage());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    dispatch(setSearchQuery(value));
    dispatch(resetPage());
    dispatch(fetchProducts());
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [close]);

  const productCategories = Array.from(
    new Map(
      products
        .flatMap((product) => product.categories)
        .map((category) => [category.id, category]) // використовуємо id як ключ
    ).values()
  );

  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={s.overlay}
    >
      <motion.div
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={s.popup}
      >
        <button className={s.closeBtn} onClick={close}>
          <svg
            viewBox="0 0 52 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M39 13L13 39M13 13L39 39"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <div className={s.inputContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder={t("searchPlaceholder", "Введіть товар для пошуку")}
            className={s.input}
          />

          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="10.9995"
              cy="10.7885"
              rx="8.03854"
              ry="8.03854"
              stroke-width="1.6"
              stroke-linecap="square"
            />
            <path
              d="M16.4863 16.708L21.0398 21.2497"
              stroke-width="1.6"
              stroke-linecap="square"
            />
          </svg>
        </div>
        <ProductList products={products.slice(0, 10)} mini={true}>
          <h2>
            <span></span>
            <span className="lg:-translate-x-[2vw] -translate-x-[6vw]">
              {t("products", "Товари")} {/* ✅ переклад */}
            </span>
          </h2>
        </ProductList>
        <h3>{t("categories", "Категорії")}</h3> {/* ✅ переклад */}
        {loading ? (
          <Loader />
        ) : (
          productCategories.length > 0 && (
            <div className={s.categoriesList}>
              <ul>
                {productCategories.map((category) => (
                  <li key={category.id}>
                    <Link to={`/catalog/${category.slug}`}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </motion.div>
    </motion.div>
  );
};
