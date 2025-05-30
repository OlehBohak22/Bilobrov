import s from "./CartProductItem.module.css"; // Імпортуємо стилі
import { ProductInfo } from "../../types/productTypes";
import {
  addToCart,
  fetchCart,
  removeAllFromCart,
  removeFromCart,
} from "../../store/slices/cartSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { memo } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useTranslation } from "react-i18next";

interface ProductItemProps {
  info: ProductInfo;
  token: string | null;
  optional: boolean | undefined;
  variation?: ProductInfo["variations"][0]; // додаємо варіацію як optional
}

const CartProductItem: React.FC<ProductItemProps> = ({
  info,
  token,
  optional,
  variation,
}) => {
  const dispatch = useAppDispatch();
  const { width } = useWindowSize();
  const isMobile = width < 1024;
  const { t } = useTranslation();
  const isNewProduct = (dateCreated: string) => {
    if (!dateCreated) return false;

    const createdDate = new Date(dateCreated);
    const today = new Date();

    const daysDiff = Math.floor(
      (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysDiff <= 14;
  };

  const brandName = info.brands[0]?.name || "";

  const handleDecrease = () => {
    if (info.quantity <= 1) return;

    dispatch(
      removeFromCart({
        product: {
          id: info.id,
          quantity: 1,
          variation_id: variation || 0,
        },
        token,
      })
    );
  };

  const handleIncrease = () => {
    dispatch(
      addToCart({
        product: {
          id: info.id,
          quantity: 1,
          variation_id: variation || 0,
        },
        token,
      })
    );
  };

  const handleRemoveAll = async () => {
    if (!info) return;

    await dispatch(
      removeAllFromCart({
        productId: info.id,
        variationId: variation || 0,
        quantity: info.quantity,
        token,
      })
    );

    dispatch(fetchCart(token));
  };

  return (
    <li className={s.item}>
      <div className={s.img}>
        <img src={info.images[0]?.src} alt={info.images[0]?.alt || info.name} />

        {isMobile && !optional && (
          <div className={s.quantityControl}>
            <button onClick={handleDecrease}>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 7.33301H0V8.66634H16V7.33301Z" />
              </svg>
            </button>

            <span>{info.quantity}</span>

            <button onClick={handleIncrease}>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2700_8776)">
                  <path d="M16 7.33333H8.66667V0H7.33333V7.33333H0V8.66667H7.33333V16H8.66667V8.66667H16V7.33333Z" />
                </g>
                <defs>
                  <clipPath id="clip0_2700_8776">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className={s.div}>
        <div>
          <div className="flex  items-center lg:mb-[0.6vw] mb-[3.2vw] flex-wrap">
            <div>
              {optional && (
                <div className={s.markersBlock}>
                  {/* {info.featured && (
                    <div className={s.bestMarker}>
                      <span>bilobrov'S</span>
                      <span>BEST</span>
                    </div>
                  )} */}

                  <div className={s.topMarker}>TOP</div>

                  {isNewProduct(info.date_created) && (
                    <div className={s.newMarker}>NEW</div>
                  )}

                  {info.sale_price &&
                    info.sale_price !== "0" &&
                    info.regular_price &&
                    info.regular_price !== "0" && (
                      <div className={s.saleMarker}>
                        -
                        {Math.round(
                          (1 -
                            Number(info.sale_price) /
                              Number(info.regular_price)) *
                            100
                        )}
                        %
                      </div>
                    )}
                </div>
              )}
            </div>

            <div className={s.code}>
              <p>{t("productCode")}</p> <span> {info.sku}</span>
            </div>
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
        </div>

        <div className="flex items-center justify-between lg:pb-[0] pb-[2vw]">
          <div className="flex items-center gap-[1vw]">
            {info.sale_price && info.sale_price !== "0" ? (
              <div>
                <span className={`${s.currency} ${s.red}`}>₴</span>
                <span className={`${s.salePrice} ${s.red}`}>
                  {info.sale_price}
                </span>
                <span className={s.regularPrice}>{info.regular_price}</span>
              </div>
            ) : (
              <div>
                <span className={s.currency}>₴</span>
                <span className={s.salePrice}>{info.price}</span>
              </div>
            )}

            {!isMobile && !optional && (
              <div className={s.quantityControl}>
                <button onClick={handleDecrease}>
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 7.33301H0V8.66634H16V7.33301Z" />
                  </svg>
                </button>

                <span>{info.quantity}</span>

                <button onClick={handleIncrease}>
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_2700_8776)">
                      <path d="M16 7.33333H8.66667V0H7.33333V7.33333H0V8.66667H7.33333V16H8.66667V8.66667H16V7.33333Z" />
                    </g>
                    <defs>
                      <clipPath id="clip0_2700_8776">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {!optional && (
            <button className={s.clear} onClick={handleRemoveAll}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.11719 6.45117H19.8784L18.461 21.2503H5.53458L4.11719 6.45117Z"
                  strokeWidth="1.6"
                  strokeLinecap="square"
                />
                <path
                  d="M12 11.3638L12 16.3366"
                  strokeWidth="1.6"
                  strokeLinecap="square"
                />
                <path
                  d="M16.4758 5.99734L15.4071 2.75H8.59217L7.52344 5.99734"
                  strokeWidth="1.6"
                  strokeLinecap="square"
                />
              </svg>

              <span>{t("delete")}</span>
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

export const CartProductItemMemo = memo(CartProductItem);
