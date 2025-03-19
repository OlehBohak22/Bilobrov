import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const consumerKey = "ck_f6e14983147c7a65ff3dd554625c6ae3069dbd5b";
const consumerSecret = "cs_f9430f1ca298c36b0001d95521253a5b1deb2fc5";

const API_URL =
  "https://bilobrov.projection-learn.website/wp-json/responses/v1/np_warehouses";
const AUTH_HEADER = {
  Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
};

export const fetchCities = createAsyncThunk(
  "cities/fetchCities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, { headers: AUTH_HEADER });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch cities");
    }
  }
);

// 🛠 Оновлений інтерфейс City (з великої літери)
interface City {
  name: string;
}

interface CitiesState {
  cities: City[];
  loading: boolean;
  error: string | null;
}

// 🛠 Виправлено тип initialState
const initialState: CitiesState = {
  cities: [],
  loading: false,
  error: null,
};

const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default citiesSlice.reducer;
