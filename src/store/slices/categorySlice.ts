import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Category } from "../../types/categoryType";

const API_URL =
  "https://bilobrov.projection-learn.website/wp-json/wc/v3/products/categories?per_page=100";

const consumerKey = "ck_f6e14983147c7a65ff3dd554625c6ae3069dbd5b";
const consumerSecret = "cs_f9430f1ca298c36b0001d95521253a5b1deb2fc5";

// Заголовок авторизації
const headers = {
  Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
};

export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async () => {
    const response = await axios.get<Category[]>(API_URL, { headers });
    return response.data;
  }
);

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.categories = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Помилка завантаження";
      });
  },
});

export default categoriesSlice.reducer;
