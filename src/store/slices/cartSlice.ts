import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  "https://bilobrov.projection-learn.website/wp-json/wc/store/cart";

// Типи для кошика
interface CartItem {
  key: string;
  id: number;
  quantity: number;
  [key: string]: any; // Для додаткових даних товару
}

interface CartState {
  items: CartItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Початковий стан
const initialState: CartState = {
  items: [],
  status: "idle",
  error: null,
};

const getNonce = () => (window as any)?.wcSettings?.nonce || "";

export const addToCart = createAsyncThunk<
  CartItem,
  { id: number; quantity: number }
>("cart/addToCart", async ({ id, quantity }, { rejectWithValue }) => {
  try {
    const nonce = getNonce();

    const response = await axios.post<CartItem>(
      `${BASE_URL}/items`,
      { id, quantity },
      {
        withCredentials: true,
        headers: {
          "X-WC-Store-API-Nonce": nonce,
        },
      }
    );
    console.log(window.wcSettings);

    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log(error.response?.data);
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Видалення конкретного товару
export const removeFromCart = createAsyncThunk<string, string>(
  "cart/removeFromCart",
  async (itemKey, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/items/${itemKey}`, {
        withCredentials: true,
      });
      return itemKey;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Очищення всього кошика
export const clearCart = createAsyncThunk<void>(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(BASE_URL, { withCredentials: true });
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Оновлення кількості товару
export const updateCartItemQuantity = createAsyncThunk<
  { itemKey: string; quantity: number },
  { itemKey: string; quantity: number }
>(
  "cart/updateCartItemQuantity",
  async ({ itemKey, quantity }, { rejectWithValue }) => {
    try {
      await axios.put(
        `${BASE_URL}/items/${itemKey}`,
        { quantity },
        { withCredentials: true }
      );
      return { itemKey, quantity };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Отримання кошика
export const fetchCart = createAsyncThunk<CartItem[]>(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<{ items: CartItem[] }>(BASE_URL, {
        withCredentials: true,
      });
      return response.data.items || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCart.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(
        addToCart.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          state.items.push(action.payload);
        }
      )
      .addCase(
        removeFromCart.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter(
            (item) => item.key !== action.payload
          );
        }
      )
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(
        updateCartItemQuantity.fulfilled,
        (
          state,
          action: PayloadAction<{ itemKey: string; quantity: number }>
        ) => {
          const item = state.items.find(
            (item) => item.key === action.payload.itemKey
          );
          if (item) {
            item.quantity = action.payload.quantity;
          }
        }
      );
  },
});

export default cartSlice.reducer;
