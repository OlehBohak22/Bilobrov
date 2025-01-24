// import s from "./HomePage.module.css";
import { HomeHero } from "../../components/HomeHero/HomeHero";
import { ProductList } from "../../components/ProductList/ProductList";

export const HomePage = () => {
  return (
    <main>
      <HomeHero></HomeHero>
      <ProductList
        categories={["Без категорії", "Акції", "Новинки", "Бестселлери"]}
        defaultCategory="Новинки"
      />
    </main>
  );
};
