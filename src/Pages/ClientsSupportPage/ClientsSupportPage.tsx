import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import s from "./ClientsSupportPage.module.css";
import { Layout } from "../../components/Layout/Layout";
import { ReturnTab } from "../../components/ReturnTab/ReturnTab";
import { FaqTab } from "../../components/FaqTab/FaqTab";
import { ContactTab } from "../../components/ContactTab/ContactTab";
import { useWindowSize } from "../../hooks/useWindowSize";
import { Breadcrumbs } from "@mui/material";
import { useTranslation } from "react-i18next";

const ClientsSupportPage = () => {
  const { t } = useTranslation();

  const categories = [
    {
      title: t("clientsSupport.customers"),
      tabs: [
        {
          id: "obmin-ta-povernennya",
          label: t("clientsSupport.returnExchange"),
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1937_23273)">
                <path
                  d="M9 4H15"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.6094 15.8125H18.9609C20.7084 15.8125 22.125 17.2291 22.125 18.9766C22.125 20.724 20.7318 22.1406 18.9844 22.1406"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.1094 13L12.5489 14.5216C11.817 15.2513 11.817 16.4344 12.5489 17.1641L14.1094 18.7188"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 14V6C23 3.23858 20.7614 1 18 1H6C3.23858 1 1 3.23858 1 6V18C1 20.7614 3.23858 23 6 23H16.5"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1937_23273">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          ),
        },
        {
          id: "faq",
          label: t("clientsSupport.faq"),
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1937_23293)">
                <path
                  d="M1 6.72057C1 4.71818 1 3.71699 1.39964 2.95218C1.75118 2.27943 2.31211 1.73247 3.00203 1.38969C3.78638 1 4.81314 1 6.86667 1H17.1333C19.1869 1 20.2136 1 20.998 1.38969C21.6879 1.73247 22.2488 2.27943 22.6004 2.95218C23 3.71699 23 4.71819 23 6.72057V13.1562C23 15.1586 23 16.1598 22.6004 16.9246C22.2488 17.5974 21.6879 18.1443 20.998 18.4871C20.2136 18.8768 19.1869 18.8768 17.1333 18.8768H14.0579C13.2952 18.8768 12.9138 18.8768 12.549 18.9498C12.2254 19.0146 11.9122 19.1217 11.618 19.2682C11.2864 19.4334 10.9886 19.6657 10.393 20.1303L7.47748 22.4047C6.96893 22.8014 6.71466 22.9998 6.50066 23C6.31455 23.0002 6.13849 22.9177 6.02239 22.7759C5.88889 22.6128 5.88889 22.2953 5.88889 21.6602V18.8768C4.75226 18.8768 4.18394 18.8768 3.71766 18.755C2.45233 18.4244 1.46398 17.4606 1.12494 16.2268C1 15.7721 1 15.218 1 14.1096V6.72057Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.9962 6.6005C10.8966 5.36241 9.06286 5.02937 7.68508 6.16309C6.3073 7.29681 6.11333 9.19233 7.19531 10.5332C7.86563 11.3639 9.54808 12.8811 10.7313 13.9153C11.1659 14.2952 11.3832 14.4852 11.644 14.5617C11.8677 14.6274 12.1247 14.6274 12.3485 14.5617C12.6093 14.4852 12.8266 14.2952 13.2612 13.9153C14.4444 12.8811 16.1268 11.3639 16.7972 10.5332C17.8791 9.19233 17.7088 7.28488 16.3074 6.16309C14.9059 5.0413 13.0959 5.36241 11.9962 6.6005Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1937_23293">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          ),
        },
        {
          id: "contacts",
          label: t("clientsSupport.contacts"),
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.66667 19.15H15.3333M6.44444 15.3H17.5556M4.22222 1H19.7778C21.0051 1 22 2.09442 22 3.44444V20.5556C22 21.9056 21.0051 23 19.7778 23H4.22222C2.99492 23 2 21.9056 2 20.5556V3.44444C2 2.09442 2.99492 1 4.22222 1ZM11.9973 5.63313C11.2198 4.77608 9.92323 4.54554 8.94905 5.33034C7.97486 6.11514 7.83771 7.42729 8.60274 8.35548C9.36778 9.28367 11.9973 11.45 11.9973 11.45C11.9973 11.45 14.6269 9.28367 15.3919 8.35548C16.157 7.42729 16.0366 6.10689 15.0456 5.33034C14.0547 4.55379 12.7749 4.77608 11.9973 5.63313Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
      ],
    },

    {
      title: t("clientsSupport.legal"),
      tabs: [
        {
          id: "offer",
          label: t("clientsSupport.offer"),

          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.6176 1H15.6353C17.5131 1 18.452 1 19.1693 1.35968C19.8002 1.67606 20.3131 2.1809 20.6346 2.80183C21 3.50774 21 4.43183 21 6.28V17.72C21 19.5682 21 20.4923 20.6346 21.1982C20.3131 21.8191 19.8002 22.3239 19.1693 22.6403C18.452 23 17.5131 23 15.6353 23H8.48235C6.60453 23 5.66562 23 4.94838 22.6403C4.31749 22.3239 3.80455 21.8191 3.4831 21.1982C3.11765 20.4923 3.11765 19.5682 3.11765 17.72V16.95M16.5294 13.1H11.5M16.5294 8.7H12.6176M16.5294 17.5H7.58824M5.35294 9.8V3.75C5.35294 2.83873 6.10352 2.1 7.02941 2.1C7.9553 2.1 8.70588 2.83873 8.70588 3.75V9.8C8.70588 11.6225 7.20472 13.1 5.35294 13.1C3.50116 13.1 2 11.6225 2 9.8V5.4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
      ],
    },
  ];
  const { hash } = useLocation();
  const initialTabId = hash ? hash.substring(1) : "obmin-ta-povernennya";
  const initialTab = categories
    .flatMap((category) => category.tabs)
    .find((tab) => tab.id === initialTabId);

  const [activeTab, setActiveTab] = useState(initialTabId);
  const [activeHash, setActiveHash] = useState(
    initialTab?.label || "Обмін та повернення"
  );

  const { width } = useWindowSize();
  const isMobile = width < 1024;

  useEffect(() => {
    if (hash) {
      const newTabId = hash.substring(1);
      setActiveTab(newTabId);

      const foundTab = categories
        .flatMap((category) => category.tabs)
        .find((tab) => tab.id === newTabId);

      setActiveHash(foundTab?.label || "");

      if (isMobile) {
        setTabsMenuHidden(true);
      }
    }
  }, [hash, isMobile]);

  const handleTabClick = (id: string) => {
    const foundTab = categories
      .flatMap((category) => category.tabs)
      .find((tab) => tab.id === id);

    setActiveTab(id);
    setActiveHash(foundTab?.label || "");

    if (isMobile) {
      setTabsMenuHidden(true);
    }
  };

  const [tabsMenuHidden, setTabsMenuHidden] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "obmin-ta-povernennya":
        return <ReturnTab />;
      case "faq":
        return <FaqTab />;
      case "contacts":
        return <ContactTab />;
      case "offer":
        return <p>Текст договору оферти...</p>;
      default:
        return null;
    }
  };

  const breadcrumbs = [
    { name: t("breadCrumbs.main"), link: "/" },
    { name: activeHash },
  ];

  return (
    <main className={s.page}>
      <Layout>
        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
          {breadcrumbs.map((breadcrumb, index) =>
            breadcrumb.link ? (
              <Link key={index} to={breadcrumb.link}>
                {breadcrumb.name}
              </Link>
            ) : (
              <span key={index}>{breadcrumb.name}</span>
            )
          )}
        </Breadcrumbs>
      </Layout>

      <div className={s.section}>
        <Layout className={s.container}>
          <div className={`${tabsMenuHidden && s.hidden} ${s.tabsMenu}`}>
            {categories.map((category) => (
              <div key={category.title} className={s.category}>
                <h3 className={s.categoryTitle}>{category.title}</h3>
                {category.tabs.map((tab) => (
                  <a
                    key={tab.id}
                    href={`#${tab.id}`}
                    className={`${s.tabButton} ${
                      activeTab === tab.id ? s.active : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabClick(tab.id);
                      window.location.hash = `#${tab.id}`;
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className={s.tabsContent}>
            {categories.map((category) =>
              category.tabs.map((tab) => (
                <div key={tab.id} className={s.tabContentSection}>
                  {activeTab === tab.id && renderContent()}
                </div>
              ))
            )}
          </div>
        </Layout>
      </div>
    </main>
  );
};

export default ClientsSupportPage;
