import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../hooks/useWindowSize";
import { Layout } from "../Layout/Layout";
import s from "./ValuablesSection.module.css";

export const ValuablesSection = () => {
  const { width } = useWindowSize();
  const isMobile = width < 1024;

  const { t } = useTranslation();

  return (
    <section className={s.section}>
      <Layout>
        <h2>{t("valuables.title")}</h2>

        <ul>
          <li className={s.red}>
            <h3>{t("valuables.clientCareTitle")}</h3>
            <p>{t("valuables.clientCareText")}</p>
          </li>
          <li className={s.white}>
            <h3>{t("valuables.personalTitle")}</h3>
            <p>{t("valuables.personalText")}</p>
          </li>

          {!isMobile && (
            <li>
              <img src="/images/valuables.jpg" alt="Valuables" />
            </li>
          )}

          <li className={s.rose}>
            <h3>{t("valuables.qualityTitle")}</h3>
            <p>{t("valuables.qualityText")}</p>
          </li>
        </ul>
      </Layout>
    </section>
  );
};
