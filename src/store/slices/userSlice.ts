import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { togglePreference } from "./wishlistSlice";

interface BonusHistoryItem {
  type: string;
  icon: string;
  time: string;
  value: number;
}

interface address {
  selected: boolean;
  id: number;
  city: string;
  entrance: string;
  apartment: string;
  house: string;
  street: string;
  last_name: string;
  middle_name: string;
  first_name: string;
}

interface Product {
  id: number;
  brand: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  short_description: string;
  sku: string;
}

export interface Order {
  shipping_type: string;
  shipping_address: string;
  customer_name: string;
  customer_phone: string;
  shipping_cost: number;
  discount_total: number;
  total_price: number;
  id: number;
  status: string;
  order_id: number;
  status_date: string;
  grand_total: number;
  products: Product[];
}

// Оновлюємо інтерфейс UserData
interface UserMeta {
  preferences: number[];
  birthday?: string;
  bonus?: string;
  phone?: string;
  bonus_history?: BonusHistoryItem[];
  address: address[];
  orders: Order[];
}

export interface UserData {
  ID: number;
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
    updateUserSuccess: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
          email: action.payload.email ?? state.user.email, // Якщо email немає в payload, залишаємо старий
          meta: {
            ...state.user.meta,
            ...action.payload.meta,
          },
        };
      }
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
