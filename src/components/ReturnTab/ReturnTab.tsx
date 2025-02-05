import s from "./ReturnTab.module.css";

export const ReturnTab = () => {
  return (
    <div className={s.tab}>
      <h2>
        <span>Обмін та</span>
        <span>повернення</span>
      </h2>

      <p className={s.desc}>
        Ми пропонуємо зручний обмін та повернення товарів у таких випадках:
      </p>

      <ul className={s.list}>
        <li>
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" fill="#FFC43A" />
            <path
              d="M9 15.1765L14.5 21L23 12"
              stroke="#FFFCF5"
              strokeWidth="2"
            />
          </svg>

          <p>
            Якщо є пошкодження пакування при доставці Новою Поштою, можливе
            повернення або заміна товару.
          </p>
        </li>
        <li>
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" fill="#FFC43A" />
            <path
              d="M9 15.1765L14.5 21L23 12"
              stroke="#FFFCF5"
              strokeWidth="2"
            />
          </svg>

          <p>
            У разі, якщо не спрацьовують дозатори або інші механізми упаковки,
            ми забезпечимо заміну або повернення товару.
          </p>
        </li>
        <li>
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" fill="#FFC43A" />
            <path
              d="M9 15.1765L14.5 21L23 12"
              stroke="#FFFCF5"
              strokeWidth="2"
            />
          </svg>

          <p>
            Якщо придбаний активний засіб не підійшов, і його використання було
            рекомендовано нашим лікарем або менеджером, можливе повернення або
            заміна.
          </p>
        </li>
      </ul>
    </div>
  );
};
