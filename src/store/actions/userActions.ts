import { AxiosError } from "axios";
import {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
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
    } catch (error) {
      console.error("Помилка перевірки сесії:", error);
    }
  }
};

// Реєстрація користувача
export const registerUser =
  (email: string, password: string, name: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(registerStart());

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

      dispatch(registerSuccess({ token, user: response.data }));
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
