import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import s from "./WishListPopup.module.css";
import { ProductInfo } from "../../types/productTypes";
import { clearWishlist } from "../../store/slices/wishlistSlice"; // локальний екшен
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { ProductItem } from "../ProductItem/ProductItem";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";

export const WishListPopup: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const dispatch = useDispatch();
  const [hasMounted, setHasMounted] = useState(false);
  const { pathname } = useLocation();
  const { width } = useWindowSize();
  const isMobile = width < 1024;
  const { t } = useTranslation();
  const wishlist = useSelector(
    (state: RootState) => state.wishlist.preferences
  );
  const products: ProductInfo[] = useSelector(
    (state: RootState) => state.products.items
  );

  // Фільтруємо продукти
  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  useEffect(() => {
    if (hasMounted) {
      onClose();
    } else {
      setHasMounted(true);
    }
  }, [pathname]);

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={s.modalOverlay}
    >
      <motion.div
        className={s.modal}
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className={s.swiperController}>
          {isMobile ? (
            <>
              <h2>{t("wishlistPopup.titleMobile")}</h2>
              {wishlistProducts.length > 0 && (
                <button className={s.clear} onClick={handleClearWishlist}>
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.43359 5.37598H16.5679L15.3868 17.7086H4.61476L3.43359 5.37598Z"
                      stroke="#D63D44"
                      stroke-width="1.6"
                      stroke-linecap="square"
                    />
                    <path
                      d="M10 9.46973L10 13.6138"
                      stroke="#D63D44"
                      stroke-width="1.6"
                      stroke-linecap="square"
                    />
                    <path
                      d="M13.7298 4.99811L12.8392 2.29199H7.16014L6.26953 4.99811"
                      stroke="#D63D44"
                      stroke-width="1.6"
                      stroke-linecap="square"
                    />
                  </svg>
                  <span>{t("deleteAll")}</span>
                </button>
              )}
            </>
          ) : (
            <h2>
              <span>{t("wishlistPopup.titleDesktopPart1")}</span>
              <span>{t("wishlistPopup.titleDesktopPart2")}</span>
            </h2>
          )}

          {wishlistProducts.length > 0 && !isMobile && (
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

        <button onClick={onClose} className={s.closeBtn}>
          <svg viewBox="0 0 52 52">
            <path
              d="M39 13L13 39M13 13L39 39"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {wishlistProducts.length > 0 ? (
          <>
            {isMobile ? (
              <div className={s.mobileList}>
                {wishlistProducts.map((product) => (
                  <ProductItem info={product} key={product.id} />
                ))}
              </div>
            ) : (
              <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView="auto"
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

            {!isMobile && (
              <button className={s.clear} onClick={handleClearWishlist}>
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.43359 5.37598H16.5679L15.3868 17.7086H4.61476L3.43359 5.37598Z"
                    stroke="#D63D44"
                    stroke-width="1.6"
                    stroke-linecap="square"
                  />
                  <path
                    d="M10 9.46973L10 13.6138"
                    stroke="#D63D44"
                    stroke-width="1.6"
                    stroke-linecap="square"
                  />
                  <path
                    d="M13.7298 4.99811L12.8392 2.29199H7.16014L6.26953 4.99811"
                    stroke="#D63D44"
                    stroke-width="1.6"
                    stroke-linecap="square"
                  />
                </svg>
                <span>{t("deleteAll")}</span>
              </button>
            )}
          </>
        ) : (
          <div className={s.emptyWishlist}>{t("wishlistPopup.empty")}</div>
        )}
      </motion.div>
    </motion.div>
  );
};
