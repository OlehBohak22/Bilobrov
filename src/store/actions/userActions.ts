import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { setUserFromToken } from "../slices/userSlice";
import { AppDispatch } from "../index"; // тип для dispatch

// Константи
const API_URL = "https://bilobrov.projection-learn.website/wp-json";
const consumerKey = "ck_f6e14983147c7a65ff3dd554625c6ae3069dbd5b";
const consumerSecret = "cs_f9430f1ca298c36b0001d95521253a5b1deb2fc5";

// Axios Instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
  },
});

// Тип для помилок
interface ErrorResponse {
  message: string;
}

// Отримати токен з localStorage
export const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};

// Перевірка токену при завантаженні додатка
export const checkUserSession = () => async (dispatch: AppDispatch) => {
  const token = getTokenFromLocalStorage();
  if (token) {
    try {
      const userResponse = await axiosInstance.get("/responses/v1/user_info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setUserFromToken({ token, user: userResponse.data }));
    } catch (error) {
      console.error("❌ Помилка перевірки сесії:", error);
    }
  }
};

// Реєстрація користувача
export const registerUser = createAsyncThunk(
  "user/register",
  async (data: { email: string; password: string; name: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/responses/v1/user_registration",
        data
      );

      const tokenResponse = await axiosInstance.post("/jwt-auth/v1/token", {
        username: data.email,
        password: data.password,
      });

      const { token } = tokenResponse.data;
      localStorage.setItem("token", token);

      return { token, user: response.data };
    } catch (error: any) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return thunkAPI.rejectWithValue(
        axiosError.response?.data.message || "Помилка реєстрації"
      );
    }
  }
);

// Логін користувача
export const loginUser = createAsyncThunk(
  "user/login",
  async (data: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/responses/v1/user_authorization",
        data
      );

      const token = response.data?.jwt;
      if (!token) throw new Error("Не вдалося отримати токен");

      localStorage.setItem("token", token);

      const userResponse = await axiosInstance.get("/responses/v1/user_info", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { token, user: userResponse.data };
    } catch (error: any) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return thunkAPI.rejectWithValue(
        axiosError.response?.data.message || "Помилка входу"
      );
    }
  }
);

// Оновлення інформації користувача
export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async (
    userData: {
      name: string;
      secondName: string;
      phone: string;
      birthday: string;
      email?: string;
    },
    thunkAPI
  ) => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) throw new Error("Користувач не авторизований");

      const response = await axiosInstance.post(
        "/responses/v1/update_user_info",
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = response.data.user;
      if (!updatedUser) {
        throw new Error("Не отримано оновлені дані користувача");
      }

      return updatedUser;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return thunkAPI.rejectWithValue(
        axiosError.response?.data.message || "Помилка оновлення даних"
      );
    }
  }
);
