import React from "react";
import { useSelector } from "react-redux";
import { Formik, Field, Form } from "formik";
// import * as Yup from "yup";
import { RootState } from "../../store";
import s from "./ReviewPopup.module.css";

interface CartPopupProps {
  onClose: () => void;
}

// const ReviewSchema = Yup.object().shape({
//   name: Yup.string().when("isAuthenticated", {
//     is: false, // Якщо користувач не авторизований
//     then: Yup.string().required("Ім'я є обов'язковим"),
//     otherwise: Yup.string().notRequired(),
//   }),
//   email: Yup.string().when("isAuthenticated", {
//     is: false, // Якщо користувач не авторизований
//     then: Yup.string()
//       .email("Невірний формат пошти")
//       .required("Пошта є обов'язковою"),
//     otherwise: Yup.string().notRequired(),
//   }),
//   review: Yup.string().required("Відгук не може бути порожнім"),
// });

export const ReviewPopup: React.FC<CartPopupProps> = ({ onClose }) => {
  const user = useSelector((state: RootState) => state.user.user);

  const initialValues = {
    name: "",
    email: "",
    review: "",
    isAuthenticated: !!user, // Якщо є користувач, то він авторизований
  };

  const handleSubmit = (values: any) => {
    // Логіка для відправки відгуку
    console.log(values);
    // Закриваємо попап після відправки
    onClose();
  };

  return (
    <div className={s.popupOverlay} onClick={onClose}>
      <div className={s.popupContent} onClick={(e) => e.stopPropagation()}>
        <div className={s.popupHeader}>
          <h2 className={s.popupTitle}>Залишити відгук</h2>
          <button className={s.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          //   validationSchema={ReviewSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              {!initialValues.isAuthenticated && (
                <>
                  <div>
                    <label htmlFor="name">Ім'я</label>
                    <Field
                      id="name"
                      name="name"
                      placeholder="Введіть ваше ім'я"
                      className={
                        errors.name && touched.name ? s.errorField : ""
                      }
                    />
                    {errors.name && touched.name && (
                      <div className={s.error}>{errors.name}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email">Пошта</label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Введіть вашу пошту"
                      className={
                        errors.email && touched.email ? s.errorField : ""
                      }
                    />
                    {errors.email && touched.email && (
                      <div className={s.error}>{errors.email}</div>
                    )}
                  </div>
                </>
              )}

              <div>
                <label htmlFor="review">Відгук</label>
                <Field
                  as="textarea"
                  id="review"
                  name="review"
                  placeholder="Напишіть ваш відгук"
                  className={
                    errors.review && touched.review ? s.errorField : ""
                  }
                />
                {errors.review && touched.review && (
                  <div className={s.error}>{errors.review}</div>
                )}
              </div>

              <div>
                <button type="submit" className={s.submitButton}>
                  Відправити відгук
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
