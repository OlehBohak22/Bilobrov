// import s from "./HomePage.module.css";
import { HomeHero } from "../../components/HomeHero/HomeHero";
import BrandsList from "../../components/PopularBrands/BrandsList";
import { ProductList } from "../../components/ProductList/ProductList";
import Register from "../../components/Register";
import { LoginForm } from "../../components/Login";

export const HomePage = () => {
  return (
    <main>
      <HomeHero></HomeHero>
      <ProductList
        categories={["Без категорії", "Акції", "Новинки", "Бестселлери"]}
        defaultCategory="Новинки"
      />

      <BrandsList />

      <ProductList categories={["Новинки"]} defaultCategory="Новинки" />

      <Register />
      <LoginForm />
    </main>
  );
};
