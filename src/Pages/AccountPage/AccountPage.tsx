import s from "./AccountPage.module.css";
import { useState } from "react";
import { Layout } from "../../components/Layout/Layout";
import { MainAccountTab } from "../../components/MainAccountTab/MainAccountTab";
import { UpdateInfoTab } from "../../components/UpdateInfoTab/UpdateInfoTab";
import { WishListTab } from "../../components/WishListTab/WishListTab";
import { BonusTab } from "../../components/BonusTab/BonusTab";
import { logout } from "../../store/slices/userSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useNavigate } from "react-router";

const categories = [
  {
    id: "main",
    label: "Головна",
  },

  {
    id: "bonus",
    label: "Бонусна карта",
    icon: "/icons/account-icons.svg#icon-bonus",
  },

  {
    id: "order",
    label: "Мої замовлення",
    icon: "/icons/account-icons.svg#icon-order",
  },

  {
    id: "wishlist",
    label: "Список побажань",
    icon: "/icons/account-icons.svg#icon-wishlist",
  },

  {
    id: "contact",
    label: "Контактні дані",
    icon: "/icons/account-icons.svg#icon-contact",
  },

  {
    id: "password",
    label: "Зміна пароля",
    icon: "/icons/account-icons.svg#icon-password",
  },

  {
    id: "address",
    label: "Мої адреси",
    icon: "/icons/account-icons.svg#icon-address",
  },
];

export const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("main");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Видаляємо токен
    dispatch(logout());
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "main":
        return <MainAccountTab setTab={setActiveTab} />;
      case "bonus":
        return <BonusTab />;
      case "order":
        return <p>Інформація про замовлення</p>;
      case "wishlist":
        return <WishListTab />;
      case "contact":
        return <UpdateInfoTab />;
      case "password":
        return <p>Зміна пароля </p>;
      case "address":
        return <p>Адреса</p>;

      default:
        return null;
    }
  };

  return (
    <div className={s.section}>
      <Layout className={s.container}>
        <div className={s.tabsMenu}>
          {categories.map((category) => (
            <div key={category.id} className={s.category}>
              <button
                className={`${s.tabButton} ${
                  activeTab === category.id ? s.active : ""
                }`}
                onClick={() => setActiveTab(category.id)}
              >
                {category.icon && (
                  <svg>
                    <use href={category.icon}></use>
                  </svg>
                )}

                {category.label}
              </button>
            </div>
          ))}

          <button className={s.logout} onClick={handleLogout}>
            <svg
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.5 17L3.5 12M3.5 12L8.5 7M3.5 12L15.5 12M15.5 3L16.7 3C18.3802 3 19.2202 3 19.862 3.32698C20.4265 3.6146 20.8854 4.07354 21.173 4.63803C21.5 5.27976 21.5 6.11984 21.5 7.8V16.2C21.5 17.8802 21.5 18.7202 21.173 19.362C20.8854 19.9265 20.4265 20.3854 19.862 20.673C19.2202 21 18.3802 21 16.7 21H15.5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Вихід
          </button>
        </div>
        <div className={s.tabsContent}>{renderContent()}</div>
      </Layout>
    </div>
  );
};
