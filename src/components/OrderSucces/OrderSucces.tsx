import { FC, useEffect, useState, useMemo } from "react";
import { OrderData } from "../../store/slices/orderSlice";
import s from "./OrderSucces.module.css";
import { ProductInfo } from "../../types/productTypes";
import { Link } from "react-router";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchCartProducts } from "../../store/slices/productsSlice";
import { useTranslation } from "react-i18next";

interface SuccesProps {
  data: OrderData | null;
  usedBonuses?: number;
  appliedCoupon?: {
    code: string;
    discountAmount: number;
  } | null;
}

const months = [
  "січня",
  "лютого",
  "березня",
  "квітня",
  "травня",
  "червня",
  "липня",
  "серпня",
  "вересня",
  "жовтня",
  "листопада",
  "грудня",
];

const now = new Date();
const day = now.getDate();
const month = months[now.getMonth()];
const year = now.getFullYear();
const formattedDate = `${day} ${month} ${year} року`;

export const OrderSucces: FC<SuccesProps> = ({
  data,
  usedBonuses = 0,
  appliedCoupon = null,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const imageArr = data?.line_items.map((item) => ({
    imageSrc: item?.image?.src,
    quantity: item.quantity,
  }));

  const items = useMemo(() => {
    return (
      data?.line_items.map((item) => ({
        id: item.product_id,
        variation_id: item.variation_id,
        quantity: item.quantity,
      })) || []
    );
  }, [data]);

  const [cartProducts, setCartProducts] = useState<ProductInfo[]>([]);
  const [, setLoading] = useState(false);

  useEffect(() => {
    const productIds = items.map((item) => item.id);
    if (productIds.length) {
      setLoading(true);
      dispatch(fetchCartProducts(productIds)).then((res) => {
        if (fetchCartProducts.fulfilled.match(res)) {
          setCartProducts(res.payload);
        }
        setLoading(false);
      });
    }
  }, [items]);

  const cart = items
    .map((cartItem) => {
      const product = cartProducts.find((p) => p.id === Number(cartItem.id));
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

  const totalWithDiscounts = Math.max(
    totalAmount - usedBonuses - (appliedCoupon?.discountAmount || 0),
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
    <div className={s.succesCard}>
      <div className={s.succesTitle}>
        <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="28" fill="#D63D44" />
          <path
            d="M25 27L27 29L31.5 24.5M27.9932 21.1358C25.9938 18.7984 22.6597 18.1696 20.1547 20.31C17.6496 22.4504 17.297 26.029 19.2642 28.5604C20.7501 30.4724 24.9713 34.311 26.948 36.0749C27.3114 36.3991 27.4931 36.5613 27.7058 36.6251C27.8905 36.6805 28.0958 36.6805 28.2805 36.6251C28.4932 36.5613 28.6749 36.3991 29.0383 36.0749C31.015 34.311 35.2362 30.4724 36.7221 28.5604C38.6893 26.029 38.3797 22.4279 35.8316 20.31C33.2835 18.1922 29.9925 18.7984 27.9932 21.1358Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p>{t("orderSuccess.thankYou")}</p>
        <h3>
          <span>{t("orderSuccess.yourOrder")}</span>
          <span>{t("orderSuccess.success")}</span>
        </h3>
        <span>
          {t("orderSuccess.orderNumber")} {data?.number}
        </span>
      </div>

      <ul className={s.imageList}>
        {imageArr?.map((item, index) => (
          <li key={index}>
            <img src={item.imageSrc} alt="image" />
            {item.quantity > 1 && <span>x{item.quantity}</span>}
          </li>
        ))}
      </ul>

      <div className={s.orderInfo}>
        <div>
          <span>{t("orderSuccess.orderDate")}</span>
          <p>{formattedDate}</p>
        </div>

        <div>
          <span>{t("orderSuccess.deliveryAddress")}</span>
          <p>{`${data?.billing.city}, ${data?.shipping.address_1}`}</p>
        </div>

        <div>
          <span>{t("orderSuccess.paymentMethod")}</span>
          <p>
            {data?.payment_method === "cod"
              ? t("order.cod")
              : t("order.onlinePayment")}
          </p>
        </div>

        <div>
          <span>{t("orderSuccess.recipient")}</span>
          <p>{`${data?.shipping.first_name} ${data?.shipping.last_name}`}</p>
        </div>

        <div>
          <span>{t("orderSuccess.contactNumber")}</span>
          <p>{data?.shipping.phone}</p>
        </div>
      </div>

      <div className={s.orderAmount}>
        <div>
          <div className={s.orderDetails}>
            <p>
              <span>{t("orderSuccess.orderTotal")}:</span>
              <span>{regularPrice} ₴</span>
            </p>

            {discount > 0 && (
              <p>
                <span>{t("orderSuccess.discountTotal")}:</span>
                <span className={s.discount}>{discount} ₴</span>
              </p>
            )}

            {usedBonuses > 0 && (
              <p>
                <span>{t("orderPanel.discountBonus")}:</span>
                <span className={s.discount}>{usedBonuses} ₴</span>
              </p>
            )}

            {appliedCoupon && (
              <p>
                <span>{t("orderPanel.couponDiscount")}:</span>
                {appliedCoupon.discountAmount.toFixed(2)} ₴
              </p>
            )}
            <p>
              <span>{t("orderSuccess.deliveryCost")}:</span>
              <span>
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <svg
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.99935 5.5013V18.8346M9.99935 5.5013H7.05292C6.61879 5.5013 6.20243 5.32571 5.89545 5.01315C5.58847 4.70059 5.41602 4.27666 5.41602 3.83464C5.41602 3.39261 5.58847 2.96868 5.89545 2.65612C6.20243 2.34356 6.61879 2.16797 7.05292 2.16797C9.34459 2.16797 9.99935 5.5013 9.99935 5.5013ZM9.99935 5.5013H12.9458C13.3799 5.5013 13.7963 5.32571 14.1032 5.01315C14.4102 4.70059 14.5827 4.27666 14.5827 3.83464C14.5827 3.39261 14.4102 2.96868 14.1032 2.65612C13.7963 2.34356 13.3799 2.16797 12.9458 2.16797C10.6541 2.16797 9.99935 5.5013 9.99935 5.5013ZM16.666 9.66797V16.168C16.666 17.1014 16.666 17.5681 16.4844 17.9246C16.3246 18.2382 16.0696 18.4932 15.756 18.653C15.3995 18.8346 14.9328 18.8346 13.9993 18.8346L5.99935 18.8346C5.06593 18.8346 4.59922 18.8346 4.2427 18.653C3.92909 18.4932 3.67413 18.2382 3.51434 17.9246C3.33268 17.5681 3.33268 17.1014 3.33268 16.168V9.66797M1.66602 6.83464L1.66602 8.33464C1.66602 8.80135 1.66602 9.0347 1.75684 9.21296C1.83674 9.36976 1.96422 9.49725 2.12102 9.57714C2.29928 9.66797 2.53264 9.66797 2.99935 9.66797L16.9994 9.66797C17.4661 9.66797 17.6994 9.66797 17.8777 9.57714C18.0345 9.49725 18.162 9.36976 18.2419 9.21296C18.3327 9.0347 18.3327 8.80135 18.3327 8.33464V6.83464C18.3327 6.36793 18.3327 6.13457 18.2419 5.95631C18.162 5.79951 18.0345 5.67203 17.8777 5.59213C17.6994 5.5013 17.4661 5.5013 16.9993 5.5013L2.99935 5.5013C2.53264 5.5013 2.29928 5.5013 2.12102 5.59213C1.96422 5.67202 1.83674 5.79951 1.75684 5.95631C1.66602 6.13457 1.66602 6.36793 1.66602 6.83464Z"
                      stroke="#1A1A1A"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </svg>
                {t("orderSuccess.free")}
              </span>
            </p>
          </div>
          <div className={s.totalAmount}>
            <p>{t("orderSuccess.totalToPay")}</p>
            <span>{totalWithDiscounts} ₴</span>
          </div>
        </div>
      </div>

      <Link to="/" className={s.homeBackLink}>
        {t("orderSuccess.backHome")}
      </Link>
    </div>
  );
};
