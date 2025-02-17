import { Route, Routes, useNavigate } from "react-router-dom"; // Додаємо useNavigate
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

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // Додаємо useNavigate
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.user); // Вибираємо стан авторизації

  useEffect(() => {
    dispatch(checkUserSession());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setIsRegisterOpen(false);
    }
  }, [user]);

  // Оновлюємо логіку відкриття реєстрації
  const handleOpenRegister = () => {
    if (user) {
      navigate("/account"); // Якщо користувач авторизований, редіректимо
    } else {
      setIsRegisterOpen(true); // Інакше відкриваємо реєстраційний попап
    }
  };

  return (
    <>
      <Header openRegister={handleOpenRegister} />{" "}
      {/* Передаємо оновлену функцію */}
      {isRegisterOpen && (
        <RegisterModal onClose={() => setIsRegisterOpen(false)} />
      )}
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
