import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
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
import { LoadingBar } from "./components/LoadingBar/LoadingBar"; // Додаємо LoadingBar
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

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWishList, setIsWishList] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReview, setIsReview] = useState(false);
  const [loading, setLoading] = useState(true); // Додаємо стейт для смужки
  const { user } = useSelector((state: RootState) => state.user);

  const { currentProduct } = useSelector((state: any) => state.products);

  useEffect(() => {
    dispatch(checkUserSession());
    dispatch(fetchProducts());
    dispatch(fetchMenus());
    dispatch(fetchBrands()); // Викликаємо асинхронну дію для завантаження брендів
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
    if (user) {
      setIsWishList(true);
    } else {
      setIsRegisterOpen(true);
      document.body.style.overflow = "hidden";
    }
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

  useEffect(() => {
    setLoading(true);
    handleCloseModals();

    const timeout = setTimeout(() => setLoading(false), 1000); // Імітуємо завантаження
    return () => clearTimeout(timeout);
  }, [location.pathname]); // Виконується при зміні URL

  // Якщо loading === true, показуємо лише LoadingBar
  if (loading) {
    return <LoadingBar loading={loading} />;
  }

  // Видаляємо умовний рендеринг LoadingBar
  return (
    <>
      <LoadingBar loading={loading} /> {/* Завжди рендеримо LoadingBar */}
      <CartInitializer />
      <Header
        openRegister={handleOpenRegister}
        openWishList={handleOpenWishList}
        openCart={handleOpenCart}
        openMenu={() => setIsMenuOpen(true)}
      />
      {isRegisterOpen && <RegisterModal onClose={handleCloseModals} />}
      {isWishList && <WishListPopup onClose={handleCloseModals} />}
      {isCartOpen && <CartPopup onClose={handleCloseModals} />}
      {isMenuOpen && <MenuPopup onClose={handleCloseModals} />}
      {isReview && (
        <ReviewPopup
          onClose={handleCloseModals}
          product_id={currentProduct?.id}
        />
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<ClientsSupportPage />} />
        <Route path="/bilobrov-club" element={<BonusPage />} />
        <Route path="/certificate" element={<CertificatePage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/catalog/:categorySlug" element={<CatalogPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/brendy" element={<BrandsPage />} />

        <Route
          path="/product/:id"
          element={
            <ProductPage
              openReview={handleOpenReview}
              openRegister={handleOpenRegister}
            />
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
