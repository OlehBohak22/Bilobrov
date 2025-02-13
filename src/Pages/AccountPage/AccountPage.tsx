import s from "./AccountPage.module.css";
import { useState } from "react";
import { Layout } from "../../components/Layout/Layout";
import { MainAccountTab } from "../../components/MainAccountTab/MainAccountTab";
import { UpdateInfoTab } from "../../components/UpdateInfoTab/UpdateInfoTab";

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

  const renderContent = () => {
    switch (activeTab) {
      case "main":
        return <MainAccountTab setTab={setActiveTab} />;
      case "bonus":
        return <p>Інформація про бонуси</p>;
      case "order":
        return <p>Інформація про замовлення</p>;
      case "wishlist":
        return <p>Інформація про список побажань</p>;
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
        </div>
        <div className={s.tabsContent}>{renderContent()}</div>
      </Layout>
    </div>
  );
};
