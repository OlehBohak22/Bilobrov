import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { CartInitializer } from "./components/CartInitializer";
import { checkUserSession } from "./store/actions/userActions";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useState, useEffect, lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/index";
import { fetchMenus } from "./store/slices/menuSlice";
import { fetchBrands } from "./store/slices/popularBrandsSlice";
import { fetchCategories } from "./store/slices/categorySlice";
import { fetchBanner } from "./store/slices/bannerSlice";
import LoadingBar from "./components/LoadingBar/LoadingBar";
import { GlobalPropsContext } from "./GlobalPropContext";
import { AnimatePresence } from "framer-motion";
import { fetchProducts, fetchReviews } from "./store/slices/productsSlice";
import { fetchCertificates, setSearchQuery } from "./store/slices/filterSlice";
import "./utils/i18n";
import { HomePage } from "./Pages/HomePage/HomePage";
import OrderSuccesPage from "./Pages/OrderSuccesPage/OrderSuccesPage";
import { OrderFooter } from "./Pages/OrderPage/OrderFooter";

// const HomePage = lazy(() => import("./Pages/HomePage/HomePage"));
const AboutPage = lazy(() => import("./Pages/AboutPage/AboutPage"));
const ClientsSupportPage = lazy(
  () => import("./Pages/ClientsSupportPage/ClientsSupportPage")
);
const BonusPage = lazy(() => import("./Pages/BonusPage/BonusPage"));
const AccountPage = lazy(() => import("./Pages/AccountPage/AccountPage"));
const BrandsPage = lazy(() => import("./Pages/BrandsPage/BrandsPage"));
const OrderPage = lazy(() => import("./Pages/OrderPage/OrderPage"));
const CatalogPage = lazy(() => import("./Pages/CatalogPage/CatalogPage"));
const CertificatePage = lazy(
  () => import("./Pages/CertificatePage/CertificatePage")
);

const ProductPage = lazy(() => import("./Pages/ProductPage/ProductPage"));

const RegisterModal = lazy(() => import("./components/RegisterPopup/Register"));

const WishListPopup = lazy(
  () => import("./components/WishListPopup/WishListPopup")
);
const CartPopup = lazy(() => import("./components/CartPopup/CartPopup"));
const ReviewPopup = lazy(() => import("./components/ReviewPopup/ReviewPopup"));
const MenuPopup = lazy(() => import("./components/MenuPopup/MenuPopup"));
const SearchPopup = lazy(() => import("./components/SearchPopup/SearchPopup"));

function App() {
  const dispatch = useAppDispatch();
  const { loading } = useSelector((state: RootState) => state.banner);
  const navigate = useNavigate();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWishList, setIsWishList] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReview, setIsReview] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state.user);
  const { currentProduct } = useSelector((state: any) => state.products);

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => {
        setShowLoading(false);
      }, 150);

      return () => clearTimeout(timeout);
    } else {
      setShowLoading(true);
    }
  }, [loading]);

  useEffect(() => {
    dispatch(checkUserSession());
    dispatch(fetchCategories());
    dispatch(fetchMenus());
    dispatch(fetchBrands());
    dispatch(fetchBanner());

    dispatch(fetchReviews());
    dispatch(fetchCertificates());
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow =
      isRegisterOpen || isWishList || isCartOpen || isMenuOpen || isSearchOpen
        ? "hidden"
        : "visible";
  }, [isRegisterOpen, isWishList, isCartOpen, isMenuOpen, isSearchOpen]);

  useEffect(() => {
    if (user) {
      setIsRegisterOpen(false);
    }
  }, [user]);

  const handleOpenRegister = () => {
    if (user) {
      navigate("/account#main");
    } else {
      setIsRegisterOpen(true);
      document.body.style.overflow = "hidden";
    }
  };

  const handleOpenWishList = () => setIsWishList(true);
  const handleOpenSearch = () => {
    setSearchOpen(true);
    setSearchQuery("");
    fetchProducts();
    // dispatch(resetFilters());
  };
  const handleOpenCart = () => setIsCartOpen(true);
  const handleOpenReview = () => setIsReview(true);

  const handleCloseModals = () => {
    setIsRegisterOpen(false);
    setIsWishList(false);
    setIsCartOpen(false);
    setIsReview(false);
    setIsMenuOpen(false);
    setSearchOpen(false);
    document.body.style.overflow = "visible";
  };

  const globalProps = {
    openCart: handleOpenCart,
    openRegister: handleOpenRegister,
  };

  useEffect(() => {
    if (loading) {
      dispatch(fetchBanner());
    }
  }, [dispatch, loading]);

  return (
    <GlobalPropsContext.Provider value={globalProps}>
      <>
        {showLoading ? (
          <LoadingBar />
        ) : (
          <>
            <CartInitializer />
            <Header
              openRegister={handleOpenRegister}
              openWishList={handleOpenWishList}
              openSearch={handleOpenSearch}
              openCart={handleOpenCart}
              openMenu={() => setIsMenuOpen(true)}
            />

            <AnimatePresence>
              <Suspense fallback={null}>
                {isRegisterOpen && (
                  <RegisterModal onClose={handleCloseModals} />
                )}
                {isWishList && <WishListPopup onClose={handleCloseModals} />}
                {isCartOpen && <CartPopup onClose={handleCloseModals} />}
                {isSearchOpen && (
                  <SearchPopup
                    close={() => {
                      setSearchOpen(false);
                      dispatch(setSearchQuery(""));
                    }}
                  />
                )}
                {isMenuOpen && (
                  <MenuPopup
                    openPopup={() => {
                      handleOpenRegister();
                      setIsMenuOpen(false);
                    }}
                    onClose={handleCloseModals}
                  />
                )}
                {isReview && (
                  <ReviewPopup
                    onClose={handleCloseModals}
                    product_id={currentProduct?.id}
                  />
                )}
              </Suspense>
            </AnimatePresence>

            <div style={{ minHeight: "100vh" }}>
              <Suspense fallback={<LoadingBar />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/support" element={<ClientsSupportPage />} />
                  <Route
                    path="/bilobrov-club"
                    element={<BonusPage openRegister={handleOpenRegister} />}
                  />
                  <Route
                    path="/podarunkovi-sertyfikaty-20"
                    element={<CertificatePage />}
                  />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/brendy" element={<BrandsPage />} />
                  <Route path="/order" element={<OrderPage />} />

                  <Route path="/order-success" element={<OrderSuccesPage />} />

                  <Route path="/catalog" element={<CatalogPage />}>
                    <Route index element={<CatalogPage />} />
                    <Route path=":slug" element={<CatalogPage />} />
                    <Route
                      path=":parentSlug/:childSlug"
                      element={<CatalogPage />}
                    />
                  </Route>

                  <Route
                    path="/product/:slug/:id"
                    element={
                      <ProductPage
                        openReview={handleOpenReview}
                        openRegister={handleOpenRegister}
                        openCart={handleOpenCart}
                      />
                    }
                  />
                </Routes>
              </Suspense>
            </div>

            {location.pathname.startsWith("/order-succes") ? (
              <OrderFooter />
            ) : (
              <Footer />
            )}
          </>
        )}
      </>
    </GlobalPropsContext.Provider>
  );
}

export default App;
