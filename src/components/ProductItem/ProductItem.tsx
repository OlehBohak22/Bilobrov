import React, { useState } from "react";
import s from "./ProductItem.module.css";
import { ProductInfo } from "../../types/productTypes";
import { StarRating } from "../StarRating/StarRating";
import WishlistButton from "../WishlistButton/WishlistButton";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addToCart } from "../../store/slices/cartSlice";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import { VariationsPopup } from "../VariationCartPopup/VariationCartPopup";

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
  const dispatch = useAppDispatch();
  const token = useSelector((state: RootState) => state.user.token);

  const cart = useSelector((state: RootState) => state.cart.items);

  // Перевірка наявності товару у кошику (булеве значення)
  const isInCart = cart.some((item) => item.id === info.id);

  const [isPopupOpen, setPopupOpen] = useState(false); // Стан для відкриття попапу

  const brandMeta = info.meta_data.find((item) => item.key === "brands");
  const brandName =
    Array.isArray(brandMeta?.value) &&
    brandMeta.value.length > 0 &&
    typeof brandMeta.value[0] === "object"
      ? (brandMeta.value[0] as { name: string }).name
      : typeof brandMeta?.value === "string"
      ? brandMeta.value
      : null;

  const handleAddToCart = () => {
    if (info.variations && info.variations.length > 1) {
      setPopupOpen(true); // Відкриваємо попап для вибору варіації
    } else {
      dispatch(
        addToCart({
          product: {
            id: info.id,
            quantity: 1,
            variation_id: info.variations?.[0] || 0,
          },
          token,
        })
      );
    }
  };

  return (
    <>
      <li className={s.productItem}>
        <Link className={s.link} to={`/product/${info.id}`} />
        <div className={s.block}>
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
                      (1 -
                        Number(info.sale_price) / Number(info.regular_price)) *
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
            <WishlistButton productId={info.id} />

            <div
              className={`${s.cart} ${isInCart && s.inCart}`}
              onClick={handleAddToCart}
              title="Додати в корзину"
            >
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

          <p>{info.id}</p>

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
      </li>

      {isPopupOpen && info.variations && (
        <VariationsPopup
          onSelect={(variation_id) => {
            dispatch(
              addToCart({
                product: {
                  id: info.id,
                  quantity: 1,
                  variation_id,
                },
                token,
              })
            );

            setPopupOpen(false);
          }}
          onClose={() => {
            setPopupOpen(false);
          }}
          productId={info.id}
          product={info}
        />
      )}
    </>
  );
};
