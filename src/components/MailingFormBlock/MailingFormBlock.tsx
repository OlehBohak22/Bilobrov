import s from "./MailingFormBlock.module.css";
import { useTranslation } from "react-i18next";

export const MailingFormBlock = () => {
  const { t } = useTranslation();

  return (
    <form className={s.form}>
      <button type="submit">
        <span>{t("mailingForm.subscribe")}</span>
        <span>{t("mailingForm.newsletter")}</span>
      </button>

      <div className={s.inputContainer}>
        <input type="email" placeholder={t("mailingForm.placeholder")} />
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.2236 6.6665L21.7982 8.07414L28.1412 14.3378H0V16.3286H28.1412L21.7982 22.5922L23.2236 23.9998L32 15.3331L23.2236 6.6665Z" />
        </svg>
      </div>
    </form>
  );
};
