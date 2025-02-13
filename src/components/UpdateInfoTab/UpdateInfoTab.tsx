import { UpdateForm } from "./Form";
import s from "./UpdateInfoTab.module.css";

export const UpdateInfoTab = () => {
  return (
    <div className={s.tab}>
      <h2>
        <span>Контактні</span>
        <span>дані</span>
      </h2>

      <UpdateForm />
    </div>
  );
};
