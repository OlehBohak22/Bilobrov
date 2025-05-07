import { useWindowSize } from "../../hooks/useWindowSize";
import s from "./AboutHeroSection.module.css";
import { useTranslation } from "react-i18next";

export const AboutHeroSection = () => {
  const { width } = useWindowSize();
  const isMobile = width < 1024;
  const { t } = useTranslation();

  return (
    <section className={s.section}>
      <div className={s.titleContainer}>
        <p>{t("aboutHero.subtitle")}</p>
        <h1>{t("aboutHero.title")}</h1>
      </div>

      <div className={s.heroBg}>
        <img
          src={
            isMobile
              ? "/images/mobile-about-hero-girl.avif"
              : "/images/about-hero-girl.avif"
          }
          alt="Beauty girl"
        />
      </div>
    </section>
  );
};
