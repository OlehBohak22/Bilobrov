import axios, { AxiosError } from "axios";
import { Dispatch } from "redux";
import {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
} from "../slices/userSlice";

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

// Реєстрація користувача
export const registerUser =
  (
    email: string,
    password: string,
    name: string,
    secondName: string,
    phone: string
  ) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch(registerStart());

      const response = await axiosInstance.post(
        "/responses/v1/user_registration",
        {
          email,
          password,
          phone,
          name,
          secondName,
        }
      );

      // Після реєстрації отримуємо токен
      const tokenResponse = await axiosInstance.post("/jwt-auth/v1/token", {
        username: email,
        password,
      });

      const { token } = tokenResponse.data;

      console.log(token);

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
  (email: string, password: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(loginStart());

      // Отримуємо дані користувача
      const response = await axiosInstance.post(
        "/responses/v1/user_authorization",
        {
          email,
          password,
        }
      );

      const token = response.data.jwt;

      console.log(token);

      // Отримуємо інформацію про користувача
      const userResponse = await axiosInstance.get("/wc/v3/customers/me", {
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
