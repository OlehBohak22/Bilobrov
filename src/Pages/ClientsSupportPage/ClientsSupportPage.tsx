import { useState } from "react";
import s from "./ClientsSupportPage.module.css";
import { Layout } from "../../components/Layout/Layout";
import { ReturnTab } from "../../components/ReturnTab/ReturnTab";
import { FaqTab } from "../../components/FaqTab/FaqTab";
import { ContactTab } from "../../components/ContactTab/ContactTab";

const categories = [
  {
    title: "Покупцям",
    tabs: [
      {
        id: "delivery",
        label: "Умови доставки",
        icon: "/icons/support-icons.svg#icon-delivery",
      },
      {
        id: "payment",
        label: "Умови оплати",
        icon: "/icons/support-icons.svg#icon-payment",
      },
      {
        id: "return",
        label: "Обмін та повернення",
        icon: "/icons/support-icons.svg#icon-return",
      },
      {
        id: "faq",
        label: "Часті питання",
        icon: "/icons/support-icons.svg#icon-faq",
      },
      {
        id: "contacts",
        label: "Наші контакти",
        icon: "/icons/support-icons.svg#icon-contacts",
      },
    ],
  },

  {
    title: "Програма лояльності",
    tabs: [
      {
        id: "bonus",
        label: "Бонусна система",
        icon: "/icons/support-icons.svg#icon-ofert",
      },
    ],
  },

  {
    title: "Юридична інформація",
    tabs: [
      {
        id: "offer",
        label: "Договір оферти",
        icon: "/icons/support-icons.svg#icon-policy",
      },
      {
        id: "privacy",
        label: "Політика конфіденційності",
        icon: "/icons/support-icons.svg#icon-policy",
      },
    ],
  },
];

export const ClientsSupportPage = () => {
  const [activeTab, setActiveTab] = useState("return");

  const renderContent = () => {
    switch (activeTab) {
      case "delivery":
        return <p>Інформація про умови доставки...</p>;
      case "payment":
        return <p>Інформація про умови оплати...</p>;
      case "return":
        return <ReturnTab />;
      case "faq":
        return <FaqTab />;
      case "contacts":
        return <ContactTab />;
      case "bonus":
        return <p>Інформація про бонусну систему...</p>;
      case "offer":
        return <p>Текст договору оферти...</p>;
      case "privacy":
        return <p>Політика конфіденційності...</p>;
      default:
        return null;
    }
  };

  return (
    <div className={s.section}>
      <Layout className={s.container}>
        <div className={s.tabsMenu}>
          {categories.map((category) => (
            <div key={category.title} className={s.category}>
              <h3 className={s.categoryTitle}>{category.title}</h3>
              {category.tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${s.tabButton} ${
                    activeTab === tab.id ? s.active : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <svg>
                    <use href={tab.icon}></use>
                  </svg>
                  {tab.label}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className={s.tabsContent}>{renderContent()}</div>
      </Layout>
    </div>
  );
};
