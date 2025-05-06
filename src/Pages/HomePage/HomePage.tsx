// import s from "./HomePage.module.css";
import { HomeHero } from "../../components/HomeHero/HomeHero";
import BrandsList from "../../components/PopularBrands/BrandsList";
import { ProductList } from "../../components/ProductList/ProductList";
import s from "./HomePage.module.css";

import { CategoriesSection } from "../../components/CategoriesSection/CategoriesSection";
import { HomeAbout } from "../../components/HomeAbout/HomeAbout";
import { HomeServices } from "../../components/HomeServices/HomeServices";
import { CashbackSection } from "../../components/CashbackSection/CashbackSection";
import { BlogSection } from "../../components/BlogSection/BlogSection";
import { Layout } from "../../components/Layout/Layout";
import { API_URL } from "../../constants/api";
import { usePageData } from "../../hooks/usePageData";
import { Helmet } from "react-helmet";

export const HomePage = () => {
  const seoData = usePageData(API_URL);

  return (
    <main className={s.page}>
      <Helmet>
        <title>{seoData.title || "Bilobrov"}</title>
        <link
          rel="canonical"
          href={seoData.canonical || window.location.href}
        />

        {seoData.og_title && (
          <meta property="og:title" content={seoData.og_title} />
        )}
        {seoData.og_description && (
          <meta property="og:description" content={seoData.og_description} />
        )}
        {seoData.og_url && <meta property="og:url" content={seoData.og_url} />}
        {seoData.og_locale && (
          <meta property="og:locale" content={seoData.og_locale} />
        )}
        {seoData.og_type && (
          <meta property="og:type" content={seoData.og_type} />
        )}
        {seoData.og_site_name && (
          <meta property="og:site_name" content={seoData.og_site_name} />
        )}
        {seoData.twitter_card && (
          <meta name="twitter:card" content={seoData.twitter_card} />
        )}

        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
      </Helmet>

      <HomeHero></HomeHero>

      <Layout>
        <ProductList
          categories={["Акції", "Новинки", "Бестселлери"]}
          defaultCategory="Новинки"
        />
      </Layout>

      <BrandsList />

      <Layout>
        <ProductList categories={["Новинки"]} defaultCategory="Новинки">
          <h2>
            <span>Нові</span>
            <span>надходження</span>
          </h2>
        </ProductList>
      </Layout>

      <CategoriesSection largePlate="Креми" parentId={1160}>
        <h2>
          <span>Догляд</span>
          <span>за обличчям</span>
        </h2>
      </CategoriesSection>

      <Layout>
        <ProductList categories={["Бестселлери"]} defaultCategory="Бестселлери">
          <h2>
            <span>Хіти</span>
            <span>продажів</span>
          </h2>
        </ProductList>
      </Layout>

      <div className="lg:mb-[8.3vw] mb-[21.3vw]">
        <CategoriesSection
          largePlate="Помада для губ"
          parentId={1161}
          reverse={true}
        >
          <h2>
            <span>Декоративна</span>
            <span>косметика</span>
          </h2>
        </CategoriesSection>
      </div>

      <HomeAbout />

      <HomeServices />

      <CashbackSection />

      <BlogSection />
    </main>
  );
};
