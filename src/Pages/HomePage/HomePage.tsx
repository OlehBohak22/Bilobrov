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
import { useTranslation } from "react-i18next";

export const HomePage = () => {
  const seoData = usePageData(API_URL);

  const { t } = useTranslation();
  const productCategories = t("productList", { returnObjects: true }) as {
    sales: string;
    novelty: string;
    bestsellers: string;
  };

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

      <HomeHero />
      <Layout>
        <ProductList
          categories={[
            productCategories.sales,
            productCategories.novelty,
            productCategories.bestsellers,
          ]}
          defaultCategory={productCategories.sales}
        />
      </Layout>
      <BrandsList />
      <Layout>
        <ProductList
          categories={[productCategories.novelty]}
          defaultCategory={productCategories.novelty}
        >
          <h2>
            <span>{t("homePage.newArrivals.first")}</span>
            <span>{t("homePage.newArrivals.second")}</span>
          </h2>
        </ProductList>
      </Layout>
      <CategoriesSection
        largePlate={t("homePage.faceCare.largePlate")}
        parentId={1160}
      >
        <h2>
          <span>{t("homePage.faceCare.title.first")}</span>
          <span>{t("homePage.faceCare.title.second")}</span>
        </h2>
      </CategoriesSection>
      <Layout>
        <ProductList
          categories={[productCategories.bestsellers]}
          defaultCategory={productCategories.bestsellers}
        >
          <h2>
            <span>{t("homePage.bestsellers.first")}</span>
            <span>{t("homePage.bestsellers.second")}</span>
          </h2>
        </ProductList>
      </Layout>
      <div className="lg:mb-[8.3vw] mb-[21.3vw]">
        <CategoriesSection
          largePlate={t("homePage.decorative.largePlate")}
          parentId={1161}
          reverse={true}
        >
          <h2>
            <span>{t("homePage.decorative.title.first")}</span>
            <span>{t("homePage.decorative.title.second")}</span>
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
