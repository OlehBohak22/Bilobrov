import { useSelector } from "react-redux";
import { RootState } from "../../store";
import s from "./WishListPopup.module.css"; // Імпортуємо стилі
import { ProductInfo } from "../../types/productTypes";
import { useDispatch } from "react-redux";
import { togglePreference } from "../../store/slices/wishlistSlice";

interface ProductItemProps {
  info: ProductInfo;
  token: string;
}

const WishListProductItem: React.FC<ProductItemProps> = ({ info, token }) => {
  const dispatch = useDispatch();

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

  const brandName = Array.isArray(brandMeta?.value)
    ? brandMeta.value[0]?.name
    : null;

  const loading = useSelector((state: RootState) => state.wishlist.loading);

  const handleToggle = () => {
    if (!loading && token) {
      dispatch(togglePreference({ token, preference: info.id }) as any);
    }
  };

  return (
    <li className={s.item}>
      <div className={s.img}>
        <img src={info.images[0]?.src} alt={info.images[0]?.alt || info.name} />
      </div>

      <div className="w-[23vw]">
        <div className="flex gap-[0.8vw] items-center mb-[0.6vw]">
          <div>
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
                        Number(info.sale_price) / Number(info.regular_price)) *
                        100
                    )}
                    %
                  </div>
                )}
            </div>
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
          <div>
            {info.sale_price && info.sale_price !== "0" ? (
              <>
                <span className={`${s.currency} ${s.red}`}>₴</span>
                <span className={`${s.salePrice} ${s.red}`}>
                  {info.sale_price}
                </span>
                <span className={s.regularPrice}>{info.regular_price}</span>
              </>
            ) : (
              <>
                <span className={s.currency}>₴</span>
                <span className={s.salePrice}>{info.price}</span>
              </>
            )}
          </div>

          <button className={s.clear} onClick={handleToggle}>
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
        </div>
      </div>
    </li>
  );
};

export const WishListPopup: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const wishlist = useSelector(
    (state: RootState) => state.user?.user?.meta?.preferences || []
  );

  const products: ProductInfo[] = useSelector(
    (state: RootState) => state.products.items
  );

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  const token = useSelector((state: RootState) => state.user.token);

  return (
    <div className={s.modalOverlay}>
      <div className={s.modal}>
        <button onClick={onClose} className={s.closeBtn}>
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

        <ul className={s.list}>
          {wishlistProducts.map((product: ProductInfo) => (
            <WishListProductItem info={product} token={token || ""} />
          ))}
        </ul>
      </div>
    </div>
  );
};
