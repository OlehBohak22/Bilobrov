import { Layout } from "../../components/Layout/Layout";
import s from "./OrderFooter.module.css";
import { useTranslation } from "react-i18next";

export const OrderFooter = () => {
  const { t } = useTranslation();

  return (
    <div className={s.footer}>
      <Layout className={s.container}>
        <div className={s.leftBlock}>
          <div>
            <p>{t("orderFooter.supportTime")}</p>

            <address>
              <a href="tel:380674811650">+38 (067) 481 16 50</a>
              <a href="mailto:support@bilobrov.cosmetics">
                support@bilobrov.cosmetics
              </a>
            </address>
          </div>

          <a className={s.tgLink} href="">
            <div className={s.icon}>
              <svg
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.63262 13.8632L8.2687 18.8888C8.78938 18.8888 9.01488 18.6692 9.2853 18.4055L11.7264 16.115L16.7847 19.7519C17.7124 20.2595 18.366 19.9922 18.6163 18.914L21.9365 3.63926L21.9374 3.63836C22.2317 2.29196 21.4415 1.76547 20.5377 2.09576L1.02135 9.43163C-0.310594 9.93922 -0.290427 10.6682 0.794932 10.9985L5.78447 12.5222L17.3742 5.40235C17.9196 5.04775 18.4155 5.24395 18.0076 5.59855L8.63262 13.8632Z" />
              </svg>
            </div>
            <span>{t("orderFooter.telegram")}</span>
          </a>
        </div>

        <div className={s.rightBLock}>
          <a href="">{t("orderFooter.deliveryTerms")}</a>
          <a href="">{t("orderFooter.paymentTerms")}</a>
        </div>
      </Layout>
    </div>
  );
};
