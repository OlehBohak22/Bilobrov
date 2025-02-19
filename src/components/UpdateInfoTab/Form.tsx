import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import s from "./Form.module.css";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { updateUserInfo } from "../../store/actions/userActions";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Ім'я є обов'язковим")
    .min(2, "Ім'я повинно бути не менше 2 символів"),
  secondName: Yup.string()
    .required("Прізвище є обов'язковим")
    .min(2, "Прізвище повинно бути не менше 2 символів"),
  birthday: Yup.date()
    .required("Дата народження є обов'язковою")
    .max(new Date(), "Дата народження не може бути в майбутньому"),
  phone: Yup.string()
    .required("Номер телефону є обов'язковим")
    .matches(/^\+?\d{10,15}$/, "Введіть правильний номер телефону"),
  email: Yup.string().email("Невірна пошта"),
});

interface FormValues {
  name: string;
  secondName: string;
  email: string;
  phone: string;
  birthday: string;
}

export const UpdateForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user?.user);

  const [isSaved, setIsSaved] = useState(false); // Стан кнопки

  const handleSubmit = async (values: FormValues) => {
    const userData: {
      name: string;
      secondName: string;
      phone: string;
      birthday: string;
      email?: string;
    } = {
      name: values.name || "",
      secondName: values.secondName || "",
      phone: values.phone || "",
      birthday: values.birthday || "",
    };

    if (values.email && values.email !== user?.email) {
      userData.email = values.email;
    }

    try {
      await dispatch(updateUserInfo(userData));

      setIsSaved(true); // Міняємо кнопку на "Зміни збережено"
      setTimeout(() => setIsSaved(false), 3000); // Через 3 секунди повертаємо назад
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={s.form}>
      <Formik
        initialValues={{
          name: user?.name || "",
          secondName: user?.secondName || "",
          birthday: user?.meta?.birthday || "",
          phone: user?.meta?.phone || "",
          email: user?.email || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className={s.title}>
            <p>Особиста інформація</p>
          </div>

          <div className={s.inputLine}>
            <div>
              <label htmlFor="name">
                Ім'я<span>*</span>
              </label>
              <Field
                placeholder="Твоє імʼя"
                type="text"
                id="name"
                name="name"
              />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="secondName">
                Прізвище<span>*</span>
              </label>
              <Field
                placeholder="Твоє прізвище"
                type="text"
                id="secondName"
                name="secondName"
              />
              <ErrorMessage
                name="secondName"
                component="div"
                className="error"
              />
            </div>

            <div>
              <label htmlFor="birthday">
                Дата народження<span>*</span>
              </label>
              <Field type="date" id="birthday" name="birthday" />
              <ErrorMessage name="birthday" component="div" className="error" />
            </div>
          </div>

          <div className={s.title}>
            <p>Контакти</p>
          </div>

          <div className={s.inputLine}>
            <div>
              <label htmlFor="phone">
                Номер телефону<span>*</span>
              </label>
              <Field type="text" id="phone" name="phone" />
              <ErrorMessage name="phone" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="email">Еmail</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
          </div>

          <button className={s.btn} type="submit">
            {isSaved ? "Зміни збережено" : "Зберегти зміни"}

            <svg
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1950_10735)">
                <path d="M17.9177 5L16.8487 6.05572L21.6059 10.7535H0.5V12.2465H21.6059L16.8487 16.9443L17.9177 18L24.5 11.5L17.9177 5Z" />
              </g>
              <defs>
                <clipPath id="clip0_1950_10735">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
          </button>
        </Form>
      </Formik>
    </div>
  );
};
