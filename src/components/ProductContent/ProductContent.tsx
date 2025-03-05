import { useState, useEffect } from "react";
import s from "./ProductContent.module.css";
import { ProductInfo } from "../../types/productTypes";
import { StarRatingRed } from "../StarRating/StarRating";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchVariationById } from "../../store/slices/productsSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ProductPageAccordion } from "../ProductPageAccordion/ProductPageAccordion";
import Select from "react-select";
import { StylesConfig } from "react-select";

interface VariationAttribute {
  id: number;
  name: string;
  slug: string;
  option: string;
  image: string;
}

interface Variation {
  id: number;
  slug: string;
  attributes: VariationAttribute[];
  image: { src: string };
}

interface ProductItemProps {
  info: ProductInfo;
  openRegister: () => void;
  variations: Variation[];
}

export const ProductContent: React.FC<ProductItemProps> = ({
  info,
  openRegister,
  variations,
}) => {
  const [selectedVariation, setSelectedVariation] = useState<number | null>(
    null
  );

  const dispatch = useAppDispatch();

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

  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string | null;
  }>({});

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
        fetchVariationById({
          productId: info.id,
          variationId: firstVariation.id,
        })
      );
    }
  }, [variations, dispatch, info.id]);

  useEffect(() => {
    if (Object.keys(selectedAttributes).length > 0) {
      const matchedVariation = variations.find((v) =>
        Object.entries(selectedAttributes).every(([key, value]) =>
          v.attributes.some(
            (attr) => attr.slug === key && attr.option === value
          )
        )
      );

      if (matchedVariation) {
        if (matchedVariation.id !== selectedVariation) {
          setSelectedVariation(matchedVariation.id);
          dispatch(
            fetchVariationById({
              productId: info.id,
              variationId: matchedVariation.id,
            })
          );
        }
      } else {
        // Якщо немає такої комбінації, можемо прибрати останній обраний атрибут
        const newAttributes = { ...selectedAttributes };
        const lastSelectedKey = Object.keys(newAttributes).pop();
        if (lastSelectedKey) {
          delete newAttributes[lastSelectedKey];
          setSelectedAttributes(newAttributes);
        }
      }
    }
  }, [selectedAttributes, variations, dispatch, info.id, selectedVariation]);

  const user = useSelector((state: RootState) => state.user?.user);

  const handleAuth = () => {
    if (!user) {
      openRegister();
    }
  };

  const brandMeta = info.meta_data.find((item) => item.key === "brands");

  const brandName =
    Array.isArray(brandMeta?.value) &&
    brandMeta.value.length > 0 &&
    typeof brandMeta.value[0] === "object"
      ? (brandMeta.value[0] as { name: string }).name
      : typeof brandMeta?.value === "string"
      ? brandMeta.value
      : null;

  const components = (info.meta_data.find(
    (item) => item.key === "_product_composition" && item.value
  )?.value ?? "") as string;

  const appointment = (info.attributes.find(
    (item) => item.name === "Призначення" && item.options
  )?.options ?? "") as [];

  const skinType = (info.attributes.find(
    (item) => item.name === "Тип шкіри" && item.options
  )?.options ?? "") as [];

  const contraindication = (info.attributes.find(
    (item) => item.name === "Протипоказання" && item.options
  )?.options ?? "") as [];

  const ingredients = (info.attributes.find(
    (item) => item.name === "Активні інгрідієнти" && item.options
  )?.options ?? "") as [];

  const characteristics = {
    appointment,
    skinType,
    contraindication,
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

    indicatorSeparator: () => ({
      display: "none", // Прибирає лінію між текстом і стрілкою
    }),
  };

  if (!info.attributes) return <p>Loading...</p>; // Або інший заглушковий контент

  return (
    <div className={s.content}>
      <div className={s.ratingBlock}>
        <StarRatingRed rating={info.average_rating} />
        <span>{info.rating_count} відгуків</span>
      </div>

      {brandName && <p className={s.productBrand}>{brandName}</p>}

      <p className={s.productName}>{info.name}</p>

      {typeof info.short_description === "string" ? (
        <p
          className={s.shortDesc}
          dangerouslySetInnerHTML={{ __html: info.short_description }}
        />
      ) : (
        <>{info.short_description}</>
      )}

      <div>
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
              const matchesSelected = Object.entries(selectedAttributes).every(
                ([selectedSlug, selectedOption]) => {
                  if (selectedSlug === attribute.slug) return true; // Пропускаємо поточний атрибут
                  return variation.attributes.some(
                    (attr) =>
                      attr.slug === selectedSlug &&
                      attr.option === selectedOption
                  );
                }
              );

              // Перевіряємо, чи ця варіація має поточний варіант `option`
              const hasOption = variation.attributes.some(
                (attr) => attr.slug === attribute.slug && attr.option === option
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
                      (opt) => opt.value === selectedAttributes[attribute.slug]
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

        {selectedVariation && <p>Вибрана варіація: {selectedVariation}</p>}
      </div>

      <div className="flex mb-[1vw]">
        {info.sale_price && info.sale_price !== "0" ? (
          <>
            <span className={`${s.salePrice} ${s.red}`}>{info.sale_price}</span>
            <span className={`${s.currency} ${s.red}`}>₴</span>

            <span className={s.regularPrice}>{info.regular_price}</span>
            <span className={s.regularPrice}>₴</span>
          </>
        ) : (
          <>
            <span className={s.salePrice}>{info.price}</span>
            <span className={s.currency}>₴</span>
          </>
        )}
      </div>

      {!user && (
        <div onClick={handleAuth} className={s.auth}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.85"
              y="3.85"
              width="22.3"
              height="15.3"
              rx="2.15"
              strokeWidth="1.7"
            />
            <path d="M4 10H1" strokeWidth="1.7" />
            <path d="M23 10L15 10" strokeWidth="1.7" />
            <path
              d="M10 11.5688C10.5 9.0688 12.5 5.07275 15 8.06882C17.3101 10.8373 13 12.0688 10 11.5688Z"
              strokeWidth="1.7"
            />
            <path
              d="M9.65527 11.5688C9.15527 9.0688 7.15527 5.07275 4.65527 8.06882C2.34516 10.8373 6.65527 12.0688 9.65527 11.5688Z"
              strokeWidth="1.7"
            />
            <path
              d="M10 12L13.5355 15.5355"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M9.53516 12L5.99962 15.5355"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path d="M10 4V19" strokeWidth="1.7" />
          </svg>
          <span>авторизуйся</span>
          <p> і отримуй бонуси</p>
        </div>
      )}

      <div className={s.orderController}>
        <div className={s.qty}>
          <button>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16 7.3335H0V8.66683H16V7.3335Z" fill="#1A1A1A" />
            </svg>
          </button>
          <span>1</span>
          <button>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_2202_6051)">
                <path
                  d="M16 7.33333H8.66667V0H7.33333V7.33333H0V8.66667H7.33333V16H8.66667V8.66667H16V7.33333Z"
                  fill="#1A1A1A"
                />
              </g>
              <defs>
                <clipPath id="clip0_2202_6051">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>

        <button className={s.cart}>ДОДАТИ В КОШИК</button>

        <button className={s.wishList}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11.3701 21.7964C11.4329 21.8608 11.5081 21.912 11.591 21.947C11.674 21.982 11.7631 22 11.8532 22C11.9432 22 12.0324 21.982 12.1153 21.947C12.1983 21.912 12.2734 21.8608 12.3363 21.7964L21.0161 13.0016C23.2698 10.719 23.2698 7.00337 21.0161 4.71987C19.9214 3.61069 18.4657 3.00001 16.916 3.00001C15.3662 3.00001 13.9114 3.61069 12.8167 4.71897L11.8532 5.69606L10.8897 4.71987C10.3557 4.17416 9.71795 3.74084 9.01393 3.44546C8.30991 3.15009 7.55388 2.99863 6.7904 3.00001C6.02678 2.99856 5.2706 3.14998 4.56642 3.44536C3.86224 3.74074 3.22431 4.17409 2.69023 4.71987C0.436589 7.00337 0.436589 10.719 2.69023 13.0007L11.3701 21.7964ZM3.65556 5.67254C4.0639 5.25547 4.5515 4.92424 5.08969 4.69834C5.62789 4.47244 6.20581 4.35641 6.7895 4.35708C7.97286 4.35708 9.08566 4.82482 9.92253 5.67344L11.3692 7.13908C11.4992 7.26314 11.6721 7.33235 11.8518 7.33235C12.0316 7.33235 12.2044 7.26314 12.3345 7.13908L13.7811 5.67254C14.1898 5.25565 14.6776 4.92455 15.2159 4.69866C15.7542 4.47277 16.3322 4.35664 16.916 4.35708C17.4997 4.35641 18.0776 4.47244 18.6158 4.69834C19.154 4.92424 19.6416 5.25547 20.0499 5.67254C21.7842 7.4304 21.7842 10.2902 20.0499 12.049L11.8532 20.3552L3.65556 12.0481C1.92123 10.2911 1.92123 7.4304 3.65556 5.67254Z" />
          </svg>
        </button>
      </div>

      <div className={s.isAvailable}>
        {info.purchasable ? (
          <div className={s.available}>
            <p>
              <svg
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4.5325 11.6668C4.30103 11.6673 4.07174 11.6232 3.85781 11.5369C3.64388 11.4507 3.44953 11.3241 3.28592 11.1644L0 7.95899L0.830667 7.14811L4.11658 10.3535C4.22684 10.461 4.37634 10.5213 4.53221 10.5213C4.68808 10.5213 4.83757 10.461 4.94783 10.3535L13.1693 2.3335L14 3.14437L5.7785 11.1644C5.615 11.3241 5.42074 11.4507 5.20691 11.5369C4.99308 11.6231 4.76388 11.6673 4.5325 11.6668Z" />
              </svg>
              В наявності
            </p>
          </div>
        ) : (
          <div className={s.available}>
            <p>Немає в наявності</p>
          </div>
        )}

        <div className={s.code}>
          <p>Код товару: </p> <span> {info.sku}</span>
        </div>
      </div>

      <div className={s.consultation}>
        <div className={s.questionCircle}>
          <svg
            className={s.circle}
            viewBox="0 0 105 104"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M58.0273 7.89031C58.4349 8.28724 58.6483 8.84372 58.584 9.50057C58.4407 10.9659 57.0516 11.6079 55.5358 11.4597C54.26 11.3349 53.1649 10.6667 52.6361 9.68403L54.0766 8.90673C54.5085 9.44631 55.0232 9.78996 55.6801 9.8542C56.3622 9.92091 56.7973 9.64465 56.8455 9.15201C56.9147 8.44463 56.0976 8.45399 55.3902 8.3848L54.986 8.34527L55.1169 7.0063L55.5211 7.04583C56.2285 7.11501 56.8007 7.13271 56.8563 6.56428C56.902 6.0969 56.5138 5.89315 56.0591 5.84868C55.4527 5.78938 54.7789 6.02954 54.239 6.33382L53.4065 5.06641C54.2401 4.49754 55.2547 4.16318 56.2905 4.26448C57.6042 4.39296 58.7754 5.19615 58.6408 6.57302C58.5951 7.04039 58.4116 7.48155 58.0273 7.89031Z" />
            <path d="M68.0274 8.07996C68.1313 8.64387 68.0003 9.10821 67.8157 9.70211L66.5728 13.7018L65.1305 13.2537L65.3791 12.4537C64.5826 12.9638 63.8498 13.0551 62.8439 12.7425C61.4379 12.3056 60.9409 11.1676 61.2799 10.0768C61.5623 9.16775 62.149 8.60576 63.324 8.54558C64.0258 8.51114 65.0164 8.65947 66.297 8.85806C66.4126 8.22944 66.1478 7.84145 65.3721 7.6004C64.8872 7.44975 64.2051 7.46372 63.8145 7.99359L62.4706 7.05764C63.133 6.08061 64.2634 5.60786 65.8391 6.09748C66.9905 6.45527 67.838 7.06417 68.0274 8.07996ZM65.3846 11.1529C65.6045 10.9156 65.7568 10.511 65.8669 10.1997C64.7074 10.0387 64.2288 9.99634 63.8117 10.0129C63.2666 10.0562 63.0011 10.2262 62.8994 10.5535C62.7601 11.0019 63.0287 11.3778 63.5983 11.5548C64.5074 11.8373 65.1646 11.3903 65.3846 11.1529Z" />
            <path d="M68.0818 15.8313L69.5018 13.3536C70.1295 13.7134 70.5533 13.4589 71.3575 12.413C72.0513 11.5087 72.7737 10.4014 73.4915 9.27669L78.0834 11.9084L75.338 16.6985L75.9437 17.0456L74.5237 19.5233L73.1142 18.7155L73.8715 17.3941L70.2486 15.3177L69.4913 16.6391L68.0818 15.8313ZM71.4179 14.4518L73.8404 15.8402L75.9231 12.2063L74.1282 11.1776C73.6234 11.9562 73.0777 12.7553 72.6267 13.3891C72.1882 14.001 71.8919 14.3139 71.4179 14.4518Z" />
            <path d="M85.0706 18.951C84.9264 19.5059 84.6113 19.8714 84.193 20.3315L81.3755 23.4307L80.258 22.4147L80.8215 21.7949C79.884 21.9204 79.1814 21.6933 78.4019 20.9846C77.3125 19.9943 77.3432 18.7529 78.1116 17.9077C78.752 17.2033 79.5212 16.9421 80.6114 17.3843C81.262 17.6499 82.097 18.2031 83.1736 18.9245C83.5441 18.4037 83.4681 17.9401 82.8671 17.3937C82.4914 17.0522 81.8673 16.7765 81.2893 17.0915L80.4672 15.6751C81.4806 15.0698 82.7049 15.1193 83.9257 16.2292C84.8179 17.0403 85.3285 17.9504 85.0706 18.951ZM81.3764 20.6184C81.6761 20.4963 81.9851 20.1941 82.2165 19.9584C81.2338 19.3224 80.8181 19.0816 80.433 18.9203C79.9207 18.729 79.6083 18.7708 79.3778 19.0244C79.0619 19.3719 79.1464 19.8261 79.5878 20.2274C80.2921 20.8677 81.0767 20.7405 81.3764 20.6184Z" />
            <path d="M84.3191 26.8956L88.6237 23.7513L87.2986 21.9372L88.5285 21.0388L92.1968 26.0608L90.967 26.9592L89.6418 25.1451L85.3373 28.2895L84.3191 26.8956Z" />
            <path d="M96.6764 34.8525L90.4331 37.6799L89.7524 36.1769L93.5678 34.449L88.4748 33.3559L87.9093 32.1072L94.1526 29.2798L94.8333 30.7828L91.1451 32.4531L96.1161 33.6154L96.6764 34.8525Z" />
            <path d="M92.2717 44.032L99.082 43.2616L99.7696 49.3404L92.9593 50.1108L92.7653 48.3956L97.9739 47.8064L97.6743 45.1579L92.4657 45.7472L92.2717 44.032Z" />
            <path d="M99.2264 59.6872L92.4086 58.986L92.5774 57.3447L96.7439 57.7732L92.8943 54.2641L93.0345 52.9005L99.8523 53.6017L99.6835 55.243L95.656 54.8288L99.3653 58.3363L99.2264 59.6872Z" />
            <path d="M91.367 63.215L96.4511 64.8173L97.1264 62.6747L98.579 63.1325L96.7096 69.064L95.257 68.6062L95.9323 66.4636L90.8481 64.8613L91.367 63.215Z" />
            <path d="M91.7988 76.5477C91.2255 76.5346 90.7976 76.3118 90.2537 76.0103L86.5907 73.9792L87.3231 72.6583L88.0557 73.0645C87.7184 72.1809 87.7782 71.4449 88.289 70.5236C89.003 69.236 90.2183 68.9811 91.2172 69.535C92.0497 69.9966 92.4806 70.6853 92.3003 71.848C92.1912 72.5421 91.8443 73.4818 91.3892 74.6952C91.9811 74.9363 92.4149 74.756 92.8088 74.0456C93.055 73.6016 93.1802 72.9309 92.7409 72.4406L93.9308 71.3153C94.7525 72.1628 94.9853 73.3658 94.1852 74.8088C93.6005 75.8633 92.8318 76.569 91.7988 76.5477ZM89.3281 73.3347C89.5157 73.5984 89.8808 73.8298 90.1632 74.0009C90.5568 72.8985 90.6957 72.4386 90.7644 72.0268C90.833 71.4843 90.7206 71.1898 90.4209 71.0236C90.0102 70.7959 89.5875 70.9824 89.2982 71.5041C88.8366 72.3366 89.1405 73.071 89.3281 73.3347Z" />
            <path d="M85.0075 76.4017L90.1486 80.9342L89.0071 82.229L87.0459 80.4999L85.1825 82.6135L87.1437 84.3425L86.0022 85.6373L80.8612 81.1048L82.0027 79.8101L83.9734 81.5475L85.8368 79.434L83.866 77.6965L85.0075 76.4017Z" />
            <path d="M78.804 83.0786L82.8237 88.6297L81.4257 89.6421L79.8922 87.5244L77.6101 89.177L79.1435 91.2947L77.7454 92.307L73.7257 86.7559L75.1238 85.7435L76.6647 87.8714L78.9468 86.2189L77.4059 84.0909L78.804 83.0786Z" />
            <path d="M71.3088 95.6689L68.7128 96.7967L65.9818 90.5106L67.565 89.8227L68.4349 91.825L69.4476 91.385L69.6339 91.3041L69.963 88.7809L71.616 88.0628L71.2266 90.8612C72.0798 90.8503 72.8353 91.2832 73.2601 92.261C73.7608 93.4135 73.4108 94.4235 72.4724 95.0665C72.0887 95.33 71.5998 95.5424 71.3088 95.6689ZM68.9659 93.0473L69.765 94.8866L70.9523 94.3707C71.092 94.31 71.2616 94.2225 71.416 94.1001C71.7015 93.8653 71.8408 93.3897 71.6587 92.9706C71.4665 92.5283 71.0106 92.3389 70.6442 92.3873C70.461 92.4116 70.2813 92.4758 70.1533 92.5314L68.9659 93.0473Z" />
            <path d="M56.8529 95.6365C57.4297 95.5461 57.9479 95.9018 58.0382 96.4786C58.1285 97.0554 57.7439 97.5524 57.1671 97.6427C56.6404 97.7252 56.1222 97.3696 56.0319 96.7927C55.9416 96.2159 56.3263 95.7189 56.8529 95.6365Z" />
            <path d="M46.3834 96.1457C45.9729 95.7519 45.7553 95.197 45.8145 94.5397C45.9467 93.0734 47.3308 92.4208 48.8477 92.5575C50.1245 92.6725 51.2246 93.3324 51.7609 94.311L50.3263 95.0992C49.8904 94.5629 49.373 94.2232 48.7157 94.164C48.0331 94.1025 47.6001 94.382 47.5557 94.875C47.4919 95.5829 48.3089 95.5673 49.0168 95.6311L49.4213 95.6676L49.3005 97.0075L48.896 96.9711C48.1881 96.9073 47.6159 96.8939 47.5646 97.4628C47.5224 97.9305 47.9121 98.1313 48.3672 98.1723C48.974 98.227 49.646 97.9817 50.1835 97.6733L51.0256 98.9343C50.1965 99.5095 49.1844 99.8516 48.1478 99.7582C46.8332 99.6397 45.6559 98.8455 45.7801 97.4676C45.8222 96.9999 46.0023 96.5574 46.3834 96.1457Z" />
            <path d="M36.3829 96.0325C36.2747 95.4694 36.4021 95.0041 36.5821 94.4088L37.7941 90.3996L39.2398 90.8367L38.9974 91.6385C39.7899 91.1223 40.522 91.0254 41.5304 91.3302C42.9396 91.7563 43.4454 92.8904 43.1148 93.9838C42.8394 94.895 42.2571 95.4615 41.0826 95.5307C40.381 95.5705 39.3893 95.4298 38.1072 95.2411C37.9964 95.8706 38.2643 96.2565 39.0418 96.4916C39.5278 96.6385 40.2098 96.6193 40.5963 96.0864L41.9474 97.012C41.2925 97.9941 40.1658 98.4756 38.5864 97.9981C37.4322 97.6492 36.5801 97.0468 36.3829 96.0325ZM39.002 92.9393C38.7838 93.1783 38.6347 93.584 38.527 93.8962C39.6877 94.0482 40.1666 94.0869 40.5836 94.0672C41.1283 94.0197 41.3925 93.8476 41.4917 93.5196C41.6276 93.0701 41.356 92.6963 40.785 92.5237C39.8739 92.2482 39.2201 92.7003 39.002 92.9393Z" />
            <path d="M36.2672 88.2822L34.8661 90.7706C34.2357 90.4157 33.8139 90.6734 33.0177 91.7254C32.3308 92.635 31.6169 93.7478 30.9077 94.8779L26.2959 92.2813L29.0045 87.4704L28.3963 87.1279L29.7973 84.6395L31.2129 85.4365L30.4657 86.7637L34.1043 88.8123L34.8515 87.4852L36.2672 88.2822ZM32.9418 89.6871L30.5086 88.3172L28.4538 91.9669L30.2565 92.9819C30.7553 92.1995 31.2949 91.3963 31.7411 90.759C32.1748 90.1438 32.4688 89.8287 32.9418 89.6871Z" />
            <path d="M19.2564 85.2918C19.3965 84.7358 19.7088 84.368 20.1236 83.9046L22.9174 80.7842L24.0427 81.7917L23.4839 82.4158C24.4204 82.2832 25.1247 82.5049 25.9095 83.2076C27.0064 84.1897 26.9851 85.4312 26.2232 86.2823C25.5882 86.9915 24.821 87.2585 23.7274 86.8246C23.0748 86.564 22.2357 86.0171 21.1536 85.3039C20.7871 85.8275 20.8666 86.2905 21.4717 86.8323C21.85 87.1709 22.4761 87.442 23.0517 87.1226L23.8846 88.5327C22.8758 89.1457 21.6512 89.1054 20.4219 88.0048C19.5236 87.2005 19.0062 86.2943 19.2564 85.2918ZM22.9379 83.5964C22.6392 83.7208 22.3324 84.0253 22.1028 84.2627C23.0903 84.8913 23.5079 85.1289 23.8942 85.2874C24.4079 85.4747 24.72 85.4305 24.9486 85.1752C25.2618 84.8253 25.1739 84.3718 24.7294 83.9739C24.0203 83.3389 23.2366 83.4721 22.9379 83.5964Z" />
            <path d="M19.9475 77.3422L15.667 80.5192L17.0059 82.3231L15.7829 83.2308L12.0763 78.237L13.2993 77.3292L14.6382 79.1331L18.9187 75.9561L19.9475 77.3422Z" />
            <path d="M7.53077 69.4817L13.7521 66.6062L14.4444 68.1039L10.6424 69.8611L15.7437 70.915L16.3188 72.1593L10.0974 75.0348L9.40518 73.5371L13.0804 71.8384L8.10055 70.7144L7.53077 69.4817Z" />
            <path d="M11.8643 60.2661L5.06011 61.0883L4.32627 55.0149L11.1305 54.1927L11.3376 55.9064L6.13359 56.5352L6.45331 59.1813L11.6573 58.5525L11.8643 60.2661Z" />
            <path d="M4.79018 44.6653L11.6131 45.3146L11.4568 46.9572L7.28721 46.5604L11.1634 50.0401L11.0335 51.4047L4.2106 50.7554L4.36692 49.1128L8.39748 49.4964L4.66152 46.0173L4.79018 44.6653Z" />
            <path d="M12.6218 41.0777L7.52541 39.5145L6.86667 41.6623L5.41057 41.2157L7.23421 35.2699L8.69031 35.7165L8.03156 37.8643L13.1279 39.4274L12.6218 41.0777Z" />
            <path d="M12.0899 27.7485C12.6632 27.7572 13.0928 27.9767 13.639 28.2741L17.3175 30.277L16.5952 31.6035L15.8595 31.2029C16.2035 32.0839 16.1494 32.8203 15.6456 33.7455C14.9415 35.0385 13.7282 35.3028 12.725 34.7565C11.889 34.3013 11.453 33.6159 11.6243 32.4519C11.7281 31.7569 12.0678 30.8147 12.5136 29.5978C11.9199 29.3612 11.4875 29.5449 11.099 30.2583C10.8562 30.7041 10.7362 31.3758 11.1792 31.8627L9.99792 32.997C9.16974 32.1559 8.92779 30.9547 9.71682 29.5056C10.2934 28.4467 11.0567 27.7351 12.0899 27.7485ZM14.585 30.9425C14.3954 30.6803 14.0286 30.4516 13.7448 30.2827C13.3597 31.3881 13.2243 31.849 13.1588 32.2614C13.0943 32.8043 13.209 33.098 13.51 33.2619C13.9224 33.4865 14.3436 33.2967 14.6289 32.7728C15.0841 31.9368 14.7746 31.2047 14.585 30.9425Z" />
            <path d="M18.8803 27.8423L13.705 23.349L14.8367 22.0456L16.811 23.7597L18.6582 21.6321L16.6839 19.918L17.8156 18.6146L22.9909 23.1079L21.8592 24.4113L19.8754 22.6889L18.0281 24.8165L20.012 26.5389L18.8803 27.8423Z" />
            <path d="M25.0332 21.1188L20.9713 15.5984L22.3616 14.5754L23.9112 16.6814L26.1806 15.0115L24.6311 12.9056L26.0214 11.8826L30.0833 17.4029L28.693 18.4259L27.1359 16.3098L24.8665 17.9797L26.4235 20.0958L25.0332 21.1188Z" />
            <path d="M32.4294 8.47264L35.0166 7.32482L37.796 13.5896L36.2182 14.2897L35.3329 12.2942L34.3236 12.742L34.1379 12.8244L33.8283 15.35L32.1809 16.0809L32.5487 13.2795C31.6956 13.297 30.9368 12.87 30.5045 11.8954C29.9949 10.7469 30.3371 9.73419 31.2705 9.08401C31.6521 8.81751 32.1394 8.60132 32.4294 8.47264ZM34.7925 11.076L33.9792 9.243L32.7958 9.76801C32.6566 9.82978 32.4877 9.91859 32.3343 10.0422C32.0506 10.2791 31.915 10.7559 32.1003 11.1735C32.2959 11.6144 32.7533 11.8002 33.1193 11.7489C33.3023 11.7233 33.4815 11.6577 33.6091 11.6011L34.7925 11.076Z" />
            <path d="M46.8916 8.39293C46.3155 8.48762 45.7947 8.13591 45.7 7.5598C45.6053 6.98369 45.9862 6.48377 46.5623 6.38909C47.0883 6.30263 47.6091 6.65434 47.7038 7.23045C47.7985 7.80656 47.4176 8.30648 46.8916 8.39293Z" />
          </svg>

          <svg
            className={s.icon}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 16H21.9867M16 16H15.9867M10 16H9.98667M16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16C28 17.5962 27.6884 19.1196 27.1226 20.5127C27.0143 20.7793 26.9602 20.9126 26.936 21.0204C26.9124 21.1258 26.9037 21.2038 26.9037 21.3118C26.9037 21.4223 26.9238 21.5426 26.9639 21.7831L27.7545 26.527C27.8373 27.0238 27.8787 27.2721 27.8017 27.4518C27.7342 27.609 27.609 27.7342 27.4518 27.8017C27.2721 27.8787 27.0238 27.8373 26.527 27.7545L21.7831 26.9639C21.5426 26.9238 21.4223 26.9037 21.3118 26.9037C21.2038 26.9037 21.1258 26.9124 21.0204 26.936C20.9126 26.9602 20.7793 27.0143 20.5127 27.1226C19.1196 27.6884 17.5962 28 16 28ZM21.3333 16C21.3333 16.3682 21.6318 16.6667 22 16.6667C22.3682 16.6667 22.6667 16.3682 22.6667 16C22.6667 15.6318 22.3682 15.3333 22 15.3333C21.6318 15.3333 21.3333 15.6318 21.3333 16ZM15.3333 16C15.3333 16.3682 15.6318 16.6667 16 16.6667C16.3682 16.6667 16.6667 16.3682 16.6667 16C16.6667 15.6318 16.3682 15.3333 16 15.3333C15.6318 15.3333 15.3333 15.6318 15.3333 16ZM9.33333 16C9.33333 16.3682 9.63181 16.6667 10 16.6667C10.3682 16.6667 10.6667 16.3682 10.6667 16C10.6667 15.6318 10.3682 15.3333 10 15.3333C9.63181 15.3333 9.33333 15.6318 9.33333 16Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className={s.text}>
          <p>потрібна допомога?</p>
          <span>отримати консультацію</span>
        </div>
      </div>

      <ProductPageAccordion
        desc={info.description}
        components={components}
        ingredients={ingredients}
        characteristics={characteristics}
      />
    </div>
  );
};
