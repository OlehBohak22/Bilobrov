import { Layout } from "../Layout/Layout";
import s from "./BilobrovTodaySection.module.css";
import { useTranslation } from "react-i18next";

export const BilobrovTodaySection = () => {
  const { t } = useTranslation();

  return (
    <section>
      <Layout className={s.container}>
        <div>
          <p>Bilobrov cosmetics</p>
          <span>{t("bilobrovToday.title")}</span>
        </div>

        <ul>
          <li>
            <span>326</span>
            <p>{t("bilobrovToday.brands")}</p>
          </li>
          <li>
            <span>9 {t("bilobrovToday.years")}</span>
            <p>{t("bilobrovToday.experience")}</p>
          </li>
          <li>
            <span>45</span>
            <p>{t("bilobrovToday.team")}</p>
          </li>
          <li>
            <span>3500</span>
            <p>{t("bilobrovToday.clients")}</p>
          </li>
        </ul>
      </Layout>
    </section>
  );
};
