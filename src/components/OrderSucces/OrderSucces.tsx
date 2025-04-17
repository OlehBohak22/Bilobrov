import { FC, useEffect, useState } from "react";
import { OrderData } from "../../store/slices/orderSlice";
import s from "./OrderSucces.module.css";
import { ProductInfo } from "../../types/productTypes";
import { Link } from "react-router";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchCartProducts } from "../../store/slices/productsSlice";
import { useMemo } from "react";

interface SuccesProps {
  data: OrderData | null;
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

export const OrderSucces: FC<SuccesProps> = ({ data }) => {
  const dispatch = useAppDispatch();

  const imageArr = data?.line_items.map((item) => {
    return { imageSrc: item?.image?.src, quantity: item.quantity };
  });

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
      const product = cartProducts.find((p) => p.id === Number(cartItem.id)); // 🛠️ fix тут
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

        <p>Дякуємо, що з нами! </p>

        <h3>
          <span>Ваше замовлення</span>
          <span>успішно прийнято</span>
        </h3>

        <span>Замовлення № {data?.number}</span>
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
          <span>Дата замовлення</span>
          <p>{formattedDate}</p>
        </div>

        <div>
          <span>Адреса доставки</span>
          <p>{`${data?.billing.city}, ${data?.shipping.address_1}`}</p>
        </div>

        <div>
          <span>Спосіб оплати</span>
          <p>
            {data?.payment_method === "cod"
              ? "Накладений платіж"
              : "Онлайн-оплата WayForPay"}
          </p>
        </div>

        <div>
          <span>Одержувач</span>
          <p>{`${data?.shipping.first_name} ${data?.shipping.last_name}`}</p>
        </div>

        <div>
          <span>Контактний номер</span>
          <p>{data?.shipping.phone}</p>
        </div>
      </div>

      <div className={s.orderAmount}>
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
                <svg>...</svg>Безкоштовна
              </span>
            </p>
          </div>
          <div className={s.totalAmount}>
            <p>До оплати</p>
            <span>{totalAmount} ₴</span>
          </div>
        </div>
      </div>

      <Link to="/" className={s.homeBackLink}>
        Повернутися на головну
      </Link>
    </div>
  );
};
