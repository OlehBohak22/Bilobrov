import React, { useEffect, useState } from "react";
import s from "./VariationCartPopup.module.css";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  fetchProductVariations,
  fetchVariationById,
} from "../../store/slices/productsSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Select, { StylesConfig } from "react-select"; // Імпортуємо React Select
import ReactDOM from "react-dom";
import { ProductInfo } from "../../types/productTypes";
import { CartProductItem } from "../CartProductItem/CartProductItem";

interface VariationsPopupProps {
  onSelect: (variationId: number) => void;
  onClose: () => void;
  productId: number;
  product: ProductInfo;
}

export const VariationsPopup: React.FC<VariationsPopupProps> = ({
  onSelect,
  onClose,
  productId,
  product,
}) => {
  const dispatch = useAppDispatch();
  // Типізація через useSelector
  const { variations, loading } = useSelector(
    (state: RootState) => state.products
  );

  const uniqueAttributes = [
    ...new Map(
      variations.flatMap((v) => {
        // Беремо зображення з варіації для всіх атрибутів цієї варіації
        const image = v.image?.src || ""; // або за замовчуванням порожній рядок
        return v.attributes.map((a) => [
          a.slug,
          { slug: a.slug, name: a.name, image: image }, // Прив'язуємо зображення до атрибута варіації
        ]);
      })
    ).values(),
  ];

  uniqueAttributes.sort((a) => (a.slug === "pa_color" ? -1 : 1));

  const [selectedVariation, setSelectedVariation] = useState<number | null>(
    null
  );
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string | null;
  }>({});

  useEffect(() => {
    dispatch(fetchProductVariations(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (variations.length > 0) {
      const firstVariation = variations[0];
      const initialAttributes: { [key: string]: string } = {};

      firstVariation.attributes.forEach((attr) => {
        initialAttributes[attr.slug] = attr.option;
      });

      setSelectedAttributes(initialAttributes);
      setSelectedVariation(firstVariation.id);
      dispatch(
        fetchVariationById({ productId, variationId: firstVariation.id })
      );
    }
  }, [variations, dispatch, productId]);

  useEffect(() => {
    if (Object.keys(selectedAttributes).length > 0) {
      const matchedVariation = variations.find((v) =>
        Object.entries(selectedAttributes).every(([key, value]) =>
          v.attributes.some(
            (attr) => attr.slug === key && attr.option === value
          )
        )
      );

      if (matchedVariation && matchedVariation.id !== selectedVariation) {
        setSelectedVariation(matchedVariation.id);
        dispatch(
          fetchVariationById({ productId, variationId: matchedVariation.id })
        );
      }
    }
  }, [selectedAttributes, variations, dispatch, productId, selectedVariation]);

  const handleConfirm = () => {
    if (selectedVariation !== null) {
      onSelect(selectedVariation);
    }
  };

  const customStyles: StylesConfig<any, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "white",
      borderColor: state.isFocused ? "black" : "black",
      borderBottomWidth: "2px",
      borderRadius: "0",
      borderTop: "none",
      borderRight: "none",
      borderLeft: "none",
      padding: "0",
      boxShadow: state.isFocused
        ? "0px 5px 12px 0px rgba(26, 26, 26, 0.1)"
        : "none",
      "&:hover": {
        borderColor: "black",
      },
      "&:active": {
        backgroundColor: "white", // Прибираємо синій фон при натисканні
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "white" : "white",
      color: state.isDisabled ? "#cbd5e1" : "#000000", // сірий колір для неактивних
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      padding: "10px",
      "&:hover": {
        color: "rgba(102, 102, 102, 1)",
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),

    indicatorSeparator: () => ({
      display: "none", // Прибирає лінію між текстом і стрілкою
    }),
  };

  const user = useSelector((state: RootState) => state.user);

  return ReactDOM.createPortal(
    <div
      className={s.overlay}
      onClick={onClose}
      aria-labelledby="variation-popup"
    >
      <div
        className={s.popup}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div>
          <div className={s.header}>
            <h3 id="variation-popup">Оберіть параметри</h3>

            <button onClick={() => onClose()}>
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

          <div className="mb-[2vw]">
            <CartProductItem
              optional={true}
              info={product}
              token={user.token}
            />
          </div>

          {loading ? (
            <p>Завантаження варіацій...</p>
          ) : (
            <>
              {uniqueAttributes.map((attribute) => {
                // Отримуємо всі можливі варіанти значень для поточного атрибута
                const options = [
                  ...new Set(
                    variations.flatMap((v) =>
                      v.attributes
                        .filter((a) => a.slug === attribute.slug)
                        .map((a) => a.option)
                    )
                  ),
                ];

                // Фільтруємо лише ті варіанти, які існують разом із вибраними атрибутами
                const optionsList = options.map((option) => {
                  const isValid = variations.some((variation) => {
                    // Перевіряємо, чи всі вибрані атрибути є в цій варіації
                    const matchesSelected = Object.entries(
                      selectedAttributes
                    ).every(([selectedSlug, selectedOption]) => {
                      if (selectedSlug === attribute.slug) return true; // Пропускаємо поточний атрибут
                      return variation.attributes.some(
                        (attr) =>
                          attr.slug === selectedSlug &&
                          attr.option === selectedOption
                      );
                    });

                    // Перевіряємо, чи ця варіація має поточний варіант `option`
                    const hasOption = variation.attributes.some(
                      (attr) =>
                        attr.slug === attribute.slug && attr.option === option
                    );

                    return matchesSelected && hasOption;
                  });

                  // Знаходимо правильне зображення для варіанту
                  const optionImage = variations
                    .filter((v) =>
                      v.attributes.some(
                        (a) => a.slug === attribute.slug && a.option === option
                      )
                    )
                    .map((v) => v.image?.src)[0]; // Беремо зображення першої варіації, що підходить

                  return {
                    value: option,
                    label: option,
                    image: optionImage, // Додаємо правильне зображення для варіанту
                    isDisabled: !isValid, // Додаємо дізейбл для неіснуючих комбінацій
                  };
                });

                return (
                  <div key={attribute.slug} className={s.attribute}>
                    <p className={s.title}>{attribute.name}</p>

                    {attribute.slug === "pa_color" ? (
                      // Відображаємо Select для кольорів
                      <div className={s.select}>
                        <Select
                          menuPortalTarget={document.body} // Рендерить список прямо в body
                          options={optionsList.map((opt, index) => ({
                            ...opt,
                            label: (
                              <div className="flex items-center">
                                {opt.image && (
                                  <img
                                    src={opt.image}
                                    alt={opt.label}
                                    className="w-6 h-6 mr-2"
                                  />
                                )}

                                {` 00${++index}, ${opt.label}`}
                              </div>
                            ),
                          }))}
                          value={optionsList.find(
                            (opt) =>
                              opt.value === selectedAttributes[attribute.slug]
                          )}
                          onChange={(option) =>
                            setSelectedAttributes((prev) => ({
                              ...prev,
                              [attribute.slug]: option.value,
                            }))
                          }
                          className={s.select}
                          styles={customStyles}
                        />
                      </div>
                    ) : (
                      // Відображаємо Radio-кнопки для всіх інших атрибутів
                      <div className={s.volume}>
                        {optionsList.map((opt) => (
                          <label
                            key={opt.value}
                            className={`border cursor-pointer transition
                ${
                  selectedAttributes[attribute.slug] === opt.value
                    ? "border-black"
                    : "border-gray-300"
                }
                ${opt.isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <input
                              type="radio"
                              className="hidden"
                              name={attribute.slug}
                              value={opt.value}
                              checked={
                                selectedAttributes[attribute.slug] === opt.value
                              }
                              onChange={() =>
                                setSelectedAttributes((prev) => ({
                                  ...prev,
                                  [attribute.slug]: opt.value,
                                }))
                              }
                              disabled={opt.isDisabled}
                            />
                            <div className="flex items-center">{opt.label}</div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <p>{selectedVariation}</p>
            </>
          )}
        </div>

        <button
          onClick={handleConfirm}
          disabled={selectedVariation === null}
          className={s.btn}
        >
          додати в кошик
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_2700_10227)">
              <path d="M17.9177 5L16.8487 6.05572L21.6059 10.7535H0.5V12.2465H21.6059L16.8487 16.9443L17.9177 18L24.5 11.5L17.9177 5Z" />
            </g>
            <defs>
              <clipPath id="clip0_2700_10227">
                <rect width="24" height="24" transform="translate(0.5)" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
};
