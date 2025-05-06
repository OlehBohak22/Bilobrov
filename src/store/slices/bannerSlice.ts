import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  API_URL_WP_V2,
  consumerKey,
  consumerSecret,
} from "../../constants/api";

const headers = new Headers();
headers.set(
  "Authorization",
  "Basic " + btoa(`${consumerKey}:${consumerSecret}`)
);

interface BannerState {
  items: [];
  loading: boolean;
  error: string | null;
}

const initialState: BannerState = {
  items: [],
  loading: true,
  error: null,
};

export const fetchBanner = createAsyncThunk("banners/fetchBanner", async () => {
  const response = await fetch(`${API_URL_WP_V2}banner`, {
    method: "GET",
    headers: headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch banners");
  }
  return await response.json();
});

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
