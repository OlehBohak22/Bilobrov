import s from "./ProductItem.module.css";
import { ProductInfo } from "../../types/productTypes";
import { StarRating } from "../StarRating/StarRating";
import WishlistButton from "../WishlistButton/WishlistButton";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface ProductItemProps {
  info: ProductInfo;
}

const isNewProduct = (dateCreated: string) => {
  if (!dateCreated) return false;

  const createdDate = new Date(dateCreated);
  const today = new Date();

  const daysDiff = Math.floor(
    (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysDiff <= 14;
};

export const ProductItem: React.FC<ProductItemProps> = ({ info }) => {
  const brandMeta = info.meta_data.find((item) => item.key === "brands");

  const { token, user } = useSelector((state: RootState) => state.user);

  if (!token || !user) {
    return null;
  }

  const brandName = Array.isArray(brandMeta?.value)
    ? brandMeta.value[0]?.name
    : null;

  return (
    <li className={s.productItem}>
      <div>
        <div className={s.productImage}>
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
                    (1 - Number(info.sale_price) / Number(info.regular_price)) *
                      100
                  )}
                  %
                </div>
              )}
          </div>

          <img
            src={info.images[0]?.src}
            alt={info.images[0]?.alt || info.name}
          />

          {/* <div className={s.wishList}>
            <svg viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8701 21.7964C11.9329 21.8608 12.0081 21.912 12.091 21.947C12.174 21.982 12.2631 22 12.3532 22C12.4432 22 12.5324 21.982 12.6153 21.947C12.6983 21.912 12.7734 21.8608 12.8363 21.7964L21.5161 13.0016C23.7698 10.719 23.7698 7.00337 21.5161 4.71987C20.4214 3.61069 18.9657 3.00001 17.416 3.00001C15.8662 3.00001 14.4114 3.61069 13.3167 4.71897L12.3532 5.69606L11.3897 4.71987C10.8557 4.17416 10.218 3.74084 9.51393 3.44546C8.80991 3.15009 8.05388 2.99863 7.2904 3.00001C6.52678 2.99856 5.7706 3.14998 5.06642 3.44536C4.36224 3.74074 3.72431 4.17409 3.19023 4.71987C0.936589 7.00337 0.936589 10.719 3.19023 13.0007L11.8701 21.7964ZM4.15556 5.67254C4.5639 5.25547 5.0515 4.92424 5.58969 4.69834C6.12789 4.47244 6.70581 4.35641 7.2895 4.35708C8.47286 4.35708 9.58566 4.82482 10.4225 5.67344L11.8692 7.13908C11.9992 7.26314 12.1721 7.33235 12.3518 7.33235C12.5316 7.33235 12.7044 7.26314 12.8345 7.13908L14.2811 5.67254C14.6898 5.25565 15.1776 4.92455 15.7159 4.69866C16.2542 4.47277 16.8322 4.35664 17.416 4.35708C17.9997 4.35641 18.5776 4.47244 19.1158 4.69834C19.654 4.92424 20.1416 5.25547 20.5499 5.67254C22.2842 7.4304 22.2842 10.2902 20.5499 12.049L12.3532 20.3552L4.15556 12.0481C2.42123 10.2911 2.42123 7.4304 4.15556 5.67254Z" />
            </svg>
          </div> */}

          <WishlistButton productId={info.id} token={token} />

          <div className={s.cart}>
            <svg
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.905 10.0682H13.8646"
                stroke="white"
                strokeWidth="1.3"
                strokeLinecap="square"
              />
              <path
                d="M8.76728 10.0682H8.72695"
                stroke="white"
                strokeWidth="1.3"
                strokeLinecap="square"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.2164 6.29297L19.0309 19.7086L2.9707 19.7086L3.78523 6.29297L18.2164 6.29297Z"
                stroke="white"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M15.1004 6.09956C15.1004 3.99658 13.3956 2.29178 11.2927 2.29178C10.28 2.28749 9.30731 2.68677 8.58972 3.40133C7.87213 4.1159 7.46874 5.08687 7.46875 6.09956"
                stroke="white"
                strokeWidth="1.3"
                strokeLinecap="square"
              />
            </svg>
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

        <div className={s.ratingBlock}>
          <StarRating rating={info.average_rating} />
          <span>({info.rating_count})</span>
        </div>
      </div>

      <div>
        {info.sale_price && info.sale_price !== "0" ? (
          <>
            <span className={`${s.currency} ${s.red}`}>₴</span>
            <span className={`${s.salePrice} ${s.red}`}>{info.sale_price}</span>
            <span className={s.regularPrice}>{info.regular_price}</span>
          </>
        ) : (
          <>
            <span className={s.currency}>₴</span>
            <span className={s.salePrice}>{info.price}</span>
          </>
        )}
      </div>
    </li>
  );
};
