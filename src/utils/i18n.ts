import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ua from "../../public/locales/ua/translation.json";
import ru from "../../public/locales/ru/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    ua: { translation: ua },
    ru: { translation: ru },
  },
  lng: "ua",
  fallbackLng: "ua",
  interpolation: { escapeValue: false },
});

export default i18n;
