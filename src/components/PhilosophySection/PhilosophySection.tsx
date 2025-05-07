import { useTranslation } from "react-i18next";
import { Layout } from "../Layout/Layout";
import s from "./PhilosophySection.module.css";

export const PhilosophySection = () => {
  const { t } = useTranslation();

  return (
    <section className={s.section}>
      <Layout className={s.container}>
        <div className={s.imageContainer}>
          <img src="/images/viktoria-in-about.avif" alt="Viktoria" />
        </div>

        <div className={s.blockDesc}>
          <span>{t("philosophy.subtitle")}</span>
          <h3>{t("philosophy.title")}</h3>
          <p>{t("philosophy.desc")}</p>
          <div className={s.viktoria}>
            <span>{t("philosophy.name")}</span>
            <span>{t("philosophy.surname")}</span>
          </div>
        </div>
      </Layout>
    </section>
  );
};
