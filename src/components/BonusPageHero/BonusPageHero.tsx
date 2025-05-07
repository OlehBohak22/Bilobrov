import { useTranslation } from "react-i18next";
import { Layout } from "../Layout/Layout";
import s from "./BonusPageHero.module.css";

export const BonusPageHero = () => {
  const { t } = useTranslation();

  return (
    <section className={s.section}>
      <Layout>
        <div>
          <h1>Bilobrov club</h1>
          <p>{t("bonusHero")}</p>
        </div>
      </Layout>
    </section>
  );
};
