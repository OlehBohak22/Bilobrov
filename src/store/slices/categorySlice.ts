import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Category } from "../../types/categoryType";
import { API_URL_WC, consumerKey, consumerSecret } from "../../constants/api";

const API_URL = `${API_URL_WC}products/categories?per_page=100`;

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
          state.categories = action.payload.filter(
            (cat) => cat.slug !== "sales" && cat.slug !== "news"
          );
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
