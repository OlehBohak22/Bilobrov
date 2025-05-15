import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { setUserFromToken } from "../slices/userSlice";
import { AppDispatch } from "../index";
import { API_URL_BASE, consumerKey, consumerSecret } from "../../constants/api";

const API_URL = API_URL_BASE;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
  },
});

interface ErrorResponse {
  message: string;
}

export const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};

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

export const registerUser = createAsyncThunk(
  "user/register",
  async (data: { email: string; password: string; name: string }, thunkAPI) => {
    try {
      // 1. Реєстрація
      await axiosInstance.post("/responses/v1/user_registration", data);

      // 2. Логін (як у loginUser)
      const response = await axiosInstance.post(
        "/responses/v1/user_authorization",
        { email: data.email, password: data.password }
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
        axiosError.response?.data.message || "Помилка реєстрації"
      );
    }
  }
);

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
