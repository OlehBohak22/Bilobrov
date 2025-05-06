import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL_WP } from "../../constants/api";

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  parent_id: string;
}

interface Menu {
  id: number;
  name: string;
  slug: string;
  items: MenuItem[];
}

interface MenuState {
  asideBottomMenu: Menu | null;
  asideTopMenu: Menu | null;
  mainMenu: Menu | null;
  loading: boolean;
  error?: string | null;
}

const initialState: MenuState = {
  asideBottomMenu: null,
  asideTopMenu: null,
  mainMenu: null,
  loading: false,
  error: null,
};

export const fetchMenus = createAsyncThunk<
  Menu[],
  void,
  { rejectValue: string }
>("menu/fetchMenus", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL_WP}menus`);
    return response.data;
  } catch (error) {
    console.log(error);
    return rejectWithValue("Не вдалося завантажити меню");
  }
});

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenus.fulfilled, (state, action: PayloadAction<Menu[]>) => {
        state.loading = false;
        state.asideBottomMenu =
          action.payload.find((menu) => menu.slug === "aside_bottom_menu") ||
          null;
        state.asideTopMenu =
          action.payload.find((menu) => menu.slug === "aside_top_menu") || null;
        state.mainMenu =
          action.payload.find((menu) => menu.slug === "main_menu") || null;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) state.error = action.payload;
      });
  },
});

export default menuSlice.reducer;
