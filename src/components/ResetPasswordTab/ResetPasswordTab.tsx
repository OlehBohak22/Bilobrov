import { useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { resetPassword } from "../../store/slices/resetPasswordSlice"; // Шлях до вашого слайсу
import { RootState } from "../../store"; // Шлях до вашого store
import s from "./ResetPasswordTab.module.css";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface FormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ...імпорти залишаються без змін

export const ResetPasswordTab = () => {
  const dispatch = useAppDispatch();
  const { status, error, message } = useSelector(
    (state: RootState) => state.resetPassword
  );
  const { t } = useTranslation();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (
    values: FormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    if (values.newPassword !== values.confirmPassword) {
      alert(t("resetPassword.errors.passwordsMismatch"));
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
        <span>{t("resetPassword.change")}</span>
        <span>{t("resetPassword.password")}</span>
      </h2>

      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange }) => {
          const allFieldsFilled =
            values.oldPassword && values.newPassword && values.confirmPassword;

          return (
            <Form className={s.form}>
              {/* Old password */}
              <div className={`${s.field} relative lg:mb-[1.8vw] mb-[4.2vw]`}>
                <label htmlFor="oldPassword">
                  {t("resetPassword.currentPassword")}
                  <span>*</span>
                </label>
                <Field
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  id="oldPassword"
                  value={values.oldPassword}
                  onChange={handleChange}
                  placeholder={t("resetPassword.currentPasswordPlaceholder")}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.25 7.40714C19.289 11.5352 15.806 14.0117 11.998 14.0117H12.002C8.194 14.0117 4.711 11.5352 2.75 7.40714"
                        stroke="#212121"
                        strokeWidth="1.6"
                        strokeLinecap="square"
                      />
                      <path
                        d="M8.74338 16.5931L9.58789 13.6836"
                        stroke="#212121"
                        strokeWidth="1.6"
                        strokeLinecap="square"
                      />
                      <path
                        d="M15.1765 16.5931L14.332 13.6836"
                        stroke="#212121"
                        strokeWidth="1.6"
                        strokeLinecap="square"
                      />
                      <path
                        d="M18.5898 11.2773L20.701 13.3885"
                        stroke="#212121"
                        strokeWidth="1.6"
                        strokeLinecap="square"
                      />
                      <path
                        d="M5.33203 11.2773L3.22092 13.3885"
                        stroke="#212121"
                        strokeWidth="1.6"
                        strokeLinecap="square"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.25 7.40714C19.289 11.5352 15.806 14.0117 11.998 14.0117H12.002C8.194 14.0117 4.711 11.5352 2.75 7.40714"
                        stroke="#212121"
                        strokeWidth="1.6"
                        strokeLinecap="square"
                      />
                      <path
                        d="M8.74338 16.5931L9.58789 13.6836"
                        stroke="#212121"
                        strokeWidth="1.6"
                        strokeLinecap="square"
                      />
                      <path
                        d="M15.1765 16.5931L14.332 13.6836"
                        stroke="#212121"
                        strokeWidth="1.6"
                        strokeLinecap="square"
                      />
                      <path
                        d="M18.5898 11.2773L20.701 13.3885"
                        stroke="#212121"
                        strokeWidth="1.6"
                        strokeLinecap="square"
                      />
                      <path
                        d="M5.33203 11.2773L3.22092 13.3885"
                        stroke="#212121"
                        strokeWidth="1.6"
                        strokeLinecap="square"
                      />
                    </svg>
                  )}
                </button>

                <ErrorMessage
                  name="oldPassword"
                  component="div"
                  className={s.error}
                />
                <div className={s.forget}>{t("resetPassword.forgot")}</div>
              </div>

              {/* New password */}
              <div className={s.inputContainer}>
                <div className={`${s.field} relative`}>
                  <label htmlFor="newPassword">
                    {t("resetPassword.newPassword")}
                    <span>*</span>
                  </label>
                  <Field
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    value={values.newPassword}
                    onChange={handleChange}
                    placeholder={t("resetPassword.newPasswordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.25 7.40714C19.289 11.5352 15.806 14.0117 11.998 14.0117H12.002C8.194 14.0117 4.711 11.5352 2.75 7.40714"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M8.74338 16.5931L9.58789 13.6836"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M15.1765 16.5931L14.332 13.6836"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M18.5898 11.2773L20.701 13.3885"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M5.33203 11.2773L3.22092 13.3885"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.25 7.40714C19.289 11.5352 15.806 14.0117 11.998 14.0117H12.002C8.194 14.0117 4.711 11.5352 2.75 7.40714"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M8.74338 16.5931L9.58789 13.6836"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M15.1765 16.5931L14.332 13.6836"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M18.5898 11.2773L20.701 13.3885"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M5.33203 11.2773L3.22092 13.3885"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                      </svg>
                    )}
                  </button>
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className={s.error}
                  />
                </div>

                {/* Confirm password */}
                <div className={`${s.field} relative`}>
                  <label htmlFor="confirmPassword">
                    {t("resetPassword.confirmPassword")}
                    <span>*</span>
                  </label>
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    placeholder={t("resetPassword.confirmPasswordPlaceholder")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.25 7.40714C19.289 11.5352 15.806 14.0117 11.998 14.0117H12.002C8.194 14.0117 4.711 11.5352 2.75 7.40714"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M8.74338 16.5931L9.58789 13.6836"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M15.1765 16.5931L14.332 13.6836"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M18.5898 11.2773L20.701 13.3885"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M5.33203 11.2773L3.22092 13.3885"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.25 7.40714C19.289 11.5352 15.806 14.0117 11.998 14.0117H12.002C8.194 14.0117 4.711 11.5352 2.75 7.40714"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M8.74338 16.5931L9.58789 13.6836"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M15.1765 16.5931L14.332 13.6836"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M18.5898 11.2773L20.701 13.3885"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                        <path
                          d="M5.33203 11.2773L3.22092 13.3885"
                          stroke="#212121"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                      </svg>
                    )}
                  </button>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className={s.error}
                  />
                </div>
              </div>

              {/* Errors */}
              {error && <div className={s.error}>{error}</div>}
              {message && <div className={s.success}>{message}</div>}

              {/* Submit button */}
              <button
                className={`${s.submitBtn} ${
                  !allFieldsFilled ? s.disabled : ""
                }`}
                type="submit"
                disabled={!allFieldsFilled || status === "loading"}
              >
                {status === "loading" ? (
                  <p>{t("resetPassword.loading")}</p>
                ) : (
                  <p>{t("resetPassword.save")}</p>
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
          );
        }}
      </Formik>
    </div>
  );
};
