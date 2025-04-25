import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header/Header";
import { HomePage } from "./Pages/HomePage/HomePage";
import { Footer } from "./components/Footer/Footer";
import { AboutPage } from "./Pages/AboutPage/AboutPage";
import { ClientsSupportPage } from "./Pages/ClientsSupportPage/ClientsSupportPage";
import { BonusPage } from "./Pages/BonusPage/BonusPage";
import { AccountPage } from "./Pages/AccountPage/AccountPage";
import { checkUserSession } from "./store/actions/userActions";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RegisterModal } from "./components/RegisterPopup/Register";
import { RootState } from "./store/index";
import { fetchProducts } from "./store/slices/productsSlice";
import { WishListPopup } from "./components/WishListPopup/WishListPopup";
// import { LoadingBar } from "./components/LoadingBar/LoadingBar";
import { CartPopup } from "./components/CartPopup/CartPopup";
import { ProductPage } from "./Pages/ProductPage/ProductPage";
import { ReviewPopup } from "./components/ReviewPopup/ReviewPopup";
import { MenuPopup } from "./components/MenuPopup/MenuPopup";
import { CertificatePage } from "./Pages/CertificatePage/CertificatePage";
import { CartInitializer } from "./components/CartInitializer";
import { fetchMenus } from "./store/slices/menuSlice";
import { CatalogPage } from "./Pages/CatalogPage/CatalogPage";
import { BrandsPage } from "./Pages/BrandsPage/BrandsPage";
import { fetchBrands } from "./store/slices/popularBrandsSlice";
import { fetchCategories } from "./store/slices/categorySlice";
import { OrderPage } from "./Pages/OrderPage/OrderPage";
import { fetchCities } from "./store/slices/citiesSlice";
import { fetchBanner } from "./store/slices/bannerSlice";
import LoadingBar from "./components/LoadingBar/LoadingBar";
import {} from "./store/slices/wishlistSlice";
import { GlobalPropsContext } from "./GlobalPropContext";
// import { NovaPoshtaMap } from "./components/MapPopup/MapPopup";
import { AnimatePresence } from "framer-motion";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const location = useLocation();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWishList, setIsWishList] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReview, setIsReview] = useState(false);
  // const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.user);

  const { currentProduct } = useSelector((state: any) => state.products);

  useEffect(() => {
    document.body.style.overflow =
      isRegisterOpen || isWishList || isCartOpen || isMenuOpen
        ? "hidden"
        : "visible";
  }, [isRegisterOpen, isWishList, isCartOpen, isMenuOpen]);

  useEffect(() => {
    dispatch(checkUserSession());
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchMenus());

    dispatch(fetchCities());

    dispatch(fetchBrands());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setIsRegisterOpen(false);
    }
  }, [user]);

  const handleOpenRegister = () => {
    if (user) {
      navigate("/account");
    } else {
      setIsRegisterOpen(true);
      document.body.style.overflow = "hidden";
    }
  };

  const handleOpenWishList = () => {
    setIsWishList(true);
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleOpenReview = () => {
    setIsReview(true);
  };

  const handleCloseModals = () => {
    setIsRegisterOpen(false);
    setIsWishList(false);
    setIsCartOpen(false);
    setIsReview(false);
    setIsMenuOpen(false);
    document.body.style.overflow = "visible";
  };

  const { loading } = useSelector((state: RootState) => state.banner);

  useEffect(() => {
    if (loading) {
      dispatch(fetchBanner());
    }
  }, [dispatch, loading]);

  const globalProps = {
    openCart: handleOpenCart,
    openRegister: handleOpenRegister,
  };
  return (
    <GlobalPropsContext.Provider value={globalProps}>
      <>
        {loading ? (
          <LoadingBar />
        ) : (
          <>
            <CartInitializer />
            <Header
              openRegister={handleOpenRegister}
              openWishList={handleOpenWishList}
              openCart={handleOpenCart}
              openMenu={() => setIsMenuOpen(true)}
            />
            <AnimatePresence>
              {isRegisterOpen && <RegisterModal onClose={handleCloseModals} />}
              {isWishList && <WishListPopup onClose={handleCloseModals} />}
              {isCartOpen && <CartPopup onClose={handleCloseModals} />}
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
            </AnimatePresence>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/support" element={<ClientsSupportPage />} />
              <Route path="/bilobrov-club" element={<BonusPage />} />
              <Route
                path="/podarunkovi-sertyfikaty-20"
                element={<CertificatePage />}
              />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/brendy" element={<BrandsPage />} />
              <Route path="/order" element={<OrderPage />} />

              <Route path="/catalog" element={<CatalogPage />}>
                <Route index element={<CatalogPage />} />
                <Route path=":slug" element={<CatalogPage />} />
                <Route
                  path=":parentSlug/:childSlug"
                  element={<CatalogPage />}
                />
              </Route>

              {/* Сторінка товару */}
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

            <Footer />

            {/* <NovaPoshtaMap /> */}
          </>
        )}
      </>
    </GlobalPropsContext.Provider>
  );
}

export default App;
