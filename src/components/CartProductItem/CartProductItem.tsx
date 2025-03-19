import s from "./CartProductItem.module.css"; // Імпортуємо стилі
import { ProductInfo } from "../../types/productTypes";
import {
  addToCart,
  fetchCart,
  removeAllFromCart,
  removeFromCart,
} from "../../store/slices/cartSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";

interface ProductItemProps {
  info: ProductInfo;
  token: string | null;
  optional: boolean | undefined;
  variation?: ProductInfo["variations"][0]; // додаємо варіацію як optional
}

export const CartProductItem: React.FC<ProductItemProps> = ({
  info,
  token,
  optional,
  variation,
}) => {
  const dispatch = useAppDispatch();

  const isNewProduct = (dateCreated: string) => {
    if (!dateCreated) return false;

    const createdDate = new Date(dateCreated);
    const today = new Date();

    const daysDiff = Math.floor(
      (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysDiff <= 14;
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

  const handleDecrease = () => {
    // Видаляємо одиницю товару з кошика, враховуючи варіацію
    dispatch(
      removeFromCart({
        product: {
          id: info.id,
          quantity: 1, // Видаляємо одну одиницю товару
          variation_id: variation || 0, // Використовуємо ID варіації, якщо вона є
        },
        token,
      })
    );
  };

  const handleIncrease = () => {
    // Додаємо одиницю товару до кошика, враховуючи варіацію
    dispatch(
      addToCart({
        product: {
          id: info.id,
          quantity: 1, // Додаємо одну одиницю товару
          variation_id: variation || 0, // Використовуємо ID варіації, якщо вона є
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
        quantity: info.quantity, // Використовуємо поточний локальний `quantity`
        token,
      })
    );

    dispatch(fetchCart(token));
  };

  return (
    <li className={s.item}>
      <div className={s.img}>
        <img src={info.images[0]?.src} alt={info.images[0]?.alt || info.name} />
      </div>

      <div className={s.div}>
        <div className="flex  items-center mb-[0.6vw]">
          <div>
            {optional && (
              <div className={s.markersBlock}>
                {info.featured && (
                  <div className={s.bestMarker}>
                    <span>bilobrov'S</span>
                    <span>BEST</span>
                  </div>
                )}

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
            <p>Код товару: </p> <span> {info.sku}</span>
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

        <div className="flex items-center justify-between">
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

            {!optional && (
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
                    <g clip-path="url(#clip0_2700_8776)">
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

          {/* Інпут для зміни кількості */}
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

              <span>Видалити</span>
            </button>
          )}
        </div>
      </div>
    </li>
  );
};
