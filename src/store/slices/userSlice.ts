import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { togglePreference } from "./wishlistSlice";

interface BonusHistoryItem {
  type: string;
  icon: string;
  time: string;
  value: number;
}

// Оновлюємо інтерфейс UserData
interface UserMeta {
  preferences: number[];
  birthday?: string;
  bonus?: string;
  phone?: string;
  bonus_history?: BonusHistoryItem[];
}

interface UserData {
  id: number;
  email: string;
  name: string;
  secondName: string;
  meta: UserMeta; // Додано поле meta
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
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
    updateUserData: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },
    setUserFromToken: (
      state,
      action: PayloadAction<{ token: string; user: UserData }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },

    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(togglePreference.fulfilled, (state, action) => {
      if (state.user && state.user.meta) {
        state.user.meta.preferences = action.payload; // Оновлення вподобань
      }
    });
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
  setUserFromToken,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
