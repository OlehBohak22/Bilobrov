import { FC } from "react";
import { OrderData } from "../../store/slices/orderSlice";
import s from "./OrderSucces.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ProductInfo } from "../../types/productTypes";
import { Link } from "react-router";

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
  const imageArr = data?.line_items.map((item) => {
    return { imageSrc: item?.image?.src, quantity: item.quantity };
  });

  const { items } = useSelector((state: RootState) => state.cart);
  const products = useSelector((state: RootState) => state.products.items);

  const cart = items
    .map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);

      if (product) {
        // Призначаємо variation без пошуку
        return {
          ...product,
          variation: cartItem.variation_id, // Прямо передаємо ID варіації
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
          <p>{data?.shipping.address_1}</p>
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
