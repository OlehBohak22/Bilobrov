import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  preferences: number[]; // id товарів
}

const initialState: WishlistState = {
  preferences: JSON.parse(localStorage.getItem("wishlist") || "[]"),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlistItem: (state, action: PayloadAction<number>) => {
      if (state.preferences.includes(action.payload)) {
        // якщо вже є — видаляємо
        state.preferences = state.preferences.filter(
          (id) => id !== action.payload
        );
      } else {
        // якщо немає — додаємо
        state.preferences.push(action.payload);
      }
      // синхронізуємо з localStorage
      localStorage.setItem("wishlist", JSON.stringify(state.preferences));
    },
    setWishlist: (state, action: PayloadAction<number[]>) => {
      state.preferences = action.payload;
      localStorage.setItem("wishlist", JSON.stringify(state.preferences));
    },
    clearWishlist: (state) => {
      state.preferences = [];
      localStorage.removeItem("wishlist");
    },
  },
});

export const { toggleWishlistItem, setWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
