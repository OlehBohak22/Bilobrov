import { useWindowSize } from "../../hooks/useWindowSize";
import s from "./AboutHeroSection.module.css";

export const AboutHeroSection = () => {
  const { width } = useWindowSize();
  const isMobile = width < 1024;

  return (
    <section className={s.section}>
      <div className={s.titleContainer}>
        <p>Ти у себе на першому місці</p>
        <h1>З Bilobrov Cosmetics</h1>
      </div>

      <div className={s.heroBg}>
        <img
          src={
            isMobile
              ? "/images/mobile-about-hero-girl.avif"
              : "/images/about-hero-girl.avif"
          }
          alt="Beaty girl"
        />
      </div>
    </section>
  );
};
