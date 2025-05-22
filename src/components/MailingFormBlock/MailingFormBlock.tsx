import { useState } from "react";
import s from "./MailingFormBlock.module.css";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL_WP, consumerKey, consumerSecret } from "../../constants/api";

export const MailingFormBlock = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return;

    try {
      await axios.post(
        `${API_URL_WP}save-email`,
        { email },
        {
          auth: {
            username: consumerKey,
            password: consumerSecret,
          },
        }
      );

      alert(t("thanks"));

      setSubscribed(true);
      setEmail("");
    } catch (error) {
      console.error("Помилка підписки:", error);
      alert("Не вдалося підписатися. Спробуйте пізніше.");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubscribe();
      }}
      className={s.form}
    >
      <button type="submit">
        <span>{t("mailingForm.subscribe")}</span>
        <span>{t("mailingForm.newsletter")}</span>
      </button>

      <div className={s.inputContainer}>
        <input
          onChange={(e) => setEmail(e.target.value)}
          className={s.subscribeInput}
          type="email"
          value={email}
          placeholder={t("mailingForm.placeholder")}
        />
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.2236 6.6665L21.7982 8.07414L28.1412 14.3378H0V16.3286H28.1412L21.7982 22.5922L23.2236 23.9998L32 15.3331L23.2236 6.6665Z" />
        </svg>
      </div>
    </form>
  );
};
