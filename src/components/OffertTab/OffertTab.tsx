import { useEffect, useState } from "react";
import s from "./OffertTab.module.css";
import { Loader } from "../Loader/Loader";
import { useTranslation } from "react-i18next";
import { API_URL_WP_V2 } from "../../constants/api";

export const OffertTab = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`${API_URL_WP_V2}pages/8989`);
        const data = await res.json();

        console.log(data);
        setContent(data.content.rendered);
      } catch (err) {
        console.error("Помилка при завантаженні оферти:", err);
      }
    };

    fetchPage();
  }, []);

  const { t } = useTranslation();

  return (
    <div className={s.tab}>
      <h2>
        <span>{t("offertTab.title1")}</span>
        <span>{t("offertTab.title2")}</span>
      </h2>

      {content ? (
        <div
          className={s.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <Loader />
      )}
    </div>
  );
};
