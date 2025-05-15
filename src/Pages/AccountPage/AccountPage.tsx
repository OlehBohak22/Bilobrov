import { useEffect, useState } from "react";
import s from "./AccountPage.module.css";
import { Layout } from "../../components/Layout/Layout";
import { MainAccountTab } from "../../components/MainAccountTab/MainAccountTab";
import { UpdateInfoTab } from "../../components/UpdateInfoTab/UpdateInfoTab";
import { WishListTab } from "../../components/WishListTab/WishListTab";
import { BonusTab } from "../../components/BonusTab/BonusTab";
import { logout } from "../../store/slices/userSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ResetPasswordTab } from "../../components/ResetPasswordTab/ResetPasswordTab";
import { AddressTab } from "../../components/AddressTab/AddressTab";
import { OrdersTab } from "../../components/OrdersTab/OrdersTab";
import { ConfirmLogoutModal } from "../../components/ConfirmLogoutModal/ConfirmLogoutModal";
import { AnimatePresence } from "framer-motion";
import { Loader } from "../../components/Loader/Loader";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useTranslation } from "react-i18next";

const categories = [
  {
    id: "main",
    icon: (
      <svg
        width="20"
        height="21"
        viewBox="0 0 20 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 20.0002V12.6002C7 12.0402 7 11.7601 7.10899 11.5462C7.20487 11.3581 7.35785 11.2051 7.54601 11.1092C7.75992 11.0002 8.03995 11.0002 8.6 11.0002H11.4C11.9601 11.0002 12.2401 11.0002 12.454 11.1092C12.6422 11.2051 12.7951 11.3581 12.891 11.5462C13 11.7601 13 12.0402 13 12.6002V20.0002M9.0177 1.76424L2.23539 7.03937C1.78202 7.39199 1.55534 7.5683 1.39203 7.7891C1.24737 7.98469 1.1396 8.20503 1.07403 8.4393C1 8.70376 1 8.99094 1 9.5653V16.8002C1 17.9203 1 18.4804 1.21799 18.9082C1.40973 19.2845 1.71569 19.5905 2.09202 19.7822C2.51984 20.0002 3.07989 20.0002 4.2 20.0002H15.8C16.9201 20.0002 17.4802 20.0002 17.908 19.7822C18.2843 19.5905 18.5903 19.2845 18.782 18.9082C19 18.4804 19 17.9203 19 16.8002V9.5653C19 8.99094 19 8.70376 18.926 8.4393C18.8604 8.20503 18.7526 7.98469 18.608 7.7891C18.4447 7.5683 18.218 7.39199 17.7646 7.03937L10.9823 1.76424C10.631 1.49099 10.4553 1.35436 10.2613 1.30184C10.0902 1.2555 9.9098 1.2555 9.73865 1.30184C9.54468 1.35436 9.36902 1.49099 9.0177 1.76424Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    id: "bonus",
    icon: (
      <svg
        viewBox="0 0 24 18"
        fill="none"
        stroke="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke="none"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 3.06977C24 2.256 23.6763 1.4746 23.1014 0.898605C22.5254 0.323721 21.744 0 20.9302 0C16.6527 0 7.34735 0 3.06977 0C2.256 0 1.4746 0.323721 0.898605 0.898605C0.323721 1.4746 0 2.256 0 3.06977V14.2326C0 15.0463 0.323721 15.8277 0.898605 16.4037C1.4746 16.9786 2.256 17.3023 3.06977 17.3023H20.9302C21.744 17.3023 22.5254 16.9786 23.1014 16.4037C23.6763 15.8277 24 15.0463 24 14.2326V3.06977ZM22.3256 3.06977V14.2326C22.3256 14.6032 22.1782 14.957 21.917 15.2194C21.6547 15.4806 21.3008 15.6279 20.9302 15.6279H3.06977C2.69916 15.6279 2.3453 15.4806 2.08298 15.2194C1.82177 14.957 1.67442 14.6032 1.67442 14.2326V3.06977C1.67442 2.69916 1.82177 2.3453 2.08298 2.08298C2.3453 1.82177 2.69916 1.67442 3.06977 1.67442H20.9302C21.3008 1.67442 21.6547 1.82177 21.917 2.08298C22.1782 2.3453 22.3256 2.69916 22.3256 3.06977Z"
        />
        <path
          stroke="none"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.82215 5.52773C2.95591 6.71099 3.30084 8.44569 4.69396 9.37666C5.26103 9.7562 6.14624 9.95378 7.01471 10.0174C8.16336 10.1 9.26178 9.97834 9.26178 9.97834C9.50177 9.95155 9.71833 9.82318 9.85564 9.62448C9.99405 9.4269 10.0398 9.17797 9.98178 8.94355C9.98178 8.94355 9.72391 7.90764 9.24503 6.89629C8.88112 6.13052 8.37991 5.39601 7.80503 5.01201C6.44764 4.10448 4.66717 4.37573 3.82215 5.52773ZM5.17284 6.51899C5.53117 6.02894 6.29805 6.01778 6.87405 6.40401C7.2335 6.64401 7.50475 7.13517 7.73136 7.61406C7.85415 7.87304 7.96019 8.13313 8.04726 8.3709C7.76819 8.37536 7.45452 8.36978 7.13526 8.34745C6.57601 8.30615 5.99108 8.23024 5.62382 7.98466C5.08243 7.62299 4.83573 6.97778 5.17284 6.51899Z"
        />
        <path
          stroke="none"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.5965 5.52773C13.7515 4.37573 11.971 4.10448 10.6136 5.01201C10.0387 5.39601 9.5375 6.13052 9.1736 6.89629C8.69471 7.90764 8.43685 8.94355 8.43685 8.94355C8.37881 9.17797 8.42457 9.4269 8.56299 9.62448C8.70029 9.82318 8.91685 9.95155 9.15685 9.97834C9.15685 9.97834 10.2553 10.1 11.4039 10.0174C12.2724 9.95378 13.1576 9.7562 13.7247 9.37666C15.1178 8.44569 15.4627 6.71099 14.5965 5.52773ZM13.2458 6.51899C13.5829 6.97778 13.3362 7.62299 12.7948 7.98466C12.4275 8.23024 11.8426 8.30615 11.2834 8.34745C10.9641 8.36978 10.6504 8.37536 10.3714 8.3709C10.4584 8.13313 10.5645 7.87304 10.6873 7.61406C10.9139 7.13517 11.1851 6.64401 11.5446 6.40401C12.1206 6.01778 12.8875 6.02894 13.2458 6.51899Z"
        />
        <path
          stroke="none"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.40814 0.837209V16.4651C8.40814 16.9273 8.78321 17.3023 9.24535 17.3023C9.70749 17.3023 10.0826 16.9273 10.0826 16.4651V0.837209C10.0826 0.37507 9.70749 0 9.24535 0C8.78321 0 8.40814 0.37507 8.40814 0.837209Z"
        />
        <path
          stroke="none"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.2326 7.81401H23.1629C23.625 7.81401 24.0001 7.43894 24.0001 6.9768C24.0001 6.51466 23.625 6.1396 23.1629 6.1396H14.2326C13.7705 6.1396 13.3954 6.51466 13.3954 6.9768C13.3954 7.43894 13.7705 7.81401 14.2326 7.81401Z"
        />
        <path
          stroke="none"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.837209 7.81401H4.18605C4.64819 7.81401 5.02326 7.43894 5.02326 6.9768C5.02326 6.51466 4.64819 6.1396 4.18605 6.1396H0.837209C0.37507 6.1396 0 6.51466 0 6.9768C0 7.43894 0.37507 7.81401 0.837209 7.81401Z"
        />
        <path
          stroke="none"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.58049 9.52196L11.9293 12.8708C12.2564 13.1979 12.7866 13.1979 13.1137 12.8708C13.4408 12.5448 13.4408 12.0135 13.1137 11.6875L9.76486 8.33871C9.43779 8.01164 8.90756 8.01164 8.58049 8.33871C8.25453 8.66466 8.25453 9.19601 8.58049 9.52196Z"
        />
        <path
          stroke="none"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.65355 8.33871L5.30471 11.6875C4.97764 12.0135 4.97764 12.5448 5.30471 12.8708C5.63178 13.1979 6.16201 13.1979 6.48908 12.8708L9.83792 9.52196C10.1639 9.19601 10.1639 8.66466 9.83792 8.33871C9.51085 8.01164 8.98062 8.01164 8.65355 8.33871Z"
        />
      </svg>
    ),
  },
  {
    id: "order",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="none"
      >
        <path
          stroke="none"
          d="M21 6H18C18 4.4087 17.3679 2.88258 16.2426 1.75736C15.1174 0.632141 13.5913 0 12 0C10.4087 0 8.88258 0.632141 7.75736 1.75736C6.63214 2.88258 6 4.4087 6 6H3C2.20435 6 1.44129 6.31607 0.87868 6.87868C0.31607 7.44129 0 8.20435 0 9V19C0.00158786 20.3256 0.528882 21.5964 1.46622 22.5338C2.40356 23.4711 3.67441 23.9984 5 24H19C20.3256 23.9984 21.5964 23.4711 22.5338 22.5338C23.4711 21.5964 23.9984 20.3256 24 19V9C24 8.20435 23.6839 7.44129 23.1213 6.87868C22.5587 6.31607 21.7956 6 21 6ZM12 2C13.0609 2 14.0783 2.42143 14.8284 3.17157C15.5786 3.92172 16 4.93913 16 6H8C8 4.93913 8.42143 3.92172 9.17157 3.17157C9.92172 2.42143 10.9391 2 12 2ZM22 19C22 19.7956 21.6839 20.5587 21.1213 21.1213C20.5587 21.6839 19.7956 22 19 22H5C4.20435 22 3.44129 21.6839 2.87868 21.1213C2.31607 20.5587 2 19.7956 2 19V9C2 8.73478 2.10536 8.48043 2.29289 8.29289C2.48043 8.10536 2.73478 8 3 8H6V10C6 10.2652 6.10536 10.5196 6.29289 10.7071C6.48043 10.8946 6.73478 11 7 11C7.26522 11 7.51957 10.8946 7.70711 10.7071C7.89464 10.5196 8 10.2652 8 10V8H16V10C16 10.2652 16.1054 10.5196 16.2929 10.7071C16.4804 10.8946 16.7348 11 17 11C17.2652 11 17.5196 10.8946 17.7071 10.7071C17.8946 10.5196 18 10.2652 18 10V8H21C21.2652 8 21.5196 8.10536 21.7071 8.29289C21.8946 8.48043 22 8.73478 22 9V19Z"
        />
      </svg>
    ),
  },
  {
    id: "wishlist",
    icon: (
      <svg
        width="22"
        height="20"
        viewBox="0 0 22 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.1111 1C18.6333 1 21 4.3525 21 7.48C21 13.8138 11.1778 19 11 19C10.8222 19 1 13.8138 1 7.48C1 4.3525 3.36667 1 6.88889 1C8.91111 1 10.2333 2.02375 11 2.92375C11.7667 2.02375 13.0889 1 15.1111 1Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    id: "contact",
    icon: (
      <svg
        width="22"
        height="24"
        viewBox="0 0 22 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.66667 19.15H14.3333M5.44444 15.3H16.5556M3.22222 1H18.7778C20.0051 1 21 2.09442 21 3.44444V20.5556C21 21.9056 20.0051 23 18.7778 23H3.22222C1.99492 23 1 21.9056 1 20.5556V3.44444C1 2.09442 1.99492 1 3.22222 1ZM10.9973 5.63313C10.2198 4.77608 8.92323 4.54554 7.94905 5.33034C6.97486 6.11514 6.83771 7.42729 7.60274 8.35548C8.36778 9.28367 10.9973 11.45 10.9973 11.45C10.9973 11.45 13.6269 9.28367 14.3919 8.35548C15.157 7.42729 15.0366 6.10689 14.0456 5.33034C13.0547 4.55379 11.7749 4.77608 10.9973 5.63313Z"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "password",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.1111 8.33326C18.1111 7.7077 17.8724 7.08214 17.3951 6.60485C16.9178 6.12754 16.2923 5.88889 15.6667 5.88889M15.6667 15.6667C19.7168 15.6667 23 12.3834 23 8.33333C23 4.28324 19.7168 1 15.6667 1C11.6166 1 8.33333 4.28324 8.33333 8.33333C8.33333 8.66783 8.35573 8.99709 8.3991 9.31971C8.47044 9.85033 8.50611 10.1156 8.4821 10.2835C8.45709 10.4584 8.42524 10.5526 8.33906 10.7068C8.25633 10.8548 8.11053 11.0006 7.81894 11.2922L1.57277 17.5383C1.36138 17.7497 1.25569 17.8554 1.18011 17.9788C1.11309 18.0881 1.06371 18.2073 1.03377 18.3321C1 18.4727 1 18.6222 1 18.9211V21.0444C1 21.729 1 22.0712 1.13321 22.3327C1.25039 22.5626 1.43737 22.7496 1.66734 22.8668C1.92879 23 2.27105 23 2.95556 23H5.88889V20.5556H8.33333V18.1111H10.7778L12.7078 16.1811C12.9994 15.8895 13.1452 15.7437 13.2932 15.6609C13.4474 15.5748 13.5416 15.5429 13.7165 15.5179C13.8844 15.4939 14.1497 15.5296 14.6803 15.6009C15.0029 15.6443 15.3322 15.6667 15.6667 15.6667Z"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "address",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.3 14.515C2.2635 15.4134 1 16.6653 1 18.05C1 20.7838 5.92487 23 12 23C18.0751 23 23 20.7838 23 18.05C23 16.6653 21.7365 15.4134 19.7 14.515M18.6 7.6C18.6 12.0701 13.65 14.2 12 17.5C10.35 14.2 5.4 12.0701 5.4 7.6C5.4 3.95492 8.35492 1 12 1C15.6451 1 18.6 3.95492 18.6 7.6ZM13.1 7.6C13.1 8.20751 12.6075 8.7 12 8.7C11.3925 8.7 10.9 8.20751 10.9 7.6C10.9 6.99249 11.3925 6.5 12 6.5C12.6075 6.5 13.1 6.99249 13.1 7.6Z"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const AccountPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 1024;
  const { t } = useTranslation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const wishlist = useSelector(
    (state: RootState) => state.user?.user?.meta?.preferences || []
  );
  const user = useSelector((state: RootState) => state.user.user);

  const [tabsMenuHidden, setTabsMenuHidden] = useState(false);

  const [activeTab, setActiveTab] = useState<string>(
    window.location.hash.replace("#", "") || "main"
  );
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#main") {
      setTabsMenuHidden(false);
    }
  }, [location.hash]);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(window.location.hash.replace("#", "") || "main");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const handleTabChange = (tabId: string) => {
    setLoading(true);

    if (isMobile) {
      setTabsMenuHidden(true);
    }

    setTimeout(() => {
      setLoading(false);
    }, 500);

    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  const renderContent = () => {
    if (loading) return <Loader />;

    switch (activeTab) {
      case "main":
        return <MainAccountTab setTab={handleTabChange} />;
      case "bonus":
        return <BonusTab />;
      case "order":
        return <OrdersTab />;
      case "wishlist":
        return <WishListTab />;
      case "contact":
        return <UpdateInfoTab />;
      case "password":
        return <ResetPasswordTab />;
      case "address":
        return <AddressTab user={user} />;
      default:
        return null;
    }
  };

  return (
    <main className={s.page}>
      <div className={s.section}>
        <Layout className={s.container}>
          <div className={`${tabsMenuHidden && s.hidden} ${s.tabsMenu}`}>
            <div className={s.username}>
              <p>{user?.name}</p>
              <p>{user?.secondName}</p>
            </div>

            <span className={s.email}>{user?.email}</span>

            <ul>
              {categories.map((category) => (
                <li key={category.id} className={s.category}>
                  <button
                    className={`${s.tabButton} ${
                      activeTab === category.id ? s.active : ""
                    }`}
                    onClick={() => handleTabChange(category.id)}
                  >
                    {category.icon}
                    {t(`accountPage.tabs.${category.id}`)}
                  </button>

                  {category.id === "wishlist" && (
                    <div className={s.wishLength}>{wishlist.length}</div>
                  )}

                  {category.id === "order" && (
                    <div className={s.wishLength}>
                      {user?.meta?.orders?.length || 0}
                    </div>
                  )}
                </li>
              ))}
            </ul>

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
              {t("accountPage.logout.button")}
            </button>
          </div>

          {isMobile && tabsMenuHidden && (
            <div className={s.tabsContent}>{renderContent()}</div>
          )}

          {!isMobile && <div className={s.tabsContent}>{renderContent()}</div>}

          <AnimatePresence>
            <ConfirmLogoutModal
              isOpen={isLogoutModalOpen}
              onConfirm={confirmLogout}
              onCancel={cancelLogout}
              confirmText={t("accountPage.logout.confirmText")}
              titleText={t("accountPage.logout.titleText")}
              descText={t("accountPage.logout.descText")}
              cancelText={t("accountPage.logout.cancelText")}
            />
          </AnimatePresence>
        </Layout>
      </div>
    </main>
  );
};

export default AccountPage;
