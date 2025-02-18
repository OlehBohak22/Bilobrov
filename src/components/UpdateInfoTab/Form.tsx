import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import s from "./Form.module.css";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { updateUserInfo } from "../../store/actions/userActions";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

// Визначаємо схему валідації за допомогою Yup
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
  email: Yup.string().email("Невірна пошта"), // Email не є обов'язковим
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

  const handleSubmit = async (values: FormValues) => {
    const userData: {
      name: string;
      secondName: string;
      phone: string;
      birthday: string;
      email?: string;
    } = {
      name: values.name || "", // Гарантуємо, що значення є
      secondName: values.secondName || "",
      phone: values.phone || "",
      birthday: values.birthday || "",
    };

    if (values.email && values.email !== user?.email) {
      userData.email = values.email; // Додаємо email тільки якщо він змінився
    }

    try {
      await dispatch(updateUserInfo(userData));

      console.log(userData);
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
            <svg
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.5 0C5.14873 0 0 5.14873 0 11.5C0 17.8513 5.14873 23 11.5 23C17.8513 23 23 17.8513 23 11.5C23 5.14873 17.8513 0 11.5 0ZM13.8955 17.2357H10.8051V8.3639H9.10455V5.76431H13.8955V17.2357Z"
                fill="#1A1A1A"
              />
            </svg>

            <p>Особиста інформація</p>
          </div>

          <div className={s.inputLine}>
            <div>
              <label htmlFor="name">
                Ім'я
                <span>*</span>
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
                Прізвище
                <span>*</span>
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
                Дата народження
                <span>*</span>
              </label>
              <Field type="date" id="birthday" name="birthday" />
              <ErrorMessage name="birthday" component="div" className="error" />
            </div>
          </div>

          <div className={s.title}>
            <svg
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.5 0C5.14873 0 0 5.14873 0 11.5C0 17.8513 5.14873 23 11.5 23C17.8513 23 23 17.8513 23 11.5C23 5.14873 17.8513 0 11.5 0ZM15.7659 17.3821H7.23405V16.6838C11.8496 11.24 12.4853 10.3602 12.4853 9.37535C12.4853 8.75334 12.0755 8.33621 11.4879 8.33621C10.8439 8.33621 10.4513 8.77054 10.4513 9.4611V9.683H7.41893V9.4708C7.41893 7.15134 8.93923 5.61816 11.4509 5.61816C13.8843 5.61816 15.5643 7.11427 15.5643 9.26794C15.5643 10.7115 15.0303 11.8196 12.5768 14.6616H15.7659V17.3821Z"
                fill="#1A1A1A"
              />
            </svg>

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
            Зберегти зміни
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1834_9386)">
                <path d="M17.9177 5L16.8487 6.05572L21.6059 10.7535H0.5V12.2465H21.6059L16.8487 16.9443L17.9177 18L24.5 11.5L17.9177 5Z" />
              </g>
              <defs>
                <clipPath id="clip0_1834_9386">
                  <rect width="24" height="24" transform="translate(0.5)" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </Form>
      </Formik>
    </div>
  );
};
