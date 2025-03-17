import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const consumerKey = "ck_f6e14983147c7a65ff3dd554625c6ae3069dbd5b";
const consumerSecret = "cs_f9430f1ca298c36b0001d95521253a5b1deb2fc5";

interface FiltersState {
  minPrice: number;
  maxPrice: number;
  onSale: boolean;
  inStock: boolean;
  categories: string[]; // Масив слагів
  attributes: string[];
  attributeTerms: string[];
  products: any[];
  loading: boolean;
}

const initialState: FiltersState = {
  minPrice: 100,
  maxPrice: 1500,
  onSale: false,
  inStock: true,
  categories: [], // Тепер масив слагів
  attributes: [],
  attributeTerms: [],
  products: [],
  loading: false,
};

export const fetchProducts = createAsyncThunk(
  "filters/fetchProducts",
  async (
    { isNew, onSale }: { isNew?: boolean; onSale?: boolean } = {},
    { getState }
  ) => {
    const state = getState() as { filters: FiltersState };

    const params: Record<string, string | number | boolean> = {
      min_price: state.filters.minPrice,
      max_price: state.filters.maxPrice,
      stock_status: state.filters.inStock ? "instock" : "outofstock",
      category: state.filters.categories.join(","),
      attribute: state.filters.attributes.join(","),
      attribute_term: state.filters.attributeTerms.join("|"),
    };

    if (isNew) {
      params["orderby"] = "date";
      params["order"] = "desc";
    }

    if (onSale) {
      params["on_sale"] = true;
    } else {
      params["on_sale"] = state.filters.onSale;
    }

    const queryString = new URLSearchParams(params as any).toString();
    const url = `https://bilobrov.projection-learn.website/wp-json/wc/v3/products?${queryString}&per_page=100`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
        },
      });

      return response.data;
    } catch (error) {
      console.error("Помилка при отриманні товарів:", error);
      throw error;
    }
  }
);

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setMinPrice: (state, action: PayloadAction<number>) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action: PayloadAction<number>) => {
      state.maxPrice = action.payload;
    },
    setOnSale: (state, action: PayloadAction<boolean>) => {
      state.onSale = action.payload;
    },
    setInStock: (state, action: PayloadAction<boolean>) => {
      state.inStock = action.payload;
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload; // Зберігаємо масив слагів
    },
    setAttributes: (state, action: PayloadAction<string[]>) => {
      state.attributes = action.payload;
    },
    setAttributeTerms: (state, action: PayloadAction<string[]>) => {
      state.attributeTerms = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setMinPrice,
  setMaxPrice,
  setOnSale,
  setInStock,
  setCategories,
  setAttributes,
  setAttributeTerms,
} = filtersSlice.actions;

export default filtersSlice.reducer;
