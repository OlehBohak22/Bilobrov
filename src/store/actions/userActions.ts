import { AxiosError } from "axios";
import {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  setUserFromToken, // нова дія для завантаження користувача по токену
} from "../slices/userSlice";
import { AppDispatch } from "../index"; // тип для dispatch
import axios from "axios";

const API_URL = "https://bilobrov.projection-learn.website/wp-json";

const consumerKey = "ck_f6e14983147c7a65ff3dd554625c6ae3069dbd5b";
const consumerSecret = "cs_f9430f1ca298c36b0001d95521253a5b1deb2fc5";

// Створюємо інстанс Axios із заголовками
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
  },
});

// Тип для помилки
interface ErrorResponse {
  message: string;
}

// Функція для отримання токену з localStorage
export const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};

// Перевірка токену при завантаженні додатка
export const checkUserSession = () => async (dispatch: AppDispatch) => {
  const token = getTokenFromLocalStorage();
  if (token) {
    try {
      // Якщо токен є, отримаємо інформацію про користувача
      const userResponse = await axiosInstance.get("/responses/v1/user_info", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Диспатчимо інформацію про користувача
      dispatch(setUserFromToken({ token, user: userResponse.data }));
      console.log(userResponse.data);
    } catch (error) {
      console.error("Помилка перевірки сесії:", error);
    }
  }
};

// Реєстрація користувача
// Реєстрація користувача
export const registerUser =
  (email: string, password: string, name: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(registerStart());

      // Виконання запиту на реєстрацію
      const response = await axiosInstance.post(
        "/responses/v1/user_registration",
        {
          email,
          password,
          name,
        }
      );

      // Після реєстрації отримуємо токен
      const tokenResponse = await axiosInstance.post("/jwt-auth/v1/token", {
        username: email,
        password,
      });

      const { token } = tokenResponse.data;

      // Зберігаємо токен в localStorage
      localStorage.setItem("token", token);

      // Диспатчимо успішну реєстрацію
      dispatch(registerSuccess({ token, user: response.data }));

      // Тепер виконуємо авторизацію автоматично
      // Власне, це виклик функції loginUser, щоб одразу авторизувати користувача
      dispatch(
        loginUser(email, password) // Замість того, щоб викликати окрему авторизацію, ми просто викликаємо loginUser
      );
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      dispatch(
        registerFailure(
          axiosError.response?.data.message || "Помилка реєстрації"
        )
      );
    }
  };

// Вхід користувача
export const loginUser =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(loginStart());

      const response = await axiosInstance.post(
        "/responses/v1/user_authorization",
        { email, password }
      );

      const token = response.data?.jwt;
      if (!token) {
        throw new Error("Не вдалося отримати токен");
      }

      // Зберігаємо токен в localStorage
      localStorage.setItem("token", token);

      const userResponse = await axiosInstance.get("/responses/v1/user_info", {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(loginSuccess({ token, user: userResponse.data }));
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      dispatch(
        loginFailure(axiosError.response?.data.message || "Помилка входу")
      );
    }
  };

export const updateUserInfo =
  (userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    birthday: string;
  }) =>
  async (dispatch: AppDispatch, getState: any) => {
    try {
      dispatch(updateUserStart());

      const token = getTokenFromLocalStorage();
      if (!token) throw new Error("Користувач не авторизований");

      const response = await axiosInstance.post(
        "/responses/v1/update_user_info",
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Отримуємо поточного користувача зі стану Redux
      const currentUser = getState().user.user;

      if (!currentUser) throw new Error("Дані користувача не знайдені в Redux");

      // Оновлюємо дані користувача
      const updatedUser = {
        ...currentUser,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email, // Додаємо email, якщо він змінюється
        meta: {
          ...currentUser.meta, // Залишаємо всі попередні мета-дані
          phone: userData.phone,
          birthday: userData.birthday,
        },
      };

      // Диспатчимо оновлені дані користувача
      dispatch(updateUserSuccess(updatedUser));

      // const userResponse = await axiosInstance.get("/responses/v1/user_info", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      // console.log(userResponse);

      // Якщо змінився email, оновлюємо токен
      if (userData.email !== currentUser.email && response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      const errorMessage =
        axiosError.response?.data.message || "Помилка оновлення даних";

      dispatch(updateUserFailure(errorMessage));
    }
  };
