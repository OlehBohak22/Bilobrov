// import s from "./HomePage.module.css";
import { HomeHero } from "../../components/HomeHero/HomeHero";
import BrandsList from "../../components/PopularBrands/BrandsList";
import { ProductList } from "../../components/ProductList/ProductList";
import Register from "../../components/Register";
import { LoginForm } from "../../components/Login";
import { CategoriesSection } from "../../components/CategoriesSection/CategoriesSection";
import { HomeAbout } from "../../components/HomeAbout/HomeAbout";
import { HomeServices } from "../../components/HomeServices/HomeServices";
import { CashbackSection } from "../../components/CashbackSection/CashbackSection";

export const HomePage = () => {
  return (
    <main>
      <HomeHero></HomeHero>
      <ProductList
        categories={["Без категорії", "Акції", "Новинки", "Бестселлери"]}
        defaultCategory="Новинки"
      />

      <BrandsList />

      <ProductList categories={["Новинки"]} defaultCategory="Новинки">
        <h2>
          <span>Нові</span>
          <span>Надходження</span>
        </h2>
      </ProductList>

      <CategoriesSection parentId={48}>
        <h2>
          <span>Догляд</span>
          <span>за обличчям</span>
        </h2>
      </CategoriesSection>

      <ProductList categories={["Бестселлери"]} defaultCategory="Бестселлери>">
        <h2>
          <span>Хіти</span>
          <span>продажів</span>
        </h2>
      </ProductList>

      <div className="mb-[8.3vw]">
        <CategoriesSection parentId={54} reverse={true}>
          <h2>
            <span>Декоративна</span>
            <span>косметика</span>
          </h2>
        </CategoriesSection>
      </div>

      <HomeAbout />

      <HomeServices />

      <CashbackSection />

      <Register />
      <LoginForm />
    </main>
  );
};
