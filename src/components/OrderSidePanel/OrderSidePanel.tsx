import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import s from "./OrderSidePanel.module.css";
import { RootState } from "../../store";
import { ProductInfo } from "../../types/productTypes";
import { CartProductItemMemo } from "../CartProductItem/CartProductItem";
import { fetchCartProducts } from "../../store/slices/productsSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { Loader } from "../Loader/Loader";
import { useTranslation } from "react-i18next";

export const OrderSidePanel = () => {
  const { t } = useTranslation();
  const { items } = useSelector((state: RootState) => state.cart);
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useAppDispatch();

  const [cartProducts, setCartProducts] = useState<ProductInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const productIds = items.map((item) => item.id);
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

  const cart = items
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

  return (
    <div className={s.sidePanel}>
      <div className={s.sideHeading}>
        <p>{t("orderPanel.totalToPay")}</p>
        <span>{totalAmount}₴</span>
      </div>

      <div className={s.orderCartList}>
        <ul>
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
            <div className={s.emptyCart}>{t("orderPanel.emptyCart")}</div>
          )}
        </ul>
      </div>

      <div className={s.orderInfo}>
        <div>
          <div className={s.orderDetails}>
            <p>
              <span>{t("orderPanel.orderAmount")}:</span>
              <span>{regularPrice} ₴</span>
            </p>
            <p>
              <span>{t("orderPanel.discountAmount")}:</span>
              <span className={s.discount}>{discount} ₴</span>
            </p>
            <p>
              <span>{t("orderPanel.deliveryCost")}:</span>
              <span>
                <svg
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="..."
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t("orderPanel.free")}
              </span>
            </p>
          </div>
          <div className={s.totalAmount}>
            <p>{t("orderPanel.total")}:</p>
            <span>{totalAmount} ₴</span>
          </div>
        </div>
      </div>
    </div>
  );
};
