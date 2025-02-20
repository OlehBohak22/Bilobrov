import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header/Header";
import { HomePage } from "./Pages/HomePage/HomePage";
import { Footer } from "./components/Footer/Footer";
import { AboutPage } from "./Pages/AboutPage/AboutPage";
import { ClientsSupportPage } from "./Pages/ClientsSupportPage/ClientsSupportPage";
import { BonusPage } from "./Pages/BonusPage/BonusPage";
import { AccountPage } from "./Pages/AccountPage/AccountPage";
import { LoginForm } from "./components/Login";
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

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isWishList, setIsWishList] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Додаємо стейт для смужки
  const { user } = useSelector((state: RootState) => state.user);

  // const getNonce = (): string | null => {
  //   return (window as any)?.wcSettings?.nonce || null;
  // };

  useEffect(() => {
    console.log("WooCommerce Nonce:", (window as any)?.wcSettings?.nonce);
  }, []);

  useEffect(() => {
    dispatch(checkUserSession());
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setIsRegisterOpen(false);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 800); // Імітуємо завантаження
    return () => clearTimeout(timeout);
  }, [location.pathname]); // Виконується при зміні URL

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
    if (user) {
      setIsCartOpen(true);
    } else {
      setIsRegisterOpen(true);
      document.body.style.overflow = "hidden";
    }
  };

  const handleCloseModals = () => {
    setIsRegisterOpen(false);
    setIsWishList(false);
    setIsCartOpen(false);
    document.body.style.overflow = "visible";
  };

  // Якщо loading === true, показуємо лише LoadingBar
  if (loading) {
    return <LoadingBar loading={loading} />;
  }

  // Видаляємо умовний рендеринг LoadingBar
  return (
    <>
      <LoadingBar loading={loading} /> {/* Завжди рендеримо LoadingBar */}
      <Header
        openRegister={handleOpenRegister}
        openWishList={handleOpenWishList}
        openCart={handleOpenCart}
      />
      {isRegisterOpen && <RegisterModal onClose={handleCloseModals} />}
      {isWishList && <WishListPopup onClose={handleCloseModals} />}
      {isCartOpen && <CartPopup onClose={handleCloseModals} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<ClientsSupportPage />} />
        <Route path="/bilobrov-club" element={<BonusPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
      <Footer />
      <LoginForm />
    </>
  );
}

export default App;
