import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  setMinPrice,
  setMaxPrice,
  setOnSale,
  setInStock,
  setCategories,
  fetchProducts,
  setBrands,
} from "../../store/slices/filterSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import s from "./FilterPopup.module.css";
import { RangeInput } from "./RangeInput";

export const Filters: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { minPrice, maxPrice, onSale, inStock, categories, loading } =
    useSelector((state: RootState) => state.filters);

  const brands = useSelector((state: RootState) => state.brands.items);

  const [categoryiIsOpen, setCategoryIsOpen] = useState(false);
  const [brandsIsOpen, setBrandsIsOpen] = useState(false);

  const { slug } = useParams();

  const allCategories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const category = allCategories.find((cat) => cat.slug === slug);
  const categoryId = category ? category.id.toString() : null;

  useEffect(() => {
    if (categoryId && !categories.includes(categoryId)) {
      console.log("Додаємо категорію:", categoryId);
      dispatch(setCategories([categoryId]));
      dispatch(fetchProducts({}));
    }
  }, [categoryId, categories, dispatch]);

  const handleCategoryChange = (categoryId: string) => {
    dispatch(
      setCategories(
        categories.includes(categoryId)
          ? categories.filter((cat) => cat !== categoryId)
          : [...categories, categoryId]
      )
    );
  };

  const selectedBrands = useSelector(
    (state: RootState) => state.filters.brands
  );
  const handleBrandChange = (brand: string) => {
    dispatch(
      setBrands(
        selectedBrands.includes(brand)
          ? selectedBrands.filter((b) => b !== brand)
          : [...selectedBrands, brand]
      )
    );
  };

  // Локальні стани для діапазону
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  useEffect(() => {
    // Оновлюємо локальний стан при першому рендері або при зміні значень в Redux
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [maxPrice, minPrice]);
  return (
    <div className={s.modalOverlay}>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={s.modal}
      >
        <div className="mb-[1vw]">
          <div className={s.menuHeader}>
            <p>Фільтри</p>
            <button onClick={onClose}>
              <svg
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M39 13L13 39M13 13L39 39"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className={s.switchController}>
            <label>
              Зі знижкою
              <input
                className={s.switch}
                type="checkbox"
                checked={onSale}
                onChange={() => dispatch(setOnSale(!onSale))}
              />
            </label>

            <label>
              В наявності
              <input
                className={s.switch}
                type="checkbox"
                checked={inStock}
                onChange={() => dispatch(setInStock(!inStock))}
              />
            </label>
          </div>

          <div>
            <div className={s.rangeContainer}>
              <RangeInput
                min={minPrice}
                max={maxPrice}
                onChange={({ min, max }) => {
                  setLocalMinPrice(min); // Оновлюємо локальний стан для діапазону
                  setLocalMaxPrice(max); // Оновлюємо локальний стан для діапазону
                }}
              />
            </div>
          </div>

          <div className={s.backDropCOntaienr}>
            <div className={s.backDrop}>
              <label
                className={`${brandsIsOpen && s.active}`}
                onClick={() => setBrandsIsOpen(!brandsIsOpen)}
              >
                {brandsIsOpen ? (
                  <svg className={s.plus} viewBox="0 0 16 17" fill="none">
                    <path d="M16 7.83325H0V9.16659H16V7.83325Z" />
                  </svg>
                ) : (
                  <svg className={s.minus} viewBox="0 0 16 17" fill="none">
                    <g clipPath="url(#clip0_2926_15592)">
                      <path d="M16 7.83333H8.66667V0.5H7.33333V7.83333H0V9.16667H7.33333V16.5H8.66667V9.16667H16V7.83333Z" />
                    </g>
                    <defs>
                      <clipPath id="clip0_2926_15592">
                        <rect
                          width="16"
                          height="16"
                          transform="translate(0 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                )}
                Бренди <span className={s.qty}>{brands.length}</span>
              </label>
              {brandsIsOpen && (
                <div className={s.list}>
                  {brands.map((brand) => (
                    <label key={brand.id} className={s.customCheckbox}>
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.id.toString())}
                        onChange={() => handleBrandChange(brand.id.toString())}
                        className={s.hiddenCheckbox}
                      />
                      <span className={s.checkboxLabel}>{brand.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className={s.backDrop}>
              <label
                className={`${categoryiIsOpen && s.active}`}
                onClick={() => setCategoryIsOpen(!categoryiIsOpen)}
              >
                {categoryiIsOpen ? (
                  <svg
                    className={s.plus}
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 7.83325H0V9.16659H16V7.83325Z" />
                  </svg>
                ) : (
                  <svg
                    className={s.minus}
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_2926_15592)">
                      <path d="M16 7.83333H8.66667V0.5H7.33333V7.83333H0V9.16667H7.33333V16.5H8.66667V9.16667H16V7.83333Z" />
                    </g>
                    <defs>
                      <clipPath id="clip0_2926_15592">
                        <rect
                          width="16"
                          height="16"
                          transform="translate(0 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                )}
                Категорії <span className={s.qty}>{allCategories.length}</span>
              </label>
              {categoryiIsOpen && (
                <div className={s.list}>
                  {allCategories.map((cat) => (
                    <label key={cat.id} className={s.customCheckbox}>
                      <input
                        type="checkbox"
                        checked={categories.includes(cat.id.toString())}
                        onChange={() => handleCategoryChange(cat.id.toString())}
                        className={s.hiddenCheckbox} // Сховаємо стандартний чекбокс
                      />
                      <span className={s.checkboxLabel}>{cat.name}</span>{" "}
                      {/* Стилізуємо саму мітку */}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          className={s.btn}
          onClick={() => {
            dispatch(setMinPrice(localMinPrice));
            dispatch(setMaxPrice(localMaxPrice));
            dispatch(fetchProducts({}));

            onClose();
          }}
          disabled={loading}
        >
          {loading ? "Завантаження..." : "Застосувати фільтри"}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.4177 5L16.3487 6.05572L21.1059 10.7535H0V12.2465H21.1059L16.3487 16.9443L17.4177 18L24 11.5L17.4177 5Z" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
};
