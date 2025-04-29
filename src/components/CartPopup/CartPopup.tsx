import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import s from "./CartPopup.module.css";
import { ProductInfo } from "../../types/productTypes";
import { CartProductItemMemo } from "../CartProductItem/CartProductItem";
import { useLocation, useNavigate } from "react-router";
import { fetchCartProducts } from "../../store/slices/productsSlice"; // шлях залежить від структури
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { Loader } from "../Loader/Loader";
import { ProductList } from "../ProductList/ProductList";
import { Layout } from "../Layout/Layout";
import { motion } from "framer-motion";

interface CartPopupProps {
  onClose: () => void;
}

export const CartPopup: React.FC<CartPopupProps> = ({ onClose }) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const token = useSelector((state: RootState) => state.user.token);
  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { pathname } = useLocation();

  const dispatch = useAppDispatch();
  const [cartProducts, setCartProducts] = useState<ProductInfo[]>([]);

  const productIds = cartItems.map((item) => item.id);
  const productIdsString = productIds.sort((a, b) => a - b).join(",");

  useEffect(() => {
    if (productIds.length) {
      setLoading(true);
      dispatch(fetchCartProducts(productIds)).then((res) => {
        if (fetchCartProducts.fulfilled.match(res)) {
          setCartProducts(res.payload);
        }
        setLoading(false);
      });
    } else {
      setCartProducts([]);
      setLoading(false);
    }
  }, [productIdsString]);

  const navigate = useNavigate();

  const cart = cartItems
    .map((cartItem) => {
      const product = cartProducts.find((p) => p.id === cartItem.id);

      if (product) {
        return {
          ...product,
          variation: cartItem.variation_id,
          quantity: cartItem.quantity,
        };
      }

      return null;
    })
    .filter(
      (item): item is ProductInfo & { variation: number; quantity: number } =>
        item !== null
    );

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );

  const discount = cart.reduce((sum, item) => {
    if (item.sale_price && item.regular_price) {
      const itemDiscount =
        (Number(item.regular_price) - Number(item.sale_price)) * item.quantity;
      return sum + itemDiscount;
    }
    return sum;
  }, 0);

  const regularPrice = cart.reduce(
    (sum, item) => sum + Number(item.regular_price || 0) * item.quantity,
    0
  );

  useEffect(() => {
    if (hasMounted) {
      onClose();
    } else {
      setHasMounted(true);
    }
  }, [pathname]);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={s.popupOverlay}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={s.popupContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={s.popupHeader}>
            <h2 className={s.popupTitle}>Кошик</h2>
            <button className={s.closeButton} onClick={onClose}>
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
          </div>

          <div className={s.flexBlock}>
            <div className={s.cartListBox}>
              <ul className={s.popupList}>
                {loading ? (
                  <Loader />
                ) : cart.length ? (
                  cart.map((item) => (
                    <CartProductItemMemo
                      optional={false}
                      key={item.id}
                      info={item}
                      token={token || ""}
                      variation={item.variation}
                    />
                  ))
                ) : (
                  <div className={s.emptyCart}>Кошик порожній</div>
                )}
              </ul>
            </div>

            <div className={s.orderInfo}>
              <div>
                <div className={s.orderDetails}>
                  <p>
                    <span>Сума замовлення:</span>
                    <span>{regularPrice} ₴</span>
                  </p>
                  <p>
                    <span>Сума знижки:</span>
                    <span className={s.discount}>{discount} ₴</span>
                  </p>
                  <p>
                    <span>Вартість доставки:</span>
                    <span>
                      <svg
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.99935 5.50033V18.8337M9.99935 5.50033H7.05292C6.61879 5.50033 6.20243 5.32473 5.89545 5.01217C5.58847 4.69961 5.41602 4.27569 5.41602 3.83366C5.41602 3.39163 5.58847 2.96771 5.89545 2.65515C6.20243 2.34259 6.61879 2.16699 7.05292 2.16699C9.34459 2.16699 9.99935 5.50033 9.99935 5.50033ZM9.99935 5.50033H12.9458C13.3799 5.50033 13.7963 5.32473 14.1032 5.01217C14.4102 4.69961 14.5827 4.27569 14.5827 3.83366C14.5827 3.39163 14.4102 2.96771 14.1032 2.65515C13.7963 2.34259 13.3799 2.16699 12.9458 2.16699C10.6541 2.16699 9.99935 5.50033 9.99935 5.50033ZM16.666 9.66699V16.167C16.666 17.1004 16.666 17.5671 16.4844 17.9236C16.3246 18.2372 16.0696 18.4922 15.756 18.652C15.3995 18.8337 14.9328 18.8337 13.9993 18.8337L5.99935 18.8337C5.06593 18.8337 4.59922 18.8337 4.2427 18.652C3.92909 18.4922 3.67413 18.2372 3.51434 17.9236C3.33268 17.5671 3.33268 17.1004 3.33268 16.167V9.66699M1.66602 6.83366L1.66602 8.33366C1.66602 8.80037 1.66602 9.03372 1.75684 9.21198C1.83674 9.36879 1.96422 9.49627 2.12102 9.57616C2.29928 9.66699 2.53264 9.66699 2.99935 9.66699L16.9994 9.66699C17.4661 9.66699 17.6994 9.66699 17.8777 9.57616C18.0345 9.49627 18.162 9.36879 18.2419 9.21198C18.3327 9.03373 18.3327 8.80037 18.3327 8.33366V6.83366C18.3327 6.36695 18.3327 6.13359 18.2419 5.95533C18.162 5.79853 18.0345 5.67105 17.8777 5.59115C17.6994 5.50033 17.4661 5.50033 16.9993 5.50033L2.99935 5.50033C2.53264 5.50033 2.29928 5.50033 2.12102 5.59115C1.96422 5.67105 1.83674 5.79853 1.75684 5.95533C1.66602 6.13359 1.66602 6.36695 1.66602 6.83366Z"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Безкоштовна
                    </span>
                  </p>
                </div>
                <div className={s.totalAmount}>
                  <p>РАЗОМ:</p>
                  <span>{totalAmount} ₴</span>
                </div>
              </div>

              <div className={s.btnBlock}>
                <button
                  className={cart.length < 1 ? s.disabled : ""}
                  onClick={() => navigate("/order")}
                >
                  Оформити замовлення
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.4177 5L16.3487 6.05572L21.1059 10.7535H0V12.2465H21.1059L16.3487 16.9443L17.4177 18L24 11.5L17.4177 5Z" />
                  </svg>
                </button>

                <button onClick={() => onClose()}>Продовжити покупки</button>
              </div>
            </div>
          </div>

          <div className={s.cartProductsSlider}>
            <ProductList
              categories={["Бестселлери"]}
              defaultCategory="Бестселлери"
              mini={true}
            >
              <h2>Тобі може сподобатись:</h2>
            </ProductList>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};
