import { Link } from "react-router";
import { Layout } from "../Layout/Layout";
import s from "./CashbackSection.module.css";
import { useTranslation } from "react-i18next";

export const CashbackSection = () => {
  const { t } = useTranslation();

  return (
    <section>
      <Layout className={s.container}>
        <div className={s.descContainers}>
          <div className={s.titleContainer}>
            <span>{t("cashbackSection.label")}</span>
            <h2>{t("cashbackSection.title")}</h2>
            <p>{t("cashbackSection.description")}</p>
          </div>

          <Link className={s.details} to="/bilobrov-club">
            <span>{t("cashbackSection.details")}</span>
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_691_3833)">
                <path d="M17.9177 5L16.8487 6.05572L21.6059 10.7535H0.5V12.2465H21.6059L16.8487 16.9443L17.9177 18L24.5 11.5L17.9177 5Z" />
              </g>
              <defs>
                <clipPath id="clip0_691_3833">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
          </Link>
        </div>
        <div>
          <img src="/images/cashback.jpg" alt="Cashback" />
        </div>
      </Layout>
    </section>
  );
};
