import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  preferences: number[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  preferences: [],
  loading: false,
  error: null,
};

// 🔥 Асинхронна дія для зміни вподобань через API
export const togglePreference = createAsyncThunk<
  number[], // Очікуваний тип повернених даних (масив вподобань)
  { token: string; preference: number[] | number } // Аргумент (token + productId)
>(
  "wishlist/togglePreference",
  async ({ token, preference }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://bilobrov.projection-learn.website/wp-json/responses/v1/user_edit_preferences",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ preference }),
        }
      );

      if (!response.ok) {
        throw new Error("Помилка оновлення вподобань");
      }

      const data = await response.json();
      return data.current_preferences; // Повертаємо оновлений масив вподобань
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<number[]>) => {
      state.preferences = action.payload;
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
        state.preferences = action.payload;
      })
      .addCase(togglePreference.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
