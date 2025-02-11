import s from "./MainAccountTab.module.css";

type MainAccountTabProps = {
  setTab: (tab: string) => void;
};

const arrow = (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 24L24 8M24 8H13.3333M24 8V18.6667"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const categories = [
  {
    id: "bonus",
    label: "Бонусна карта",
    image: "/images/main-tab-images/bonus.avif",
    icon: arrow,
  },

  {
    id: "order",
    label: "Мої замовлення",
    image: "/images/main-tab-images/order.avif",
    icon: arrow,
  },

  {
    id: "wishlist",
    label: "Список побажань",
    image: "/images/main-tab-images/wishlist.avif",
    icon: arrow,
  },

  {
    id: "contact",
    label: "Контактні дані",
    image: "/images/main-tab-images/contact.avif",
    icon: arrow,
  },

  {
    id: "password",
    label: "Зміна пароля",
    image: "/images/main-tab-images/password.avif",
    icon: arrow,
  },

  {
    id: "address",
    label: "Мої адреси",
    image: "/images/main-tab-images/address.avif",
    icon: arrow,
  },
];

export const MainAccountTab: React.FC<MainAccountTabProps> = ({ setTab }) => {
  return (
    <div className={s.tab}>
      <h2>
        <span>Вікторіє,</span>
        <span>вітаємо!</span>
      </h2>

      <p className={s.welcomeText}>
        Ласкаво просимо до вашого особистого кабінету BILOBROV CLUB!
      </p>

      <p className={s.descText}>
        Тут ви можете переглядати свої бонуси, контролювати замовлення,
        слідкувати за накопиченими знижками та першими дізнаватися про новинки
        та акції. Всі привілеї клубу — у вашому розпорядженні!
      </p>

      <ul className={s.list}>
        {categories.map((item) => (
          <li key={item.id} onClick={() => setTab(item.id)}>
            <img src={item.image} alt={item.label} />
            <p>
              {item.label}
              {item.icon}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
