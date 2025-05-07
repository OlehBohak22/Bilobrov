import { useTranslation } from "react-i18next";
import { UpdateForm } from "./Form";
import s from "./UpdateInfoTab.module.css";

export const UpdateInfoTab = () => {
  const { t } = useTranslation();
  return (
    <div className={s.tab}>
      <h2>
        <span>{t("updateInfo.contact")}</span>
        <span>{t("updateInfo.data")}</span>
      </h2>

      <UpdateForm />
    </div>
  );
};
