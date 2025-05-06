import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL_WP_V2 } from "../../constants/api";

interface FaqItem {
  id: number;
  faq_question: string;
  faq_answer: string;
}

interface FaqState {
  faqs: FaqItem[];
  loading: boolean;
  error: string | null;
}

const initialState: FaqState = {
  faqs: [],
  loading: false,
  error: null,
};

export const fetchFaqs = createAsyncThunk("faq/fetchFaqs", async () => {
  const response = await axios.get<FaqItem[]>(`${API_URL_WP_V2}faqs`);
  return response.data;
});

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFaqs.fulfilled,
        (state, action: PayloadAction<FaqItem[]>) => {
          state.loading = false;
          state.faqs = action.payload;
        }
      )
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load FAQs";
      });
  },
});

export default faqSlice.reducer;
