import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://bilobrov.projection-learn.website/wp-json/wp/v2/";
const consumerKey = "ck_f6e14983147c7a65ff3dd554625c6ae3069dbd5b";
const consumerSecret = "cs_f9430f1ca298c36b0001d95521253a5b1deb2fc5";

// Заголовок авторизації
const headers = new Headers();
headers.set(
  "Authorization",
  "Basic " + btoa(`${consumerKey}:${consumerSecret}`)
);

// Типи для стану
interface BannerState {
  items: []; // Змініть на конкретний тип, якщо є деталі про структуру
  loading: boolean;
  error: string | null;
}

const initialState: BannerState = {
  items: [],
  loading: false,
  error: null,
};

// Асинхронний екшн для отримання банерів
export const fetchBanner = createAsyncThunk("banners/fetchBanner", async () => {
  const response = await fetch(`${API_URL}banner`, {
    method: "GET",
    headers: headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch banners");
  }
  return await response.json();
});

// Слайс для роботи з банерами
const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An unknown error occurred";
      });
  },
});

export default bannerSlice.reducer;
