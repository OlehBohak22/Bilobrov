import { FC, useState } from "react";
import s from "./OrdersTab.module.css";
import { Order } from "../../store/slices/userSlice";
// import { useSelector } from "react-redux";
// import { RootState } from "../../store";

interface OrderTabProp {
  info: Order;
}

export const OrderItem: FC<OrderTabProp> = ({ info }) => {
  const [isOpen, setIsOpen] = useState(false);

  // const { token } = useSelector((state: RootState) => state.user);

  let STATUS: string;
  let CLASS: string;

  const date = new Date(info.status_date);

  const formattedDate = date.toLocaleDateString("uk-UA");

  switch (info.status) {
    case "pending":
      STATUS = "формуємо замовлення";
      CLASS = "pending";
      break;

    case "processing":
      STATUS = "Замовлення у дорозі";
      CLASS = "processing";
      break;

    case "completed":
      STATUS = "Замовлення вже у вас";
      CLASS = "completed";
      break;

    default:
      STATUS = "невідомий статус";
      CLASS = "unknown";
      break;
  }

  return (
    <li className={s.item}>
      <div className={s.orderHeading}>
        <div>
          <p className={`${s[CLASS]} ${s.status}`}>{STATUS}</p>
          <p className={s.orderDate}>
            №{info.order_id} від {formattedDate}
          </p>
        </div>

        <div className={s.orderPrice}>
          <p>Сума замовлення:</p>
          <span>{info.grand_total} ₴</span>
        </div>

        <div className={s.imageList}>
          {info.products.length > 3 && (
            <span>+ {info.products.length - 3}</span>
          )}

          {info.products.slice(0, 3).map((product) => (
            <img src={product.image} alt="" />
          ))}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${s.openBtn} ${isOpen && s.opened}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.5L12 15.5L5 8.5"
              stroke-width="1.6"
              stroke-linecap="square"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className={s.backdropContent}>
          <div className={s.orderInfo}>
            <span>Інформація про замовлення:</span>

            <h4>Доставка</h4>
            <div className="mb-[1vw]">
              <p>{info.shipping_type}</p>

              <p>{info.shipping_address}</p>
            </div>

            <h4>Одержувач</h4>

            <div>
              <p>{info.customer_name}</p>

              <p>{info.customer_phone}</p>
            </div>
          </div>

          <div className={s.rightBlock}>
            <div className={s.cartListBox}>
              <ul className={s.popupList}>
                {info.products.map((item) => (
                  <li>
                    <div className={s.imageBlock}>
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className={s.productInfo}>
                      <p className={s.code}>
                        Код товару: <span>{item.sku}</span>
                      </p>
                      <p className={s.brandName}>{item.brand}</p>
                      <p className={s.productName}>{item.name}</p>
                      <p className={s.productDesc}>{item.short_description}</p>

                      <div className={s.priceBlock}>
                        <div>
                          {item.price / item.quantity} ₴
                          <span> x {item.quantity}</span>
                        </div>

                        <div>{item.price} ₴</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className={s.totalInfo}>
              <div className={s.orderDetails}>
                <p>
                  <span>Сума замовлення:</span>
                  <span>{info.total_price} ₴</span>
                </p>
                <p>
                  <span>Сума знижки:</span>
                  <span className={s.discount}>{info.discount_total} ₴</span>
                </p>
                <p>
                  <span>Вартість доставки:</span>
                  {info.shipping_cost ? (
                    <span>{info.shipping_cost}₴</span>
                  ) : (
                    <div>
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
                    </div>
                  )}
                </p>
              </div>
              <div className={s.totalAmount}>
                <p>РАЗОМ:</p>
                <span>{info.grand_total} ₴</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};
