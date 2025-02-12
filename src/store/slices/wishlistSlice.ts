import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  "https://bilobrov.projection-learn.website/wp-json/responses/v1/user_edit_preferences";

export const togglePreference = createAsyncThunk(
  "wishlist/togglePreference",
  async (
    { token, preference }: { token: string; preference: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        API_URL,
        { preference },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response.data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to update preferences"
      );
    }
  }
);

interface WishlistState {
  userId: number | null;
  preferences: number[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  userId: null,
  preferences: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (
      state,
      action: PayloadAction<{ userId: number; preferences: number[] }>
    ) => {
      state.userId = action.payload.userId;
      state.preferences = action.payload.preferences;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(togglePreference.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePreference.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload.current_preferences;
      })
      .addCase(togglePreference.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
