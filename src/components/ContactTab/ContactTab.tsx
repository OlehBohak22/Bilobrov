import s from "./ContactTab.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchContacts } from "../../store/slices/contactSlice";
import { AppDispatch, RootState } from "../../store";
import { Loader } from "../Loader/Loader";
import { useTranslation } from "react-i18next";

export const ContactTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const {
    input_email,
    input_phone,
    input_address,
    input_schedule,
    save_data_text,
    loading,
    error,
  } = useSelector((state: RootState) => state.contact);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className={s.error}>
        {t("contactTab.error")}: {error}
      </div>
    );

  return (
    <div className={s.tab}>
      <h2>
        <span>{t("contactTab.title1")}</span>
        <span>{t("contactTab.title2")}</span>
      </h2>

      <ul className={s.list}>
        <li>
          <div>
            <h3>{t("contactTab.sendLetter")}</h3>
            <p>{t("contactTab.contactUs")}</p>
          </div>

          <a href={`mailto:${input_email}`}>{input_email}</a>
        </li>

        <li>
          <div>
            <h3>{t("contactTab.callUs")}</h3>
            <p>{t("contactTab.supportChat")}</p>
          </div>

          <a href={`tel:${input_phone}`}>{input_phone}</a>
        </li>

        <li>
          <div>
            <h3>{t("contactTab.visitUs")}</h3>
            <p>{input_address}</p>
          </div>

          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.google.com.ua/maps/place/%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%8F+%D0%9B%D0%B5%D1%81%D1%8F+%D0%9A%D1%83%D1%80%D0%B1%D0%B0%D1%81%D0%B0,+5,+%D0%91%D1%96%D0%BB%D0%B0+%D0%A6%D0%B5%D1%80%D0%BA%D0%B2%D0%B0..."
          >
            {t("contactTab.viewOnMap")}
          </a>
        </li>
      </ul>

      <p className={s.schdule}>{input_schedule}</p>

      <ul className={s.socialList}>
        {save_data_text.map((item) => (
          <li key={item.hl_input_link}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={item.hl_input_link}
            >
              <div className={s.socialName}>
                <span
                  dangerouslySetInnerHTML={{ __html: item.hl_svg_photo }}
                ></span>
                <p>{item.hl_input_name}</p>
              </div>

              <div className={s.socialInfo}>
                <img src="/icons/footer-logo.svg" alt="Logo" />

                <div>
                  <p>{item.hl_input_tag}</p>
                  <span>
                    {item.hl_input_btn_text}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 18L18 6M18 6H10M18 6V14"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
