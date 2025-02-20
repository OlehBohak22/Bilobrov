import { useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { resetPassword } from "../../store/slices/resetPasswordSlice"; // Шлях до вашого слайсу
import { RootState } from "../../store"; // Шлях до вашого store
import s from "./ResetPasswordTab.module.css";
import { useAppDispatch } from "../../hooks/useAppDispatch";

interface FormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ResetPasswordTab = () => {
  const dispatch = useAppDispatch();
  const { status, error, message } = useSelector(
    (state: RootState) => state.resetPassword
  );

  const handleSubmit = (
    values: FormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    if (values.newPassword !== values.confirmPassword) {
      alert("Паролі не співпадають");
      return;
    }

    dispatch(
      resetPassword({
        password: values.newPassword,
        old_password: values.oldPassword,
      })
    );

    resetForm();
  };

  return (
    <div className={s.tab}>
      <h2>
        <span>Зміна</span>
        <span>пароля</span>
      </h2>

      <div></div>
      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange }) => (
          <Form className={s.form}>
            <div className={`${s.field} mb-[1.8vw]`}>
              <label htmlFor="oldPassword">
                Поточний пароль<span>*</span>
              </label>
              <Field
                type="password"
                name="oldPassword"
                id="oldPassword"
                value={values.oldPassword}
                onChange={handleChange}
                placeholder="Твій поточний пароль"
              />
              <ErrorMessage
                name="oldPassword"
                component="div"
                className={s.error}
              />
              <div className={s.forget}>Забули пароль?</div>
            </div>

            <div className={s.inputContainer}>
              <div className={s.field}>
                <label htmlFor="newPassword">
                  Новий пароль
                  <span>*</span>
                </label>
                <Field
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={values.newPassword}
                  onChange={handleChange}
                  placeholder="Введи новий пароль"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className={s.error}
                />
              </div>

              <div className={s.field}>
                <label htmlFor="confirmPassword">
                  Повторіть новий пароль
                  <span>*</span>
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  placeholder="Повтори новий пароль"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className={s.error}
                />
              </div>
            </div>

            {error && <div className={s.error}>{error}</div>}
            {message && <div className={s.success}>{message}</div>}

            <button className={s.submitBtn} type="submit">
              {(status === "loading" && <p>Завантаження...</p>) || (
                <p>Зберегти зміни</p>
              )}
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2036_10999)">
                  <path d="M17.9177 5L16.8487 6.05572L21.6059 10.7535H0.5V12.2465H21.6059L16.8487 16.9443L17.9177 18L24.5 11.5L17.9177 5Z" />
                </g>
                <defs>
                  <clipPath id="clip0_2036_10999">
                    <rect width="24" height="24" transform="translate(0.5)" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
