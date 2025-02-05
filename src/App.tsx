import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header/Header";
import { HomePage } from "./Pages/HomePage/HomePage";
// import { CheckoutPage } from "./components/CheckoutPage";
import { Footer } from "./components/Footer/Footer";
import { AboutPage } from "./Pages/AboutPage/AboutPage";
import { ClientsSupportPage } from "./Pages/ClientsSupportPage/ClientsSupportPage";
// import Register from "./components/Register";
// import { LoginForm } from "./components/Login";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<ClientsSupportPage />} />
      </Routes>
      <Footer />
      {/* <Register />
      <LoginForm />
      <CheckoutPage /> */}
    </>
  );
}

export default App;
