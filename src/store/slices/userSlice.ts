import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Типи для користувача та автентифікації
interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  // Інші поля, що ти хочеш зберігати
}

interface AuthState {
  token: string | null;
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Реєстрація користувача
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (
      state,
      action: PayloadAction<{ token: string; user: UserData }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;
    },

    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Вхід користувача
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: UserData }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Вихід з акаунту
    logout: (state) => {
      state.token = null;
      state.user = null;
    },

    // Оновлення даних користувача (якщо є)
    updateUserData: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUserData,
} = userSlice.actions;

export default userSlice.reducer;
