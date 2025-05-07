import s from "./ReturnTab.module.css";
import { useTranslation } from "react-i18next";

export const ReturnTab = () => {
  const { t } = useTranslation();

  const reasons = [
    t("returnTab.reason1"),
    t("returnTab.reason2"),
    t("returnTab.reason3"),
  ];

  return (
    <div className={s.tab}>
      <h2>
        <span>{t("returnTab.title1")}</span>
        <span>{t("returnTab.title2")}</span>
      </h2>

      <p className={s.desc}>{t("returnTab.description")}</p>

      <ul className={s.list}>
        {reasons.map((reason, index) => (
          <li key={index}>
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" fill="#FFC43A" />
              <path
                d="M9 15.1765L14.5 21L23 12"
                stroke="#FFFCF5"
                strokeWidth="2"
              />
            </svg>

            <p>{reason}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
