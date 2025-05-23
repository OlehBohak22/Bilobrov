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
import { useGlobalProps } from "../../GlobalPropContext";
import { truncateHtmlString } from "../../utils/truncateHtmlString";
import { useWindowSize } from "../../hooks/useWindowSize";
import { AnimatePresence } from "framer-motion";

interface ProductItemProps {
  info: ProductInfo;
  certificate?: boolean;
  mini?: boolean;
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

export const ProductItem: React.FC<ProductItemProps> = ({
  info,
  certificate,
  mini,
}) => {
  const dispatch = useAppDispatch();
  const token = useSelector((state: RootState) => state.user.token);

  const { openCart } = useGlobalProps();

  const cart = useSelector((state: RootState) => state.cart.items);

  const { reviews } = useSelector((state: any) => state.products);

  const currentReviews = reviews.filter(
    (item: { product_id: any }) => item.product_id == info.id
  );

  const isInCart = cart.some((item) => item.id === info.id);

  const [isPopupOpen, setPopupOpen] = useState(false);

  const { width } = useWindowSize();

  const isMobile = width < 1024;

  const brandName = info.brands[0]?.name || "";

  const handleAddToCart = () => {
    if (info.variations && info.variations.length > 1) {
      setPopupOpen(true);
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
      openCart();
    }
  };

  const localAverage =
    currentReviews.length > 0
      ? currentReviews.reduce(
          (sum: number, r: { rating: number }) => sum + r.rating,
          0
        ) / currentReviews.length
      : 0;

  return (
    <>
      <li
        key={info.id}
        className={`${s.productItem} ${mini && s.miniProductItem} ${
          info.stock_quantity < 1 && s.notAvailable
        } `}
      >
        <Link className={s.link} to={`/product/${info.slug}/${info.id}`} />

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

            {info.stock_quantity > 0 &&
              info.categories[0]?.slug !== "podarunkovi-sertyfikaty-20" && (
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
                      strokeWidth="1.3"
                      strokeLinecap="square"
                    />
                    <path
                      d="M8.76728 10.0682H8.72695"
                      strokeWidth="1.3"
                      strokeLinecap="square"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.2164 6.29297L19.0309 19.7086L2.9707 19.7086L3.78523 6.29297L18.2164 6.29297Z"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M15.1004 6.09956C15.1004 3.99658 13.3956 2.29178 11.2927 2.29178C10.28 2.28749 9.30731 2.68677 8.58972 3.40133C7.87213 4.1159 7.46874 5.08687 7.46875 6.09956"
                      strokeWidth="1.3"
                      strokeLinecap="square"
                    />
                  </svg>
                </div>
              )}
          </div>

          {brandName && <p className={s.productBrand}>{brandName}</p>}

          {certificate && <p className={s.productBrand}>Bilobrov</p>}

          <p className={s.productName}>{info.name}</p>
          {typeof info.short_description === "string" ? (
            <p className={s.shortDesc}>
              {truncateHtmlString(info.short_description, 80)}{" "}
            </p>
          ) : (
            <>{info.short_description}</>
          )}

          {certificate && <p className={s.shortDesc}>Gift Card</p>}

          {!certificate && (
            <div className={s.ratingBlock}>
              <StarRating isMobile={isMobile} rating={localAverage} />
              <span>({currentReviews.length})</span>
            </div>
          )}
        </div>

        <div>
          {info.sale_price && info.sale_price !== "0" ? (
            <>
              <span className={`${s.salePrice} ${s.red}`}>
                {info.sale_price}
              </span>
              <span className={`${s.currency} ${s.red}`}>₴</span>

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

      <AnimatePresence>
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
              openCart();
            }}
            onClose={() => {
              setPopupOpen(false);
            }}
            productId={info.id}
            product={info}
          />
        )}
      </AnimatePresence>
    </>
  );
};
