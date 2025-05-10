import { useLocation } from "react-router";
import { BonusFaq } from "../../components/BonusFaq/BonusFaq";
import { BonusPageHero } from "../../components/BonusPageHero/BonusPageHero";
import { BonusSection } from "../../components/BonusSection/BonusSection";
import { BonusSystem } from "../../components/BonusSystem/BonusSystem";
import s from "./BonusPage.module.css";
import { API_URL } from "../../constants/api";
import { usePageData } from "../../hooks/usePageData";
import { Helmet } from "react-helmet";

const BonusPage = ({ openRegister }: { openRegister: () => void }) => {
  const { state } = useLocation();

  const metaUrl = state || `${API_URL}/bonusna-systema`;

  const seoData = usePageData(metaUrl);

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

      <BonusPageHero />
      <BonusSection openRegister={openRegister} />
      <BonusSystem />
      <BonusFaq />
    </main>
  );
};

export default BonusPage;
