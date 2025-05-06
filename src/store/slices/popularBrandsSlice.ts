import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL_WP, consumerKey, consumerSecret } from "../../constants/api";

// Заголовок авторизації
const headers = new Headers();
headers.set(
  "Authorization",
  "Basic " + btoa(`${consumerKey}:${consumerSecret}`)
);

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  link: string;
  image: string;
  popular_product: { image: string };
}

interface BrandsState {
  items: Brand[];
  loading: boolean;
  error: string | null;
}

const initialState: BrandsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchBrands = createAsyncThunk<Brand[]>(
  "brands/fetchBrands",
  async () => {
    const response = await fetch(`${API_URL_WP}brands`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch brands");
    }

    const data = await response.json();
    return data;
  }
);

// Слайс для роботи з брендами
const brandsSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An unknown error occurred";
      });
  },
});

// Експортуємо ред'юсер
export default brandsSlice.reducer;
