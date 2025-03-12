import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL =
  "https://bilobrov.projection-learn.website/wp-json/responses/v1/";
const consumerKey = "ck_f6e14983147c7a65ff3dd554625c6ae3069dbd5b";
const consumerSecret = "cs_f9430f1ca298c36b0001d95521253a5b1deb2fc5";

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
    const response = await fetch(`${API_URL}brands`, {
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
