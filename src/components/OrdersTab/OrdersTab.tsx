import { useSelector } from "react-redux";
import s from "./OrdersTab.module.css";
import { RootState } from "../../store";
import { OrderItem } from "./OrderItem";

export const OrdersTab = () => {
  const orders = useSelector(
    (state: RootState) => state.user.user?.meta.orders || []
  );

  return (
    <div className={s.tab}>
      <h3>
        <span>Мої</span>
        <span>замовлення</span>
      </h3>

      <ul>
        {orders.map((order, index) => (
          <OrderItem key={index} info={order} />
        ))}
      </ul>
    </div>
  );
};
