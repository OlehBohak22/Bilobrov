import { Layout } from "../Layout/Layout";
import s from "./HomeServices.module.css";

export const HomeServices = () => {
  return (
    <section className={s.section}>
      <Layout>
        <ul>
          <li>
            <div className={s.iconContainer}>
              <svg>
                <use href="/icons/services-icons.svg#icon-free-shipping"></use>
              </svg>
            </div>

            <div className={s.descContainer}>
              <h4>Безкоштовна доставка по Україні</h4>
              <p>
                Ваші улюблені продукти Bilobrov з доставкою без зайвих витрат у
                будь-який куточок України.
              </p>
            </div>
          </li>
          <li>
            <div className={s.iconContainer}>
              <svg>
                <use href="/icons/services-icons.svg#icon-psychiatry"></use>
              </svg>
            </div>

            <div className={s.descContainer}>
              <h4>Підтримка та консультація</h4>
              <p>
                Наші менеджери завжди готові допомогти підібрати потрібний засіб
                та відповісти на ваші запитання.
              </p>
            </div>
          </li>
          <li>
            <div className={s.iconContainer}>
              <svg>
                <use href="/icons/services-icons.svg#icon-gift-card"></use>
              </svg>
            </div>

            <div className={s.descContainer}>
              <h4>Накопичуваний кешбек на покупки</h4>
              <p>
                З кожної покупки в Bilobrov ви накопичуєте кешбек, який робить
                ваші майбутні замовлення вигіднішими.
              </p>
            </div>
          </li>
          <li>
            <div className={s.iconContainer}>
              <svg>
                <use href="/icons/services-icons.svg#icon-return-box"></use>
              </svg>
            </div>

            <div className={s.descContainer}>
              <h4>Легкий обмін та поверенення товарів</h4>
              <p>
                Ми цінуємо вашу довіру та гарантуємо легкий обмін і повернення.
                Якщо продукт не підійшов, ми швидко замінимо його на інший
              </p>
            </div>
          </li>
        </ul>
      </Layout>
    </section>
  );
};
