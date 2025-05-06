import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import s from "./ClientsSupportPage.module.css";
import { Layout } from "../../components/Layout/Layout";
import { ReturnTab } from "../../components/ReturnTab/ReturnTab";
import { FaqTab } from "../../components/FaqTab/FaqTab";
import { ContactTab } from "../../components/ContactTab/ContactTab";
import { useWindowSize } from "../../hooks/useWindowSize";
import { Breadcrumbs } from "@mui/material";

const categories = [
  {
    title: "Покупцям",
    tabs: [
      // {
      //   id: "delivery",
      //   label: "Умови доставки",
      //   icon: (
      //     <svg
      //       viewBox="0 0 24 24"
      //       fill="none"
      //       xmlns="http://www.w3.org/2000/svg"
      //     >
      //       <path
      //         d="M4.8 1.704L3.06667 3.992C2.72335 4.44518 2.55169 4.67176 2.55568 4.86143C2.55914 5.02648 2.63732 5.18127 2.76861 5.28304C2.91949 5.4 3.20558 5.4 3.77778 5.4H20.2222C20.7944 5.4 21.0805 5.4 21.2314 5.28304C21.3627 5.18127 21.4409 5.02648 21.4443 4.86143C21.4483 4.67176 21.2766 4.44518 20.9333 3.992L19.2 1.704M4.8 1.704C4.99555 1.44587 5.09333 1.3168 5.21725 1.22371C5.327 1.14127 5.45129 1.07975 5.58376 1.04229C5.73334 1 5.8963 1 6.22222 1H17.7778C18.1037 1 18.2667 1 18.4162 1.04229C18.5487 1.07975 18.673 1.14127 18.7828 1.22371C18.9067 1.3168 19.0044 1.44587 19.2 1.704M4.8 1.704L2.71111 4.46133C2.44727 4.80961 2.31534 4.98375 2.22166 5.17551C2.13854 5.34568 2.07791 5.52574 2.04128 5.71125C2 5.92031 2 6.13799 2 6.57333L2 19.48C2 20.7121 2 21.3282 2.24221 21.7988C2.45526 22.2127 2.79522 22.5493 3.21335 22.7602C3.68871 23 4.31099 23 5.55556 23L18.4444 23C19.689 23 20.3113 23 20.7866 22.7602C21.2048 22.5493 21.5447 22.2127 21.7578 21.7988C22 21.3282 22 20.7121 22 19.48V6.57333C22 6.13799 22 5.92032 21.9587 5.71126C21.9221 5.52575 21.8615 5.34568 21.7783 5.17552C21.6847 4.98375 21.5527 4.80961 21.2889 4.46133L19.2 1.704M16.4444 9.8C16.4444 10.967 15.9762 12.0861 15.1427 12.9113C14.3092 13.7364 13.1787 14.2 12 14.2C10.8213 14.2 9.6908 13.7364 8.8573 12.9113C8.02381 12.0861 7.55556 10.967 7.55556 9.8"
      //         strokeWidth="2"
      //         strokeLinecap="round"
      //         strokeLinejoin="round"
      //       />
      //     </svg>
      //   ),
      // },
      // {
      //   id: "payment",
      //   label: "Умови оплати",
      //   icon: (
      //     <svg
      //       viewBox="0 0 24 24"
      //       fill="none"
      //       xmlns="http://www.w3.org/2000/svg"
      //     >
      //       <path
      //         d="M16.4444 7.48347V3.30673C16.4444 2.31398 16.4444 1.81761 16.2498 1.51256C16.0797 1.24604 15.8163 1.06499 15.5197 1.01079C15.1803 0.948743 14.7608 1.15675 13.9217 1.57277L4.06557 6.45937C3.31723 6.8304 2.94306 7.01591 2.66901 7.30362C2.42673 7.55797 2.2418 7.86846 2.12834 8.21135C2 8.59922 2 9.0419 2 9.92728V15.8385M17 15.2417H17.0111M2 11.3029L2 19.1805C2 20.5175 2 21.1859 2.24221 21.6966C2.45526 22.1458 2.79522 22.511 3.21335 22.7398C3.68871 23 4.31099 23 5.55556 23H18.4444C19.689 23 20.3113 23 20.7866 22.7398C21.2048 22.511 21.5447 22.1458 21.7578 21.6966C22 21.1859 22 20.5175 22 19.1805V11.3029C22 9.96599 22 9.29753 21.7578 8.78688C21.5447 8.33771 21.2048 7.97252 20.7866 7.74366C20.3113 7.48347 19.689 7.48347 18.4444 7.48347L5.55556 7.48347C4.311 7.48347 3.68871 7.48347 3.21335 7.74366C2.79522 7.97252 2.45526 8.33771 2.24221 8.78688C2 9.29752 2 9.96599 2 11.3029ZM17.5556 15.2417C17.5556 15.5713 17.3068 15.8385 17 15.8385C16.6932 15.8385 16.4444 15.5713 16.4444 15.2417C16.4444 14.9121 16.6932 14.6449 17 14.6449C17.3068 14.6449 17.5556 14.9121 17.5556 15.2417Z"
      //         strokeWidth="2"
      //         strokeLinecap="round"
      //         strokeLinejoin="round"
      //       />
      //     </svg>
      //   ),
      // },
      {
        id: "obmin-ta-povernennya",
        label: "Обмін та повернення",
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
        label: "Часті питання",
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
        label: "Наші контакти",
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
  // {
  //   title: "Програма лояльності",
  //   tabs: [
  //     {
  //       id: "bonus",
  //       label: "Бонусна система",
  //       icon: (
  //         <svg
  //           viewBox="0 0 24 24"
  //           fill="none"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <rect
  //             x="0.85"
  //             y="3.85"
  //             width="22.3"
  //             height="15.3"
  //             rx="2.15"
  //             strokeWidth="1.7"
  //           />
  //           <path d="M4 10H1" strokeWidth="1.7" />
  //           <path d="M23 10L15 10" strokeWidth="1.7" />
  //           <path
  //             d="M10 11.5688C10.5 9.0688 12.5 5.07275 15 8.06882C17.3101 10.8373 13 12.0688 10 11.5688Z"
  //             strokeWidth="1.7"
  //           />
  //           <path
  //             d="M9.65527 11.5688C9.15527 9.0688 7.15527 5.07275 4.65527 8.06882C2.34516 10.8373 6.65527 12.0688 9.65527 11.5688Z"
  //             strokeWidth="1.7"
  //           />
  //           <path
  //             d="M10 12L13.5355 15.5355"
  //             strokeWidth="1.7"
  //             strokeLinecap="round"
  //           />
  //           <path
  //             d="M9.53516 12L5.99962 15.5355"
  //             strokeWidth="1.7"
  //             strokeLinecap="round"
  //           />
  //           <path d="M10 4V19" strokeWidth="1.7" />
  //         </svg>
  //       ),
  //     },
  //   ],
  // },
  {
    title: "Юридична інформація",
    tabs: [
      {
        id: "offer",
        label: "Договір оферти",
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
      // {
      //   id: "privacy-policy",
      //   label: "Політика конфіденційності",
      //   icon: (
      //     <svg
      //       viewBox="0 0 24 24"
      //       fill="none"
      //       xmlns="http://www.w3.org/2000/svg"
      //     >
      //       <path
      //         d="M12.6176 1H15.6353C17.5131 1 18.452 1 19.1693 1.35968C19.8002 1.67606 20.3131 2.1809 20.6346 2.80183C21 3.50774 21 4.43183 21 6.28V17.72C21 19.5682 21 20.4923 20.6346 21.1982C20.3131 21.8191 19.8002 22.3239 19.1693 22.6403C18.452 23 17.5131 23 15.6353 23H8.48235C6.60453 23 5.66562 23 4.94838 22.6403C4.31749 22.3239 3.80455 21.8191 3.4831 21.1982C3.11765 20.4923 3.11765 19.5682 3.11765 17.72V16.95M16.5294 13.1H11.5M16.5294 8.7H12.6176M16.5294 17.5H7.58824M5.35294 9.8V3.75C5.35294 2.83873 6.10352 2.1 7.02941 2.1C7.9553 2.1 8.70588 2.83873 8.70588 3.75V9.8C8.70588 11.6225 7.20472 13.1 5.35294 13.1C3.50116 13.1 2 11.6225 2 9.8V5.4"
      //         strokeWidth="2"
      //         strokeLinecap="round"
      //         strokeLinejoin="round"
      //       />
      //     </svg>
      //   ),
      // },
    ],
  },
];

export const ClientsSupportPage = () => {
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
      case "delivery":
        return <p>Інформація про умови доставки...</p>;
      case "payment":
        return <p>Інформація про умови оплати...</p>;
      case "obmin-ta-povernennya":
        return <ReturnTab />;
      case "faq":
        return <FaqTab />;
      case "contacts":
        return <ContactTab />;
      case "bonus":
        return <p>Інформація про бонусну систему...</p>;
      case "offer":
        return <p>Текст договору оферти...</p>;
      // case "privacy-policy":
      //   return <p>Політика конфіденційності...</p>;
      default:
        return null;
    }
  };

  const breadcrumbs = [{ name: "Головна", link: "/" }, { name: activeHash }];

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
