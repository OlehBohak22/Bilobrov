import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProductInfo } from "../../types/productTypes";

const API_URL = "https://bilobrov.projection-learn.website/wp-json/wc/v3/";
const consumerKey = "ck_f6e14983147c7a65ff3dd554625c6ae3069dbd5b";
const consumerSecret = "cs_f9430f1ca298c36b0001d95521253a5b1deb2fc5";

const headers = new Headers();
headers.set(
  "Authorization",
  "Basic " + btoa(`${consumerKey}:${consumerSecret}`)
);

interface ProductState {
  items: ProductInfo[];
  loading: boolean;
  currentProduct: ProductInfo | null;
  reviews: any[];
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  currentProduct: null,
  reviews: [],
  error: null,
};

export const fetchProducts = createAsyncThunk<ProductInfo[]>(
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

export const fetchProductById = createAsyncThunk<ProductInfo, number>(
  "products/fetchProductById",
  async (productId) => {
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

export const fetchVariationById = createAsyncThunk<
  ProductInfo,
  { productId: number; variationId: number }
>("products/fetchVariationById", async ({ productId, variationId }) => {
  const response = await fetch(
    `${API_URL}products/${productId}/variations/${variationId}`,
    {
      method: "GET",
      headers: headers,
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch variation");
  }
  return await response.json();
});

export const fetchReviews = createAsyncThunk(
  "products/fetchReviews",
  async () => {
    const response = await fetch(`${API_URL}products/reviews`, {
      method: "GET",
      headers: headers,
    });
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }
    return await response.json();
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
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
      });

    builder.addCase(fetchVariationById.fulfilled, (state, action) => {
      state.loading = false;
      if (state.currentProduct) {
        state.currentProduct = {
          ...state.currentProduct,
          price: action.payload.price,
          sale_price: action.payload.sale_price,
          regular_price: action.payload.regular_price,
          images: action.payload.image ? [action.payload.image] : [],
          sku: action.payload.sku,
        };
      }
    });

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
    });

    builder.addCase(fetchReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload;
    });
    builder.addCase(fetchReviews.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default productSlice.reducer;
