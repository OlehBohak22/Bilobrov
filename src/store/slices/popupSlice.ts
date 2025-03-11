import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PopupState {
  isOpen: boolean;
  productId: number | null;
  variations: number[];
}

const initialState: PopupState = {
  isOpen: false,
  productId: null,
  variations: [],
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    openPopup: (
      state,
      action: PayloadAction<{ productId: number; variations: number[] }>
    ) => {
      state.isOpen = true;
      state.productId = action.payload.productId;
      state.variations = action.payload.variations;
    },
    closePopup: (state) => {
      state.isOpen = false;
      state.productId = null;
      state.variations = [];
    },
  },
});

export const { openPopup, closePopup } = popupSlice.actions;
export default popupSlice.reducer;
