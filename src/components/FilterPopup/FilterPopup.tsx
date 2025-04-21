import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useLocation, useNavigate } from "react-router-dom";
import s from "./FilterPopup.module.css";
import { RangeInput } from "./RangeInput";
import {
  setMinPrice,
  setMaxPrice,
  setOnSale,
  setInStock,
  setSelectedBrands,
  setSelectedCategories,
  fetchProducts,
  setSelectedAttributes,
} from "../../store/slices/filterSlice";
import { motion } from "framer-motion";

export const Filters: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const attributesFromURL: Record<string, string[]> = {};

    params.forEach((value, key) => {
      if (key.startsWith("attr_")) {
        const id = key.replace("attr_", "");
        attributesFromURL[id] = value.split(",");
      }
    });

    setLocalSelectedAttributes(attributesFromURL);
    dispatch(setSelectedAttributes(attributesFromURL));
  }, []);

  const {
    minPrice,
    maxPrice,
    onSale,
    inStock,
    selectedCategories,
    selectedBrands,
    attributes,
  } = useSelector((state: RootState) => state.filters);

  const allCategories = useSelector(
    (state: RootState) => state.categories.categories
  );

  const allBrands = useSelector((state: RootState) => state.brands.items);

  const [localSelectedAttributes, setLocalSelectedAttributes] = useState<
    Record<string, string[]>
  >({});
  const [openAttributes, setOpenAttributes] = useState<Record<string, boolean>>(
    {}
  );

  const toggleAttributeOption = (slug: string, option: string) => {
    setLocalSelectedAttributes((prev) => {
      const current = prev[slug] || [];
      return {
        ...prev,
        [slug]: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      };
    });
  };

  const toggleAttributeOpen = (slug: string) => {
    setOpenAttributes((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [localSelectedCategories, setLocalSelectedCategories] =
    useState<string[]>(selectedCategories);
  const [localSelectedBrands, setLocalSelectedBrands] =
    useState<string[]>(selectedBrands);

  const [brandsIsOpen, setBrandsIsOpen] = useState(false);
  const [categoryIsOpen, setCategoryIsOpen] = useState(false);

  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
    setLocalSelectedCategories(selectedCategories);
    setLocalSelectedBrands(selectedBrands);
  }, [minPrice, maxPrice, selectedCategories, selectedBrands]);

  const toggleCategory = (id: string) => {
    setLocalSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id]
    );
  };

  const toggleBrand = (id: string) => {
    setLocalSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const applyFilters = () => {
    dispatch(setMinPrice(localMinPrice));
    dispatch(setMaxPrice(localMaxPrice));
    dispatch(setSelectedCategories(localSelectedCategories));
    dispatch(setSelectedBrands(localSelectedBrands));

    // 👉 Створюємо новий URL
    const query = new URLSearchParams(location.search);
    query.set("min", localMinPrice.toString());
    query.set("max", localMaxPrice.toString());
    query.set("sale", onSale.toString());
    query.set("stock", inStock.toString());

    if (localSelectedCategories.length) {
      query.set("categories", localSelectedCategories.join(","));
    } else {
      query.delete("categories");
    }

    if (localSelectedBrands.length) {
      query.set("brands", localSelectedBrands.join(","));
    } else {
      query.delete("brands");
    }

    Object.entries(localSelectedAttributes).forEach(([slug, optionIds]) => {
      if (optionIds.length > 0) {
        query.set(`attr_${slug}`, optionIds.join(",")); // slug = pa_xxx, value = ids
      } else {
        query.delete(`attr_${slug}`);
      }
    });

    dispatch(setSelectedAttributes(localSelectedAttributes));

    // 🧭 Навігація з новим URL
    let pathname = "/catalog";

    if (localSelectedCategories.length === 1) {
      const matchedCategory = allCategories.find(
        (cat) => cat.id.toString() === localSelectedCategories[0]
      );
      if (matchedCategory) {
        pathname += `/${matchedCategory.slug}`;
      }
    }

    navigate({ pathname, search: query.toString() });

    setTimeout(() => {
      dispatch(fetchProducts());
    }, 100);

    onClose();
  };

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(); // Якщо клік був за межами модалки — закриваємо
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={s.modalOverlay}
    >
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={s.modal}
        ref={modalRef}
      >
        <div>
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

          <div className={s.rangeContainer}>
            <RangeInput
              min={minPrice}
              max={maxPrice}
              onChange={({ min, max }) => {
                setLocalMinPrice(min);
                setLocalMaxPrice(max);
              }}
            />
          </div>

          <div className={s.backDropCOntaienr}>
            <div className={s.backDrop}>
              <label
                className={`${brandsIsOpen ? s.active : ""}`}
                onClick={() => setBrandsIsOpen(!brandsIsOpen)}
              >
                {brandsIsOpen ? (
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
                Бренди <span className={s.qty}>{allBrands.length}</span>
              </label>

              {brandsIsOpen && (
                <div className={s.list}>
                  {allBrands.map((brand) => (
                    <label key={brand.id} className={s.customCheckbox}>
                      <input
                        type="checkbox"
                        checked={localSelectedBrands.includes(
                          brand.id.toString()
                        )}
                        onChange={() => toggleBrand(brand.id.toString())}
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
                className={`${categoryIsOpen ? s.active : ""}`}
                onClick={() => setCategoryIsOpen(!categoryIsOpen)}
              >
                {categoryIsOpen ? (
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

              {categoryIsOpen && (
                <div className={s.list}>
                  {allCategories.map((cat) => (
                    <label key={cat.id} className={s.customCheckbox}>
                      <input
                        type="checkbox"
                        checked={localSelectedCategories.includes(
                          cat.id.toString()
                        )}
                        onChange={() => toggleCategory(cat.id.toString())}
                        className={s.hiddenCheckbox}
                      />
                      <span className={s.checkboxLabel}>{cat.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {attributes.map((attr) => {
              const attrSlug = attr.slug; // slug вже має вигляд pa_something

              return (
                <div key={attrSlug} className={s.backDrop}>
                  <label
                    className={`${openAttributes[attrSlug] ? s.active : ""}`}
                    onClick={() => toggleAttributeOpen(attrSlug)}
                  >
                    {openAttributes[attrSlug] ? (
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
                    {attr.name}{" "}
                    <span className={s.qty}>{attr.options.length}</span>
                  </label>

                  {openAttributes[attrSlug] && (
                    <div className={s.list}>
                      {attr.options.map((option: any) => (
                        <label key={option.id} className={s.customCheckbox}>
                          <input
                            type="checkbox"
                            className={s.hiddenCheckbox}
                            checked={localSelectedAttributes[
                              attrSlug
                            ]?.includes(option.id.toString())}
                            onChange={() =>
                              toggleAttributeOption(
                                attrSlug,
                                option.id.toString()
                              )
                            }
                          />
                          <span className={s.checkboxLabel}>{option.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button className={s.btn} onClick={applyFilters}>
          Застосувати фільтри
        </button>
      </motion.div>
    </motion.div>
  );
};
