import s from "./WishList.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ProductItem } from "../ProductItem/ProductItem";
import { ProductInfo } from "../../types/productTypes";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { clearWishlist } from "../../store/slices/wishlistSlice"; // локальний екшен
import { useWindowSize } from "../../hooks/useWindowSize";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { fetchCartProducts } from "../../store/slices/productsSlice";
import { Loader } from "../Loader/Loader";
import { empty } from "../BonusTab/BonusTab";
import { Link } from "react-router";

export const WishListTab = () => {
  const dispatch = useAppDispatch();
  const [wishlistProducts, setWishlistProducts] = useState<ProductInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const { width } = useWindowSize();
  const isMobile = width < 1024;
  const { t } = useTranslation();

  const wishlist = useSelector(
    (state: RootState) => state.wishlist.preferences
  );

  const productIdsString = wishlist
    .slice()
    .sort((a, b) => a - b)
    .join(",");

  useEffect(() => {
    if (wishlist.length) {
      setLoading(true);
      dispatch(fetchCartProducts(wishlist)).then((res) => {
        if (fetchCartProducts.fulfilled.match(res)) {
          setWishlistProducts(res.payload);
        }
        setLoading(false);
      });
    } else {
      setWishlistProducts([]);
      setLoading(false);
    }
  }, [productIdsString, dispatch]);

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
  };

  return (
    <div className={s.tab}>
      <div className={s.swiperController}>
        <h2>
          <span>{t("wishlistPopup.titleDesktopPart1")}</span>
          <span>{t("wishlistPopup.titleDesktopPart2")}</span>
        </h2>

        {!isMobile && wishlistProducts.length > 0 && (
          <div className={s.navigationContainer}>
            <button className={s.prevButton}>
              <svg
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_480_5408)">
                  <path d="M7.08228 5L8.15132 6.05572L3.39413 10.7535L24.5 10.7535V12.2465L3.39413 12.2465L8.15132 16.9443L7.08228 18L0.5 11.5L7.08228 5Z" />
                </g>
                <defs>
                  <clipPath id="clip0_480_5408">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="matrix(-1 0 0 1 24.5 0)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
            <button className={s.nextButton}>
              <svg
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_480_5411)">
                  <path d="M17.9177 5L16.8487 6.05572L21.6059 10.7535H0.5V12.2465H21.6059L16.8487 16.9443L17.9177 18L24.5 11.5L17.9177 5Z" />
                </g>
                <defs>
                  <clipPath id="clip0_480_5411">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className={s.loaderWrapper}>
          <Loader />
        </div>
      ) : wishlistProducts.length > 0 ? (
        <>
          {!isMobile && (
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={4}
              navigation={{
                prevEl: `.${s.prevButton}`,
                nextEl: `.${s.nextButton}`,
              }}
              className={s.productListSwiper}
            >
              {wishlistProducts.map((product) => (
                <SwiperSlide className={s.slide} key={product.id}>
                  <ProductItem info={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <button className={s.clear} onClick={handleClearWishlist}>
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
            <span>{t("deleteAll")}</span>
          </button>

          {isMobile && (
            <div className={s.mobileList}>
              {wishlistProducts.map((product) => (
                <ProductItem info={product} key={product.id} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className={s.emptyWishlist}>
          <p> {t("wishlistPopup.empty")}</p>
          {empty}

          <Link to="/catalog">
            В каталог
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_4390_39352)">
                <path d="M17.9177 5L16.8487 6.05572L21.6059 10.7535H0.5V12.2465H21.6059L16.8487 16.9443L17.9177 18L24.5 11.5L17.9177 5Z" />
              </g>
              <defs>
                <clipPath id="clip0_4390_39352">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};
