import { Route, Routes } from "react-router-dom";
import { ProductList } from "./components/ProductList/ProductList";
import "./App.css";
import { Header } from "./components/Header/Header";
import { HomePage } from "./Pages/HomePage/HomePage";
import { CheckoutPage } from "./components/CheckoutPage";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <ProductList />
      <CheckoutPage />
    </>
  );
}

export default App;
