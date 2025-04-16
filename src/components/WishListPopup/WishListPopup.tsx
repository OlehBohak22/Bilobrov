import { useSelector } from "react-redux";
import { RootState } from "../../store";
import s from "./WishListPopup.module.css"; // Імпортуємо стилі
import { ProductInfo } from "../../types/productTypes";
import { togglePreference } from "../../store/slices/wishlistSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { ProductItem } from "../ProductItem/ProductItem";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

export const WishListPopup: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [hasMounted, setHasMounted] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (hasMounted) {
      onClose();
    } else {
      setHasMounted(true);
    }
  }, [pathname]);

  const token = useSelector((state: RootState) => state.user?.token);

  const handleClearWishlist = () => {
    if (token) {
      dispatch(togglePreference({ token, preference: [] })); // Очищаємо вподобання
    }
  };

  const wishlist = useSelector(
    (state: RootState) => state.user.user?.meta.preferences || []
  );

  // Отримуємо всі товари (припустимо, що вони є у `products` в Redux)
  const products: ProductInfo[] = useSelector(
    (state: RootState) => state.products.items
  );

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );
  return (
    <div className={s.modalOverlay}>
      <motion.div
        className={s.modal}
        initial={{ x: "50%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className={s.swiperController}>
          <h2>
            <span>Список</span>
            <span>побажань</span>
          </h2>

          {wishlistProducts.length > 0 && (
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

        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={"auto"}
          navigation={{
            prevEl: `.${s.prevButton}`,
            nextEl: `.${s.nextButton}`,
          }}
          className={s.productListSwiper}
        >
          {wishlistProducts.map((product: ProductInfo) => (
            <SwiperSlide className={s.slide} key={product.id}>
              <ProductItem info={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        {(wishlistProducts.length !== 0 && (
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

            <span>Видалити все</span>
          </button>
        )) || <p>Список бажань порожній</p>}
      </motion.div>
    </div>
  );
};
