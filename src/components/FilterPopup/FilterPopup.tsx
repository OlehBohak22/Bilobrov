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
  resetFilters,
} from "../../store/slices/filterSlice";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";

export const Filters: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [brandSearch, setBrandSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [attributeSearch, setAttributeSearch] = useState<
    Record<string, string>
  >({});

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

  const { t } = useTranslation();

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

    if (localSelectedCategories.length === 1 && allCategories.length > 0) {
      const matchedCategory = allCategories.find(
        (cat) => cat.id.toString() === localSelectedCategories[0]
      );
      if (matchedCategory?.slug) {
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

  return createPortal(
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
            <p>{t("catalog.filters")}</p>
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
              {t("catalog.filterSale")}
              <input
                className={s.switch}
                type="checkbox"
                checked={onSale}
                onChange={() => dispatch(setOnSale(!onSale))}
              />
            </label>

            <label>
              {t("catalog.filterInStock")}

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
              min={0}
              max={10000}
              value={{ min: localMinPrice, max: localMaxPrice }}
              onChange={({ min, max }) => {
                setLocalMinPrice(min);
                setLocalMaxPrice(max);
              }}
            />
          </div>

          <div className={s.backDropCOntaienr}>
            <button
              onClick={() => {
                dispatch(resetFilters());
                dispatch(fetchProducts());
                onClose();
              }}
              className={s.resetFilters}
            >
              {t("reset")}
            </button>

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
                {t("catalog.filterBrands")}
                <span className={s.qty}>{allBrands.length}</span>
              </label>

              {brandsIsOpen && (
                <div className={s.list}>
                  {allBrands.length > 20 && (
                    <div className={s.inputContainer}>
                      <input
                        type="text"
                        className={s.searchInput}
                        placeholder={t("catalog.searchAttr")}
                        value={brandSearch}
                        onChange={(e) =>
                          setBrandSearch(e.target.value.toLowerCase())
                        }
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
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M16.4863 16.708L21.0398 21.2497"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                      </svg>
                    </div>
                  )}
                  {allBrands
                    .filter((brand) =>
                      brand.name.toLowerCase().includes(brandSearch)
                    )
                    .map((brand) => (
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
                {t("catalog.filterCat")}
                <span className={s.qty}>{allCategories.length}</span>
              </label>

              {categoryIsOpen && (
                <div className={s.list}>
                  {allCategories.length > 2 && (
                    <div className={s.inputContainer}>
                      <input
                        type="text"
                        className={s.searchInput}
                        placeholder={t("catalog.searchAttr")}
                        value={categorySearch}
                        onChange={(e) =>
                          setCategorySearch(e.target.value.toLowerCase())
                        }
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
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M16.4863 16.708L21.0398 21.2497"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                      </svg>
                    </div>
                  )}
                  {allCategories
                    .filter((cat) =>
                      cat.name.toLowerCase().includes(categorySearch)
                    )
                    .map((cat) => (
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
                      {attr.options.length > 20 && (
                        <div className={s.inputContainer}>
                          <input
                            type="text"
                            className={s.searchInput}
                            placeholder={t("catalog.searchAttr")}
                            value={attributeSearch[attrSlug] || ""}
                            onChange={(e) =>
                              setAttributeSearch((prev) => ({
                                ...prev,
                                [attrSlug]: e.target.value.toLowerCase(),
                              }))
                            }
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
                              strokeWidth="1.6"
                              strokeLinecap="square"
                            />
                            <path
                              d="M16.4863 16.708L21.0398 21.2497"
                              strokeWidth="1.6"
                              strokeLinecap="square"
                            />
                          </svg>
                        </div>
                      )}
                      {attr.options
                        .filter((opt) =>
                          opt.name
                            .toLowerCase()
                            .includes(
                              attributeSearch[attrSlug]?.toLowerCase() || ""
                            )
                        )
                        .map((option) => (
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
                            <span className={s.checkboxLabel}>
                              {option.name}
                            </span>
                          </label>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <button className={s.btn} onClick={applyFilters}>
            {t("catalog.filterApply")}
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
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};
