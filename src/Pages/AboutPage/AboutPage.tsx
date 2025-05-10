import { Breadcrumbs } from "@mui/material";
import { AboutHeroSection } from "../../components/AboutHeroSection/AboutHeroSection";
import { BilobrovTodaySection } from "../../components/BilobrovTodaySection/BilobrovTodaySection";
import { Layout } from "../../components/Layout/Layout";
import { OurTeamSection } from "../../components/OurTeamSection/OurTeamSection";
import { PhilosophySection } from "../../components/PhilosophySection/PhilosophySection";
import { ValuablesSection } from "../../components/ValuablesSection/ValuablesSection";
import s from "./AboutPage.module.css";
import { Link, useLocation } from "react-router";
import Helmet from "react-helmet";
import { usePageData } from "../../hooks/usePageData";
import { API_URL } from "../../constants/api";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t } = useTranslation();

  const breadcrumbs = [
    { name: t("breadCrumbs.main"), link: "/" },
    { name: t("breadCrumbs.about"), link: "/about" },
  ];

  const { state } = useLocation();

  const metaUrl = state || `${API_URL}/about`;

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

      <Layout>
        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
          {breadcrumbs.map((breadcrumb, index) => (
            <Link key={index} to={breadcrumb.link}>
              {breadcrumb.name}
            </Link>
          ))}
        </Breadcrumbs>
      </Layout>

      <AboutHeroSection />
      <BilobrovTodaySection />
      <PhilosophySection />
      <OurTeamSection />
      <ValuablesSection />
    </main>
  );
};

export default AboutPage;
