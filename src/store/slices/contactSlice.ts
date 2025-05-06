import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL_WP_V2 } from "../../constants/api";

interface SocialLink {
  hl_input_name: string;
  hl_input_link: string;
  hl_input_tag: string;
  hl_input_btn_text: string;
  hl_svg_photo: string;
}

interface ContactState {
  input_email: string;
  input_phone: string;
  input_address: string;
  input_schedule: string;
  save_data_text: SocialLink[];
  loading: boolean;
  error: string | null;
}

const initialState: ContactState = {
  input_email: "",
  input_phone: "",
  input_address: "",
  input_schedule: "",
  save_data_text: [],
  loading: false,
  error: null,
};

export const fetchContacts = createAsyncThunk(
  "contact/fetchContacts",
  async () => {
    const response = await axios.get<ContactState>(`${API_URL_WP_V2}contact`);
    return response.data;
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchContacts.fulfilled,
        (state, action: PayloadAction<ContactState>) => {
          state.loading = false;
          state.input_email = action.payload.input_email;
          state.input_phone = action.payload.input_phone;
          state.input_address = action.payload.input_address;
          state.input_schedule = action.payload.input_schedule;
          state.save_data_text = action.payload.save_data_text;
        }
      )
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to load contact information";
      });
  },
});

export default contactSlice.reducer;
