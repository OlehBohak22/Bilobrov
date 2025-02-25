import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://bilobrov.projection-learn.website/wp-json/wc/v3/";
const consumerKey = "ck_f6e14983147c7a65ff3dd554625c6ae3069dbd5b";
const consumerSecret = "cs_f9430f1ca298c36b0001d95521253a5b1deb2fc5";

// Заголовок авторизації
const headers = new Headers();
headers.set(
  "Authorization",
  "Basic " + btoa(`${consumerKey}:${consumerSecret}`)
);

// Асинхронний екшн для отримання продуктів
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch(`${API_URL}products`, {
      method: "GET",
      headers: headers,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return await response.json();
  }
);

// Асинхронний екшн для отримання одного продукту за ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId: number) => {
    const response = await fetch(`${API_URL}products/${productId}`, {
      method: "GET",
      headers: headers,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return await response.json();
  }
);

// Слайс для роботи з продуктами
const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    currentProduct: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        // state.error = action.error.message;
      });

    // fetchProductById
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.currentProduct = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProduct = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state) => {
      state.loading = false;
      // state.error = action.error.message; // За потреби розкоментуйте
    });
  },
});

export default productSlice.reducer;
