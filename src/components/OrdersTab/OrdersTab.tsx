import { useSelector } from "react-redux";
import s from "./OrdersTab.module.css";
import { RootState } from "../../store";
import { OrderItem } from "./OrderItem";
import { useTranslation } from "react-i18next";

export const OrdersTab = () => {
  const orders = useSelector(
    (state: RootState) => state.user.user?.meta.orders || []
  );

  const { t } = useTranslation();

  console.log(orders);

  return (
    <div className={s.tab}>
      <h3>
        <span>{t("orders.title1")}</span>
        <span>{t("orders.title2")}</span>
      </h3>

      <ul>
        {orders.map((order, index) => (
          <OrderItem key={index} info={order} />
        ))}
      </ul>
    </div>
  );
};
