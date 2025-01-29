import s from "./FooterNavigationBlock.module.css";
import { Link } from "react-router";

export const FooterNavigationBlock = () => {
  return (
    <div className={s.navigationBlock}>
      <div className={s.block}>
        <h3>Клієнтам</h3>

        <ul>
          <li>
            <Link to="/">Питання – відповіді</Link>
          </li>
          <li>
            <Link to="/">Доставка</Link>
          </li>
          <li>
            <Link to="/">Оплата</Link>
          </li>
          <li>
            <Link to="/">Обмін та повернення</Link>
          </li>
          <li>
            <Link to="/">Бонусна програма</Link>
          </li>
        </ul>
      </div>

      <div className={s.block}>
        <h3>Bilobrov cosmetics</h3>

        <ul>
          <li>
            <Link to="/">Bilobrov cosmetics</Link>
          </li>
          <li>
            <Link to="/">Блог</Link>
          </li>
          <li>
            <Link to="/">Особистий кабінет</Link>
          </li>
          <li>
            <Link to="/">Контакти</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
