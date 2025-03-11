import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  "https://bilobrov.projection-learn.website/wp-json/responses/v1/cart";

interface Product {
  id: number;
  quantity: number;
  variation_id?: number;
}

interface CartState {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed" | null;
  error: string | null;
}

const getLocalCart = (): Product[] =>
  JSON.parse(localStorage.getItem("cart") || "[]");
const saveLocalCart = (cart: Product[]) =>
  localStorage.setItem("cart", JSON.stringify(cart));

export const fetchCart = createAsyncThunk<Product[], string | null>(
  "cart/fetchCart",
  async (token, { rejectWithValue }) => {
    try {
      if (!token) return getLocalCart();
      const { data } = await axios.get<{ cart: Product[] }>(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addToCart = createAsyncThunk<
  Product[],
  { product: Product; token: string | null }
>("cart/addToCart", async ({ product, token }, { rejectWithValue }) => {
  try {
    if (!token) {
      const localCart = getLocalCart();
      const existing = localCart.find(
        (item) =>
          item.id === product.id &&
          item.variation_id === (product.variation_id || 0)
      );
      if (existing) existing.quantity += product.quantity;
      else
        localCart.push({ ...product, variation_id: product.variation_id || 0 });
      saveLocalCart(localCart);
      return localCart;
    }
    const { data } = await axios.post<{ cart: Product[] }>(
      API_URL,
      { product },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data.cart;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const removeFromCart = createAsyncThunk<
  Product[],
  { product: Product; token: string | null }
>("cart/removeFromCart", async ({ product, token }, { rejectWithValue }) => {
  try {
    // Якщо немає токена, працюємо з локальним кошиком
    if (!token) {
      const localCart = getLocalCart().filter(
        (item) =>
          !(
            item.id === product.id &&
            item.variation_id === (product.variation_id || 0)
          )
      );
      saveLocalCart(localCart);
      return localCart;
    }

    // Видалення через API
    const { data } = await axios.delete<{ cart: Product[] }>(API_URL, {
      data: {
        product: {
          id: product.id,
          quantity: product.quantity,
          variation_id: product.variation_id || 0, // Додаємо варіацію як 0, якщо вона не вказана
        },
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    return data.cart;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const mergeCart = createAsyncThunk<void, string>(
  "cart/mergeCart",
  async (token, { dispatch }) => {
    const localCart = getLocalCart();
    if (localCart.length === 0) {
      await dispatch(fetchCart(token));
      return;
    }
    for (const product of localCart) {
      await dispatch(addToCart({ product, token }));
    }
    localStorage.removeItem("cart");
    await dispatch(fetchCart(token));
  }
);

const initialState: CartState = {
  items: [],
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchCart.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.items = action.payload;
        }
      )
      .addCase(
        addToCart.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.items = action.payload;
        }
      )
      .addCase(
        removeFromCart.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.items = action.payload;
        }
      )

      .addCase(mergeCart.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = "succeeded";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: PayloadAction<any>) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export default cartSlice.reducer;
