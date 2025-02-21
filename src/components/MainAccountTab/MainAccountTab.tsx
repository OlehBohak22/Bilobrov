import s from "./MainAccountTab.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type MainAccountTabProps = {
  setTab: (tab: string) => void;
};

const vocativeCase = (name: string): string => {
  const rules: Record<string, string> = {
    а: "о",
    ія: "іє",
    ий: "ю",
    ій: "ю",
    о: "е",
    е: "є",
    ь: "ю",
    ва: "во",
    на: "но",
    ла: "ло",
    са: "со",
    та: "то",
    ра: "ро",
    ма: "мо",
    да: "до",
    ка: "ко",
    за: "зо",
    га: "го",
    ба: "бо",
  };

  const exceptions: Record<string, string> = {
    // Жіночі імена
    Марія: "Маріє",
    Наталія: "Наталіє",
    Ольга: "Ольго",
    Юлія: "Юліє",
    Софія: "Софіє",
    Лідія: "Лідіє",
    Валерія: "Валеріє",
    Дарія: "Даріє",
    Тетяна: "Тетяно",
    Катерина: "Катерино",
    Христина: "Христино",
    Анастасія: "Анастасіє",
    Надія: "Надіє",
    Ксенія: "Ксеніє",
    Василина: "Василино",
    Галина: "Галино",
    Ірина: "Ірино",
    Ярина: "Ярино",
    Вероніка: "Вероніко",
    Анна: "Анно",
    Емма: "Еммо",
    Людмила: "Людмило",
    Роксолана: "Роксолано",
    Ангеліна: "Ангеліно",
    Вікторія: "Вікторіє",

    // Чоловічі імена
    Ігор: "Ігоре",
    Лев: "Леве",
    Тарас: "Тарасе",
    Олег: "Олеже",
    Микола: "Миколо",
    Володимир: "Володимире",
    Сергій: "Сергію",
    Андрій: "Андрію",
    Олексій: "Олексію",
    Дмитро: "Дмитре",
    Артем: "Артеме",
    Роман: "Романе",
    Максим: "Максиме",
    Олександр: "Олександре",
    Павло: "Павле",
    Василь: "Василю",
    Євген: "Євгене",
    Анатолій: "Анатолію",
    Валентин: "Валентине",
    Юрій: "Юрію",
    Степан: "Степане",
    Григорій: "Григорію",
    Остап: "Остапе",
    Рудольф: "Рудольфе",
    Майкл: "Майкле",
  };

  if (exceptions[name]) return exceptions[name];

  for (const [ending, replacement] of Object.entries(rules)) {
    if (name.endsWith(ending)) {
      return name.slice(0, -ending.length) + replacement;
    }
  }

  return "Красуне";
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
  const user = useSelector((state: RootState) => state.user?.user);

  return (
    <div className={s.tab}>
      <h2>
        {user?.name ? <span>{vocativeCase(user.name)},</span> : ""}
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
