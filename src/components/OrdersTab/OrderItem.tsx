import { FC } from "react";
import s from "./OrdersTab.module.css";
import { Order } from "../../store/slices/userSlice";

interface OrderTabProp {
  info: Order;
}

export const OrderItem: FC<OrderTabProp> = ({ info }) => {
  console.log(info);

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

    default:
      STATUS = "невідомий статус";
      CLASS = "unknown";
      break;
  }

  return (
    <li className={s.item}>
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
        {info.products.map((product) => (
          <img src={product.image} alt="" />
        ))}
      </div>
    </li>
  );
};
