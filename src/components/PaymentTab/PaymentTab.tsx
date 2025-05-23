import { useTranslation } from "react-i18next";
import s from "./PaymentTab.module.css";

export const PaymentTab = () => {
  const { t } = useTranslation();

  const notes = t("paymentTab.notes", {
    returnObjects: true,
  }) as string[];

  const paymentMethods = t("paymentTab.paymentUl", {
    returnObjects: true,
  }) as { title: string; subTitle: string }[];

  return (
    <div className={s.tab}>
      <h2>
        <span>{t("paymentTab.title.first")}</span>
        <span>{t("paymentTab.title.second")}</span>
      </h2>

      <p className={s.desc}>{t("paymentTab.subtitle")}</p>

      <ul className={s.paymentMethods}>
        {paymentMethods.map((item, index) => (
          <li key={index}>
            {svg}
            <h4>{item.title}</h4>
            <p>{item.subTitle}</p>
          </li>
        ))}
      </ul>

      <p className={s.notice}>{t("paymentTab.methodsTitle")}</p>

      <ul className={s.noticeList}>
        {" "}
        {notes.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <p className={s.notice}>{t("paymentTab.bottomNote")}</p>
    </div>
  );
};

const svg = (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#D63D44" />
    <path d="M9 15.1765L14.5 21L23 12" stroke="#FFFCF5" stroke-width="2" />
  </svg>
);
